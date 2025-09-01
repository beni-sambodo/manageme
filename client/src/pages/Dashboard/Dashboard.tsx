import { Breadcrumb, Statistic, StatisticProps, Table, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  FaAnchor,
  FaChalkboardTeacher,
  FaChartLine,
  FaUserGraduate,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Calendar from "../../components/Calendar";
import { useApiGet } from "../../services/queryConfig";
import statisticsService from "../../services/statistics.service";
import { FiRefreshCw } from "react-icons/fi";
import { useState } from "react";
import CountUp from "react-countup";
import SubjectDistributionChart from './SubjectDistributionChart';
import groupService from "../../services/group.service";

const { Title } = Typography;
const StatCard = ({ title, value, valueDisplay, icon, formatter, link, customFormatter }: any) => (
  <Link to={link} className="bg-white shadow-2xl shadow-p/20 p-5 rounded-xl">
    <div className="flex justify-between content-center m-auto w-[100%]">
      {customFormatter ? (
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{valueDisplay}</div>
        </div>
      ) : (
        <Statistic title={title} value={value} formatter={formatter} />
      )}
      <span className="bg-[#696CFF] shadow-xl shadow-indigo-500/50 rounded-xl flex items-center text-white aspect-square justify-center w-16">
        {icon}
      </span>
    </div>
  </Link>
);

const CourseDebtorsTable = () => {
  const { t } = useTranslation("ns1");
  const { data, isLoading } = useApiGet(["getCourseDebtors"], () =>
    statisticsService.getCourseDebtors()
  );

  const columns = [
    {
      title: t("CourseName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("dashboard.nonPayingStudents"),
      dataIndex: "debtorCount",
      key: "debtorCount",
      render: (text: any) => <span className="font-semibold">{text}</span>,
    },
    {
      title: t("dashboard.totalDebt"),
      dataIndex: "totalDebt",
      key: "totalDebt",
      render: (text: any) => <span className="font-semibold">{text.toLocaleString("uz")} so'm</span>,
    },
  ];

  return (
    <div>
      <Title level={4} className="mb-4">{t("dashboard.debtorsAndTotalDebt")}</Title>
      <Table
        dataSource={data || []}
        columns={columns}
        rowKey="name"
        loading={isLoading}
        pagination={false}
        size="small"
      />
    </div>
  );
};

export default function Dashboard() {
  const { t } = useTranslation("ns1");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLoading, data, refetch, isPending } = useApiGet(["getStats"], () =>
    statisticsService.getStats(reload)
  );
  const { data: lessonsData, isLoading: lessonsLoading } = useApiGet(
    ["lessons"],
    () => groupService.getLessonsForCalendar()
  );
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," />
  );

  const cardData = [
    {
      title: t("dashboard.profitAnalysis"),
      value: data?.money,
      icon: <FaChartLine size={20} />,
      link: "/dashboard/finance",
    },
    {
      title: t("dashboard.students"),
      value: data?.students,
      icon: <FaUserGraduate size={20} />,
      link: "/dashboard/reception",
    },
    {
      title: t("dashboard.groups"),
      value: data?.groups,
      icon: <FaAnchor size={20} />,
      link: "/dashboard/groups",
    },
    {
      title: t("dashboard.staff"),
      value: data?.employers,
      icon: <FaChalkboardTeacher size={20} />,
      link: "/dashboard/employees",
    },
  ];
  const handleRefetch = async () => {
    try {
      setLoading(true);
      await setReload(true);
      await refetch();
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={[
            {
              title: <Link to="/">ManageMe</Link>,
            },
            {
              title: t("dashboard.title"),
            },
          ]}
        />
        <button className="flex items-center gap-3" onClick={handleRefetch}>
          <span
            className={
              isLoading || isPending || loading ? "animate-spin  " : "b"
            }
          >
            <FiRefreshCw />
          </span>
          {isLoading || (isPending && "loading")}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
        {cardData.slice(0, 4).map((card, index) => (
          <StatCard key={index} {...card} formatter={formatter} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {cardData.slice(4, 6).map((card, index) => (
          <StatCard key={index + 4} {...card} formatter={formatter} />
        ))}
      </div>

      <div className="grid 2xl:grid-cols-5 py-5">
        <div className="bg-white 2xl:col-span-3 shadow-2xl shadow-p/20 rounded-xl p-5 2xl:mr-2">
          <Calendar lessonsData={lessonsData} loading={lessonsLoading} />
        </div>
        <div className="bg-white 2xl:col-span-2 shadow-2xl shadow-p/20 mt-5 2xl:mt-0 p-5 rounded-xl 2xl:ml-2">
          <SubjectDistributionChart />
        </div>
      </div>

      <div className="bg-white shadow-2xl shadow-p/20 p-5 rounded-xl mt-5">
        <CourseDebtorsTable />
      </div>
    </div>
  );
}
