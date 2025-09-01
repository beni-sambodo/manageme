import axiosInstance from "./axiosInstance";

class transactionService {
  async getMyTr() {
    const response = await axiosInstance.get(`/transaction/my`);
    return response.data;
  }
  async getSchoolTr(filters: any, pagination: any) {
    const params: Record<string, unknown> = {};

    // Add filters only if they are not null, undefined, or 0
    filters &&
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== "" &&
          value !== undefined &&
          !(typeof value === "number" && value === 0)
        ) {
          params[key] = value;
        }
      });
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const response = await axiosInstance.get(
      `/transaction?page=${pagination || 1}${queryString && "&" + queryString}`
    );
    return response.data;
  }
  async getStudentPayment(group: string, month?: string | null) {
    const params: Record<string, unknown> = {};

    if (group) {
      params.group = group;
    }
    if (month) {
      params.month = month;
    }
    const response = await axiosInstance.get(`/student-payment/filtered`, {
      params,
    });
    return response.data;
  }
  async getTypes() {
    const response = await axiosInstance.get(`/transaction/type`);
    return response.data;
  }

  async pay(values: {
    paymentId: string | undefined;
    amount: number;
    type: string;
    for: string;
  }) {
    const response = await axiosInstance.post(`/student-payment/pay`, values);
    return response.data;
  }
  async makeDiscount(values: {
    group: string;
    amount: number;
    student: string | undefined;
    reason: string;
  }) {
    const response = await axiosInstance.post(
      `/student-payment/discount`,
      values
    );
    return response.data;
  }
}

export default new transactionService();
