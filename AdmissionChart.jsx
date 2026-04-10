import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a2236",
      border: "1px solid #1e2d47",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 12,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <p style={{ color: "#94a3b8", margin: "0 0 6px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function AdmissionChart({ data }) {
  if (!data || !data.length) return (
    <div style={{ color: "#5a7090", fontFamily: "monospace", padding: 20 }}>
      Loading trend data...
    </div>
  );

  return (
    <div style={{
      background: "#121828",
      border: "1px solid #1e2d47",
      borderRadius: 14,
      padding: "18px 20px",
      marginBottom: 16,
      animation: "fadeUp 0.5s ease 0.2s both",
    }}>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        color: "#e8edf5",
        margin: "0 0 16px",
        borderLeft: "3px solid #00d4aa",
        paddingLeft: 10,
      }}>
        Monthly Admissions vs Readmissions — 2024
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b8bff" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b8bff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#5a7090", fontSize: 11, fontFamily: "IBM Plex Mono" }}
            axisLine={{ stroke: "#1e2d47" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#5a7090", fontSize: 11, fontFamily: "IBM Plex Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: "IBM Plex Mono", color: "#94a3b8" }}
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Admissions"
            stroke="#3b8bff"
            strokeWidth={2}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="readmitted"
            name="Readmissions"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#colorRead)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
