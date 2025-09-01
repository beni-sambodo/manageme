/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Avatar,
  Breadcrumb,
  Dropdown,
  MenuProps,
  Table,
  Tag,
  message,
  Modal,
  InputNumber,
  Select,
  Input,
} from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddButton from "../../components/AddButton";
import { useApiGet, useApiMutation } from "../../services/queryConfig";
import employeesService from "../../services/employees.service";
import { IEmploye, User, position } from "../../Types/Types";
import { LuMoreVertical } from "react-icons/lu";
import { SetStateAction, useState } from "react";
import InviteForm from "./InviteForm";

export default function Employees() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    name: searchParams.get("name"),
    position: searchParams.get("position"),
    salary: searchParams.get("salary"),
    status: searchParams.get("status"),
  });

  const { isLoading, data, error, refetch } = useApiGet(
    ["getInvites", filters],
    () => employeesService.getInvites(filters)
  );
  const [open, setOpen] = useState<boolean>(false);
  const [employe, setEmployer] = useState<null | IEmploye>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const positions = useApiGet(["getPositions"], () =>
    employeesService.getPositions()
  );
  const dataSource = data?.map((w: IEmploye, index: number) => ({
    key: (index + 1).toString(),
    id: w._id,
    employee: w?.user,
    e: w,
    status: w?.status,
    position: w?.positions?.map((i: position) => i?.position),
    salary: w?.positions.map((i: position, index: number) => (
      <p key={index}>
        {i?.salary} {i.salary_type == "MONTHLY" ? "so'm" : "%"}
      </p>
    )),
  }));

  const deleteEmployer = useApiMutation(
    () => employeesService.deleteEmployer(employe?._id),
    {
      onSuccess: () => {
        message.success("Deleted successfully");
        setEmployer(null);
        refetch();
      },
      onError: () => message.error("Failed to delete employee"),
    }
  );
  const changeStatusEmployer = useApiMutation(
    (status: string) =>
      employeesService.changeStatusEmployer(employe?._id, status),
    {
      onSuccess: () => {
        message.success("Status changed successfully");
        setEmployer(null);
        refetch();
      },
      onError: () => message.error("Failed to change employee status"),
    }
  );
  const updateEmployer = useApiMutation(
    (value: any) => employeesService.updateEmployer(employe?._id, value),
    {
      onSuccess: () => {
        message.success("successfully");
        setEmployer(null);
        setOpen(false);

        refetch();
      },
      onError: () => message.error("Failed to change employee status"),
    }
  );
  const handleStatusVacation = (status: string) => {
    setPendingStatus(status);
    setStatusModalVisible(true);
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1":
        setOpen(true);
        break;
      case "2":
        setDeleteModalVisible(true);
        break;
      case "3":
        handleStatusVacation(
          employe?.status == "VACATION" ? "ACCEPTED" : "VACATION"
        );
        break;
      default:
        message.info(`Click on item ${key}`);
    }
  };
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const positionColorMap: Record<string, string> = {
    TEACHER: "green",
    ADMINISTRATOR: "blue",
    MANAGER: "purple",
    CEO: "red",
    ACCOUNTANT: "gold",
    CLEANER: "orange",
    SECURITY: "volcano",
  };
  const handleDelete = () => {
    deleteEmployer.mutate();
    setDeleteModalVisible(false);
  };

  const confirmStatusChange = () => {
    if (pendingStatus) {
      changeStatusEmployer.mutate(pendingStatus);
      setStatusModalVisible(false);
    }
  };

  const handleAddPosition = (values: any) => {
    const v: any = {
      positions: values,
    };
    updateEmployer.mutate(v);
  };
  const columns: any = [
    {
      title: t("employees.table.number"), // Translated title
      dataIndex: "key",
      key: "key",
    },
    {
      title: t("employees.table.employee"), // Translated title
      dataIndex: "employee",
      key: "employee",
      render: (em: User) => (
        <div className="flex gap-3 items-center">
          <Avatar size={"large"} src={em.avatar?.location}>
            {em.name[0]}
          </Avatar>
          {em.name}
        </div>
      ),
    },
    {
      title: t("employees.table.position"),
      dataIndex: "position",
      key: "position",
      render: (positions: { _id: string; name: string; type: string }[]) => {
        return (
          <>
            {positions?.map((position) => {
              const color = positionColorMap[position?.type] || "default";
              return (
                <Tag key={position?._id} color={color}>
                  {position?.name}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: t("employees.table.salary"),
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: t("employees.table.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let statusClass = "";

        switch (status.toLowerCase()) {
          case "accepted":
            statusClass = "bg-green-100 text-green-800";
            break;
          case "vacation":
            statusClass = "bg-yellow-100 text-yellow-800";
            break;
          case "deleted":
            statusClass = "bg-black text-white";
            break;
          case "cancelled":
            statusClass = "bg-red-100 text-red-800";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold ${statusClass}`}
          >
            {t(`changeStatusModal.statusOptions.${status.toLowerCase()}`)}{" "}
          </span>
        );
      },
    },
    {
      title: t("reception.student.action"),
      dataIndex: "action",
      key: "action",
      render: (
        _: string,
        record: { status: string; e: SetStateAction<IEmploye | null> }
      ) => {
        const items: MenuProps["items"] = [
          {
            key: "1",
            label: t("groupCard.edit"),
          },
          {
            key: "2",
            label: t("groupCard.delete"),
          },
          {
            key: "3",
            label: t(
              `groupCard.${record.status == "VACATION" ? "work" : "vacation"}`
            ),
          },
        ].filter(Boolean);

        return (
          <Dropdown trigger={["click"]} menu={{ items, onClick }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setEmployer(record.e);
              }}
            >
              <LuMoreVertical />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  if (error) {
    message.error(t("employees.error"));
    return <p>{t("employees.error")}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        <Breadcrumb
          items={[
            {
              title: (
                <Link to="/dashboard">{t("employees.breadcrumb.home")}</Link>
              ),
            },
            {
              title: t("employees.breadcrumb.employees"),
            },
          ]}
        />
        <AddButton text={t("employees.inviteButton")} link="add" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex flex-col">
          <label>{t("employees.table.employee")}</label>
          <Input
            value={filters.name || ""}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            size="large"
            placeholder={t("employees.table.employee")}
            className="w-full md:w-60"
          />
        </div>

        <div className="flex flex-col">
          <label>{t("employees.table.position")}</label>
          <Select
            value={filters.position || ""}
            onChange={(value) => handleFilterChange("position", value)}
            placeholder={t("employees.table.position")}
            size="large"
            className="w-full md:w-60"
          >
            {positions?.data?.map((pos: { _id: string; name: string }) => (
              <Select.Option key={pos._id} value={pos._id}>
                {pos.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col">
          <label>{t("employees.table.status")}</label>
          <Select
            value={filters.status || ""}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder={t("employees.table.status")}
            size="large"
            options={[
              { value: "accepted", label: "Accepted" },
              { value: "vacation", label: "Vacation" },
              { value: "deleted", label: "Deleted" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            className="w-full md:w-60"
          />
        </div>

        <div className="flex flex-col">
          <label>{t("employees.table.salary")}</label>
          <InputNumber
            value={filters.salary || ""}
            onChange={(value) => handleFilterChange("salary", value)}
            controls={false}
            size="large"
            placeholder={t("employees.table.salary")}
            className="w-full md:w-60"
          />
        </div>
      </div>
      <div className="w-full flex flex-col justify-between items-start"></div>
      <InviteForm
        editEmployee={employe}
        onAddPosition={handleAddPosition}
        setOpen={setOpen}
        open={open}
        isEditMode={true}
        loading={updateEmployer.isPending}
      />
      <div className="mt-5 overflow-hidden rounded-xl">
        <Table
          pagination={false}
          className="overflow-x-scroll md:overflow-auto"
          loading={isLoading}
          locale={{
            emptyText: t("dashboard.noData"), // Localized message for empty data
          }}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
      <Modal
        title={t("employees.confirmDelete")}
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText={t("groupCard.delete")}
        cancelText={t("reception.modal.onCancel")}
      >
        {t("employees.deleteConfirmationMessage")}
      </Modal>
      <Modal
        title={t("employees.confirmStatusChange")}
        open={isStatusModalVisible}
        onOk={confirmStatusChange}
        onCancel={() => setStatusModalVisible(false)}
        okText={t("reception.modal.onOk")}
        cancelText={t("reception.modal.onCancel")}
      >
        {t("employees.statusChangeConfirmationMessage")}
      </Modal>
    </div>
  );
}
