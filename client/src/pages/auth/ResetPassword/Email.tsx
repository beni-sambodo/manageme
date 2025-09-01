import { Button, Form, Input, Space, message } from "antd";
import { useApiMutation } from "../../../services/queryConfig";
import emailService from "../../../services/email.service";
import { Dispatch, SetStateAction } from "react";

type FieldType = {
  email?: string;
  code?: string;
  newPassword?: string;
};
interface prop {
  setEmail: Dispatch<SetStateAction<string>>;
  setIsSecondFormDisabled: Dispatch<SetStateAction<boolean>>;
}

export default function Email({ setEmail, setIsSecondFormDisabled }: prop) {
  const handleEmailFormFinish = (values: FieldType) => {
    setEmail(values.email!);
    sendVerificationCode.mutate(values.email!);
  };
  const sendVerificationCode = useApiMutation(
    (email: string) => emailService.sendPassCode(email),
    {
      onSuccess: () => {
        message.success("Verification code sent successfully");
        setIsSecondFormDisabled(false);
      },
      onError: () => message.error("Failed to send verification code"),
    }
  );
  return (
    <div>
      {" "}
      <Form
        name="send_code"
        initialValues={{ remember: true }}
        onFinish={handleEmailFormFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Space.Compact className="w-full">
            <Input style={{ width: "calc(100% - 100px)" }} />
            <Button loading={sendVerificationCode.isPending} htmlType="submit" type="primary" className="rounded-s-none">
              Send Code
            </Button>
          </Space.Compact>
        </Form.Item>
      </Form>
    </div>
  );
}
