import { Modal } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CgUserAdd } from "react-icons/cg";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useStore } from "../base/store";

export default function AddStudentModal() {
  const { t } = useTranslation();
  const { isStudentModalOpen, setStudentModalOpen } = useStore();

  const handleAddStudentModalClose = () => {
    setStudentModalOpen(false);
  };

  return (
    <Modal
      title={t("reception.addModal.title")}
      open={isStudentModalOpen}
      onCancel={handleAddStudentModalClose}
      footer={null}
    >
      <div className="py-5 flex justify-between gap-5">
        <Link
          to="/dashboard/reception/invite"
          onClick={handleAddStudentModalClose} // Close modal on click
          className="flex py-10 flex-col text-lg duration-300 rounded-lg w-1/2 items-center justify-center hover:bg-gray-100 transition-all"
        >
          <CgUserAdd size={40} className="mb-2" />
          {t("reception.addModal.invite")}
        </Link>

        <Link
          to="/dashboard/reception/create"
          onClick={handleAddStudentModalClose} // Close modal on click
          className="flex py-10 flex-col text-lg rounded-lg w-1/2 items-center justify-center hover:bg-gray-100 transition-all duration-300"
        >
          <AiOutlineUsergroupAdd size={40} className="mb-2" />
          {t("reception.addModal.create")}
        </Link>
      </div>
    </Modal>
  );
}