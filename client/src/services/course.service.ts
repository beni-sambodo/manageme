import axiosInstance from "./axiosInstance";
import { ICourse } from "../Types/Types";
interface FormValues {
  name: string;
  category: string;
  type: string[];
  duration: number;
  teachers: string[];
  price: number;
  isPublic: boolean;
}

class CourseService {
  async getCourses(filters?: any, page: number = 1, limit: number = 10) {
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

    // Add page to the query
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();

    const response = await axiosInstance.get(
      `/course?page=${page}&limit=${limit}${queryString && "&" + queryString}`
    );
    return response.data;
  }

  async createCourse(values: ICourse) {
    const response = await axiosInstance.post(`/course`, values);
    return response.data;
  }
  async editCourse(id: string, values: FormValues) {
    const response = await axiosInstance.put(`/course/${id}`, values);
    return response.data;
  }

  async getCourseCategories() {
    const response = await axiosInstance.get(`/course-category`);
    return response.data;
  }
  async getCoursesByID(id: string | undefined) {
    const response = await axiosInstance.get(`/course/` + id);
    return response.data;
  }

  async deleteCourse(id: string) {
    const response = await axiosInstance.delete(`/course/${id}`);
    return response.data;
  }

  async deleteCourseCategory(id: string) {
    const response = await axiosInstance.delete(`/course-category/${id}`);
    return response.data;
  }

  async createCourseCategory(name: string) {
    const response = await axiosInstance.post(`/course-category`, { name });
    return response.data;
  }

  async updateCourseCategory(id: string, name: string) {
    const response = await axiosInstance.put(`/course-category/${id}`, {
      name,
    });
    return response.data;
  }
}

export default new CourseService();
