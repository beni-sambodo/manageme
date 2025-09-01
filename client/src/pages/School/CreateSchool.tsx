import { Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BiPlus } from "react-icons/bi";
import schoolService from "../../services/school.service";
import { useNavigate } from "react-router-dom";
import { CreateS, School } from "../../Types/Types";
import uploadService from "../../services/upload.service";
import { useState, ChangeEvent } from "react";
import useFetchUser from "../../hooks/useFetchUser";
import Header from "../../components/Header";
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const uzbekistanRegions = [
  "Andijan",
  "Bukhara",
  "Fergana",
  "Jizzakh",
  "Karakalpakstan",
  "Khorezm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Samarkand",
  "Sirdaryo",
  "Surxondaryo",
  "Tashkent",
];

export default function CreateSchool() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { fetchData } = useFetchUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("+998 ");

  const createSchool = async (newSchool: CreateS) => {
    try {
      setLoading(t("creating_school"));
      await schoolService.createSchool(newSchool);
      message.success(t("school_created_success"));
      fetchData();
      navigate("/");
    } catch (err) {
      message.error(t("error_create_school"));
    } finally {
      setLoading(null);
    }
  };

  const uploadFiles = async (type: string, files: any[]) => {
    if (!Array.isArray(files)) {
      throw new Error(`Expected an array of files, got: ${typeof files}`);
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file.originFileObj);
    });

    try {
      setLoading(t("uploading_photos"));
      const response = await uploadService.upload(type, formData);
      return response.map((item: { _id: string }) => item._id);
    } catch (err) {
      console.error("Error during file upload:", err);
      message.error(t(`error_uploading_${type}`));
      throw err;
    } finally {
      setLoading(null);
    }
  };

  const onFinish = async (values: School) => {
    try {
      const { documents, images } = values;
      const uploadedDocuments = documents
        ? await uploadFiles("documents", documents)
        : null;
      const uploadedImages = images
        ? await uploadFiles("images", images)
        : null;

      const newSchool: CreateS = {
        name: values.name,
        description: values.description,
        slogan: values.slogan || "",
        documents: uploadedDocuments,
        images: uploadedImages,
        type: values.type,
        subscription_type: values.subscription_type,
        country: values.country,
        region: values.region,
        contact: values.contact,
        rate: 1,
      };

      await createSchool(newSchool);
    } catch (error) {
      message.error(t("error_create_school"));
    }
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-lg mx-auto mt-8 bg-white p-6 rounded-lg shadow-box">
        <h2 className="text-2xl font-bold mb-6">{t("create_school")}</h2>
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          autoSave="true"
          initialValues={{ country: "Uzbekistan" }}
          onFinish={onFinish}
          onFinishFailed={() => {
            message.error(t("form_submission_failed"));
          }}
        >
          <Form.Item
            name="name"
            label={t("school_name")}
            rules={[
              { required: true, message: t("Maktab nomini kiriting") },
            ]}
          >
            <Input placeholder={t("Maktab nomini kiriting")} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t("description")}
            rules={[{ required: true, message: t("Tavsif kiriting") }]}
          >
            <Input.TextArea rows={4} placeholder={t("Tavsif")} />
          </Form.Item>

          <Form.Item name="slogan" label={t("slogan")}>
            <Input placeholder={t("Maktab shiorini kirting")} />
          </Form.Item>

          <Form.Item
            name="type"
            label={t("school_type")}
            rules={[
              { required: true, message: t("Matab turini tanlang") },
            ]}
          >
            <Select placeholder={t("Maktab turini tanlang")}>
              <Option value="MAIN">{t("main")}</Option>
              <Option value="FILIAL">{t("filial")}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="subscription_type"
            label={t("subscription_type")}
            rules={[{ required: true, message: t("Obuna turini tanlang") }]}
          >
            <Select placeholder={t("Obuna turini tanlang")}>
              <Option value="monthly">{t("monthly")}</Option>
              <Option value="daily">{t("daily")}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="country"
            label={t("country")}
            rules={[{ required: true, message: t("Mamlakatni tanlang") }]}
          >
            <Select disabled>
              <Select.Option value={"Uzbekistan"}>{t("country")}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="region"
            label={t("region")}
            rules={[{ required: true, message: t("Viloyatni tanlash") }]}
          >
            <Select
              showSearch
              placeholder={t("Viloyatni tanlang")}
              optionFilterProp="children"
              filterOption={(input: string, option: any) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {uzbekistanRegions.map((region) => (
                <Select.Option key={region} value={region}>
                  {region}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label={t("contact_email")}
            rules={[{ type: "email", message: t("valid_email") }]}
          >
            <Input placeholder={t("Emailingizni kiriting")} />
          </Form.Item>

          <Form.Item
            name="contact"
            dependencies={["number"]}
            label={t("contact_number")}
            rules={[
              { required: true, message: t("Telefon raqamda xatolik") },
              {
                pattern: /^\+998 \d{2} \d{3} \d{2} \d{2}$/,
                message: t("Telefon raqami noto'g'ri formatda"),
              },
            ]}
          >
            <Input
              placeholder={t("Raqamingizni kiriting")}
              value={phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let value = e.target.value;
                // Ensure +998 prefix is always present and not deletable
                if (!value.startsWith("+998 ")) {
                  value = "+998 " + value.replace(/[^0-9]/g, "");
                } else {
                  value = "+998 " + value.substring(5).replace(/[^0-9]/g, "");
                }

                const numbers = value.substring(5).replace(/\D/g, "");
                let formattedNumber = "+998 ";

                if (numbers.length > 0) {
                  formattedNumber += numbers.substring(0, 2);
                }
                if (numbers.length > 2) {
                  formattedNumber += " " + numbers.substring(2, 5);
                }
                if (numbers.length > 5) {
                  formattedNumber += " " + numbers.substring(5, 7);
                }
                if (numbers.length > 7) {
                  formattedNumber += " " + numbers.substring(7, 9);
                }

                // Limit to +998 XX XXX XX XX (17 characters including spaces)
                if (formattedNumber.length > 17) {
                  formattedNumber = formattedNumber.substring(0, 17);
                }

                setPhoneNumber(formattedNumber);
                form.setFieldsValue({ contact: formattedNumber });
              }}
              onKeyDown={(e) => {
                // Prevent deleting the prefix
                if (phoneNumber === "+998 " && (e.key === 'Backspace' || e.key === 'Delete')) {
                  e.preventDefault();
                }
                if (e.currentTarget.selectionStart !== null && e.currentTarget.selectionStart < 5 && (e.key === 'Backspace' || e.key === 'Delete')) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="documents"
            label={t("documents")}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload multiple listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>{t("Hujjatni yuklang")}</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="images"
            label={t("images")}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload multiple listType="picture-card" beforeUpload={() => false}>
              <div className="flex flex-col justify-center items-center">
                <BiPlus />
                <div>{t("Rasm yuklang")}</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading ? true : false}
              type="primary"
              size="large"
              htmlType="submit"
            >
              {loading ? loading : t("Matab Yaratish")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
