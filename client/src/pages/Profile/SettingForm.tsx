import { Button, Form, Image, Input, InputNumber, message, Spin } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { User } from "../../Types/Types";
import uploadService from "../../services/upload.service";
import ChangePassword from "./ChangePassword";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";

export default function SettingForm({
  onFinish,
  user,
  isPending,
  setAvatarId,
}: {
  onFinish: (values: User) => Promise<void>;
  user: User | null;
  isPending: boolean;
  setAvatarId: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(user?.avatar);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = useForm();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const uploadedAvatar = await uploadFile(file, "avatar");
        setAvatarId(uploadedAvatar._id);
        setAvatar({
          _id: uploadedAvatar._id,
          location: uploadedAvatar.location,
        });
      } catch (err) {
        message.error(t("error_uploading_file"));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const uploadFile = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await uploadService.upload(type, formData);
    return response[0];
  };

  const handleRemove = async (imageIdToRemove: string) => {
    try {
      await uploadService.deleteGroup(imageIdToRemove);
      setAvatar(undefined);
      message.success(t("avatar_removed"));
    } catch (err) {
      message.error(t("error_deleting_avatar"));
    }
  };

  return (
    <>
      <Form
        name="profile_settings"
        onFinish={onFinish}
        form={form}
        layout="vertical"
        className="rounded-xl py-6 px-5 md:w-1/2 gap-x-5 bg-white"
        initialValues={user || {}}
      >
        {avatar && (
          <div className="relative mb-5 overflow-hidden rounded-lg w-fit">
            <Image
              className="max-w-[100px] min-w-[100px] aspect-square object-cover border rounded-lg"
              src={avatar.location}
              alt={avatar._id}
              loading="lazy"
            />
            <button
              type="button"
              className="absolute bg-white rounded-full top-1 right-1 p-1 shadow"
              onClick={() => handleRemove(avatar._id)}
            >
              <CgClose />
            </button>
          </div>
        )}
        {!avatar && (
          <Form.Item
            name="avatar"
            label={t("photo_or_avatar")}
            extra={t("upload")}
          >
            <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/png, image/heic, image/jpeg,image/jpg"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="avatar-upload"
              />
              <label
                className="flex p-4 w-full h-full flex-col justify-center items-center cursor-pointer"
                htmlFor="avatar-upload"
              >
                {isUploading ? (
                  <Spin />
                ) : (
                  <>
                    <BiPlus size={24} />
                    <span>{t("upload")}</span>
                  </>
                )}
              </label>
            </div>
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label={t("name")}
          rules={[{ required: true, message: t("enter_name") }]}
        >
          <Input placeholder={t("enter_name")} />
        </Form.Item>
        <Form.Item
          label={t("surname")}
          name="surname"
          rules={[{ required: true, message: t("addStudent.surnameRequired") }]}
        >
          <Input placeholder={t("enter_surname")} />
        </Form.Item>
        <Form.Item
          name="username"
          label={t("username")}
          rules={[{ required: true, message: t("enter_username") }]}
        >
          <Input addonBefore={"@"} disabled placeholder={t("enter_username")} />
        </Form.Item>
        <div className="flex flex-col md:flex-row justify-between md:gap-5 w-full">
          <Form.Item
            name="age"
            className="md:w-1/2"
            label={t("age")}
            // rules={[{ required: true, message: t("enter_age") }]}
          >
            <InputNumber
              className="w-full"
              type="number"
              controls={false}
              placeholder={t("enter_age")}
              min={1}
              step={1}
              precision={0}
              max={99}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t("phone")}
            className="md:w-1/2"
            rules={[
              {
                required: true,
                message: t("phone_required"),
              },
              {
                pattern: /^\d{9}$/,
                message: t("phone_invalid"),
              },
            ]}
          >
            <InputNumber
              addonBefore={"+998"}
              onKeyPress={(event) => {
                if (!/^\d$/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              maxLength={9}
              controls={false}
              className="w-full"
              type="tel"
              placeholder={t("enter_phone")}
            />
          </Form.Item>
        </div>
        <div className="flex gap-2">
          <Form.Item>
            <Button
              loading={isPending}
              htmlType="submit"
              type="primary"
            >
              {t("update")}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setOpen(true)} type="link">
              {t("change_password")}
            </Button>
          </Form.Item>
        </div>
      </Form>
      <ChangePassword setOpen={setOpen} open={open} />
    </>
  );
}
