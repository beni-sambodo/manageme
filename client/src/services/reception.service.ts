import { newStudent } from "../Types/Types";
import axiosInstance from "./axiosInstance";

class receptionService {
  async getStudentsByGroup(value: string) {
    const response = await axiosInstance.get(`/reception/${value}`);
    return response.data;
  }

  async getStudents(
    page?: number,
    status?: string | null,
    group?: string | null,
    limit?: number
  ) {
    const params: Record<string, unknown> = { page, limit };

    // Добавляем статус и группу, только если они не пусты
    if (status) {
      params.status = status;
    }
    if (group) {
      params.group = group;
    }

    const response = await axiosInstance.get("/reception", {
      params,
    });
    return response.data;
  }

  async statusChange(status: string, id: string) {
    const response = await axiosInstance.put(`/reception/${id}`, {
      status: status,
    });

    return response.data;
  }
  async addToGroup(id: string[] | undefined, group: string | undefined) {
    const response = await axiosInstance.put(`/reception/add-group`, {
      receptions: id,
      group: group,
    });

    return response.data;
  }

  async inviteStudent(values: newStudent) {
    const response = await axiosInstance.post(`/reception`, values);

    return response.data;
  }

  async createNewStudent(values: newStudent) {
    const response = await axiosInstance.post(`/reception/create-new`, values);

    return response.data;
  }
  async deleteStudent(ids: { receptions: string[] }) {
    const response = await axiosInstance.post(`/reception/delete-many`, ids);

    return response.data;
  }
  async editReception(value: any, id: string | undefined) {
    const response = await axiosInstance.put(`/reception/update/` + id, value);

    return response.data;
  }
  async getReceptionById(id: string | undefined) {
    const response = await axiosInstance.get(`/reception/` + id);
    return response.data;
  }
  async editManyReception(value: any) {
    const response = await axiosInstance.put(`/reception/update-many`, value);

    return response.data;
  }
}
export default new receptionService();
