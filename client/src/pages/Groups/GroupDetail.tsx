import {
  Spin,
  message,
} from "antd";
import { useParams } from "react-router-dom";
import groupService from "../../services/group.service";
import { useApiGet } from "../../services/queryConfig";
import BreadcrumbComponent from "./GroupDetail_Components/BreadcrumbComponent";
import GroupDescriptions from "./GroupDetail_Components/GroupDescriptions";
import StudentsList from "./GroupDetail_Components/StudentsList";
import TeachersList from "./GroupDetail_Components/TeachersList";
export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data, error, refetch } = useApiGet(["getGroupById", id], () =>
    groupService.getGroupById(id)
  );

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
    <div className="w-full p-4">
      <BreadcrumbComponent name={data.name} />
      {data && (
        <div className="mt-4 flex flex-col md:flex-row gap-5 items-start justify-between">
          <div className="md:w-2/3">
            <GroupDescriptions data={data} />
            <div className="bg-white p-5 mt-5 shadow-box rounded-lg">
              <h1 className="font-semibold text-[16px]">Students</h1>
              <div className="py-5">
                <StudentsList students={data.students} group={data._id} refetch={refetch} />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 md:w-1/3 shadow-box rounded-lg">
            <h1 className="font-semibold text-[16px]">Teachers</h1>
            <div className="py-5">
              <TeachersList teachers={data.teachers} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
