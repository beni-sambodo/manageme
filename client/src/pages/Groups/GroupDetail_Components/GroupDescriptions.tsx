import { Descriptions, DescriptionsProps } from "antd";
import { IGRoup, Teacher } from "../../../Types/Types";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface GroupDescriptionsProps {
  data: IGRoup; // Replace with appropriate type for your data
}

export default function GroupDescriptions({ data }: GroupDescriptionsProps) {
  const { t } = useTranslation();

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: t("groupDescriptions.course"),
      children: <p>{data?.course?.name}</p>,
    },
    {
      key: "2",
      label: t("groupDescriptions.level"),
      children: <p>{data?.level}</p>,
    },
    {
      key: "3",
      label: t("groupDescriptions.days"),
      children: <p>{data?.days?.length}</p>,
    },
    {
      key: "4",
      label: t("groupDescriptions.room"),
      children: (
        <p className="line-clamp-1">
          {data?.room && `${data?.room?.number} xona, ${data?.room?.name}`}
        </p>
      ),
    },
    {
      key: "5",
      label: t("groupDescriptions.students"),
      children: (
        <p>
          {data?.students.length}/{data?.space}
        </p>
      ),
    },
    {
      key: "6",
      label: t("groupDescriptions.teachers"),
      children: (
        <p className="line-clamp-1">
          {data?.teachers.map((t: Teacher) => t.name).join(", ")}
        </p>
      ),
    },
    {
      key: "7",
      label: t("groupDescriptions.price"),
      children: <p>{data?.course?.price.toLocaleString("uz")} so'm</p>,
    },
    {
      key: "8",
      label: t("groupDescriptions.time"),
      children: (
        <p>
          {data?.startTime} - {data?.endTime}
        </p>
      ),
    },
    {
      key: "9",
      label: t("groupDescriptions.dayPattern"),
      children: <p className="uppercase">{data?.day_pattern.join(", ")}</p>,
    },
    {
      key: "10",
      label: t("groupDescriptions.period"),
      children: (
        <p className="uppercase">
          {moment(data?.dates[0]).format("DD.MM.YYYY")} -{" "}
          {moment(data?.dates[data.dates.length - 1]).format("DD.MM.YYYY")}
        </p>
      ),
    },
  ];

  return (
    <Descriptions
      className="bg-white p-5 shadow-box rounded-lg"
      column={2}
      title={
        <div className="flex items-center">
          {data.name}
          <div
            className={`${data.status == "ACCEPTED"
              ? "bg-green-600 animate-ping"
              : "animate-pulse bg-red-600"
              } w-2 aspect-square rounded-full inline-block ml-2`}
          ></div>
        </div>
      }
      items={items}
    />
  );
}
