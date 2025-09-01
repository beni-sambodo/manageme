/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button, Input, Form, Upload, message } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { BiPlus } from "react-icons/bi";
import uploadService from "../services/upload.service";
import supportService from "../services/support.service";

interface prop {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const SupportModal = ({ isVisible, setIsVisible }: prop) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<string | null>(null);

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
      setLoading("Uploading photos...");
      const response = await uploadService.upload(type, formData);
      return response.map((item: { _id: string }) => item._id);
    } catch (err) {
      console.error("Error during file upload:", err);
      message.error(`Error uploading ${type}`);
      throw err;
    } finally {
      setLoading(null);
    }
  };
  const handleSubmit = async (values: { text?: string; file?: any }) => {
    form.validateFields();
    try {
      setLoading("Loading...");
      const { file } = values;
      const uploadedFiles = await uploadFiles("files", file);
      if (!uploadedFiles || !uploadedFiles.length) {
        throw new Error("Image upload failed. Please try again.");
      }
      const value: { text: string; file: string } = {
        text: values.text || "error-text",
        file: uploadedFiles,
      };
      await supportService.createSupport(value);
    } catch (err) {
      setLoading(null);
    }finally {
        setIsVisible(false)
        setLoading(null);
    }

  };

  return (
    <Modal
      centered
      title="Support"
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="file"
          label="Screenshots"
          rules={[{ required: true, message: "Please upload school images." }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload multiple listType="picture-card" beforeUpload={() => false}>
            <div className="flex flex-col  justify-center items-center">
              <BiPlus />
              <div>Upload Image</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="text"
          label="Support Request"
          rules={[
            { required: true, message: "Please enter your support request!" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter your support request here..."
          />
        </Form.Item>
        <Form.Item>
          <Button  loading={loading ? true : false} disabled={loading ? true : false} htmlType="submit" type="primary">
            {loading ? loading : "Submit"}
          </Button>
        </Form.Item>
      </Form>

      <div className="support-link">
        <p>
          If you need immediate assistance, contact us on{" "}
          <a
            href="https://t.me/LyublyupeImeni"
            target="_blank"
            className="text-main"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
          .
        </p>
      </div>
    </Modal>
  );
};

export default SupportModal;
