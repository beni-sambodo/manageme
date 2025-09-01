/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Form, InputNumber, message, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useApiGet, useApiMutation } from "../../services/queryConfig";
import transactionService from "../../services/transaction.service";
import { Dispatch, SetStateAction, useState } from "react";
import { IPayment } from "../../Types/Types";
import moment from "moment";

interface PayModalProps {
  isModalVisible: boolean;
  refetch: () => void;
  studentID?: string;
  studentName?: string;
  payment: IPayment[] | undefined;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function PayModal({
  isModalVisible,
  refetch,
  setIsModalVisible,
  studentID,
  payment,
  studentName,
}: PayModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedPayment, setSelectedPayment] = useState<IPayment | undefined>(
    undefined
  );

  const paymentTypes = useApiGet(["getTypes"], () =>
    transactionService.getTypes()
  );

  const pay = useApiMutation(
    (values: {
      paymentId: string;
      amount: number;
      type: string;
      for: string;
    }) => transactionService.pay(values),
    {
      onSuccess: () => {
        message.success(t("payment.success"));
        refetch();
        setIsModalVisible(false);
        form.resetFields();
        setSelectedPayment(undefined); // Reset selected payment
      },
      onError: () => message.error(t("payment.error")),
    }
  );
  const paymentOptions = paymentTypes.data?.map(
    (
      type: { _id: string; name: string | string | string[] },
      index: number
    ) => ({
      key: index, // Use a unique key, such as index or an identifier from the data
      value: type._id, // Assume type has a `value` property
      label: t(`payment.modal.${type.name}`), // Assume type has a `translationKey` property
    })
  );

  const monthOptions = payment?.map((pay) => ({
    key: pay._id,
    value: pay._id,
    label: moment(pay.month.date).format("MM.DD.YYYY"),
  }));

  const handlePay = (values: {
    month: string;
    amount: number;
    type: string;
    for: string;
  }) => {
    if (studentID) {
      pay.mutate({
        paymentId: values.month,
        amount: values.amount,
        type: values.type,
        for: values.for,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedPayment(undefined); // Reset selected payment
  };

  const handleMonthChange = (value: string) => {
    const selectedPayment = payment?.find((p) => p._id === value);
    setSelectedPayment(selectedPayment);
  };

  const setMaxAmount = () => {
    if (selectedPayment) {
      form.setFieldsValue({ amount: selectedPayment.mpv });
    }
  };


  return (
    <Modal
      title={t("payment.modal.title")}
      open={isModalVisible}
      onCancel={handleCancel}
      centered
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handlePay}>
        <h1 className="my-5 text-base">
          {t("payment.modal.confirmation")}:{" "}
          <span className="font-semibold">{studentName}</span>
        </h1>

        {selectedPayment && (
          <div className="my-3 font-bold text-lg flex items-center justify-center w-full">
            {selectedPayment.mpv.toLocaleString("uz") +
              " " +
              t("payment.modal.currency")}{" "}
            /{" "}
            {selectedPayment.mfp.toLocaleString() +
              " " +
              t("payment.modal.currency")}
          </div>
        )}

        <Form.Item
          label={t("payment.modal.month")}
          name="month"
          rules={[
            { required: true, message: t("payment.modal.monthRequired") },
          ]}
        >
          <Select options={monthOptions} onChange={handleMonthChange} />
        </Form.Item>
        <div className="flex items-center">
          <Form.Item
            label={t("payment.modal.amount")}
            name="amount"
            className="w-full mr-2"
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
          <div className="flex flex-col items-center">
            <Button
              type="default"
              className="mt-2"
              onClick={setMaxAmount}
              disabled={!selectedPayment}
            >
              To'liq {selectedPayment?.mpv.toLocaleString()}
            </Button>
          </div>
        </div>
        <Form.Item
          label={t("payment.modal.type")}
          name="type"
          rules={[{ required: true, message: t("payment.modal.typeRequired") }]}
        >
          <Select options={paymentOptions} />
        </Form.Item>
        <Form.Item
          label={t("payment.modal.for")}
          name="for"
          rules={[{ required: true, message: t("payment.modal.forRequired") }]}
        >
          {/* <TextArea  /> */}
          <Select placeholder={t("payment.modal.reasonPlaceholder")}>
            {/* Populate with reasons */}
            <Select.Option value="group">Group</Select.Option>
            <Select.Option value="debt">Debt</Select.Option>
            {/* Add more reasons as needed */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={pay.isPending}>
            {t("payment.modal.payButton")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
