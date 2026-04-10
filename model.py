import sqlite3
import pickle
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

FEATURES = ["age", "los", "num_procedures", "num_medications", "num_diagnoses", "prev_admissions"]
MODEL_PATH = "model.pkl"

def train_model():
    conn = sqlite3.connect("patients.db")
    df = pd.read_sql("SELECT * FROM patients", conn)
    conn.close()

    X = df[FEATURES]
    y = df["readmitted"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        random_state=42,
        class_weight="balanced"
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc:.2%}")
    print(classification_report(y_test, y_pred))

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    return model

def load_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            return pickle.load(f)
    return train_model()

def predict(model, patient_data: dict):
    features = [[
        int(patient_data.get("age", 50)),
        int(patient_data.get("los", 5)),
        int(patient_data.get("num_procedures", 2)),
        int(patient_data.get("num_medications", 5)),
        int(patient_data.get("num_diagnoses", 3)),
        int(patient_data.get("prev_admissions", 1)),
    ]]
    prob = model.predict_proba(features)[0][1]
    risk = "High" if prob > 0.6 else "Medium" if prob > 0.35 else "Low"

    importances = dict(zip(FEATURES, model.feature_importances_.tolist()))

    return {
        "probability": round(float(prob) * 100, 1),
        "risk_level": risk,
        "feature_importances": importances
    }

if __name__ == "__main__":
    train_model()
