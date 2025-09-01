// src/pages/Schools.tsx
import React, { useState } from "react";
import { Table } from "antd";
import { useApiGet } from "../../../services/queryConfig";
import adminService from "../../../services/admin.service";
import { CgMoreVerticalAlt } from "react-icons/cg";

const AdminSchools: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12 });

  const { data, isLoading } = useApiGet(["getAdminSchools", pagination], () =>
    adminService.getAdminSchools({
      page: pagination.current.toString(),
      limit: pagination.pageSize.toString(),
    })
  );

  const columns = [
    {
      title: "School Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data: string) => <p className="line-clamp-2">{data}</p>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Subscription Type",
      dataIndex: "subscription_type",
      key: "subscription_type",
    },
    {
      title: "Action",
      // dataIndex: "subscription_type",
      key: "action",
      render: () => (<button><CgMoreVerticalAlt/></button>)
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data?.schoolsList}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.pagination?.count,
          onChange: handleTableChange,
        }}
        loading={isLoading}
        rowKey="_id"
      />
    </div>
  );
};

export default AdminSchools;
