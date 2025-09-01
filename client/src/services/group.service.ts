import { IGRoup } from "../Types/Types";
import axiosInstance from "./axiosInstance";

class GroupService {
  async searchGroup(name?: string | null) {
    const params: Record<string, unknown> = {};
    if (name) {
      params.name = name;
    }

    try {
      const response = await axiosInstance.get(`/group/search`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }
  async getGroups(filters?: Record<string, any>) {
    const params: Record<string, unknown> = {};
    if (filters) {
      // Loop through the filters and only add non-null or non-empty values to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          params[key] = value;
        }
      });
    }

    try {
      const response = await axiosInstance.get(`/group`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }

  async acceptGroup(id: string, status: string) {
    const response = await axiosInstance.put(
      `/group/status/${id}?status=${status.toLowerCase()}`
    );
    return response.data;
  }

  async deleteFromGroup(values: { student: string; group: string }) {
    const response = await axiosInstance.post(`/group/student`, values);
    return response.data;
  }
  async deleteGroup(id: string) {
    const response = await axiosInstance.delete(`/group/${id}`);
    return response.data;
  }
  async updateGroup(id: string | undefined, value: IGRoup) {
    const response = await axiosInstance.put(`/group/${id}`, value);
    return response.data;
  }

  async createGroup(values: IGRoup) {
    const response = await axiosInstance.post(`/group`, values);
    return response.data;
  }
  async getGroupById(id: string | undefined) {
    const response = await axiosInstance.get(`/group/` + id);
    return response.data;
  }

  async getTeacherGroups() {
    try {
      const response = await axiosInstance.get(`/group/teacher`);
      return response.data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }
  async getStudentsGroups() {
    try {
      const response = await axiosInstance.get(`/group/student`);
      return response.data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }

  async getLessonsForCalendar() {
    try {
      const response = await axiosInstance.get(`/group/calendar`);
      return response.data;
    } catch (error) {
      console.error("Error fetching lessons for calendar:", error);
      throw error;
    }
  }
}
export default new GroupService();
