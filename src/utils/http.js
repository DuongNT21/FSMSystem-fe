import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Attach token from localStorage
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // or your key name

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handle common errors globally
 */
http.interceptors.response.use(
  (response) => response.data, // return only data
  (error) => { 

    return Promise.reject(error);
  }
);

export default http;
