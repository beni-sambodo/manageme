import axiosInstance from "./axiosInstance";
import imageCompression from "browser-image-compression";

class UploadService {
  async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error during image compression:", error);
      throw error;
    }
  }

  async upload(type: string, formData: FormData) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authorization token found");
    }

    const headers = {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    };

    const file = formData.get("file");
    if (file instanceof File && file.type.startsWith("image")) {
      const compressedFile = await this.compressImage(file);
      formData.set("file", compressedFile);
    }

    try {
      const response = await axiosInstance.post(
        `/file/upload/${type}`,
        formData,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during file upload:", error);
      throw error;
    }
  }

  async deleteGroup(id: string) {
    try {
      const response = await axiosInstance.delete(`/file/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error during file deletion:", error);
      throw error;
    }
  }
}

export default new UploadService();
