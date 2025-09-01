import { Button, Form, Input, Select, Upload, message } from "antd";
import { BiUpload } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import schoolService from "../../../services/school.service";
import { useApiMutation } from "../../../services/queryConfig";
import uploadService from "../../../services/upload.service";

interface CenterSettingsFormProps {
  schoolData: any | undefined; // Replace with appropriate type for your data
  onUpdateSuccess: () => void;
  onUpdateError: () => void;
}

const CenterSettingsForm = ({ schoolData }: CenterSettingsFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [editValues, setEditValues] = useState({
    name: schoolData?.name,
    ceo: schoolData?.ceo,
    contact: schoolData?.contact,
    description: schoolData?.description,
    slogan: schoolData?.slogan,
    images: schoolData?.images?.map((image: any) => ({
      uid: image._id,
      name: image.key.split("/").pop(),
      status: "done",
      url: image.location,
    })),
    subscription_type: schoolData.subscription_type,
    documents: schoolData?.documents?.map((image: any) => ({
      uid: image._id,
      name: image.key.split("/").pop(),
      status: "done",
      url: image.location,
    })),
    type: schoolData?.type,
    region: schoolData?.region,
    country: schoolData?.country,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadFiles = async (type: string, files: any[]) => {
    if (!Array.isArray(files)) {
      throw new Error(`Expected an array of files, got: ${typeof files}`);
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file.originFileObj);
    });

    try {
      setLoading(true);
      const response = await uploadService.upload(type, formData);
      return response.map((item: { _id: string }) => item._id);
    } catch (err) {
      console.error("Error during file upload:", err);
      message.error(t(`centerSettings.${type}Upload`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolData) {
      setEditValues({
        name: schoolData.name,
        ceo: schoolData.ceo,
        contact: schoolData.contact,
        description: schoolData.description,
        slogan: schoolData.slogan,
        images: schoolData.images,
        documents: schoolData.documents,
        type: schoolData.type,
        region: schoolData.region,
        subscription_type: schoolData.subscription_type,
        country: schoolData.country,
      });
    }
  }, [schoolData]);

  const editCenter = useApiMutation(
    (values) => schoolService.updateSchool(schoolData?._id, values),
    {
      success: () => message.success(t("centerSettings.schoolName") + " " + t("centerSettings.updateSuccess")),
      error: () => message.error(t("centerSettings.updateError")),
      invalidateKeys: ["updateSchool"],
    }
  );
  const handleFinish = async (values: any) => {
    // Separate existing and new images/documents
    const existingImages = values.images.filter((file: any) => file.url);
    const newImages = values.images.filter((file: any) => !file.url);
  
    const existingDocuments = values.documents.filter((file: any) => file.url);
    const newDocuments = values.documents.filter((file: any) => !file.url);
  
    let uploadedImages = [];
    let uploadedDocuments = [];
  
    // Upload new images and documents
    if (newImages.length > 0) {
      uploadedImages = await uploadFiles("images", newImages);
    }
  
    if (newDocuments.length > 0) {
      uploadedDocuments = await uploadFiles("documents", newDocuments);
    }
  
    // Combine existing and uploaded files
    const finalImages = [
      ...existingImages.map((file: any) => file.uid),
      ...uploadedImages,
    ];
  
    const finalDocuments = [
      ...existingDocuments.map((file: any) => file.uid),
      ...uploadedDocuments,
    ];
  
    const formattedValues = {
      ...values,
      images: finalImages,
      documents: finalDocuments,
    };
  
    editCenter.mutate(formattedValues);
  };
  
  return (
    <Form
      name="center_settings"
      layout="vertical"
      initialValues={editValues}
      onFinish={handleFinish}
      className="rounded-xl bg-white"
    >
      <Form.Item
        name="name"
        label={t("centerSettings.schoolName")}
        rules={[{ required: true, message: t("centerSettings.schoolNameRequired") }]}
      >
        <Input placeholder={t("centerSettings.schoolNamePlaceholder")} />
      </Form.Item>

      <Form.Item
        name="contact"
        label={t("centerSettings.contact")}
        rules={[{ required: true, message: t("centerSettings.contactRequired") }]}
      >
        <Input placeholder={t("centerSettings.contactPlaceholder")} />
      </Form.Item>

      <Form.Item
        name="description"
        label={t("centerSettings.description")}
        rules={[{ required: true, message: t("centerSettings.descriptionRequired") }]}
      >
        <Input.TextArea placeholder={t("centerSettings.descriptionPlaceholder")} />
      </Form.Item>

      <Form.Item
        name="slogan"
        label={t("centerSettings.slogan")}
        rules={[{ required: true, message: t("centerSettings.sloganRequired") }]}
      >
        <Input placeholder={t("centerSettings.sloganPlaceholder")} />
      </Form.Item>

      <Form.Item
        name="images"
        label={t("centerSettings.images")}
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        extra={t("centerSettings.imagesUpload")}
      >
        <Upload name="images" multiple listType="picture-card" beforeUpload={() => false}>
          <span className="flex flex-col items-center">
            <BiUpload />
            {t("centerSettings.imagesUpload")}
          </span>
        </Upload>
      </Form.Item>

      <Form.Item
        name="documents"
        label={t("centerSettings.documents")}
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        extra={t("centerSettings.documentsUpload")}
      >
        <Upload beforeUpload={() => false} name="documents" listType="picture-card">
          <span className="flex flex-col items-center">
            <BiUpload />
            {t("centerSettings.documentsUpload")}
          </span>
        </Upload>
      </Form.Item>

      <Form.Item
        name="type"
        label={t("centerSettings.type")}
        rules={[{ required: true, message: t("centerSettings.typeRequired") }]}
      >
        <Select disabled>
          {/* Options */}
        </Select>
      </Form.Item>

      <Form.Item
        name="subscription_type"
        label={t("centerSettings.subscriptionType")}
        rules={[{ required: true, message: t("centerSettings.subscriptionTypeRequired") }]}
      >
        <Select>
          <Select.Option value="monthly">Monthly</Select.Option>
          <Select.Option value="daily">Daily</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="region"
        label={t("centerSettings.region")}
        rules={[{ required: true, message: t("centerSettings.regionRequired") }]}
      >
        <Input placeholder={t("centerSettings.regionPlaceholder")} />
      </Form.Item>

      <Form.Item
        name="country"
        label={t("centerSettings.country")}
        rules={[{ required: true, message: t("centerSettings.countryRequired") }]}
      >
        <Input placeholder={t("centerSettings.countryPlaceholder")} />
      </Form.Item>

      <Form.Item>
        <Button loading={editCenter.isPending || loading} type="primary" htmlType="submit">
          {t("centerSettings.submit")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CenterSettingsForm;
