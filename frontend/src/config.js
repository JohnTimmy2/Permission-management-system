import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Identifies the caller to the backend so role-gated routes (see requireRole
// in Backend/server.js) can look up the real role for this user_id — the
// server never trusts a role the client claims, only the id it's acting as.
axios.interceptors.request.use((config) => {
  const userId = localStorage.getItem("user_id");
  if (userId) config.headers["x-user-id"] = userId;
  return config;
});
