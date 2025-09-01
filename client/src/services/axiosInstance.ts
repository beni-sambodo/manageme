import axios, { AxiosInstance } from "axios";

const API_URL: string = import.meta.env.VITE_BASE_URL || ""; // Ensure a fallback
const token = localStorage.getItem("token");

// Create Axios instance with default configurations
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token, // Include 'Bearer' if required
  },
});

axiosInstance.interceptors.request.use((config) => {
  const newToken = localStorage.getItem("token");
  if (newToken) {
    config.headers.Authorization = newToken;
  }
  return config;
});

export default axiosInstance;
