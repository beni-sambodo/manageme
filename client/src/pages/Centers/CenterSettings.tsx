import { Spin } from "antd";
import { useApiGet } from "../../services/queryConfig";
import schoolService from "../../services/school.service";
import Part2 from "./Part2";
import BreadcrumbComponent from "../Groups/GroupDetail_Components/BreadcrumbComponent";
export default function CenterSettings() {
  const { isLoading, data } = useApiGet(["currentSchool"], () =>
    schoolService.getCurrentSchool()
  );


  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[80vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div >
      <BreadcrumbComponent name={data?.name} />
      <div className="mt-4 rounded-xl py-6 px-5 bg-white">
        <Part2 schoolData={data} />
      </div>
    </div>
  );
}
