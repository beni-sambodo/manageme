import axiosInstance from "./axiosInstance";

class statisticsService {


  async getStats(refetchParam: boolean) {

    const response = await axiosInstance.get(`/statistics?refresh=${refetchParam}`,);
    return response.data;
  }

  async getDailyRegistrations() {
    const response = await axiosInstance.get('/statistics/daily-registrations');
    return response.data;
  }

  async getSubjectDistribution() {
    const response = await axiosInstance.get('/statistics/subject-distribution');
    return response.data;
  }

  async getCourseDebtors() {
    const response = await axiosInstance.get('/statistics/course-debtors');
    return response.data;
  }
}

export default new statisticsService();
