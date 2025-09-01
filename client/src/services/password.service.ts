import axiosInstance from "./axiosInstance";
interface IType {
  oldPassword: string;
  newPassword: string;
}
interface IType2 {
  email: string;
  newPassword: string;
}
class passwordService {
  async updatePass(value: IType) {
    const response = await axiosInstance.put(`/auth/change-password`, value);
    return response.data;
  }
  async resetPass(value: IType2) {
    const response = await axiosInstance.post(`/auth/new-password`, value);
    return response.data;
  }
}

export default new passwordService();
