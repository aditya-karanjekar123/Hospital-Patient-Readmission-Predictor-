import React from "react";

const colors = {
  teal:   "#00d4aa",
  red:    "#ef4444",
  blue:   "#3b8bff",
  amber:  "#f59e0b",
  purple: "#a78bfa",
};

function KPICard({ label, value, sub, color, delta, delay }) {
  return (
    <div style={{
      background: "#121828",
      border: "1px solid #1e2d47",
      borderTop: `3px solid ${color}`,
      borderRadius: 14,
      padding: "16px 18px",
      animation: `fadeUp 0.4s ease ${delay}s both`,
    }}>
      <p style={{
        margin: 0, fontSize: 11,
        color: "#5a7090",
        fontFamily: "'IBM Plex Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>{label}</p>
      <p style={{
        margin: "8px 0 4px",
        fontSize: 28,
        fontWeight: 700,
        color: color,
        fontFamily: "'Syne', sans-serif",
        lineHeight: 1,
      }}>{value}</p>
      <p style={{
        margin: 0,
        fontSize: 12,
        color: delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#5a7090",
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        {delta > 0 ? "▲" : delta < 0 ? "▼" : "●"}{" "}
        {sub}
      </p>
    </div>
  );
}

export default function KPICards({ data }) {
  if (!data) return null;

  const cards = [
    {
      label: "Total Patients",
      value: data.total_patients?.toLocaleString(),
      sub: "FY 2024 · all departments",
      color: colors.teal,
      delta: 1,
      delay: 0,
    },
    {
      label: "Readmission Rate",
      value: `${data.readmission_rate}%`,
      sub: `${data.total_readmitted} patients readmitted`,
      color: colors.red,
      delta: -1,
      delay: 0.07,
    },
    {
      label: "Avg Length of Stay",
      value: `${data.avg_los}d`,
      sub: "days per patient",
      color: colors.blue,
      delta: 0,
      delay: 0.14,
    },
    {
      label: "Avg Patient Age",
      value: data.avg_age,
      sub: "years · mixed demographics",
      color: colors.amber,
      delta: 0,
      delay: 0.21,
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: 12,
      marginBottom: 22,
    }}>
      {cards.map((c, i) => <KPICard key={i} {...c} />)}
    </div>
  );
}
