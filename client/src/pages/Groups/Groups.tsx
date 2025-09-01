import { useState } from "react";
import { Breadcrumb } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApiGet } from "../../services/queryConfig";
import groupService from "../../services/group.service";
import AddButton from "../../components/AddButton";
import GroupsList from "./Components/GroupsList";
import DynamicFilter from "../../components/DynamicFilter";
import courseService from "../../services/course.service";
import { ICourse } from "../../Types/Types";
import roomService from "../../services/room.service";
import moment from "moment";

export default function Groups() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const course = useApiGet(["getCourses"], () =>
    courseService.getCourses(null, 1, 999)
  );
  const room = useApiGet(["getRooms"], () => roomService.getRooms());
  const [filters, setFilters] = useState({
    status: searchParams.get("status"),
    course: searchParams.get("course"),
    room: searchParams.get("room"),
    pattern: searchParams.get("pattern"),
    groupName: searchParams.get("groupName"),
    priceMin: searchParams.get("priceMin"),
    priceMax: searchParams.get("priceMax"),
  });

  const filterConfig: any = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "new", label: t("groups.statusOptions.new") },
        { value: "inview", label: t("groups.statusOptions.inview") },
        { value: "waiting", label: t("groups.statusOptions.waiting") },
        { value: "freezed", label: t("groups.statusOptions.freezed") },
      ],
    },
    {
      key: "course",
      label: "Course",
      type: "select",
      options:
        !course.isLoading &&
        course?.data?.datas?.map((value: ICourse) => ({
          value: value._id,
          label: value.name,
        })),
    },
    {
      key: "room",
      label: "Room",
      type: "select",
      options:
        !room.isLoading &&
        room?.data?.map((value: ICourse) => ({
          value: value._id,
          label: value.name,
        })),
    },
    {
      key: "priceMin",
      label: "Minimum Price",
      type: "inputNumber",
    },
    {
      key: "priceMax",
      label: "Maximum Price",
      type: "inputNumber",
    },
    {
      key: "groupName",
      label: "Group Name",
      type: "input",
    },
    {
      key: "pattern",
      label: "Pattern",
      type: "select",
      options: [
        { value: "odd", label: "Odd" },
        { value: "even", label: "Even" },
      ],
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

    setSearchParams(formattedParams);
  };

  const { isLoading, data, error, refetch } = useApiGet(
    ["getGroups", filters],
    () => groupService.getGroups(filters)
  );

  return (
    <div className="w-full min-h-[90vh]">
      <div className="flex items-start justify-between">
        <Breadcrumb
          items={[
            { title: <Link to="/dashboard">{t("groups.breadcrumb.home")}</Link> },
            { title: t("groups.breadcrumb.groups") },
          ]}
        />
        <AddButton text={t("groups.addButton")} link="/dashboard/groups/add" />
      </div>
      <DynamicFilter
        filters={filters}
        filterConfig={filterConfig}
        handleFilterChange={handleFilterChange}
      />
      <GroupsList
        isLoading={isLoading}
        error={error}
        data={data}
        refetch={refetch}
      />
    </div>
  );
}
