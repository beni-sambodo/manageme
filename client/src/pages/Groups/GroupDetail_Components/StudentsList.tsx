import {
  Modal,
  List,
  Skeleton,
  Avatar,
  Empty,
  Dropdown,
  message,
  MenuProps,
} from "antd";
import { FiMoreVertical } from "react-icons/fi";
import useFetchUser from "../../../hooks/useFetchUser";
import { useState } from "react";
import { useApiMutation } from "../../../services/queryConfig";
import groupService from "../../../services/group.service";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface User {
  name: string;
  surname: string;
  username: string;
  _id: string;
}

interface Student {
  _id: string;
  user: User;
  payment?: boolean;
  avatar?: {
    location: string;
  };
  username: string;
  name: string;
}

interface StudentsListProps {
  students: Student[];
  group: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch?: any;
}

export default function StudentsList({
  students,
  group,
  refetch,
}: StudentsListProps) {
  const { t } = useTranslation();
  const { user, userLoading } = useFetchUser();
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // const handlePayClick = (student: Student) => {
  //   setSelectedStudent(student);
  //   setIsModalVisible(true);
  // };

  const removeFromGroup = useApiMutation(
    (params: { student: string; group: string }) =>
      groupService.deleteFromGroup(params),
    {
      onSuccess: () => {
        message.success("Successfully removed from group");
        refetch();
      },
      onError: () => {
        message.error("Failed to remove from group");
      },
      invalidateKeys: ["updateRole"],
    }
  );

  const showDeleteConfirm = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalVisible(true);
  };

  const handleRemoveFromGroup = async () => {
    if (!studentToDelete) return;
    try {
      await removeFromGroup.mutate({ student: studentToDelete._id, group });
      setIsDeleteModalVisible(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Failed to remove from group:", error);
    }
  };

  if (students.length === 0) {
    return <Empty description={t("noData")} />;
  }

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={students}
        renderItem={(item) => {
          const items: MenuProps["items"] = [
            {
              key: "0",
              danger: true,
              label: (
                <button onClick={() => showDeleteConfirm(item)}>
                  {t("removeFromGroup")}
                </button>
              ),
            },
          ];

          return (
            <List.Item
              actions={[
                <Dropdown
                  className={
                    !userLoading &&
                      (user?.selected_role.role.toLocaleLowerCase() === "admin" ||
                        user?.selected_role.role.toLocaleLowerCase() === "ceo")
                      ? ""
                      : "hidden"
                  }
                  menu={{ items }}
                  trigger={["click"]}
                >
                  <button className="flex text-xl justify-center h-full items-center">
                    <FiMoreVertical />
                  </button>
                </Dropdown>
              ]}
            >
              <Skeleton avatar title={false} active loading={false}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item?.avatar?.location}>
                      {item?.username[0]}
                    </Avatar>
                  }
                  title={<Link to={`/dashboard/reception/search/${item._id}`}>{item.name}</Link>}
                  description={
                    <Link to={`/dashboard/reception/search/${item._id}`}>{item.username}</Link>
                  }
                />
              </Skeleton>
            </List.Item>
          );
        }}
      />
      {/* <PayModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        selectedStudent={selectedStudent}
      /> */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleRemoveFromGroup}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        <p>
          Are you sure you want to remove {studentToDelete?.name} from the
          group?
        </p>
      </Modal>
    </>
  );
}
