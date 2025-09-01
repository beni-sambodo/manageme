import { Button, Form, Input, InputNumber, message } from "antd";
import Shape from "../../../assets/shape.png";
import { useApiMutation } from "../../../services/queryConfig";
import emailService from "../../../services/email.service";
import passwordService from "../../../services/password.service";
import { useState } from "react";
import Email from "./Email";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

interface IType2 {
  email: string;
  newPassword: string;
}

interface IVerify {
  email: string;
  code: number;
}

type FieldType = {
  email?: string;
  code?: string;
  newPassword?: string;
};

export default function ResetPass() {
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [isSecondFormDisabled, setIsSecondFormDisabled] = useState(true);
  const navigate = useNavigate();
  const resetPassword = useApiMutation(
    (value: IType2) => passwordService.resetPass(value),
    {
      onSuccess: () => {
        message.success("Password reset successfully");
        setIsPending(false);
        navigate('/login');
      },
      onError: () => {
        message.error("Failed to reset password");
        setIsPending(false);
      },
    }
  );

  const verifyCode = useApiMutation(
    (data: IVerify) => emailService.checkCode(data),
    {
      onSuccess: () => {
        message.success("Email verified successfully");
      },
      onError: () => message.error("Failed to verify code"),
    }
  );

  const handleResetFormFinish = (values: FieldType) => {
    setIsPending(true);
    verifyCode.mutate(
      { email: email, code: Number(values.code) },
      {
        onSuccess: () => {
          resetPassword.mutate({
            email: email,
            newPassword: values.newPassword!,
          });
        },
        onError: () => {
          setIsPending(false);
        },
      }
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    message.error("Failed:", errorInfo);
  };

  return (
    <div className="w-screen h-screen relative flex flex-col justify-center items-center">
      <Link to="/login" className="flex hover:text-main items-center top-5 left-5 absolute gap-2"><BiArrowBack/> Login</Link>
      <div className="bg-white p-10  z-10 rounded-xl md:min-w-[30%] md:max-w-[50%] shadow-xl">

        <h1 className="mb-10 text-center text-2xl">Reset Password</h1>
        <Email
          setEmail={setEmail}
          setIsSecondFormDisabled={setIsSecondFormDisabled}
        />
        <hr />
        <Form
          name="reset_password"
          initialValues={{ remember: true, email: email }}
          onFinish={handleResetFormFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          disabled={isSecondFormDisabled}
        >
          <Form.Item<FieldType>
            label="Verification Code"
            className="mt-2"
            name="code"
            rules={[
              {
                required: true,
                message: "Please enter the verification code!",
              },
            ]}
          >
            <InputNumber className="w-full" controls={false} />
          </Form.Item>
          <Form.Item<FieldType>
            label="New Password"
            className="mt-2"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" loading={isPending}>
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="scale-90 inset-0 flex justify-center items-center absolute z-[1]">
        <img
          className="object-cover scale-90 inset-0"
          src={Shape}
          alt="Background Shape"
        />
      </div>
    </div>
  );
}