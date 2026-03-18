import { userApi } from "../apis/userApi";
import axiosClient from "../apis/axiosClient";

export const userService = {
  getUsers: async (params) => {
    const response = await userApi.getUsers(params);
    return response;
  },
  updateUserStatus: async (id, isActive) => {
    const response = await axiosClient.put(`/users/${id}/status`, null, {
      params: { isActive },
    });
    return response;
  },
};