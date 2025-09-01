import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Badge,
  Dropdown,
  Select,
  Spin,
  Tag,
  message,
} from "antd";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FaRegBell } from "react-icons/fa";
import { BiMenu, BiPlus } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import MobileSidebar from "./MobileSidebar";
import { FiSearch } from "react-icons/fi";
import { useStore } from "../base/store";
import useFetchUser from "../hooks/useFetchUser";
import authService from "../services/auth.service";
import SearchModule from "./SearchModule";
import Logo from "../assets/Logo.png";
import { useApiGet, useApiMutation } from "../services/queryConfig";
import { User } from "../Types/Types";
import PayModal from "./PayModal";
import notificationService from "../services/notification.service";
import AddStudentModal from "./AddStudentModal"; // Added import for the new modal

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LanguageSelector = ({ ln, handleLanguageChange }: any) => (
  <Select
    defaultValue={ln || "uz"}
    onChange={handleLanguageChange}
    className="w-[100px] hidden md:block"
    options={[
      { value: "uz", label: "Uzbek" },
      { value: "en", label: "English" },
      { value: "ru", label: "Russian" },
    ]}
  />
);

const HeaderContent = ({
  user,
  setSearch,
}: {
  user: User | null;
  setSearch: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="flex justify-start gap-10 items-center">
    <Link to="/dashboard" className="hidden md:flex items-center gap-5">
      <img src={Logo} loading="lazy" className="w-[45px]" alt="manageme.uz" />
      <span className="text-xl font-semibold">ManageMe</span>
    </Link>
    {user?.selected_role?.role?.toLocaleLowerCase() == "admin" ||
      (user?.selected_role?.role?.toLocaleLowerCase() == "ceo" && (
        <button
          onClick={() => setSearch(true)}
          className="w-[250px] bg-[#0000000a] leading-[1.571428571428571] cursor-pointer justify-between items-center p-[6px_11px] rounded-md hidden md:flex relative z-0"
        >
          <FiSearch />
          <Tag>Ctrl+K</Tag>
        </button>
      ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AvatarDropdown = ({ items, user, userLoading }: any) => {
  return (
    <Dropdown arrow menu={{ items }} trigger={["click"]}>
      <Avatar
        src={!userLoading && user?.avatar?.location && user?.avatar?.location}
        className="cursor-pointer select-none"
        size="large"
      >
        {!userLoading && user?.username.charAt(0)}
      </Avatar>
    </Dropdown>
  );
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const ln = localStorage.getItem("ln");
  const { updateUser, setStudentModalOpen } = useStore();
  const { user, userLoading, fetchData, clearUserCache } = useFetchUser();
  const [modal, setModal] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  const Notification = useApiGet(
    ["getNotifications"],
    () => notificationService.getNotifications(),
    { enabled: !!token }
  );

  const changeRole = useApiMutation(
    (value: string) => authService.updateRole(value),
    {
      success: () => {
        message.success("Role chenged successfully"),
          fetchData(),
          navigate("/dashboard");
      },
      error: () => message.error("Failed to change role"),
      invalidateKeys: ["updateRole"],
    }
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("ln", value);
  };

  const handleRoleChange = (role: string) => {
    changeRole.mutate(role);
  };

  const handleLogout = () => {
    clearUserCache();
    updateUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      setSearch(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    window.addEventListener("keydown", handleSearch);
    return () => {
      window.removeEventListener("keydown", handleSearch);
    };
  }, []);

  const menuItems = [
    {
      key: "2",
      label: <NavLink to="/dashboard/profile"> {t("header.profilesettings")}</NavLink>,
    },
    {
      key: "3",
      label: (
        <button onClick={handleLogout} className="text-red-400">
          {t("header.logout")}
        </button>
      ),
    },
  ];

  if (user?.roles && user.roles.length >= 1) {
    menuItems.splice(1, 0, {
      key: "1",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      label: t("header.role"),
      children: user.roles.map(
        (r: {
          _id: string;
          role: string;

          school: {
            name: string;
          };
        }) => ({
          key: r?._id,
          label: (
            <button
              disabled={user?.selected_role?._id === r?._id}
              className={
                user?.selected_role?._id === r?._id
                  ? "text-[#696CFF] capitalize"
                  : "capitalize"
              }
            >
              {r.role} <span className="text-[12px]">({r?.school?.name})</span>
            </button>
          ),
          onClick: () => handleRoleChange(r._id),
        })
      ),
    });
  }

  if (
    user?.selected_role?.permissions.includes("*-school") ||
    user?.selected_role?.role === "CEO"
  ) {
    menuItems.push({
      key: "4",
      label: <NavLink to="/dashboard/mycenter"> {t("header.centerSettings")}</NavLink>,
    });
  }
  (user?.selected_role?.permissions);

  // Define menu items for the plus button dropdown
  const plusMenuItems = [
    {
      key: "pay",
      label: (
        <button onClick={() => setModal(true)} className="w-full text-left px-2 py-1">
          {t("header.makePayment", "To'lov qilish")}
        </button>
      ),
    },
    {
      key: "addStudent",
      label: (
        <button onClick={() => setStudentModalOpen(true)} className="w-full text-left px-2 py-1">
          {t("header.createNewStudent", "Ro'yhatga olish")}
        </button>
      ),
    },
  ];

  return (
    <div className="z-[9999999999999999] top-1">
      <div
        onClick={() => setOpen(false)}
        className={`fixed bg-black/20 ${open ? "w-[100%]" : "bg-transparent"
          } min-h-screen z-30`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`border shadow-lg duration-300 h-screen bg-white ${open ? "w-[80%] p-4" : "w-0 overflow-hidden"
            }`}
        >
          <div className="w-full text-right p-4">
            <button onClick={() => setOpen(false)} className="text-2xl">
              <CgClose />
            </button>
          </div>
          <MobileSidebar setOpen={setOpen} />
        </div>
      </div>

      {/* Header */}
      <div className="pt-2">
        <div className="bg-white dark:bg-slate-800 mx-3 mb-5 rounded-xl px-6 py-4 flex items-center justify-between shadow-box">
          <button onClick={() => setOpen(true)} className="md:hidden text-2xl">
            <BiMenu />
          </button>

          {/* Header Content */}
          <HeaderContent user={user} setSearch={setSearch} />

          <div className="flex items-center gap-x-4">
            {/* Language Selector */}
            <LanguageSelector
              ln={ln}
              handleLanguageChange={handleLanguageChange}
            />
            {user?.selected_role?.role.toLocaleLowerCase() === "ceo" ||
              user?.selected_role?.role.toLocaleLowerCase() === "admin" ? (
              <Dropdown menu={{ items: plusMenuItems }} placement="bottomRight" arrow trigger={['click']}>
                <button
                  className="text-[22px] cursor-pointer text-gray-500 flex items-center justify-center"
                  aria-label={t("header.addOptions", "Add options")}
                >
                  <BiPlus />
                </button>
              </Dropdown>
            ) :
              null}

            <button
              className="md:hidden outline-none"
              onClick={() => setSearch(true)}
            >
              <span className="text-[22px] cursor-pointer text-gray-500">
                <FiSearch />
              </span>
            </button>

            {/* Notifications */}
            <Link className="flex" to={"/dashboard/notifications"}>
              <Badge dot color={Notification.data > 0 ? "red" : "white"}>
                <span className="text-xl cursor-pointer text-gray-500">
                  <FaRegBell />
                </span>
              </Badge>
            </Link>

            {/* Avatar and Dropdown */}
            {userLoading || changeRole.isPending ? (
              <Spin />
            ) : (
              <AvatarDropdown
                items={menuItems}
                user={user}
                userLoading={userLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Search Module */}
      <div className={search ? "" : "hidden"}>
        <SearchModule setSearch={setSearch} />
      </div>
      <PayModal setOpen={setModal} open={modal} />
      <AddStudentModal /> {/* Added the new modal component here */}
    </div>
  );
}

export default Header;
