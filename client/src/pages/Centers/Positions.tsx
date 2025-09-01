/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Table,
  TreeSelect,
} from "antd";
import positionsService from "../../services/positions.service";
import { IPositions } from "../../Types/Types";
import { useApiMutation } from "../../services/queryConfig";
import { MdDelete, MdEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Permissions from "./treedata";

export default function Positions({
  positions,
  refetch,
}: {
  positions: IPositions[];
  refetch: () => void;
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation(); // Initialize i18n translations

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState<IPositions | null>(
    null
  );

  const addOrEditPosition = useApiMutation(
    (value: IPositions) => {
      if (editingPosition) {
        return positionsService.updatePosition(editingPosition._id, value);
      } else {
        return positionsService.addPosition(value);
      }
    },
    {
      onSuccess: () => {
        setIsModalVisible(false);
        refetch();
        message.success(
          t(`positions.${editingPosition ? "updateSuccess" : "addSuccess"}`)
        );
        setEditingPosition(null);
      },
      onError: () =>
        message.error(
          t(`positions.${editingPosition ? "updateFailed" : "addFailed"}`)
        ),
      invalidateKeys: ["positions"],
    }
  );

  const deletePosition = useApiMutation(
    (id: string) => positionsService.deletePosition(id),
    {
      onSuccess: () => {
        refetch();
        message.success(t("positions.deleteSuccess"));
      },
      onError: () => message.error(t("positions.deleteFailed")),
      invalidateKeys: ["positions"],
    }
  );

  const showAddPositionModal = () => {
    setIsModalVisible(true);
    setEditingPosition(null);
  };

  const treeData = Object.keys(Permissions).map((key) => {
    return {
      title: t(`permissions.${key}.title`),
      value: key,
      selectable: false,
      children: Object.keys(Permissions[key]).map((action) => ({
        title: t(`permissions.${key}.${action}`),
        value: Permissions[key][action],
      })),
    };
  });

  const showEditPositionModal = (position: IPositions) => {
    setIsModalVisible(true);
    setEditingPosition(position);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPosition(null);
  };

  const handleAddOrEditPosition = (values: IPositions) => {
    addOrEditPosition.mutate(values);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t("positions.deleteConfirm"),
      onOk: () => deletePosition.mutate(id),
    });
  };

  const columns = [
    {
      title: t("positions.positionName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("payment.table.type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("positions.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_: undefined, position: IPositions) => (
        <Space>
          <Button
            type="link"
            className="text-xl"
            onClick={() => showEditPositionModal(position)}
          >
            <MdEdit />
          </Button>
          <Button
            type="link"
            danger
            className="text-xl"
            onClick={() => handleDelete(position._id)}
          >
            <MdDelete />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (isModalVisible) {
      if (editingPosition) {
        form.setFieldsValue(editingPosition);
      } else {
        form.resetFields();
      }
    }
  }, [editingPosition, form, isModalVisible]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] text-p font-medium">
          {t("positions.totalPositions", { count: positions.length })}
        </h2>
        <Button type="primary" onClick={showAddPositionModal}>
          {t("positions.addNewPosition")}
        </Button>
      </div>
      <Table
        pagination={false}
        bordered
        className="mt-4 overflow-hidden"
        dataSource={positions}
        columns={columns}
        rowKey="_id"
      />

      <Modal
        title={editingPosition ? t("positions.editPosition") : t("positions.addPosition")}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="add_or_edit_position"
          layout="vertical"
          onFinish={handleAddOrEditPosition}
        >
          <Form.Item
            name="name"
            label={t("positions.positionName")}
            rules={[
              { required: true, message: t("positions.positionNameRequired") },
            ]}
          >
            <Input placeholder={t("positions.positionNamePlaceholder")} />
          </Form.Item>

          <Form.Item
            name="type"
            label={t("positions.role")}
            rules={[{ required: true, message: t("positions.roleRequired") }]}
          >
            <Select placeholder={t("positions.rolePlaceholder")}>
              <Select.Option value="TEACHER">{t("positions.roleTeacher")}</Select.Option>
              <Select.Option value="ADMINISTRATOR">{t("positions.roleAdministrator")}</Select.Option>
              <Select.Option value="MANAGER">{t("positions.roleManager")}</Select.Option>
              <Select.Option value="CEO">{t("positions.roleCeo")}</Select.Option>
              <Select.Option value="ACCOUNTANT">{t("positions.roleAccountant")}</Select.Option>
              <Select.Option value="CLEANER">{t("positions.roleCleaner")}</Select.Option>
              <Select.Option value="SECURITY">{t("positions.roleSecurity")}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label={t("positions.description")}
            rules={[
              { required: true, message: t("positions.descriptionRequired") },
            ]}
          >
            <Input.TextArea placeholder={t("positions.descriptionPlaceholder")} />
          </Form.Item>

          <Form.Item
            name="permissions"
            label={t("positions.permissions")}
            rules={[{ required: true, message: t("positions.permissionsRequired") }]}
          >
            <TreeSelect
              treeCheckable={false}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              multiple
              placeholder={t("positions.permissionsPlaceholder")}
              style={{ width: "100%" }}
              treeData={treeData}
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={addOrEditPosition.isPending}
              type="primary"
              htmlType="submit"
            >
              {editingPosition ? t("positions.updatePosition") : t("positions.addPosition")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
