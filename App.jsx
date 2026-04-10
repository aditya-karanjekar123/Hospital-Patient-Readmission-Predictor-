import React, { useState, useEffect } from "react";
import KPICards       from "./components/KPICards";
import AdmissionChart from "./components/AdmissionChart";
import DepartmentChart from "./components/DepartmentChart";
import RiskTable       from "./components/RiskTable";
import PredictForm     from "./components/PredictForm";
import DiagnosisChart  from "./components/DiagnosisChart";
import {
  getKPIs, getDepartments, getMonthlyTrend,
  getHighRisk, getDiagnosisStats,
} from "./api";

// ─── Mock data (used when backend is offline) ──────────────
const MOCK = {
  kpis: {
    total_patients: 500, total_readmitted: 171,
    readmission_rate: 34.2, avg_los: 8.4, avg_age: 52.3,
  },
  monthly: [
    {month:"2024-01",total:28,readmitted:8},{month:"2024-02",total:32,readmitted:10},
    {month:"2024-03",total:25,readmitted:7},{month:"2024-04",total:38,readmitted:14},
    {month:"2024-05",total:42,readmitted:16},{month:"2024-06",total:35,readmitted:12},
    {month:"2024-07",total:40,readmitted:15},{month:"2024-08",total:45,readmitted:17},
    {month:"2024-09",total:38,readmitted:13},{month:"2024-10",total:50,readmitted:20},
    {month:"2024-11",total:44,readmitted:17},{month:"2024-12",total:55,readmitted:22},
  ],
  departments: [
    {department:"Cardiology",patients:112,readmission_rate:41.2,avg_los:9.8},
    {department:"Oncology",patients:89,readmission_rate:38.6,avg_los:11.2},
    {department:"Neurology",patients:68,readmission_rate:35.8,avg_los:10.4},
    {department:"General Medicine",patients:134,readmission_rate:29.4,avg_los:6.3},
    {department:"Orthopedics",patients:97,readmission_rate:22.7,avg_los:7.1},
  ],
  highRisk: [
    {id:7,name:"Patient 007",age:72,gender:"Male",department:"Cardiology",diagnosis:"Heart Failure",prev_admissions:5,los:18,num_medications:12,readmitted:1},
    {id:23,name:"Patient 023",age:68,gender:"Female",department:"Oncology",diagnosis:"Cancer",prev_admissions:4,los:15,num_medications:10,readmitted:1},
    {id:41,name:"Patient 041",age:55,gender:"Male",department:"Neurology",diagnosis:"Stroke",prev_admissions:3,los:14,num_medications:8,readmitted:0},
    {id:58,name:"Patient 058",age:81,gender:"Male",department:"Cardiology",diagnosis:"COPD",prev_admissions:5,los:13,num_medications:14,readmitted:1},
    {id:63,name:"Patient 063",age:49,gender:"Female",department:"General Medicine",diagnosis:"Diabetes",prev_admissions:3,los:8,num_medications:7,readmitted:0},
    {id:79,name:"Patient 079",age:76,gender:"Female",department:"Oncology",diagnosis:"Pneumonia",prev_admissions:4,los:12,num_medications:11,readmitted:1},
    {id:102,name:"Patient 102",age:62,gender:"Male",department:"Cardiology",diagnosis:"Hypertension",prev_admissions:3,los:9,num_medications:9,readmitted:1},
    {id:118,name:"Patient 118",age:70,gender:"Female",department:"Orthopedics",diagnosis:"Fracture",prev_admissions:2,los:16,num_medications:6,readmitted:0},
    {id:134,name:"Patient 134",age:44,gender:"Male",department:"General Medicine",diagnosis:"Diabetes",prev_admissions:3,los:7,num_medications:8,readmitted:0},
    {id:156,name:"Patient 156",age:85,gender:"Female",department:"Cardiology",diagnosis:"Heart Failure",prev_admissions:5,los:20,num_medications:15,readmitted:1},
  ],
  diagnoses: [
    {diagnosis:"Diabetes",patients:92,readmission_rate:32.1,avg_los:7.2},
    {diagnosis:"Heart Failure",patients:78,readmission_rate:45.5,avg_los:11.4},
    {diagnosis:"Hypertension",patients:85,readmission_rate:28.9,avg_los:6.1},
    {diagnosis:"COPD",patients:61,readmission_rate:39.2,avg_los:9.8},
    {diagnosis:"Pneumonia",patients:57,readmission_rate:35.6,avg_los:8.3},
    {diagnosis:"Fracture",patients:48,readmission_rate:18.3,avg_los:6.9},
    {diagnosis:"Stroke",patients:44,readmission_rate:41.0,avg_los:12.1},
    {diagnosis:"Arthritis",patients:35,readmission_rate:21.4,avg_los:5.4},
  ],
};

