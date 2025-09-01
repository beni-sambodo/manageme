// src/components/AttendanceModal.tsx

import { Modal, Select, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

type AttendanceModalProps = {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  reason: string;
  setReason: (value: string) => void;
  customReason: string;
  setCustomReason: (value: string) => void;
  loading: boolean;
};

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isModalVisible,
  handleOk,
  handleCancel,
  reason,
  setReason,
  customReason,
  setCustomReason,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("absenceReason")}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Select
        placeholder={t("selectReason")}
        onChange={(value: string) => setReason(value)}
        value={reason}
        style={{ width: "100%" }}
      >
        <Option value="Болезнь">{t("illness")}</Option>
        <Option value="NO_REASON">{t("noReason")}</Option>
        <Option value="Семейные обстоятельства">{t("familyCircumstances")}</Option>
        <Option value="Другое">{t("educationalInstitution")}</Option>
      </Select>
      {reason === "Другое" && (
        <Input
          placeholder={t("otherReason")}
          onChange={(e) => setCustomReason(e.target.value)}
          value={customReason}
          style={{ marginTop: "10px" }}
        />
      )}
    </Modal>
  );
};

export default AttendanceModal;
