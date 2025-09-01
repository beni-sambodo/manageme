import { IPositions } from "../Types/Types";
import axiosInstance from "./axiosInstance";

class positionsService {
  async getPositions() {
    const response = await axiosInstance.get(`/position`);
    return response.data;
  }

  async addPosition(value: IPositions) {
    const response = await axiosInstance.post(`/position`, value);
    return response.data;
  }

  async updatePosition(id: string, value: IPositions) {
    const response = await axiosInstance.put(`/position/${id}`, value);
    return response.data;
  }

  async deletePosition(id: string) {
    const response = await axiosInstance.delete(`/position/${id}`);
    return response.data;
  }
}

export default new positionsService();
