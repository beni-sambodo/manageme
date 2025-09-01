import { Button, Form, Input, message, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { Us } from "../../Types/Types";
import Shape from "../../assets/shape.png";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "../../base/store";
import useFetchUser from "../../hooks/useFetchUser";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ ln, handleLanguageChange }: any) => (
  <Select
    defaultValue={ln || "uz"}
    onChange={handleLanguageChange}
    className="w-[100px] hidden md:block"
    options={[
      { value: "uz", label: "O'zbek" },
      { value: "en", label: "English" },
      { value: "ru", label: "Русский" },
    ]}
  />
);

export default function Login() {
  const { t, i18n } = useTranslation();
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("ln", value);
  };
  const ln = localStorage.getItem("ln");

  const navigate = useNavigate();
  const { updateUser } = useStore();
  const { fetchData } = useFetchUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { mutate, isLoading, isPending }: any = useMutation({
    mutationFn: (values: Us) => authService.login(values),
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.token);
      updateUser(data?.data);
      fetchData();
      message.success(t("login_success"));
      navigate("/dashboard");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Login failed:", error);
      message.error(
        `${t("login_error")} ${error.response.data.message || t("login_error")
        }`
      );
    },
  });

  const onFinish = (values: Us) => {
    const lowercaseUsername = values.username.toLowerCase();
    const updatedValues = { ...values, username: lowercaseUsername };
    mutate(updatedValues);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    message.error(t("login_error"), errorInfo);
  };

  type FieldType = {
    username?: string;
    password?: string;
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-10 z-10 rounded-xl xl:w-[25%] md:w-[50%] shadow-xl">
        <div className="absolute top-5 left-5">
          <LanguageSelector
            ln={ln}
            handleLanguageChange={handleLanguageChange}
          />
        </div>
        <h1 className="mb-10 text-center text-2xl">{t("login")}</h1>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType>
            label={t("username")}
            name="username"
            rules={[
              {
                required: true,
                message: t("please_enter_username"),
              },
              {
                pattern: /^[a-zA-Z0-9.-]*$/,
                message: t("username_pattern_message"),
              },
            ]}
          >
            <Input
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onInput={(e: any) =>
                (e.target.value = e.target.value.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={t("password")}
            name="password"
            rules={[{ required: true, message: t("please_enter_password") }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-end">
            <Link className="text-[#45b6d5]" to={"/reset"}>
              {t("forgot_password")}
            </Link>
          </div>

          <Form.Item>
            <Button disabled={isLoading || isPending} htmlType="submit">
              {isLoading || isPending ? t("loading") : t("login")}
            </Button>
            <p className="mt-3">
              {t("dont_have_account")}{" "}
              <Link className="text-[#45b6d5]" to={"/register"}>
                {t("register.title")}
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
