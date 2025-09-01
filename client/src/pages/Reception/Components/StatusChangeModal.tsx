// /src/components/StatusChangeModal.tsx

import { Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import { newStudent } from "../../../Types/Types";
import receptionService from "../../../services/reception.service";
import { useApiMutation } from "../../../services/queryConfig";

interface StatusChangeModalProps {
  isModalOpen: boolean;
  currentStudent: newStudent | null;

  refetch: () => void;
  status: string;
  onClose: () => void;
  onSuccess: () => void;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isModalOpen,
  currentStudent,
  refetch,
  status,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const handleStatusChange = useApiMutation(
    ({ status, id }: { status: string; id: string }) =>
      receptionService.statusChange(status, id),
    {
      onSuccess: () => {
        message.success(t("reception.successStatusUpdate"));
        onClose();
        refetch()
        onSuccess();
        // Ensure the parent component clears selections
        if (window.clearReceptionSelections) {
          window.clearReceptionSelections();
        }
      },
      onError: () => {
        message.error(t("reception.errorStatusUpdate"));
      },
    }
  );

  const confirmStatusChange = () => {
    if (currentStudent) {
      handleStatusChange.mutate({ status, id: currentStudent._id });
    }
  };

  return (
    <Modal
      title={t("reception.modal.title")}
      open={isModalOpen}
      confirmLoading={handleStatusChange.isPending}
      onOk={confirmStatusChange}
      onCancel={onClose}
    >
      <h3>
        {t("reception.changeStatus.changingTo")} {status.toUpperCase()}
      </h3>
      <h3>
        {t("reception.changeStatus.studentName")}{" "}
        {currentStudent ? `${currentStudent.user.name}` : ""}
      </h3>
    </Modal>
  );
};

export default StatusChangeModal;
