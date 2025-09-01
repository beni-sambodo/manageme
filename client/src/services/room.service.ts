import { IRoom } from "../Types/Types";
import axiosInstance from "./axiosInstance";

class roomService {
  async getRooms() {
    const response = await axiosInstance.get(`/room`);
    return response.data;
  }

  async addRoom(value: IRoom) {
    const response = await axiosInstance.post(`/room`, value);
    return response.data;
  }

  async updateRoom(id: string, value: IRoom) {
    const response = await axiosInstance.put(`/room/${id}`, value);
    return response.data;
  }

  async deleteRoom(id: string) {
    const response = await axiosInstance.delete(`/room/${id}`);
    return response.data;
  }
}

export default new roomService();
