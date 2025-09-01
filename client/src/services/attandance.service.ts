import axiosInstance from "./axiosInstance";

interface IType {
  attendance: string;
  id: string;
  status: string;
  comment: string;
}

class attandanceService {
  async getAttendanceById(attendanceId: string | null) {
    const response = await axiosInstance.get(`/attendance/${attendanceId}`);
    return response.data;
  }
  async getTodaysLessons() {
    const response = await axiosInstance.get(`/attendance/today`);
    return response.data;
  }

  async attand(value: IType) {
    const response = await axiosInstance.put(`/attendance`, value);
    return response.data;
  }

  async end(id: string) {
    const response = await axiosInstance.put(`/attendance/end/${id}`);
    return response.data;
  }
  async endGroup(group: string) {
    const response = await axiosInstance.post(`/group/payment`, { group });
    return response.data;
  }
  async create(value: { day: string; group: string }) {
    const response = await axiosInstance.post(`/attendance`, value);
    return response.data;
  }
  async getMonthlyAttendance(groupId: string, month?: string) {
    const url = month 
      ? `/group/${groupId}/monthly-attendance?month=${month}` 
      : `/group/${groupId}/monthly-attendance`;
    const response = await axiosInstance.get(url);
    return response.data;
  }
}

export default new attandanceService();
