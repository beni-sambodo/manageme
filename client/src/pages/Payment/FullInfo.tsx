import React from "react";
import { Modal, Avatar } from "antd";
import { useTranslation } from "react-i18next";

interface TransactionData {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  school: string;
  sum: number;
  type: {
    _id: string;
    name: string;
    school: string;
  };
  for: string;
  group: {
    _id: string;
    name: string;
    status: string;
  };
  auto: boolean;
  admin: {
    _id: string;
    username: string;
    avatar: {
      _id: string;
      location: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  data: TransactionData;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  const { t } = useTranslation(); // Use the i18next translation hook

  return (
    <Modal
      title={t("transactionDetails")}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="custom-modal"
    >
      <div className="p-4">
        {/* User Details */}
        <div className="flex items-center mb-4">
          <Avatar src={data?.admin?.avatar?.location} size="large" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{data?.admin?.username}</h2>
            <p className="text-sm text-gray-600">{data?.user?.username}</p>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="mb-4">
          <h3 className="text-base font-semibold">{t("transactionInfo")}</h3>
          <p className="text-sm text-gray-600">
            {t("id")}: {data._id}
          </p>
          <p className="text-sm text-gray-600">
            {t("amount")}: {data?.sum}
          </p>
          <p className="text-sm text-gray-600">
            {t("type")}: {data?.type?.name}
          </p>
        </div>

        {/* Group Details */}
        <div className="mb-4">
          <h3 className="text-base font-semibold">{t("groupDetails")}</h3>
          <p className="text-sm text-gray-600">
            {t("groupName")}: {data?.group?.name}
          </p>
          <p className="text-sm text-gray-600">
            {t("status")}: {data?.group?.status}
          </p>
        </div>

        {/* Miscellaneous */}
        <div>
          <h3 className="text-base font-semibold">{t("additionalInfo")}</h3>
          <p className="text-sm text-gray-600">
            {t("auto")}: {data?.auto ? t("yes") : t("no")}
          </p>
          <p className="text-sm text-gray-600">
            {t("createdAt")}: {new Date(data.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {t("updatedAt")}: {new Date(data.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;
