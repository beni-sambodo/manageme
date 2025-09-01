import { useState } from "react";
import { Button, Modal, message, Space, Table } from "antd";
import roomService from "../../services/room.service";
import { IRoom } from "../../Types/Types";
import { useApiMutation } from "../../services/queryConfig";
import { MdDelete, MdEdit } from "react-icons/md";
import { useEffect } from "react";
import RoomFormModal from "./Components/RoomFormModal";
import { useTranslation } from "react-i18next";

export default function Rooms({
  rooms,
  refetch,
}: {
  rooms: IRoom[];
  refetch: () => void;
}) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);

  const getHeaders = async () => {
    const token = await localStorage.getItem("token");
    return {
      Authorization: token,
    };
  };

  const addOrEditRoom = useApiMutation(
    async (value: IRoom) => {
      if (editingRoom) {
        return roomService.updateRoom(editingRoom._id, value);
      } else {
        return roomService.addRoom(value);
      }
    },
    {
      onSuccess: () => {
        setIsModalVisible(false);
        refetch();
        message.success(
          t(`rooms.${editingRoom ? "updateSuccess" : "addSuccess"}`)
        );
        setEditingRoom(null);
      },
      onError: () =>
        message.error(t(`rooms.${editingRoom ? "updateFailed" : "addFailed"}`)),
      invalidateKeys: ["rooms"],
    }
  );

  const deleteRoom = useApiMutation(
    async (id: string) => {
      return roomService.deleteRoom(id);
    },
    {
      onSuccess: () => {
        refetch();
        message.success(t("rooms.deleteSuccess"));
      },
      onError: () => message.error(t("rooms.deleteFailed")),
      invalidateKeys: ["rooms"],
    }
  );

  useEffect(() => {
    getHeaders();
  }, []);

  const showAddRoomModal = () => {
    setEditingRoom(null);
    setIsModalVisible(true);
  };

  const showEditRoomModal = (room: IRoom) => {
    setEditingRoom(room);
    setIsModalVisible(true);
  };

  const handleAddOrEditRoom = (values: IRoom) => {
    addOrEditRoom.mutate(values);
  };

  const handleDelete = (id: string) => {
    if (!id) {
      message.error(t("rooms.invalidIdError", "ID xato yoki topilmadi"));
      return;
    }
    Modal.confirm({
      title: t("rooms.deleteConfirm", "O'chirishni tasdiqlaysizmi?"),
      onOk: () => deleteRoom.mutate(id),
    });
  };

  const columns = [
    {
      title: t("rooms.roomName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("rooms.roomNumber"),
      dataIndex: "number",
      key: "number",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_: undefined, room: IRoom) => (
        <Space>
          <Button
            type="link"
            className="text-xl"
            onClick={() => {
              showEditRoomModal(room);
            }}
          >
            <MdEdit />
          </Button>
          <Button
            type="primary"
            danger
            className="text-xl"
            onClick={() => handleDelete(room._id)}
          >
            <MdDelete />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] text-p font-medium">
          {t("rooms.totalRooms", { count: rooms.length })}
        </h2>
        <Button type="primary" onClick={showAddRoomModal}>
          {t("rooms.addNewRoom")}
        </Button>
      </div>
      <Table
        pagination={false}
        bordered
        className="mt-4 overflow-hidden"
        dataSource={rooms}
        columns={columns}
        rowKey="_id"
      />

      <RoomFormModal
        isModalVisible={isModalVisible}
        editingRoom={editingRoom}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRoom(null);
        }}
        onFinish={handleAddOrEditRoom}
        isPending={addOrEditRoom.isPending}
      />
    </div>
  );
}
