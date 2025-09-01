// src/components/Sidebar.tsx

import { Layout, Menu } from "antd";
import { DashboardOutlined, BookOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { IoSchoolOutline } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";

const { Sider } = Layout;

const AdminSidebar: React.FC = () => {
  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <IoSchoolOutline />,
      label: <Link to="/admin/schools">Schools</Link>,
    },
    {
      key: "3",
      icon: <BookOutlined />,
      label: <Link to="/admin/course-categories">Course Categories</Link>,
    },
    {
      key: "4",
      icon: <MdSupportAgent />,
      label: <Link to="/admin/support">Support</Link>, // Fixed typo from "Siupport" to "Support"
    },
  ];

  return (
    <Sider collapsible>
      <div className="logo p-4 text-white text-center text-xl">Admin Panel</div>
      <Menu theme="dark" mode="inline" items={menuItems} />
    </Sider>
  );
};

export default AdminSidebar;
