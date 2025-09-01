import axiosInstance from "./axiosInstance";

class supportService {
  async createSupport(values: { text: string; file: string }) {
    const response = await axiosInstance.post(`/support`, values);
    return response.data;
  }
}

export default new supportService();
