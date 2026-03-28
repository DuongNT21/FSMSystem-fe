import axiosClient from "./axiosClient";

const API_URL = "/users";

export const userApi = {
  getUsers: (params) => {
    return axiosClient.get(API_URL, { params });
  },
  blockUser: (id) => {
    return axiosClient.put(`${API_URL}/${id}/block`);
  },
  createStaff: (data) => {
    return axiosClient.post(`${API_URL}/staff`, data);
  },
  updateStaff: (id, data) => {
    return axiosClient.put(`${API_URL}/staff/${id}`, data);
  },
  deleteStaff: (id) => {
    return axiosClient.delete(`${API_URL}/staff/${id}`);
  },
};
