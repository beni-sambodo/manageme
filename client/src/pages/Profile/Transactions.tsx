
import { message, Table } from "antd";
import "tailwindcss/tailwind.css";
import { useApiGet } from "../../services/queryConfig";
import transactionService from "../../services/transaction.service";

export default function Transactions() {
  const { isLoading, data, error } = useApiGet(["getMyTr"], () =>
    transactionService.getMyTr()
  );

  if (error) {
    message.error("Failed to fetch transactions");
  }

  const columns = [
    {
      title: "School Name",
      dataIndex: ["school", "name"],
      key: "schoolName",
    },
    {
      title: "Sum",
      dataIndex: "sum",
      key: "sum",
      render: (sum:number) => sum.toLocaleString('uz'),
    },
    {
      title: "Admin",
      dataIndex: ["admin", "username"],
      key: "admin",
    },
  ];

  return (
    <div className="bg-white overflow-hidden rounded-xl">
    
      <Table
        columns={columns}
        dataSource={data?.map((item: { _id: string; }) => ({ ...item, key: item._id })) || []}
        loading={isLoading}
        pagination={false}
        className="w-full"
      />
    </div>
  );
}
