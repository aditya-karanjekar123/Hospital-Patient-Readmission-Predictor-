import React, { useState } from "react";

const RiskBadge = ({ level }) => {
  const styles = {
    High:   { bg: "rgba(239,68,68,0.15)",   color: "#f87171", border: "rgba(239,68,68,0.3)" },
    Medium: { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
    Low:    { bg: "rgba(34,197,94,0.15)",   color: "#4ade80", border: "rgba(34,197,94,0.3)" },
  };
  const s = styles[level] || styles.Low;
  return (
    <span style={{
      fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
      padding: "3px 9px", borderRadius: 20,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>{level}</span>
  );
};

const getRisk = (row) => {
  if (row.prev_admissions >= 4 || row.los > 15) return "High";
  if (row.prev_admissions >= 2 || row.los > 10) return "Medium";
  return "Low";
};

export default function RiskTable({ data }) {
  const [search, setSearch] = useState("");

  if (!data || !data.length) return (
    <div style={{ color: "#5a7090", fontFamily: "monospace", padding: 20 }}>
      Loading patients...
    </div>
  );

  const filtered = data.filter(p =>
    p.department.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      background: "#121828", border: "1px solid #1e2d47",
      borderRadius: 14, padding: "18px 20px",
      animation: "fadeUp 0.5s ease 0.2s both",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14,
          fontWeight: 600, color: "#e8edf5", margin: 0,
          borderLeft: "3px solid #f59e0b", paddingLeft: 10,
        }}>
          High Risk Patients — prev admissions ≥ 3 or LOS &gt; 12 days
        </p>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dept / diagnosis..."
          style={{
            background: "#1a2236", border: "1px solid #1e2d47",
            borderRadius: 8, padding: "7px 12px",
            color: "#e8edf5", fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            outline: "none", width: 220,
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["ID", "Name", "Age", "Department", "Diagnosis", "Prev Admits", "LOS", "Risk", "Status"].map(h => (
                <th key={h} style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "#5a7090",
                  padding: "8px 10px", borderBottom: "1px solid #1e2d47",
                  textAlign: "left", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const risk = getRisk(p);
              return (
                <tr key={i} style={{ borderBottom: "1px solid rgba(30,45,71,0.5)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1a2236"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px", color: "#5a7090", fontFamily: "monospace" }}>#{p.id}</td>
                  <td style={{ padding: "10px", color: "#e8edf5" }}>{p.name}</td>
                  <td style={{ padding: "10px", color: "#94a3b8" }}>{p.age}</td>
                  <td style={{ padding: "10px", color: "#94a3b8" }}>{p.department}</td>
                  <td style={{ padding: "10px", color: "#94a3b8" }}>{p.diagnosis}</td>
                  <td style={{ padding: "10px", fontFamily: "monospace", color: p.prev_admissions >= 4 ? "#f87171" : "#e8edf5" }}>
                    {p.prev_admissions}
                  </td>
                  <td style={{ padding: "10px", fontFamily: "monospace", color: p.los > 14 ? "#f87171" : "#e8edf5" }}>
                    {p.los}d
                  </td>
                  <td style={{ padding: "10px" }}><RiskBadge level={risk} /></td>
                  <td style={{ padding: "10px" }}>
                    <RiskBadge level={p.readmitted ? "High" : "Low"} />
                    <span style={{ marginLeft: 6, fontSize: 11, color: "#5a7090" }}>
                      {p.readmitted ? "Readmitted" : "Stable"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ margin: "12px 0 0", fontSize: 11, color: "#5a7090", fontFamily: "monospace" }}>
        Showing {filtered.length} of {data.length} high-risk patients
      </p>
    </div>
  );
}
