import axiosInstance from "./axiosInstance";

class EmployeesService {
  async getMyInvites() {
    const response = await axiosInstance.get(`/employer/my-invites`);
    return response.data;
  }

  async getInvites(
    filters?:
      | {
          name: string;
          position: string;
          salary: number;
          status: string;
        }
      | unknown
  ) {
    const response = await axiosInstance.get(`/employer/employees`, {
      params: filters,
    });
    return response.data;
  }

  async getPositions() {
    try {
      const response = await axiosInstance.get(`/position`);
      return response.data;
    } catch (error) {
      console.error("Error fetching positions:", error);
      throw error;
    }
  }
  async changeStatusEmployer(id: string | undefined, status: string) {
    const response = await axiosInstance.put(`/employer/${id}`, {
      status: status,
    });
    return response.data;
  }
  async updateEmployer(id: string | undefined, value: any) {
    const response = await axiosInstance.put(`/employer/update/` + id, value);
    return response.data;
  }

  async deleteEmployer(id: string | undefined) {
    const response = await axiosInstance.delete(`/employer/${id}`);
    return response.data;
  }

  async changeInvite(action: string, id: string) {
    try {
      const response = await axiosInstance.put(`/employer/${action}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error changing invite ${action} for ID ${id}:`, error);
      throw error;
    }
  }

  async createInvite(values: {
    user: string;
    message: string;
    positions: { salary: number; salary_type: string; position: string }[];
  }) {
    try {
      const response = await axiosInstance.post(`/employer`, values);
      return response.data;
    } catch (error) {
      console.error("Error creating invite:", error);
      throw error;
    }
  }
}

export default new EmployeesService();
