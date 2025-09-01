import { CreateS, School } from "../Types/Types";
import axiosInstance from "./axiosInstance";
class SchoolService {
  async getCurrentSchool(): Promise<School> {
    const response = await axiosInstance.get<School>(`/school/current-school`);
    return response.data;
  }

  async getMySchool(): Promise<School> {
    const response = await axiosInstance.get<School>(`/school/my-schools`);
    return response.data;
  }

  async createSchool(values: CreateS): Promise<School> {
    const response = await axiosInstance.post<School>(`/school`, values);
    return response.data;
  }

  async updateSchool(id: string | undefined, values: unknown) {
    const response = await axiosInstance.put(`/school/${id}`, values);
    return response.data;
  }

  async getAllStuds() {
    const response = await axiosInstance.get(`school/students`);
    return response.data;
  }
}

export default new SchoolService();
