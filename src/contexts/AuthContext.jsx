/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import React from "react";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      setLoading(false);
    };

    initializeApp();
  }, []);

  const login = async ({ username, password }) => {
    const userData = await authService.login({ username, password });
    localStorage.setItem("access_token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    console.log("Login successful, should navigate to home");
    return userData;
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
    await authService.register({
      username,
      password,
      fullname,
      email,
      phoneNumber,
      address,
      avatar,
    });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
