import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Modal,
  Tooltip,
  message,
} from "antd";
import { FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { IGRoup } from "../../Types/Types";
import { CgMoreVerticalAlt } from "react-icons/cg";
import groupService from "../../services/group.service";
import { useState } from "react";
import useFetchUser from "../../hooks/useFetchUser";
import Photo from "../../assets/group.jpg";
interface GroupCardProps {
  group: IGRoup;
  refetch?: () => void; // refetch is optional
}

export default function GroupCard({ group, refetch }: GroupCardProps) {
  const { t } = useTranslation();
  const { user } = useFetchUser();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState<string>(group.status);
  const navigate = useNavigate();

  const showDeleteModal = () => setIsDeleteModalVisible(true);
  const handleDeleteCancel = () => setIsDeleteModalVisible(false);
  const showUpdateModal = () => navigate(`/dashboard/groups/edit/${group._id}`);

  const handleDelete = async () => {
    try {
      await groupService.deleteGroup(group._id);
      message.success(t("groupCard.groupDeleted"));
      setIsDeleteModalVisible(false);
      refetch && refetch();
    } catch (error) {
      message.error(t("groupCard.deleteError"));
    }
  };

  const statusColorClass = (() => {
    switch (newStatus) {
      case "WAITING":
        return "bg-orange-400";
      case "FINISHED":
        return "bg-rose-500";
      case "ACCEPTED":
        return "bg-green-500";
      case "FROZEN":
        return "bg-gray-400";
      default:
        return "bg-gray-200";
    }
  })();

  const handleStatusChange = async (status: string) => {
    try {
      await groupService.acceptGroup(group._id, status);
      setNewStatus(status);
      message.success(t("groupCard.statusUpdated"));
    } catch (error) {
      message.error(t("groupCard.statusUpdateError"));
    }
  };

  const statuses: MenuProps["items"] = [
    {
      key: "waiting",
      label: (
        <button onClick={() => handleStatusChange("WAITING")}>
          {t("groupCard.WAITING")}
        </button>
      ),
    },
    {
      key: "finished",
      label: (
        <button onClick={() => handleStatusChange("FINISHED")}>
          {t("groupCard.FINISHED")}
        </button>
      ),
    },
    {
      key: "frozen",
      label: (
        <button onClick={() => handleStatusChange("FROZEN")}>
          {t("groupCard.FROZEN")}
        </button>
      ),
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: <button onClick={showUpdateModal}>{t("groupCard.edit")}</button>,
    },
    {
      key: "delete",
      label: <button onClick={showDeleteModal}>{t("groupCard.delete")}</button>,
      danger: true,
    },
    ...(group.status.toLowerCase() !== "accepted"
      ? [
        {
          key: "accept",
          label: (
            <button onClick={() => handleStatusChange("ACCEPTED")}>
              {t("groupCard.accept")}
            </button>
          ),
        },
      ]
      : []),
  ];

  return (
    <div className="w-[100%] rounded-xl hover:shadow-2xl duration-300 shadow-xl shadow-slate-300/50 overflow-hidden flex flex-col justify-between bg-white p-5">
      <div className="relative w-[100%] text-white rounded-xl flex items-center justify-center text-2xl overflow-hidden h-[200px]">
        <img
          loading="lazy"
          className="object-cover h-full w-full"
          src={Photo}
          alt={group.name}
        />
        <div className="absolute top-2 gap-2 h-7 right-2 flex items-center">
          <Dropdown trigger={["click"]} menu={{ items: statuses }}>
            <span
              className={`h-full items-center flex font-semibold subpixel-antialiased tracking-wide text-sm rounded-lg px-4 shadow-lg cursor-pointer ${statusColorClass}`}
            >
              {t("groupCard." + newStatus) || t("groupCard.statusLabel")}
            </span>
          </Dropdown>
          {user &&
            ["ceo", "admin"].includes(
              user.selected_role.role.toLowerCase()
            ) && (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Button
                  type="primary"
                  className="flex text-xl justify-center h-full rounded-lg items-center bg-main"
                >
                  <CgMoreVerticalAlt />
                </Button>
              </Dropdown>
            )}
        </div>
      </div>
      <div className="flex mt-5 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-sm">
            <p className="flex items-center gap-1">
              <span className="text-main">
                <FaClock />
              </span>
              <span>
                {group.startTime} - {group.endTime}
              </span>
            </p>
            <p>
              {t("groupCard.roomLabel")}: {group.room?.number || 0}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Link
              to={`/dashboard/groups/${group._id}`}
              className="text-h1 hover:text-main duration-300 text-2xl font-semibold line-clamp-1"
            >
              {group.name}
            </Link>
            <p className="flex text-md font-semibold uppercase items-center">
              {t("groupCard." + group.day_pattern.join(", "))}
            </p>
          </div>
          <div className="font-semibold flex flex-col justify-center pt-3 border-t border-gray/35 text-[16px] my-3">
            <p>
              <span className="text-gray-500 text-[14px]">
                {t("groupCard.courseLabel")}:
              </span>{" "}
              {group.course?.name}
            </p>
            <p>
              <span className="text-gray-500 text-[14px]">
                {t("groupCard.levelLabel")}:
              </span>{" "}
              {group.level}
            </p>
            <p>
              <span className="text-gray-500 text-[14px]">
                {t("groupCard.spaceLabel")}:
              </span>{" "}
              {group.students.length}/{group.space}
            </p>
          </div>
        </div>
        <div className="flex object-cover border-t border-gray/35 pt-3 justify-between items-center">
          <div className="flex items-center gap-1">
            {t("groupCard.teachersLabel")}:
            <Avatar.Group maxCount={3}>
              {group.teachers?.map((t) => (
                <Tooltip key={t._id} title={t?.name} placement="top">
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    className="border border-black"
                  >
                    {t?.name?.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold">
              {group.course?.price?.toLocaleString("uz")}
            </span>
            so'm
          </div>
        </div>
      </div>

      <Modal
        title={t("groupCard.deleteModalTitle")}
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText={t("groupCard.confirmDelete")}
        cancelText={t("groupCard.cancel")}
      >
        <p>{t("groupCard.deleteModalContent")}</p>
      </Modal>
    </div>
  );
}
