import { Modal, Form, Input, InputNumber, Button } from "antd";
import { IRoom } from "../../../Types/Types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Prop {
  isModalVisible: boolean;
  editingRoom: IRoom | null;
  onCancel: () => void;
  onFinish: (values: IRoom) => void;
  isPending: boolean;
}

export default function RoomFormModal({
  isModalVisible,
  editingRoom,
  onCancel,
  onFinish,
  isPending,
}: Prop) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingRoom) {
      form.setFieldsValue(editingRoom);
    } else {
      form.resetFields();
    }
  }, [editingRoom, form]);

  return (
    <Modal
      title={editingRoom ? t("rooms.editRoom") : t("rooms.addRoom")}
      open={isModalVisible}
      forceRender
      onCancel={onCancel}
      footer={null}
    >
      <Form
        name="add_or_edit_room"
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label={t("rooms.roomName")}
          rules={[{ required: true, message: t("rooms.roomNameRequired") }]}
        >
          <Input placeholder={t("rooms.roomNamePlaceholder")} />
        </Form.Item>
        <Form.Item
          name="number"
          label={t("rooms.roomNumber")}
          rules={[{ required: true, message: t("rooms.roomNumberRequired") }]}
        >
          <InputNumber
            className="w-full"
            controls={false}
            type="number"
            placeholder={t("rooms.roomNumberPlaceholder")}
          />
        </Form.Item>
        <Form.Item
          name="location"
          label={t("rooms.roomLocation")}
          rules={[{ required: true, message: t("rooms.roomLocationRequired") }]}
        >
          <Input placeholder={t("rooms.roomLocationPlaceholder")} />
        </Form.Item>
        <Form.Item name="description" label={t("rooms.description")} rules={[{ required: true, message: t("rooms.roomDescriptionRequired") }]}>
          <Input.TextArea placeholder={t("rooms.descriptionPlaceholder")} />
        </Form.Item>

        <Form.Item>
          <Button loading={isPending} type="primary" htmlType="submit">
            {editingRoom ? t("rooms.updateRoom") : t("rooms.addRoom")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
