import sqlite3
import random

def init_db():
    conn = sqlite3.connect("patients.db")
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        department TEXT,
        diagnosis TEXT,
        admission_date TEXT,
        discharge_date TEXT,
        los INTEGER,
        num_procedures INTEGER,
        num_medications INTEGER,
        num_diagnoses INTEGER,
        prev_admissions INTEGER,
        readmitted INTEGER
    )''')

    c.execute("SELECT COUNT(*) FROM patients")
    if c.fetchone()[0] > 0:
        conn.close()
        return

    departments = ["Cardiology", "Orthopedics", "Oncology", "Neurology", "General Medicine"]
    diagnoses   = ["Diabetes", "Hypertension", "Fracture", "Heart Failure", "COPD", "Pneumonia", "Stroke", "Arthritis"]
    genders     = ["Male", "Female"]
    months      = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
                   "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"]

    rows = []
    for i in range(1, 501):
        age   = random.randint(20, 85)
        los   = random.randint(1, 20)
        prev  = random.randint(0, 5)
        meds  = random.randint(1, 15)
        procs = random.randint(0, 6)
        diags = random.randint(1, 9)
        month = random.choice(months)
        admit = f"{month}-{random.randint(1,28):02d}"
        prob  = 0.08 + (prev * 0.10) + (0.14 if age > 65 else 0) + (0.10 if los > 10 else 0)
        read  = int(random.random() < min(prob, 0.88))
        rows.append((
            i, f"Patient {i:03d}", age,
            random.choice(genders),
            random.choice(departments),
            random.choice(diagnoses),
            admit, admit,
            los, procs, meds, diags, prev, read
        ))

    c.executemany(
        "INSERT INTO patients VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        rows
    )
    conn.commit()
    conn.close()
    print("Database seeded with 500 patients.")

if __name__ == "__main__":
    init_db()
