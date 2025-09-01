import { Modal, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import { IGRoup, newStudent } from "../../../Types/Types";
import receptionService from "../../../services/reception.service";
import { useApiGet, useApiMutation } from "../../../services/queryConfig";
import groupService from "../../../services/group.service";
import { useState, useEffect } from "react";

interface AcceptModalProps {
  acceptModal: boolean;
  acceptStudent?: newStudent;
  refetch: () => void;
  onClose: () => void;
}

const AcceptModal: React.FC<AcceptModalProps> = ({
  acceptModal,
  acceptStudent,
  refetch,
  onClose,
}) => {
  const { t } = useTranslation();

  // Initialize state for selected group
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    acceptStudent?.group?._id
  );

  // Fetch groups using custom hook
  const { isLoading, data: groups } = useApiGet(["getGroups"], () =>
    groupService.getGroups()
  );

  // Handle adding student to a group
  const { mutate: addToGroup, isPending } = useApiMutation(
    (id: string) => receptionService.addToGroup([id], selectedGroup),
    {
      onSuccess: () => {
        message.success(t("reception.successStatusUpdate"));
        onClose();
        refetch();
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

  // Prepare options for the Select component
  const groupOptions = groups?.map((group: IGRoup) => ({
    key: group._id,
    label: group.name,
    value: group._id,
  }));

  // Confirm adding student to group
  const confirmAddToGroup = () => {
    if (acceptStudent && selectedGroup) {
      addToGroup(acceptStudent._id);
    }
  };

  // Handle change of group selection
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
  };

  // Update selected group when acceptStudent changes
  useEffect(() => {
    if (acceptStudent?.group?._id) {
      setSelectedGroup(acceptStudent.group._id);
    }
  }, [acceptStudent]);

  return (
    <Modal
      title={t("reception.modal.title")}
      open={acceptModal}
      confirmLoading={isPending}
      onOk={confirmAddToGroup}
      onCancel={onClose}
    >
      <div className="flex gap-4">
        <h3>{t("reception.changeStatus.Group")}</h3>
        <Select
          className="w-[120px]"
          loading={isLoading}
          value={selectedGroup}
          options={groupOptions}
          onChange={handleGroupChange}
        />
      </div>
      <div className="flex gap-4">
        <h3>{t("reception.changeStatus.studentName")}</h3>
        {acceptStudent && acceptStudent.user.name}
      </div>
    </Modal>
  );
};

export default AcceptModal;
