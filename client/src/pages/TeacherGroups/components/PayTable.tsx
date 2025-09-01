import { Table, Tag, Dropdown, Button, Select } from "antd";
import { useApiGet } from "../../../services/queryConfig";
import transactionService from "../../../services/transaction.service";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { SetStateAction, useState } from "react";
import PayModal from "../../Payment/PayModal";
import DiscountModal from "../../Payment/DiscountModal";
import { IPaymentUser } from "../../../Types/Types";
import { useTranslation } from "react-i18next";

interface PayTableProps {
  group: string;
}

export default function PayTable({ group }: PayTableProps) {

  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalDVisible, setIsModalDVisible] = useState<boolean>(false);
  const [month, setMonth] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<IPaymentUser | null>(
    null
  );

  const { data, error, isLoading, refetch } = useApiGet(
    ["getStudentPayment", group, month],
    () => transactionService.getStudentPayment(group, month),
    {
      keepPreviousData: true,
    }
  );

  if (error) {
    return <div>{t("errorLoadingData")}</div>;
  }

  const students = data?.datas || [];
  const effectiveMonthId = data?.effectiveMonth;

  const items = [
    {
      key: 1,
      label: (
        <button onClick={() => setIsModalVisible(true)}>
          {t("makePayment")}
        </button>
      ),
    },
    {
      key: 2,
      label: (
        <button onClick={() => setIsModalDVisible(true)}>
          {t("makeDiscount")}
        </button>
      ),
    },
  ];

  const handleMonthChange = (value: string) => {
    setMonth(value);
    refetch();
  };

  const getMonthlyDue = (course?: { price: number | string; duration: number }): number => {
    if (!course || course.price === undefined || course.price === null || course.duration === undefined || course.duration === null || course.duration === 0) {
      return 0;
    }
    let price = 0;
    if (typeof course.price === 'number') {
      price = course.price;
    } else if (typeof course.price === 'string') {
      const parsedPrice = parseFloat(course.price);
      if (!isNaN(parsedPrice)) {
        price = parsedPrice;
      }
    }
    return price > 0 ? price / course.duration : 0;
  };

  const columns: any = [
    {
      title: t("name"),
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: t("username"),
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: t("debt"),
      key: "debt",
      render: (_: string, record: IPaymentUser) => {
        const paymentForMonth = record.payment.find(p => p.month && (p.month._id === effectiveMonthId || p.month.toString() === effectiveMonthId));
        let debtForDisplay = 0;
        let tagColor = "green";
        if (paymentForMonth) {
          debtForDisplay = paymentForMonth.debt || 0;
          tagColor = debtForDisplay > 0 ? "red" : "green";
        } else if (effectiveMonthId) {
          const anyPaymentWithDebt = record.payment.find(p => p.debt !== undefined);
          if (anyPaymentWithDebt) {
            debtForDisplay = anyPaymentWithDebt.debt || 0;
          }
          tagColor = debtForDisplay > 0 ? "red" : "green";
        }
        return <Tag color={tagColor}>{debtForDisplay}</Tag>;
      },
    },
    {
      title: t("paymentStatus"),
      key: "status",
      render: (_: string, record: IPaymentUser) => {
        const paymentForMonth = record.payment.find(p => p.month && (p.month._id === effectiveMonthId || p.month.toString() === effectiveMonthId));
        let statusText = t("paid");
        let statusColor = "green";

        if (paymentForMonth) {
          statusText = paymentForMonth.status;
          statusColor = paymentForMonth.status === "paid" ? "green" : "red";
        } else if (effectiveMonthId) {
          const monthlyDue = getMonthlyDue(record.course);
          if (monthlyDue > 0) {
            statusText = t("unpaid");
            statusColor = "red";
          } else {
            statusText = t("paid");
            statusColor = "green";
          }
        }
        return <Tag color={statusColor}>{statusText}</Tag>;
      },
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_: string, record: SetStateAction<IPaymentUser | null>) => (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Button
            type="text"
            onClick={() => setSelectedStudent(record)}
            className="flex text-xl justify-center items-center text-main"
          >
            <CgMoreVerticalAlt />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Select
        value={month}
        onChange={handleMonthChange}
        placeholder={t("selectMonth")}
        allowClear
        style={{ marginBottom: 16, width: 200 }}
      >
        {data?.months.map((month: { _id: string; date: string }) => (
          <Select.Option key={month._id} value={month._id}>
            {new Date(month.date).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Select.Option>
        ))}
      </Select>
      <Table
        dataSource={students}
        loading={isLoading}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
      <PayModal
        isModalVisible={isModalVisible}
        refetch={refetch}
        setIsModalVisible={setIsModalVisible}
        studentID={selectedStudent?.user._id}
        payment={selectedStudent?.payment}
        studentName={selectedStudent?.user.name}
      />
      <DiscountModal
        isModalDVisible={isModalDVisible}
        groupID={group}
        setIsModalDVisible={setIsModalDVisible}
        studentID={selectedStudent?._id}
        studentName={selectedStudent?.user.name}
      />
    </div>
  );
}
