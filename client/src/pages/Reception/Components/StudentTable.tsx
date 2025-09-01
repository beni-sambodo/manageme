import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Table,
  Button,
  Avatar,
  Select,
  Dropdown,
  MenuProps,
  Modal,
  Form,
  Input,
  message,
  Pagination,
} from "antd";
import { useTranslation } from "react-i18next";
import { BiUser } from "react-icons/bi";
import { ICourse, IGRoup, newStudent } from "../../../Types/Types";
import { ColumnsType } from "antd/es/table";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { Link } from "react-router-dom";
import groupService from "../../../services/group.service";
import courseService from "../../../services/course.service";
import { useApiGet, useApiMutation } from "../../../services/queryConfig";
import receptionService from "../../../services/reception.service";
import moment from "moment";

interface StudentTableProps {
  handlePageChange: (page: number) => void;
  data: any;
  isLoading: boolean;
  handleSelectChange: (value: string, record: { student: newStudent }) => void;
  handleAcceptChange: (record: { student: newStudent }) => void;
  setSelect: Dispatch<SetStateAction<string[]>>;
  selectedRows: string[];
  setselectedRows: any;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
}

const CustomPagination = ({
  current,
  pageSize,
  total,
  onChange,
  onShowSizeChange,
}: any) => {
  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      showSizeChanger
      onChange={onChange}
      onShowSizeChange={onShowSizeChange}
      pageSizeOptions={[10, 20, 50, 100]}
      style={{ display: "flex", justifyContent: "center", padding: "12px" }}
    />
  );
};

