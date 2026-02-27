import api from "../shared/api/axiosClient";

// ===== GET ALL BATCH =====
export const getAllBatch = () => api.get("/raw-material-batches");

// ===== CREATE BATCH =====
export const createBatch = (data) => api.post("/raw-material-batches", data);

// ===== UPDATE BATCH =====
export const updateBatch = (id, data) =>
  api.put(`/raw-material-batches/${id}`, data);

// ===== GET INVENTORY LOG =====
export const getBatchLogs = (id) => api.get(`/raw-material-batches/${id}/logs`);
