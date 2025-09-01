import { Modal, Form, Select, Button, message, InputNumber } from "antd";
import { useApiGet, useApiMutation } from "../services/queryConfig";
import groupService from "../services/group.service";
import transactionService from "../services/transaction.service";
import { IGRoup, IPayment, IPaymentUser } from "../Types/Types";
import { Dispatch, SetStateAction, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import useFetchUser from "../hooks/useFetchUser";

export default function PayModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const { user } = useFetchUser();
  const [group, setGroup] = useState<string>("");
  const [payments, setPayments] = useState<IPayment[]>([]);
  const { data: groups } = useApiGet(
    ["getGroups"],
    () => groupService.getGroups(),
    { enabled: !!user?.selected_role }
  );
  const { data, isLoading, refetch } = useApiGet(
    ["getStudentPayment", group],
    () => transactionService.getStudentPayment(group),
    { enabled: !!group }
  );

  const paymentTypes = useApiGet(
    ["getTypes"],
    () => transactionService.getTypes(),
    { enabled: !!user?.selected_role }
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
        setOpen(false);
        form.resetFields();
        setGroup(""); // Reset selected payment
        setPayments([]); // Reset selected payment
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

  const onClose = () => {
    setOpen(false);
    form.resetFields(); // Reset form fields on close
  };
  const handleStudChange = (stud: string) => {
    const FS = data?.datas.find((student: IPaymentUser) => student._id == stud);
    setPayments(FS.payment);
  };
  const [form] = Form.useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    pay.mutate(values);
  };

  return (
    <Modal
      open={open}
      title="Pay"
      width={"60vw"}
      onCancel={onClose}
      footer={null}
    >
      <Form
        className="grid grid-cols-2 gap-x-3"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <div>
          <Form.Item
            name="group"
            label="Groups"
            rules={[{ required: true, message: "Please select a group" }]}
          >
            <Select onChange={setGroup}>
              {groups?.map((group: IGRoup) => (
                <Select.Option key={group._id} value={group._id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="students"
            label="Students"
            rules={[{ required: true, message: "Please select a student" }]}
          >
            <Select
              onChange={handleStudChange}
              loading={isLoading}
              disabled={!group}
            >
              {data?.datas?.map((student: IPaymentUser) => (
                <Select.Option key={student._id} value={student._id}>
                  {student.user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="paymentId"
            label={t("payment.modal.month")}
            rules={[
              { required: true, message: t("payment.modal.monthRequired") },
            ]}
          >
            <Select disabled={!data || payments.length === 0}>
              {payments?.map((payment: IPayment) => (
                <Select.Option key={payment._id} value={payment._id}>
                  {moment(payment.month.date).format("DD.MM.YYYY")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label={t("payment.modal.type")}
            name="type"
            rules={[
              { required: true, message: t("payment.modal.typeRequired") },
            ]}
          >
            <Select options={paymentOptions} />
          </Form.Item>
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
            label={t("payment.modal.for")}
            name="for"
            rules={[
              { required: true, message: t("payment.modal.forRequired") },
            ]}
          >
            <Select placeholder={t("payment.modal.reasonPlaceholder")}>
              {/* Populate with reasons */}
              <Select.Option value="group">Group</Select.Option>
              <Select.Option value="debt">Debt</Select.Option>
              {/* Add more reasons as needed */}
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Button loading={pay.isPending} type="primary" htmlType="submit">
            {t("payment.modal.payButton")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
