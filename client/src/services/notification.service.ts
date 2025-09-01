import axiosInstance from "./axiosInstance";

class notificationService {
  async getNotifications() {
    const response = await axiosInstance.get(`/notification`);
    return response.data;
  }
}

export default new notificationService();
