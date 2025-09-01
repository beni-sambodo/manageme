import axios from "axios";
import axiosInstance from "./axiosInstance";

const AdminToken = localStorage.getItem("adminToken");

class adminService {
  async login(values: { username: string; password: string }) {
    const response = await axiosInstance.post(`/admin/login`, values);
    return response.data;
  }

  async getAdminSchools({
    limit = "12",
    page = "1",
  }: {
    limit?: string;
    page?: string;
  }) {
    const headers = { Authorization: AdminToken };

    const response = await axios.get(
      `/admin/schools?limit=${limit}&page=${page}`,
      { headers }
    );
    return response.data;
  }
}

export default new adminService();
