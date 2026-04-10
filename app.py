from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from database import init_db
from model import load_model, train_model, predict

app = Flask(__name__)
CORS(app)

# Initialize DB and train model on startup
init_db()
ml_model = load_model()

# ─── Helper ───────────────────────────────────────────
def query_db(sql, params=()):
    conn = sqlite3.connect("patients.db")
    conn.row_factory = sqlite3.Row
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ─── Routes ───────────────────────────────────────────

@app.route("/api/kpis", methods=["GET"])
def get_kpis():
    """Summary KPI cards"""
    data = query_db("""
        SELECT
            COUNT(*) AS total_patients,
            SUM(readmitted) AS total_readmitted,
            ROUND(AVG(los), 1) AS avg_los,
            ROUND(AVG(age), 1) AS avg_age,
            ROUND(SUM(readmitted) * 100.0 / COUNT(*), 1) AS readmission_rate
        FROM patients
    """)[0]
    return jsonify(data)


@app.route("/api/departments", methods=["GET"])
def get_departments():
    """Department-wise breakdown using GROUP BY"""
    data = query_db("""
        SELECT
            department,
            COUNT(*) AS patients,
            ROUND(AVG(los), 1) AS avg_los,
            ROUND(SUM(readmitted) * 100.0 / COUNT(*), 1) AS readmission_rate,
            ROUND(AVG(age), 1) AS avg_age
        FROM patients
        GROUP BY department
        ORDER BY readmission_rate DESC
    """)
    return jsonify(data)


@app.route("/api/monthly-trend", methods=["GET"])
def get_monthly_trend():
    """Monthly admissions and readmissions"""
    data = query_db("""
        SELECT
            SUBSTR(admission_date, 1, 7) AS month,
            COUNT(*) AS total,
            SUM(readmitted) AS readmitted
        FROM patients
        GROUP BY month
        ORDER BY month
    """)
    return jsonify(data)


@app.route("/api/high-risk", methods=["GET"])
def get_high_risk():
    """High risk patients — prev_admissions >= 3 OR los > 12"""
    data = query_db("""
        SELECT
            id, name, age, gender, department, diagnosis,
            prev_admissions, los, num_medications, readmitted
        FROM patients
        WHERE prev_admissions >= 3 OR los > 12
        ORDER BY prev_admissions DESC, los DESC
        LIMIT 25
    """)
    return jsonify(data)


@app.route("/api/diagnosis-stats", methods=["GET"])
def get_diagnosis_stats():
    """Top diagnoses with readmission rates"""
    data = query_db("""
        SELECT
            diagnosis,
            COUNT(*) AS patients,
            ROUND(SUM(readmitted) * 100.0 / COUNT(*), 1) AS readmission_rate,
            ROUND(AVG(los), 1) AS avg_los
        FROM patients
        GROUP BY diagnosis
        ORDER BY patients DESC
    """)
    return jsonify(data)


@app.route("/api/predict", methods=["POST"])
def predict_readmission():
    """ML prediction endpoint"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    result = predict(ml_model, data)
    return jsonify(result)


@app.route("/api/retrain", methods=["POST"])
def retrain():
    """Retrain the model"""
    global ml_model
    ml_model = train_model()
    return jsonify({"message": "Model retrained successfully"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
