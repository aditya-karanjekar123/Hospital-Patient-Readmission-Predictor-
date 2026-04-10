import axios from "axios";

const BASE = "http://localhost:5000/api";

// GET all KPI summary numbers
export const getKPIs = () => axios.get(`${BASE}/kpis`);

// GET department-wise stats
export const getDepartments = () => axios.get(`${BASE}/departments`);

// GET monthly trend data
export const getMonthlyTrend = () => axios.get(`${BASE}/monthly-trend`);

// GET high risk patients list
export const getHighRisk = () => axios.get(`${BASE}/high-risk`);

// GET diagnosis stats
export const getDiagnosisStats = () => axios.get(`${BASE}/diagnosis-stats`);

// POST predict readmission for a patient
export const predictPatient = (patientData) =>
  axios.post(`${BASE}/predict`, patientData);
