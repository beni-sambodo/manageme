/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Form, Input, message, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerU } from "../../Types/Types";
import authService from "../../services/auth.service";
import { useStore } from "../../base/store";
import Shape from "../../assets/shape.png";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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

export default function Register() {
  const { t, i18n } = useTranslation();
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("ln", value);
  };
  const ln = localStorage.getItem("ln");

  const navigate = useNavigate();
  const { updateUser } = useStore();
  const { mutate, isLoading, isPending }: any = useMutation({
    mutationFn: (values: registerU) => authService.register(values),
    onSuccess: ({ data }) => {
      message.success(t("register.success"));
      updateUser(data?.data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login failed:", error.message.message);
      message.error(
        `${t("register.error")} ${error.response.data.message.message || t("register.checkCredentials")
        }`
      );
    },
  });

  const onFinish = (values: registerU) => {
    const lowercaseUsername = values.username.toLowerCase();
    const updatedValues = { ...values, username: lowercaseUsername };
    mutate(updatedValues);
  };

  type FieldType = {
    username?: string;
    password?: string;
    name?: string;
    acceptTerms?: boolean;
  };

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-10 z-10 rounded-xl xl:w-[25%] md:w-[50%] shadow-xl">
        <div className="absolute top-5 left-5">
          <LanguageSelector
            ln={ln}
            handleLanguageChange={handleLanguageChange}
          />
        </div>
        <h1 className="mb-10 text-center text-2xl">{t("register.title")}</h1>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType>
            label={t("register.nameLabel")}
            name="name"
            rules={[
              { required: true, message: t("register.nameRequired") },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: t("register.usernameRequired"),
              },
              {
                pattern: /^[a-zA-Z0-9.-]*$/,
                message: t("register.usernamePattern"),
              },
              {
                validator: (_, value) => {
                  const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
                  if (letterCount < 4) {
                    return Promise.reject(
                      new Error(t("register.usernameLetterCount"))
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              onInput={(e: any) =>
                (e.target.value = e.target.value.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={t("register.passwordLabel")}
            name="password"
            rules={[
              { required: true, message: t("register.passwordRequired") },
            ]}
          >
            <Input.Password min={6} />
          </Form.Item>

          <Form.Item<FieldType>
            name="acceptTerms"
            valuePropName="checked"
            rules={[
              { required: true, message: t("register.acceptTermsRequired") },
            ]}
          >
            <Checkbox>
              <span className="ml-2">
                <Link className="text-main" to="/terms">
                  {t("register.privacyPolicy")}
                </Link>
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button disabled={isPending} htmlType="submit">
              {isLoading || isPending ? t("register.loading") : t("register.submit")}
            </Button>
            <p className="mt-4">
              {t("register.haveAccount")}{" "}
              <Link className="text-[#45b6d5]" to={"/login"}>
                {t("register.login")}
              </Link>
            </p>
          </Form.Item>
        </Form>
      </div>
      <div className="scale-90 inset-0 flex justify-center items-center absolute z-[1]">
        <img
          className="object-cover scale-90 inset-0"
          src={Shape}
          alt=""
          loading="lazy"
        />
      </div>
    </div>
  );
}
