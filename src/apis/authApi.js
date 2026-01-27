import http from "../utils/http";

const login = async (data) => {
  const response = await http.post("/auth", data);
  console.log(response.data);
  return {
    token: response.data.token,
    fullName: response.data.fullName,
    roleName: response.data.roleName,
  };
};

const register = async (data) => {
  const response = await http.post("/register", data);
  return {
    id: response.data.id,
    username: response.data.username,
    fullName: response.data.fullName,
    avartar: response.data.avartar,
  };
};

export const authApi = {
  login,
  register,
};
