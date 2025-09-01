import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { User } from "../../Types/Types";
import { useApiMutation } from "../../services/queryConfig";
import emailService from "../../services/email.service";
import { useForm } from "antd/es/form/Form";
import { useTranslation } from "react-i18next";

interface IVerify {
  email: string;
  code: number;
}

const OTPInput = ({
  length,
  onChange,
}: {
  length: number;
  onChange: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <Input
            key={index}
            style={{ width: "3rem", textAlign: "center" }}
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e.target.value, index)}
          />
        ))}
    </div>
  );
};

export default function Email({
  user,
  fetchData,
}: {
  user: User | null;
  fetchData: any;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [form] = useForm();
  const { t } = useTranslation();

  const changeEmail = useApiMutation(
    (email: string) => emailService.changeEmail(email),
    {
      onSuccess: () => {
        message.success(t("email_updated_successfully"));
        fetchData();
      },
      onError: () => message.error(t("failed_to_update_email")),
    }
  );

  const verifyEmail = useApiMutation(
    (data: IVerify) => emailService.verifyEmail(data),
    {
      onSuccess: () => {
        message.success(t("email_verified_successfully"));
        fetchData();
        setIsModalVisible(false);
      },
      onError: () => message.error(t("failed_to_verify_email")),
    }
  );

  const sendVerificationCode = useApiMutation(
    (email: string) => emailService.sendCode(email),
    {
      onSuccess: () => message.success(t("verification_code_sent_successfully")),
      onError: () => message.error(t("failed_to_send_verification_code")),
    }
  );

  const handleUpdateEmail = ({ email }: { email: string }) => {
    changeEmail.mutate(email);
  };

  const handleVerifyEmail = (email: string) => {
    sendVerificationCode.mutate(email);
    setIsModalVisible(true);
  };

  const handleVerificationSubmit = () => {
    const emailToVerify = form.getFieldValue("email");
    if (emailToVerify && verificationCode) {
      verifyEmail.mutate({
        email: emailToVerify,
        code: Number(verificationCode),
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setVerificationCode("");
  };

  return (
    <>
      <Form
        name="email"
        layout="vertical"
        className="rounded-xl pt-6 px-5 gap-x-5 bg-white"
        form={form}
        initialValues={{ email: user?.email?.email }}
        onFinish={handleUpdateEmail}
      >
        <Form.Item
          name="email"
          label={t("email")}
          rules={[{ required: true, message: t("please_input_your_email") }]}
        >
          <Input
            status={user?.email?.verifired ? "" : "warning"}
            type="email"
            placeholder={t("enter_your_email")}
          />
        </Form.Item>
        <div className="flex gap-2 justify-end">
          <Form.Item>
            <Button
              htmlType="submit"
              loading={changeEmail.isPending}
              type="primary"
            >
              {t("update_email")}
            </Button>
          </Form.Item>
        </div>
      </Form>

      {!user?.email?.verifired && user?.email && (
        <Button
          type="primary"
          onClick={() => handleVerifyEmail(user.email.email)}
          className="mt-3"
        >
          {t("verify_email")}
        </Button>
      )}

      <Modal
        title={t("verify_email_modal_title")}
        open={isModalVisible}
        onOk={handleVerificationSubmit}
        onCancel={handleCancel}
        okText={t("verify")}
        cancelText={t("cancel")}
      >
        <Form layout="vertical">
          <Form.Item
            label={t("verification_code")}
            rules={[
              {
                required: true,
                message: t("please_input_the_verification_code"),
              },
            ]}
          >
            <OTPInput length={6} onChange={setVerificationCode} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
