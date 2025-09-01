/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, InputNumber, Modal, Select, Space, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useApiGet } from "../../services/queryConfig";
import employeesService from "../../services/employees.service";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IEmploye } from "../../Types/Types";

interface prop {
  editEmployee: IEmploye | null;
  onAddPosition: any;
  setOpen: any;
  open: boolean;
  isEditMode: boolean;
  loading: boolean;
}

const InviteForm = ({
  editEmployee,
  onAddPosition,
  setOpen,
  open,
  isEditMode,
  loading,
}: prop) => {
  const { t } = useTranslation();
  const { isLoading, data } = useApiGet(["getPositions"], () =>
    employeesService.getPositions()
  );
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && editEmployee) {
      form.setFieldsValue({
        positions: editEmployee.positions?.map((position) => ({
          position: position.position?._id,
          salary: position.salary,
          salary_type: position.salary_type,
        })),
      });
    }
  }, [editEmployee, isEditMode, form]);

  const handleLinkClick = () => {
    navigate("/mycenter?tab=1");
  };

  const handleFinish = (values: any) => {
    onAddPosition(values.positions);
  };

  return (
    <Modal
      forceRender
      closable
      onOk={() => form.submit()}
      onCancel={() => setOpen(false)}
      confirmLoading={loading}
      open={open}
      title={
        isEditMode ? t("editEmployee.form.title") : t("addEmployee.breadcrumb.inviteEmployee")
      }
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.List name="positions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  className="w-full"
                  direction="vertical"
                  style={{ marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "salary"]}
                    label={t("addEmployee.form.salary")}
                    rules={[
                      {
                        required: true,
                        message: t("addEmployee.form.salaryPlaceholder"),
                      },
                    ]}
                  >
                    <InputNumber
                      controls={false}
                      className="w-full"
                      placeholder={t("addEmployee.form.salaryPlaceholder")}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      parser={(value) => (value ? value.replace(/\s/g, '') : '')}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "salary_type"]}
                    label={t("addEmployee.form.salary_type")}
                    initialValue="MONTHLY"
                  >
                    <Select>
                      <Select.Option value="MONTHLY">
                        {t("addEmployee.form.salaryTypeMonthly")}
                      </Select.Option>
                      <Select.Option value="PERCENT">
                        {t("addEmployee.form.salaryTypePercentages")}
                      </Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "position"]}
                    label={t("addEmployee.form.position")}
                    rules={[
                      {
                        required: true,
                        message: t("addEmployee.form.positionPlaceholder"),
                      },
                    ]}
                  >
                    <Select
                      loading={isLoading}
                      placeholder={t("addEmployee.form.positionPlaceholder")}
                    >
                      {data
                        ?.filter((i: any) => i._id !== null) // Filter out entries with null _id
                        .map((i: any) => (
                          <Select.Option key={i._id} value={i._id}>
                            {i.name}
                          </Select.Option>
                        ))}
                      <Select.Option value={""} disabled>
                        <span
                          style={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            color: "#1890ff",
                          }}
                          onClick={handleLinkClick}
                        >
                          {t("addEmployee.form.addPosition")}
                        </span>
                      </Select.Option>
                    </Select>
                  </Form.Item>

                  <Button type="dashed" danger onClick={() => remove(name)}>
                    {t("addEmployee.form.removePosition")}
                  </Button>
                </Space>
              ))}

              <Button type="dashed" onClick={() => add()}>
                {t("addEmployee.form.addPosition")}
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default InviteForm;
