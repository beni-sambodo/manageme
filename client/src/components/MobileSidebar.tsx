import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaUserFriends,
  FaFileAlt,
  FaClipboardList,
  FaChalkboardTeacher,
  FaUserPlus,
  FaMoneyBill,
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import groupService from "../services/group.service";
import useFetchUser from "../hooks/useFetchUser";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IGRoup } from "../Types/Types";
import { useTranslation } from "react-i18next";

export default function MobileSidebar({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<IGRoup[]>([]);
  const { user } = useFetchUser();
  const userPermissions = user?.selected_role?.permissions || [];

  const sidebarItems = [
    {
      to: "/",
      icon: FaChartBar,
      text: t("sidebar.dashboard"),
      permission: "*-dashboard",
    },
    {
      to: "/reception",
      icon: FaUserPlus,
      text: t("sidebar.reception"),
      permission: "*-reception",
    },
    {
      to: "/employees",
      icon: FaChalkboardTeacher,
      text: t("sidebar.employees"),
      permission: "*-employees",
    },
    {
      to: "/groups",
      icon: FaUsers,
      text: t("sidebar.groups"),
      permission: "*-group",
    },
    {
      to: "/courses",
      icon: FaFileAlt,
      text: t("sidebar.courses"),
      permission: "*-courses",
    },
    {
      to: "/notifications",
      icon: FaClipboardList,
      text: t("sidebar.notifications"),
      permission: "*-notifications",
    },
    {
      to: "/finance",
      icon: FaMoneyBill,
      text: t("sidebar.finance"),
      permission: "*-finance",
    },
  ];

  const getNavLinkClass = (isActive: boolean) =>
    isActive ? "flex items-center text-main gap-x-5" : "flex items-center text-p gap-x-5";

  useEffect(() => {
    const fetchGroups = async () => {
      if (user?.selected_role?.role?.toLowerCase() === "teacher") {
        const res: IGRoup[] = await groupService.getTeacherGroups();
        setGroups(res);
      } else if (user?.selected_role?.role?.toLowerCase() === "student") {
        const res: IGRoup[] = await groupService.getStudentsGroups();
        setGroups(res);
      }
    };
    fetchGroups();
  }, [user]);

  const filteredSidebarItems =
    user?.selected_role?.role?.toLowerCase() === "ceo"
      ? sidebarItems
      : sidebarItems.filter((item) =>
          userPermissions.includes(item.permission)
        );

  return (
    <div className="px-5 py-3 group rounded-xl overflow-hidden flex flex-col text-2xl gap-y-3 bg-white">
      {user?.selected_role?.role.toLowerCase() === "teacher" && (
        <>
          <NavLink
            to={`/`}
            onClick={() => setOpen(false)}
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <span className="flex-nowrap gap-4 flex line-clamp-1">
              <MdGroups />
              My Groups
            </span>
          </NavLink>
          {groups.map((group) => (
            <NavLink
              key={group._id}
              onClick={() => setOpen(false)}
              to={`/groups/${group._id}`}
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              <span className="flex-nowrap gap-4 flex line-clamp-1">
                <FaUserFriends />
                {group.name}
              </span>
            </NavLink>
          ))}
        </>
      )}

      {user?.selected_role?.role.toLowerCase() === "student" && (
        <>
          <NavLink
            to={`/`}
            onClick={() => setOpen(false)}
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            <span className="flex-nowrap gap-4 flex line-clamp-1">
              <MdGroups />
              My Groups
            </span>
          </NavLink>
          {groups.map((group) => (
            <NavLink
              key={group._id}
              onClick={() => setOpen(false)}
              to={`/groups/${group._id}`}
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              <span className="flex-nowrap gap-4 flex line-clamp-1">
                <FaUserFriends />
                {group.name}
              </span>
            </NavLink>
          ))}
        </>
      )}

      {filteredSidebarItems?.length > 0 && (
        <div className="flex flex-col gap-y-3">
          {filteredSidebarItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              <span className="text-xl">
                <item.icon />
              </span>
              <span>{item.text}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
