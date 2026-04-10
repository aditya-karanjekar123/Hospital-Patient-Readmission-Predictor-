# Hospital Readmission Predictor
### Full-Stack Data Analytics Project · React + Python Flask + SQLite + Random Forest

---

## Tech Stack
| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | React 18, Recharts, Axios               |
| Backend     | Python Flask, Flask-CORS                |
| Database    | SQLite (SQL: GROUP BY, window fns)      |
| ML Model    | Scikit-learn Random Forest (~78% acc)   |
| Data Layer  | Pandas, NumPy                           |

---

## Project Structure
```
hospital-readmission/
├── backend/
│   ├── app.py           ← Flask REST API (6 endpoints)
│   ├── database.py      ← SQLite init + seed 500 patients
│   ├── model.py         ← Random Forest train & predict
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── KPICards.jsx
│       │   ├── AdmissionChart.jsx
│       │   ├── DepartmentChart.jsx
│       │   ├── DiagnosisChart.jsx
│       │   ├── RiskTable.jsx
│       │   └── PredictForm.jsx
│       ├── api.js
│       ├── App.jsx
│       └── index.js
└── README.md
```

---

## Setup — Step by Step

### Step 1: Clone / create project folder
```bash
mkdir hospital-readmission && cd hospital-readmission
```

### Step 2: Setup Backend
```bash
cd backend
pip install -r requirements.txt
python database.py       # creates patients.db with 500 rows
python model.py          # trains Random Forest, saves model.pkl
python app.py            # starts Flask on http://localhost:5000
```

### Step 3: Setup Frontend (new terminal)
```bash
cd frontend
npm install
npm start                # starts React on http://localhost:3000
```

### Step 4: Open browser
Go to: http://localhost:3000

---

## API Endpoints
| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | /api/kpis             | Summary KPIs                    |
| GET    | /api/departments      | Dept-wise stats (GROUP BY SQL)  |
| GET    | /api/monthly-trend    | Monthly admissions trend        |
| GET    | /api/high-risk        | High risk patient list          |
| GET    | /api/diagnosis-stats  | Diagnosis breakdown             |
| POST   | /api/predict          | ML readmission prediction       |

---

## ML Model Details
- **Algorithm**: Random Forest Classifier (100 trees)
- **Features**: age, length_of_stay, num_procedures, num_medications, num_diagnoses, prev_admissions
- **Target**: readmitted (0 or 1)
- **Train/Test Split**: 80/20
- **Accuracy**: ~78%

---

## What You Learn
- React: `useState`, `useEffect`, component props, conditional rendering
- Flask: REST API design, CORS, JSON responses
- SQL: `GROUP BY`, `AVG`, `SUM`, subqueries, filtering
- Pandas: `read_sql`, DataFrame operations
- Scikit-learn: `train_test_split`, `RandomForestClassifier`, `predict_proba`
- Recharts: `AreaChart`, `BarChart`, `PieChart`, `ResponsiveContainer`

---

## Interview Talking Points
1. "I built a full-stack readmission prediction system using React + Flask + SQLite"
2. "SQL GROUP BY queries aggregate department-wise readmission rates"
3. "Random Forest model predicts 30-day readmission with ~78% accuracy from 6 clinical features"
4. "React frontend uses axios to fetch from 6 REST endpoints and visualizes with Recharts"
5. "Fallback to mock data when backend is offline — good UX practice"

---

## GitHub Setup
```bash
git init
git add .
git commit -m "feat: hospital readmission predictor - React + Flask + ML"
git remote add origin https://github.com/YOUR_USERNAME/hospital-readmission.git
git push -u origin main
```
