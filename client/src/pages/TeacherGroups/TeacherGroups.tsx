import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useFetchUser from "../../hooks/useFetchUser";
import groupService from "../../services/group.service";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "antd";
import GroupFilter from "../Groups/Components/GroupFilter";
import GroupsList from "../Groups/Components/GroupsList";

export default function TeacherGroups() {
  const { t } = useTranslation();
  const { user, userLoading } = useFetchUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState<string | null>(searchParams.get("status"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (user) {
          const { role } = user.selected_role;
          if (role.toLowerCase() === "teacher") {
            const res = await groupService.getTeacherGroups();
            setGroups(res);
          } else if (role.toLowerCase() === "student") {
            const res = await groupService.getStudentsGroups();
            setGroups(res);
          }
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !userLoading) {
      fetchGroups();
    }
  }, [user, userLoading]);

  const handleFilterChange = useCallback((status: string) => {
    setSearchParams({ status });
    setStatus(status);
  }, [setSearchParams]);

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        <Breadcrumb
          items={[
            { title: <Link to="/">{t("groups.breadcrumb.home")}</Link> },
            { title: t("groups.breadcrumb.groups") },
          ]}
        />
      </div>

      <GroupFilter status={status} onChange={handleFilterChange} />

      <GroupsList isLoading={isLoading} data={groups} />
    </div>
  );
}