const StudentTable: React.FC<StudentTableProps> = ({
  handlePageChange,
  data,
  isLoading,
  handleSelectChange,
  handleAcceptChange,
  setSelect,
  selectedRows,
  setselectedRows,
  setLimit,
  limit,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<newStudent | null>(null);
  const [form] = Form.useForm();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const statusColors: any = {
    NEW: "select-status-new",
    INVIEW: "select-status-inview",
    CANCELLED: "select-status-cancelled",
  };

  // Fetching Courses and Groups
  const { data: groups } = useApiGet(["getGroups"], () =>
    groupService.getGroups()
  );
  const { data: courses } = useApiGet(["getCourses"], () =>
    courseService.getCourses()
  );

  const courseOptions = courses?.datas?.map((course: ICourse) => ({
    value: course._id,
    label: course.name,
  }));

  const groupOptions = groups
    ?.filter(
      (group: IGRoup) =>
        !selectedCourseId || group.course._id === selectedCourseId
    )
    .map((group: IGRoup) => ({
      value: group._id,
      label: group.name,
    }));

  const editReception = useApiMutation(
    (values) => receptionService.editReception(values, editingStudent?._id),
    {
      onSuccess: () => message.success(t("delete.success")),
      onError: () => message.error(t("payment.error")),
    }
  );

  const showEditModal = (record: { student: newStudent }) => {
    setEditingStudent(record.student);
    form.setFieldsValue({
      name: record.student.user.name,
      group: record.student.group?._id,
      course: record.student.course,
      referal: record.student.referal,
      comment: record.student.comment,
    });
    setIsModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      editReception.mutate(values);
      setIsModalVisible(false);
    });
  };

  const getMenuItems = (record: {
    student: newStudent;
  }): MenuProps["items"] => [
      {
        key: "accept",
        label: (
          <button onClick={() => handleAcceptChange(record)}>
            {t("groupCard.accept")}
          </button>
        ),
      },
      {
        key: "edit",
        label: (
          <button onClick={() => showEditModal(record)}>
            {t("groupCard.edit")}
          </button>
        ),
      },
    ];

  // Table Columns
  const columns: ColumnsType<{
    course: any;
    id: string;
    student: newStudent;
  }> = [
      {
        title: "#",
        dataIndex: "key",
        key: "key",
      },
      {
        title: t("reception.student.name"),
        dataIndex: "student",
        key: "student",
        render: (_, record) => (
          <Link
            to={`/dashboard/reception/search/${record.id}`}
            className="flex items-center gap-3"
          >
            <Avatar
              src={record.student?.user?.avatar?.location}
              icon={<BiUser />}
            />
            <div className="flex flex-col  items-start">
              <span className="capitalize font-bold line-clamp-1">
                {record.student.user.name}
              </span>
              <span className="text-xs">+{record.student.user.phone}</span>
            </div>
          </Link>
        ),
      },
      {
        title: t("reception.student.comment"),
        dataIndex: "comment",
        key: "comment",
        render: (comment) => <p className="">{comment}</p>,
      },
      {
        title: t("groupDescriptions.time"),
        dataIndex: "time",
        key: "time",
        render: (comment) => <p className="">{moment(comment).format("DD.MM.YYYY")}</p>,
      },
      {
        title: t("reception.student.group"),
        dataIndex: "group",
        key: "group",
        render: (group, record) => (
          <div className="flex flex-col">
            <span>{group}</span>
            <span className="text-[11px]">{record.course?.name}</span>
          </div>
        ),
      },
      {
        title: t("reception.student.status"),
        dataIndex: "status",
        key: "status",
        render: (status, record) => (
          <Select
            value={status}
            onChange={(value) => handleSelectChange(value, record)}
            className={statusColors[status] || ""}
            options={[
              { value: "NEW", label: t("reception.status.new") },
              { value: "INVIEW", label: t("reception.status.inview") },
              { value: "CANCELLED", label: t("reception.status.cancelled") },
            ]}
            style={{ width: 120 }}
          />
        ),
      },
      {
        title: t("reception.student.action"),
        key: "action",
        render: (record) => (
          <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
            <Button
              type="text"
              className="flex justify-center items-center text-xl text-main"
            >
              <CgMoreVerticalAlt />
            </Button>
          </Dropdown>
        ),
      },
    ];

  // DataSource
  const dataSource = data?.students.map(
    (student: newStudent, index: number) => ({
      key: index + 1,
      id: student?._id,
      phone: student.phone,
      time: student.createdAt,
      group: student.group?.name,
      course: student.course,
      comment: student.comment,
      status: student.status,
      student,
    })
  );

  // Row Selection
  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
      const s = selectedRows.map((i) => i.id);
      setSelect(s);
      setselectedRows(selectedRowKeys);
    },
    getCheckboxProps: (record: { student: newStudent }) => ({
      disabled: record.student.status === "ACCEPTED",
    }),
  };

  // Handle limit change
  const handleLimitChange = (size: number) => {
    setLimit(size);
    handlePageChange(1); // Reset to the first page when the limit changes
  };

  return (
    <div className="overflow-hidden">
      <Table
        dataSource={dataSource}
        className="overflow-scroll md:overflow-auto"
        loading={isLoading}
        columns={columns}
        pagination={false}
        rowSelection={rowSelection}
      />
      <CustomPagination
        current={data.pagination.page}
        pageSize={limit}
        total={data.pagination.count}
        onChange={handlePageChange}
        onShowSizeChange={handleLimitChange}
      />
      {/* Edit Modal */}
      <Modal
        open={isModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={t("common.save")}
        cancelText={t("common.cancel")}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="course"
            label={t("addStudent.courseLabel")}
            rules={[{ required: true, message: t("common.required") }]}
          >
            <Select
              options={courseOptions}
              allowClear
              onChange={setSelectedCourseId}
            />
          </Form.Item>
          <Form.Item
            name="group"
            label={t("reception.student.group")}
            rules={[{ required: true, message: t("common.required") }]}
          >
            <Select options={groupOptions} allowClear />
          </Form.Item>
          <Form.Item name="referal" label={t("addStudent.suggestedByLabel")}>
            <Input />
          </Form.Item>
          <Form.Item name="comment" label={t("reception.student.comment")}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentTable;
