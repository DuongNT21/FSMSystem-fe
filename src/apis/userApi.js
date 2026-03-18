import axiosClient from "./axiosClient";

const API_URL = "/users";

export const userApi = {
  getUsers: (params) => {
    return axiosClient.get(API_URL, { params });
  },
  blockUser: (id) => {
    return axiosClient.put(`${API_URL}/${id}/block`);
  },
};
