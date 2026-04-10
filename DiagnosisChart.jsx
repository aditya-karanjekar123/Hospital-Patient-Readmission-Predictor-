import React from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#00d4aa","#3b8bff","#f59e0b","#ef4444","#a78bfa","#22c55e","#f472b6","#38bdf8"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: "#1a2236", border: "1px solid #1e2d47",
      borderRadius: 10, padding: "10px 14px",
      fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <p style={{ color: d.payload.fill, margin: "0 0 4px", fontWeight: 600 }}>{d.name}</p>
      <p style={{ color: "#94a3b8", margin: 0 }}>Patients: <strong style={{ color: "#e8edf5" }}>{d.value}</strong></p>
    </div>
  );
};

export default function DiagnosisChart({ data }) {
  if (!data || !data.length) return null;

  const pieData = data.map((d, i) => ({
    name: d.diagnosis,
    value: d.patients,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 16, marginBottom: 16,
    }}>
      {/* Pie Chart */}
      <div style={{
        background: "#121828", border: "1px solid #1e2d47",
        borderRadius: 14, padding: "18px 20px",
        animation: "fadeUp 0.5s ease 0.35s both",
      }}>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
          color: "#e8edf5", margin: "0 0 16px",
          borderLeft: "3px solid #a78bfa", paddingLeft: 10,
        }}>
          Patients by Diagnosis
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData} cx="50%" cy="50%"
              innerRadius={55} outerRadius={85}
              paddingAngle={3} dataKey="value"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle" iconSize={8}
              wrapperStyle={{ fontSize: 11, fontFamily: "IBM Plex Mono", color: "#94a3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Readmission rate table */}
      <div style={{
        background: "#121828", border: "1px solid #1e2d47",
        borderRadius: 14, padding: "18px 20px",
        animation: "fadeUp 0.5s ease 0.45s both",
      }}>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
          color: "#e8edf5", margin: "0 0 16px",
          borderLeft: "3px solid #f59e0b", paddingLeft: 10,
        }}>
          Readmission Rate by Diagnosis
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 11, color: "#94a3b8",
                fontFamily: "monospace", width: 110, flexShrink: 0,
              }}>
                {d.diagnosis}
              </span>
              <div style={{ flex: 1, background: "#1a2236", borderRadius: 3, height: 18, overflow: "hidden" }}>
                <div style={{
                  width: `${d.readmission_rate}%`,
                  height: "100%",
                  background: d.readmission_rate > 35 ? "#ef4444" : d.readmission_rate > 25 ? "#f59e0b" : "#22c55e",
                  borderRadius: 3,
                  display: "flex", alignItems: "center",
                  paddingLeft: 7,
                  fontSize: 10, color: "#0b0f1a", fontFamily: "monospace", fontWeight: 600,
                }}>
                  {d.readmission_rate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
