import axiosInstance from "./axiosInstance";
interface IVerify {
  email: string;
  code: number;
}
class emailService {
  async sendPassCode(email: string) {
    const response = await axiosInstance.post(`/auth/send-code`, { email });
    return response.data;
  }
  async sendCode(email: string) {
    const response = await axiosInstance.post(`/auth/send-verification-code`, {
      email: email,
    });
    return response.data;
  }

  async checkCode(value: IVerify) {
    const response = await axiosInstance.post(`/auth/check-code`, value);
    return response.data;
  }
  async verifyEmail(value: IVerify) {
    const response = await axiosInstance.post(`/auth/verify-email`, value);
    return response.data;
  }

  async changeEmail(email: string) {
    const response = await axiosInstance.put(`/auth/change-email`, {
      email: email,
    });
    return response.data;
  }
}

export default new emailService();
