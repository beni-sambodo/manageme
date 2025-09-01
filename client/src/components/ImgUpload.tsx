import React, { useState } from "react";
import { message, Spin, Image } from "antd";
import { BiPlus } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import uploadService from "../services/upload.service";

interface ImageUploadProps {
  type: string; // Type of file being uploaded (e.g., "avatar", "banner", etc.)
  onUploadSuccess: (id: string) => void; // Callback function to pass the uploaded image ID
  multiple?: boolean; // Whether to allow multiple files to be uploaded
  initialImages?: any; // Initial images to display
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  onUploadSuccess,
  multiple = false,
  initialImages,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState(
    Array.isArray(initialImages)
      ? initialImages
      : initialImages
      ? [initialImages]
      : []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const uploadedImages = await Promise.all(
          files.map((file) => uploadFile(file, type))
        );
        setImages([...images, ...uploadedImages]);
        uploadedImages.forEach((image: { _id: string }) =>
          onUploadSuccess(image._id)
        );
      } catch (err) {
        console.error(err);
        message.error("Error uploading files");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const uploadFile = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await uploadService.upload(type, formData);
    return response[0];
  };

  const handleRemove = async (id: string) => {
    try {
      await uploadService.deleteGroup(id);
      setImages(images.filter((image: { _id: string }) => image._id !== id));
      message.success("File has been removed");
    } catch (err) {
      message.error("Error deleting file");
    }
  };

  const renderPreview = () => {
    return images.map((image) => {
      return (
        <div
          key={image._id}
          className="relative max-w-[100px] min-w-[100px] aspect-square overflow-hidden rounded-lg w-fit"
        >
          <Image
            className=" w-full aspect-square object-cover border rounded-lg"
            src={image.location}
            alt={image._id}
            loading="lazy"
          />
          <button
            type="button"
            className="absolute bg-white rounded-full top-1 right-1 p-1 shadow"
            onClick={() => handleRemove(image._id)}
          >
            <CgClose />
          </button>
        </div>
      );
    });
  };

  return (
    <div className="gap-5 flex items-center ">
      {renderPreview()}

      {images.length <= 0 ? (
        <div className="flex w-[100px] h-[100px] flex-col items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 duration-200">
          <input
            type="file"
            disabled={isUploading}
            onChange={handleFileChange}
            style={{ display: "none" }}
            id={`${type}-upload`}
            multiple={multiple}
          />
          <label
            className="flex p-4 w-full h-full flex-col justify-center items-center cursor-pointer"
            htmlFor={`${type}-upload`}
          >
            {isUploading ? (
              <Spin />
            ) : (
              <>
                <BiPlus size={24} />
                <span>Upload</span>
              </>
            )}
          </label>
        </div>
      ) : multiple ? (
        <div className="flex w-[100px] h-[100px] flex-col items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 duration-200">
          <input
            type="file"
            disabled={isUploading}
            onChange={handleFileChange}
            style={{ display: "none" }}
            id={`${type}-upload`}
            multiple={multiple}
          />
          <label
            className="flex p-4 w-full h-full flex-col justify-center items-center cursor-pointer"
            htmlFor={`${type}-upload`}
          >
            {isUploading ? (
              <Spin />
            ) : (
              <>
                <BiPlus size={24} />
                <span>Upload</span>
              </>
            )}
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;
