import { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Modal,
  Tooltip,
  message,
} from "antd";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { ICourse, IEmploye } from "../../Types/Types";
import EditCourses from "./EditCourses";
import courseService from "../../services/course.service";
import Photo from "../../assets/course.avif";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function CourseCard({
  data,
  refetch,
}: {
  data: ICourse;
  refetch: () => void;
}) {
  const {t} = useTranslation()
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      await courseService.deleteCourse(data._id);
      message.success("Course deleted successfully");
      setIsDeleteModalVisible(false);
      refetch();
      // Optionally, you can add logic to refresh the course list after deletion
    } catch (error) {
      message.error("Failed to delete course");
    }
  };

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const items: MenuProps["items"] = [
    {
      key: 1,
      label: <button onClick={showEditModal}>{t("groupCard.edit")}</button>,
    },
    {
      key: 2,
      label: <button onClick={showDeleteModal}>{t("groupCard.delete")}</button>,
      danger: true,
    },
  ];

  return (
    <div className="bg-white h-fit flex flex-col shadow-2xl shadow-p/20 p-4 rounded-xl">
      <div className="h-[170px]">
        <img
          className="object-cover w-full h-full rounded-xl"
          src={data?.image?.location || Photo}
          loading="lazy"  
          alt="Courses"
        />
      </div>
      <div className="mt-5">
        <div className="flex justify-between items-center w-full">
          <Link to={data._id}>
            <h1 className="text-h1 text-2xl line-clamp-1 font-semibold">
              {data.name}
            </h1>
          </Link>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              type="text"
              shape="circle"
              className="flex text-xl justify-center items-center text-main"
            >
              <CgMoreVerticalAlt />
            </Button>
          </Dropdown>
        </div>
        <div className="text-p text-lg gap-y-1 gap-x-5 mt-4">
          <p className="line-clamp-1 flex border-b justify-between">
            {t("Category")}:{" "}
            <span className="text-h1 font-medium">{data.category?.name}</span>
          </p>
          <p className="line-clamp-1 flex border-b mt-1 p-0.5 justify-between">
          {t("course.type")}:{" "}
            <span className="text-h1 font-medium">
              {data.type.map((i: string) => i).join(", ")}
            </span>
          </p>
          <p className="line-clamp-1 flex border-b mt-1 p-0.5 justify-between">
          {t("Duration")}:{" "}
            <span className="text-h1 font-medium">{data.duration} oy</span>
          </p>
        </div>
        <div className="flex mt-4 justify-between">
          <Avatar.Group maxCount={4}>
            {data.teachers.map((t: IEmploye) => (
              <Tooltip key={t._id} title={t.user.name} placement="top">
                <Avatar
                  style={{ backgroundColor: getRandomColor() }}
                  src={t.user?.avatar?.location}
                >
                  {t.user.name[0]}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
          <h1 className="text-main text-2xl font-semibold">
            {data.price.toLocaleString("uz")} so'm
          </h1>
        </div>
      </div>

      <Modal
        title={t("groupCard.edit")}
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        centered
        footer={null}
      >
        <EditCourses
          Course={data}
          setIsEditModalVisible={setIsEditModalVisible}
          refetch={refetch}
        />
      </Modal>

      <Modal
        title="Delete Course"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        centered
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this course?</p>
      </Modal>
    </div>
  );
}
