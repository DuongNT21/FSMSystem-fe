import { authApi } from "../apis/authApi";

const login = async ({ username, password }) => {
  return await authApi.login({ username, password });
};

const register = async ({
  username,
  password,
  fullname,
  email,
  phoneNumber,
  address,
  avatar,
}) => {
  return await authApi.register({
    username,
    password,
    fullname,
    email,
    phoneNumber,
    address,
    avatar,
  });
};

export const authService = {
  login,
  register,
};
