import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };
  return (
    <Header className="bg-white shadow-md flex justify-between items-center px-4">
      <h1 className="text-xl">Admin Dashboard</h1>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Header>
  );
};

export default AppHeader;
