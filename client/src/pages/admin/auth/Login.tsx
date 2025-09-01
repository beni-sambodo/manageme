import { Button, Form, Input, message } from "antd";
import adminService from "../../../services/admin.service";
import { useApiMutation } from "../../../services/queryConfig";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isPending, mutate } = useApiMutation(
    (value: { username: string; password: string }) =>
      adminService.login(value),
    {
      success: (data) => {
        message.success("Logged in successfully"),
          localStorage.setItem("adminToken", data.token),
          navigate("/admin");
      },
      error: () => message.error("Failed to login"),
      invalidateKeys: ["adminLogin"],
    }
  );

  const onFinish = (values: { username: string; password: string }) => {
    mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold">Admin Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isPending}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
