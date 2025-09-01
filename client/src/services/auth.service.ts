import axiosInstance from "./axiosInstance";
import { Login, Us, User, registerU } from "../Types/Types";
import axios from "axios";
class authService {
  async getRole() {
    const response = await axiosInstance.get(`/position`);

    return response.data;
  }

  async getUser() {
    try {
      const response = await axiosInstance.get(`/auth/user-data`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
        // If the error is not 401 or another issue, throw the error
        throw error;
      } else {
        // If the error is not an Axios error, rethrow it or handle it as needed
        throw new Error("An unexpected error occurred");
      }
    }
  }
  async findUser(username: string | undefined) {
    const response = await axiosInstance.get(`/auth/user/${username}`);

    return response.data;
  }

  async login(values: Us) {
    return axiosInstance.post<Login>(`/auth/login`, values);
  }

  async register(values: registerU) {
    return axiosInstance.post<Login>(`/auth/register`, values);
  }

  async updateUser(values: User) {
    const response = await axiosInstance.put(`/auth/update`, values);

    return response.data;
  }

  async updateRole(value: string) {
    const response = await axiosInstance.put(`/auth/select-role?role=${value}`);

    return response.data;
  }

  async getFullData(username: string | undefined) {
    const response = await axiosInstance.get(`/auth/full-data/${username}`);

    return response.data;
  }
}

export default new authService();
