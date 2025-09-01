import { Breadcrumb } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import transactionService from "../../services/transaction.service";
import { useApiGet } from "../../services/queryConfig";
import PaymentTable from "./PaymentTable";
import groupService from "../../services/group.service";
import DynamicFilter from "../../components/DynamicFilter";
import { useState } from "react";
import moment from "moment";
import { IGRoup } from "../../Types/Types";

export default function Payment() {
  const { t } = useTranslation();
  const groupFetch = useApiGet(["getGroups"], () => groupService.getGroups());
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState(1);

  const [filters, setFilters] = useState({
    course: searchParams.get("course"),
    groupName: searchParams.get("groupName"),
    type: searchParams.get("type"),
    minAmount: searchParams.get("minAmount"),
    maxAmount: searchParams.get("maxAmount"),
  });
  const { data, error, isLoading } = useApiGet(
    ["getSchoolTr", filters, pagination],
    () => transactionService.getSchoolTr(filters, pagination)
  );
  const paymentTypes = useApiGet(["getTypes"], () =>
    transactionService.getTypes()
  );
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };
  const filterConfig: any = [
    {
      key: "group",
      label: t("addStudent.groupLabel"),
      type: "select",
      options:
        !groupFetch.isLoading &&
        groupFetch?.data?.map((value: IGRoup) => ({
          value: value._id,
          label: value.name,
        })),
    },
    {
      key: "type",
      label: t("course.type"),
      type: "select",
      options:
        !paymentTypes.isLoading &&
        paymentTypes?.data?.map((value: IGRoup) => ({
          value: value._id,
          label: value.name,
        })),
    },
    {
      key: "minAmount",
      label: t("minAmount"),
      type: "inputNumber",
    },
    {
      key: "maxAmount",
      label: t("maxAmount"),
      type: "inputNumber",
    },
  ];
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    const formattedParams = Object.entries({ ...filters, [key]: value })
      .filter(
        ([_, val]: any) =>
          val !== null && val !== undefined && val !== "" && val !== 0
      )
      .reduce((acc, [key, val]) => {
        if (key === "startTime" || key === "endTime") {
          acc[key] = val ? moment(val).format("HH:mm") : null;
        } else {
          acc[key] = val;
        }
        return acc;
      }, {} as Record<string, any>);
    setPagination(1);
    setSearchParams(formattedParams);
  };

  if (error) {
    return <div>{t("payment.errorOccurred")}</div>;
  }

  return (
    <div className="min-h-[80vh] w-full">
      <div className="flex items-start justify-between">
        <Breadcrumb
          items={[
            {
              title: <Link to={"/dashboard"}>{t("employees.breadcrumb.home")}</Link>,
            },
            {
              title: t("sidebar.finance"),
            },
          ]}
        />
      </div>
      <DynamicFilter
        filters={filters}
        filterConfig={filterConfig}
        handleFilterChange={handleFilterChange}
      />

      <div className="mt-4 bg-white rounded-lg overflow-hidden shadow-xl">
        <PaymentTable
          data={data}
          loading={isLoading}
          pagination={pagination}
          handleTableChange={handleTableChange}
        />
      </div>
    </div>
  );
}