const TABS = [
  { id: "overview",    label: "Overview"      },
  { id: "departments", label: "Departments"   },
  { id: "diagnoses",   label: "Diagnoses"     },
  { id: "high-risk",   label: "High Risk"     },
  { id: "predict",     label: "ML Predict"    },
];

export default function App() {
  const [tab,     setTab]     = useState("overview");
  const [kpis,    setKpis]    = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [depts,   setDepts]   = useState([]);
  const [risks,   setRisks]   = useState([]);
  const [diags,   setDiags]   = useState([]);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [k, m, d, r, g] = await Promise.all([
          getKPIs(), getMonthlyTrend(), getDepartments(),
          getHighRisk(), getDiagnosisStats(),
        ]);
        setKpis(k.data);
        setMonthly(m.data);
        setDepts(d.data);
        setRisks(r.data);
        setDiags(g.data);
      } catch {
        // Backend offline — use mock data
        setKpis(MOCK.kpis);
        setMonthly(MOCK.monthly);
        setDepts(MOCK.departments);
        setRisks(MOCK.highRisk);
        setDiags(MOCK.diagnoses);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  return (
    <div style={{
      background: "#0b0f1a", minHeight: "100vh",
      fontFamily: "'Lato', sans-serif",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0);     }
        }
        * { box-sizing: border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background: #0b0f1a; }
        ::-webkit-scrollbar-thumb { background: #1e2d47; border-radius: 3px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: "#0f1622",
        borderBottom: "1px solid #1e2d47",
        padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #00d4aa, #3b8bff)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18, fontWeight: 700, color: "#e8edf5",
            }}>Hospital Readmission Predictor</div>
            <div style={{
              fontSize: 11, color: "#5a7090",
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              React + Python Flask + SQLite + Random Forest
            </div>
          </div>
        </div>
        <div style={{
          background: "rgba(0,212,170,0.1)",
          border: "1px solid rgba(0,212,170,0.25)",
          color: "#00d4aa",
          fontSize: 11, padding: "5px 12px",
          borderRadius: 20,
          fontFamily: "'IBM Plex Mono', monospace",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#00d4aa",
            animation: "blink 1.4s infinite",
          }}/>
          LIVE · 500 patients
        </div>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        background: "#0f1622",
        borderBottom: "1px solid #1e2d47",
        padding: "0 28px",
        display: "flex", gap: 2,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "13px 18px",
            fontFamily: "'Syne', sans-serif",
            fontSize: 12, fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: tab === t.id ? "#00d4aa" : "#5a7090",
            borderBottom: tab === t.id ? "2px solid #00d4aa" : "2px solid transparent",
            transition: "all 0.15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "22px 28px", maxWidth: 1200 }}>

        {tab === "overview" && (
          <>
            <KPICards data={kpis} />
            <AdmissionChart data={monthly} />
          </>
        )}

        {tab === "departments" && (
          <DepartmentChart data={depts} />
        )}

        {tab === "diagnoses" && (
          <DiagnosisChart data={diags} />
        )}

        {tab === "high-risk" && (
          <RiskTable data={risks} />
        )}

        {tab === "predict" && (
          <PredictForm />
        )}
      </div>
    </div>
  );
}
