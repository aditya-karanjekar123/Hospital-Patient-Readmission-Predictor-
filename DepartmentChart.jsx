import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a2236", border: "1px solid #1e2d47",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <p style={{ color: "#94a3b8", margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{p.value}{p.name.includes("Rate") ? "%" : p.name.includes("LOS") ? "d" : ""}</strong>
        </p>
      ))}
    </div>
  );
};

const getRateColor = (rate) =>
  rate > 35 ? "#ef4444" : rate > 25 ? "#f59e0b" : "#22c55e";

export default function DepartmentChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      marginBottom: 16,
    }}>
      {/* Readmission Rate Bar Chart */}
      <div style={{
        background: "#121828", border: "1px solid #1e2d47",
        borderRadius: 14, padding: "18px 20px",
        animation: "fadeUp 0.5s ease 0.3s both",
      }}>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
          color: "#e8edf5", margin: "0 0 16px",
          borderLeft: "3px solid #ef4444", paddingLeft: 10,
        }}>
          Readmission Rate by Department
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" horizontal={false} />
            <XAxis
              type="number" domain={[0, 60]}
              tick={{ fill: "#5a7090", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category" dataKey="department" width={115}
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="readmission_rate" name="Readmission Rate" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getRateColor(entry.readmission_rate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Avg LOS Bar Chart */}
      <div style={{
        background: "#121828", border: "1px solid #1e2d47",
        borderRadius: 14, padding: "18px 20px",
        animation: "fadeUp 0.5s ease 0.4s both",
      }}>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
          color: "#e8edf5", margin: "0 0 16px",
          borderLeft: "3px solid #3b8bff", paddingLeft: 10,
        }}>
          Avg Length of Stay by Department
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#5a7090", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `${v}d`}
            />
            <YAxis
              type="category" dataKey="department" width={115}
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avg_los" name="Avg LOS" fill="#3b8bff" radius={[0, 4, 4, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
