import { Modal, Form, Input, Button, InputNumber, message } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import transactionService from "../../services/transaction.service";

interface DiscountModalProps {
  isModalDVisible: boolean;
  setIsModalDVisible: Dispatch<SetStateAction<boolean>>;
  studentID: string | undefined;
  groupID: string;
  studentName: string | undefined;
}

export default function DiscountModal({
  isModalDVisible,
  setIsModalDVisible,
  studentID,
  groupID,
  studentName,
}: DiscountModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    // Prepare your data for submission
    const discountData = {
      group: groupID, // Assuming `payment` contains group info
      student: studentID,
      amount: values.amount,
      reason: values.reason,
    };

    try {
      // Call your service to handle the discount logic
      await transactionService.makeDiscount(discountData);
      message.success("Discount applied");
      setIsModalDVisible(false); // Close the modal on successful submission
    } catch (error) {
      message.error("Failed to apply discount");
    }
  };

  return (
    <Modal
      title={`Chegirma berilayotgan o'quvchi: ${studentName}`}
      open={isModalDVisible}
      onCancel={() => setIsModalDVisible(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("payment.modal.amount")}
          name="amount"
          rules={[
            { required: true, message: t("payment.modal.amountRequired") },
            {
              type: "number",
              min: 10000,
              message: t("payment.modal.amountInvalid"),
            },
          ]}
        >
          <InputNumber
            type="number"
            controls={false}
            className="w-full"
            addonAfter={t("payment.modal.currency")}
            min={0}
          />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Sababi"
          rules={[
            {
              required: true,
              message: "Iltimos, chegirma sababini kiriting",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Apply Discount
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
