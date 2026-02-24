import axiosClient from "./axiosClient";

export const materialApi = {
  getById: (id) => axiosClient.get(`/material/${id}`),
  getAll: (params) => axiosClient.get("/material", { params }),
};

export const bouquetApi = {
  create: (formData) => {
    // formData should be a FormData object for multipart/form-data
    return axiosClient.post("/bouquets/create", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  update: (formData) => {
    return axiosClient.put("/bouquets/update", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  get: (params) => axiosClient.get("/bouquets/get", { params }),
  getById: (id) => axiosClient.get("/bouquets/getById", { params: { id } }),
  delete: (id) => axiosClient.delete("/bouquets/delete", { params: { id } }),
};

export const promotionApi = {
  getAll: (params) => axiosClient.get("/promotions", { params }),
  create: (data) => axiosClient.post("/promotions", data),
  check: (code, orderValue) => axiosClient.get("/promotions/check", { params: { code, orderValue } }),
  delete: (id) => axiosClient.delete(`/promotions/${id}`),
};
