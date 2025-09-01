import { Spin, message } from "antd";
import { useParams } from "react-router-dom";
import groupService from "../../services/group.service";
import { useApiGet } from "../../services/queryConfig";
import BreadcrumbComponent from "../Groups/GroupDetail_Components/BreadcrumbComponent";
import GroupDescriptions from "../Groups/GroupDetail_Components/GroupDescriptions";
import StudentsList from "../Groups/GroupDetail_Components/StudentsList";
import Attendance from "./Attandance";
import { Calendar } from "react-multi-date-picker";
import useFetchUser from "../../hooks/useFetchUser";
import TeachersList from "../Groups/GroupDetail_Components/TeachersList";
import PayTable from "./components/PayTable";
import { useTranslation } from "react-i18next";
export default function TeacherGroupCard() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user, userLoading } = useFetchUser();
  const { isLoading, data, error, refetch } = useApiGet(
    ["getGroupById", id],
    () => groupService.getGroupById(id)
  );
  const dates = data?.days?.map((i: { date: string }) => i.date);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[80vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    message.error("Error fetching group details");
    return <p>Error</p>;
  }
  return (
    <div className="w-full">
      <BreadcrumbComponent name={data?.name} />
      {data && (
        <div className="mt-4 flex flex-col lg:flex-row gap-5 items-start justify-between">
          <div className="lg:w-2/3">
            <GroupDescriptions data={data} />
            {!userLoading &&
              user?.selected_role.role.toLocaleLowerCase() !== "student" && (
                <div className="bg-white p-5 mt-5 shadow-box rounded-lg">
                  <h1 className="font-semibold text-[16px]">
                    {t("groupPage.attendance")}
                  </h1>
                  <div className="py-5">
                    <Attendance
                      data={data}
                      refetch={refetch}
                      isLoading={data.isLoading}
                    />
                  </div>
                </div>
              )}
            {!userLoading &&
              (user?.selected_role.role.toLocaleLowerCase() === "admin" ||
                user?.selected_role.role.toLocaleLowerCase() === "ceo") && (
                <div className="bg-white p-5 mt-5 shadow-box rounded-lg">
                  <h1 className="font-semibold text-[16px]">
                    {t("groupPage.paymentTable")}
                  </h1>
                  <div className="py-5">
                    <PayTable group={data._id} />
                  </div>
                </div>
              )}
          </div>
          <div className="flex flex-col w-full lg:w-1/3 ">
            <div className="bg-white p-5 w-full shadow-box rounded-lg">
              <h1 className="font-semibold text-[16px]">
                {t("groupPage.students")}
              </h1>
              <div className="py-5">
                <StudentsList
                  students={data.students}
                  group={data._id}
                  refetch={refetch}
                />
              </div>
            </div>
            <div className="bg-white p-5 mt-5 w-full shadow-box rounded-lg">
              <h1 className="font-semibold text-[16px]">
                {t("groupPage.calendar")}
              </h1>
              <div className="py-5">
                <Calendar
                  className="w-full"
                  numberOfMonths={1}
                  shadow={false}
                  multiple
                  value={dates}
                  readOnly
                  weekStartDayIndex={1}
                />
              </div>
            </div>
            <div className="bg-white p-5 mt-5 shadow-box rounded-lg">
              <h1 className="font-semibold text-[16px]">
                {t("groupPage.teachers")}
              </h1>
              <div className="py-5">
                <TeachersList teachers={data.teachers} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
