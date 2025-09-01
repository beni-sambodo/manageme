import { Modal, Select, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface ChangeStatusModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (status: string) => void;
  studentId: string;
  currentStatus: string;
}

export default function ChangeStatusModal({
  isVisible,
  onCancel,
  onConfirm,
  studentId,
  currentStatus,
}: ChangeStatusModalProps) {
  const { t } = useTranslation(); // Initialize translation
  const [newStatus, setNewStatus] = useState(currentStatus);

  const statusOptions = [
    { value: "new", label: t("changeStatusModal.statusOptions.new") },
    { value: "inview", label: t("changeStatusModal.statusOptions.inview") },
    { value: "canceled", label: t("changeStatusModal.statusOptions.canceled") },
    { value: "accepted", label: t("changeStatusModal.statusOptions.accepted") },
  ];

  const handleConfirm = () => {
    // Perform the action to change the student's status
    onConfirm(newStatus);
    message.success(t("changeStatusModal.statusUpdated")); // Provide success feedback
  };

  return (
    <Modal
      title={t("changeStatusModal.title")}
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t("changeStatusModal.cancel")}
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          {t("changeStatusModal.confirm")}
        </Button>,
      ]}
    >
      <p>
        {t("changeStatusModal.studentId")}: {studentId}
      </p>
      <p>
        {t("changeStatusModal.currentStatus")}: {currentStatus}
      </p>
      <Select
        style={{ width: "100%" }}
        value={newStatus}
        onChange={setNewStatus}
        options={statusOptions}
        placeholder={t("changeStatusModal.selectPlaceholder")}
      />
    </Modal>
  );
}
