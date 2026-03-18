import { userApi } from "../apis/userApi";

export const userService = {
  getUsers: async (params) => {
    const response = await userApi.getUsers(params);
    return response;
  },
  blockUser: async (id) => {
    const response = await userApi.blockUser(id);
    return response;
  },
};