import { Button, Table, TableColumnsType, Tag } from "antd";
import { IPaymentUser } from "../../Types/Types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TransactionModal from "./FullInfo";
import { CgInfo } from "react-icons/cg";

export default function PaymentTable({
  data,
  loading,
  pagination,
  handleTableChange,
}: {
  data: { datas: IPaymentUser[]; pagination: any };
  loading: boolean;
  pagination: any;
  handleTableChange: (pagination: any) => void;
}) {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [check, setData] = useState<any>({});

  const handleClick = (record: any) => {
    setModalVisible(true);
    setData(record);
  };

  const columns: TableColumnsType<IPaymentUser> = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("payment.table.name"),
      dataIndex: ["user", "name"],
      key: "name",
      render: (name, record) => name || record.user?.username,
    },
    {
      title: t("payment.table.username"),
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: t("payment.table.amount"),
      key: "amountPaid",
      render: (_, record: any) => {
        const paymentInfo =
          record.payment && record.payment.length > 0
            ? record.payment[0]
            : { mpv: 0, status: "unknown", debt: 0 };
        const amountPaid = record.sum || paymentInfo.mpv || 0;
        return (
          <p className="font-semibold text-green-500">
            {amountPaid.toLocaleString("uz")} so'm
          </p>
        );
      },
    },
    {
      title: t("payment.table.pay"),
      key: "paymentStatus",
      render: (_, record: IPaymentUser) => {
        const paymentInfo =
          record.payment && record.payment.length > 0
            ? record.payment[0]
            : { status: "unknown", debt: 0, mpv: 0 };

        const statusText =
          paymentInfo.status === "debtor" ? t("To'lanmagan") : t("To'langan");
        const color = paymentInfo.status === "debtor" ? "volcano" : "green";

        if (paymentInfo.status === "unknown") {
          const altStatus =
            paymentInfo.mpv > 0 ? t("To'langan") : t("To'lanmagan");
          const altColor = paymentInfo.mpv > 0 ? "green" : "default";
          return <Tag color={altColor}>{altStatus}</Tag>;
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: t("actions"),
      key: "action",
      render: (_: undefined, record) => (
        <Button
          shape="circle"
          onClick={() => handleClick(record)}
          className="text-2xl flex items-center justify-center"
          type="text"
        >
          <CgInfo />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        className="overflow-scroll md:overflow-hidden"
        dataSource={data?.datas}
        bordered
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.pagination?.count,
          onChange: handleTableChange,
        }}
        columns={columns}
      />

      <TransactionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        data={check}
      />
    </>
  );
}
