import { Button, Form, Input, Modal, message } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useApiMutation } from "../../services/queryConfig";
import passwordService from "../../services/password.service";

interface IType {
  oldPassword: string;
  newPassword: string;
}

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

export default function ChangePassword({ setOpen, open }: Props) {
  const [form] = Form.useForm();

  const changePass = useApiMutation(
    (value: IType) => passwordService.updatePass(value),
    {
      onSuccess: () => {
        message.success("Password successfully changed");
        setOpen(false);
      },
      onError: () => {
        message.error("Failed to change password");
      },
    }
  );

  const handleFinish = (values: IType) => {
    changePass.mutate(values);
  };

  return (
    <Modal
      footer={null}
      title="Change Password"
      onCancel={() => setOpen(false)}
      open={open}
    >
      <Form
        form={form}
        name="password_update"
        layout="vertical"
        autoComplete="off"
        className="pt-4 h-full"
        onFinish={handleFinish}
      >
        <Form.Item
          name="oldPassword"
          label="Old password"
          rules={[
            { required: true, message: "Please input your old password!" },
          ]}
        >
          <Input.Password placeholder="Enter your old password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New password"
          rules={[
            { required: true, message: "Please input your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("oldPassword") !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("New password cannot be the same as old password")
                );
              },
            }),
          ]}
        >
          <Input.Password autoComplete="off" placeholder="Enter your new password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
