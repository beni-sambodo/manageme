import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaUserFriends,
  FaFileAlt,
  FaClipboardList,
  FaChalkboardTeacher,
  FaUserPlus,
  FaSchool,
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";
import useFetchUser from "../hooks/useFetchUser";
import groupService from "../services/group.service";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IGRoup } from "../Types/Types";

const Sidebar = () => {
  const { t } = useTranslation();
  let sidebarItems = [
    {
      to: "",
      icon: FaChartBar,
      text: t("sidebar.dashboard"),
      permission: "*-dashboard",
    },
    {
      to: "reception",
      icon: FaUserPlus,
      text: t("sidebar.reception"),
      permission: "*-reception",
    },
    {
      to: "employees",
      icon: FaChalkboardTeacher,
      text: t("sidebar.employees"),
      permission: "*-employer",
    },
    {
      to: "groups",
      icon: FaUsers,
      text: t("sidebar.groups"),
      permission: "*-group",
    },
    {
      to: "courses",
      icon: FaFileAlt,
      text: t("sidebar.courses"),
      permission: "*-course",
    },
    {
      to: "notifications",
      icon: FaClipboardList,
      text: t("sidebar.notifications"),
      permission: "*-notifications",
    },
    {
      to: "finance",
      icon: FaMoneyBills,
      text: t("sidebar.finance"),
      permission: "*-statistics",
    },
    {
      to: "mycenter",
      icon: FaSchool,
      text: t("header.centerSettings"),
      permission: "*-school",
    },
  ];

  const [groups, setGroups] = useState<IGRoup[]>([]);
  const { user } = useFetchUser();
  const userPermissions = user?.selected_role?.permissions || [];
  const userRole = user?.selected_role?.role?.toLowerCase();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        let res;
        if (userRole === "teacher") {
          res = await groupService.getTeacherGroups();
        } else if (userRole === "student") {
          res = await groupService.getStudentsGroups();
        }
        setGroups(res);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, [userRole]);

  // Reorder sidebar items for CEO
  if (userRole === "ceo") {
    sidebarItems = [
      sidebarItems[0], // Dashboard
      sidebarItems[2], // Employees (move this before reception)
      sidebarItems[1], // Reception
      ...sidebarItems.slice(3), // Remaining items
    ];
  }

  const filteredSidebarItems =
    userRole === "ceo"
      ? sidebarItems
      : sidebarItems.filter((item) =>
        userPermissions.includes(item.permission)
      );

  const activeClass =
    "bg-main py-[18px] line-clamp-1 flex items-center justify-center xl:group-hover:justify-normal xl:group-hover:px-3 duration-300 text-white gap-x-4 rounded-md";
  const inactiveClass =
    "hover:bg-main/20 py-[18px] line-clamp-1 text-p xl:group-hover:px-3 flex justify-center xl:group-hover:justify-normal duration-300 items-center gap-x-4 rounded-md";

  return (
    <div className="sidebar group">
      {filteredSidebarItems.length > 0 && (
        <div className="px-2 py-3 text-lg rounded-xl shadow-xl flex flex-col gap-y-1 bg-white">
          {filteredSidebarItems.map(({ to, icon: Icon, text }, index) => (
            <NavLink
              key={index}
              to={to}
              className={({ isActive }) =>
                isActive ? activeClass : inactiveClass
              }
            >
              <span className="text-xl">
                <Icon />
              </span>
              <span className="xl:group-hover:block line-clamp-1 hidden">
                {text}
              </span>
            </NavLink>
          ))}
        </div>
      )}

      {userRole && (userRole === "teacher" || userRole === "student") && (
        <div className="px-2 mt-3 py-3 text-lg rounded-xl shadow-xl flex flex-col gap-y-1 bg-white">
          <NavLink
            key={0}
            to={``}
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            <span className="text-xl">
              <MdGroups />
            </span>
            <span className="xl:group-hover:block line-clamp-1 hidden">
              My Groups
            </span>
          </NavLink>

          {groups?.length > 0 &&
            groups?.map((group, index) => (
              <NavLink
                key={index}
                to={`groups/${group._id}`}
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <span className="text-xl">
                  <FaUserFriends />
                </span>
                <span className="xl:group-hover:block line-clamp-1 hidden">
                  {group.name}
                </span>
              </NavLink>
            ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
