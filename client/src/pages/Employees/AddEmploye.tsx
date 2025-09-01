import {
  Breadcrumb,
  Input,
  Avatar,
  Button,
  message,
  Skeleton,
  Form,
  List,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import authService from "../../services/auth.service";
import { User, position } from "../../Types/Types";
import employeesService from "../../services/employees.service";
import InviteForm from "./InviteForm";
import { useApiMutation } from "../../services/queryConfig";
import { CgClose } from "react-icons/cg";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
const { Text } = Typography;
export default function AddEmployee() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [positions, setPositions] = useState<position[]>([]);
  const navigate = useNavigate();
  const findUser = useApiMutation(
    (username: string) => authService.findUser(username),
    {
      success: (data) => {
        setUser(data), message.success("User found!");
      },
      error: () => {
        setUser(null), message.error("User not found!");
      },
      invalidateKeys: ["findUser"],
    }
  );
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      message.error(t("addEmployee.search.placeholder"));
      return;
    }
    findUser.mutate(value.toLowerCase());
  };

  const handleInvite = (values: { message: string }) => {
    if (!user) {
      message.error(t("addEmployee.user.notFound"));
      return;
    } else if (positions.length == 0) {
      message.error("Rol tanlang");
      return;
    }

    interface AddEmployePosition extends Omit<position, "position"> {
      position: string;
    }
    const stringPositions = positions as unknown as AddEmployePosition[];

    const data = {
      user: user._id,
      message: values.message,
      positions: stringPositions.map((pos: AddEmployePosition) => ({
        salary: pos.salary,
        salary_type: pos.salary_type.toUpperCase(),
        position: pos.position,
      })),
    };
    try {
      employeesService.createInvite(data);
      queryClient.invalidateQueries({ queryKey: ["getInvites"] });
      navigate("/dashboard/employees");
      message.success(t("done"));
    } catch {
      message.error(t("addEmployee.form.inviteError"));
    }
  };
// user.selected_role ? <boyagi dashboard : tanlash cardlar
  const handleClose = () => {
    setPositions([]);
  };

  const handleAddPosition = (position: position[]) => {
    setPositions([...positions, position[0]]);
    setOpen(false);
  };
  return (
    <div className=" min-h-[80vh]">
      <Breadcrumb
        items={[
          { title: <Link to={"/"}>{t("addEmployee.breadcrumb.home")}</Link> },
          {
            title: (
              <Link to={"/dashboard/employees"}>
                {t("addEmployee.breadcrumb.employees")}
              </Link>
            ),
          },
          { title: t("addEmployee.breadcrumb.inviteEmployee") },
        ]}
      />

      <div className="mt-4 md:w-1/2">
        <div className="bg-white p-4 shadow-box rounded-lg">
          <h1 className="mb-2 text-xl font-semibold">
            {t("addEmployee.search.title")}
          </h1>
          {!user && (
            <Input.Search
              allowClear
              enterButton={t("addEmployee.search.searchButton")}
              loading={findUser.isPending}
              size="large"
              className="mt-2"
              placeholder={t("addEmployee.search.placeholder")}
              onSearch={handleSearch}
            />
          )}
          <div className="mt-5">
            {findUser.isPending ? (
              <div className="flex justify-between items-center gap-3">
                <Skeleton.Avatar shape="circle" size="large" active />
                <Skeleton title paragraph={false} />
              </div>
            ) : user ? (
              <div className="flex items-center bg-gray-100 p-2 rounded-lg justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatar?.location}
                    size={"large"}
                    className="capitalize"
                  >
                    {user.name[0]}
                  </Avatar>
                  <p className="text-lg font-semibold capitalize">
                    {user.name}
                  </p>
                </div>
                <button onClick={() => setUser(null)} className="text-xl pr-1">
                  <MdClose />
                </button>
              </div>
            ) : (
              <div>{t("addEmployee.search.noUser")}</div>
            )}
          </div>
        </div>

        <div className="bg-white mt-4 p-4 shadow-box rounded-lg">
          <Form layout="vertical" name="inviteForm" onFinish={handleInvite}>
            <Form.Item
              name="message"
              label={t("addEmployee.form.message")}
              rules={[
                {
                  required: true,
                  message: t("addEmployee.form.messagePlaceholder"),
                },
              ]}
            >
              <Input.TextArea
                placeholder={t("addEmployee.form.messagePlaceholder")}
              />
            </Form.Item>
            <div className="mb-2">
              {positions.length ? (
                <List
                  grid={{ gutter: 16, column: 1 }}
                  dataSource={positions}
                  renderItem={(position: position) => (
                    <div className="mb-4">
                      <div className="flex  py-2 justify-between items-center ">
                        <div className="flex flex-col sm:flex-row gap-5">
                          <Text type="secondary">
                            {position?.position?.name}
                          </Text>
                          {/* <Text>{position.pos}</Text> */}
                          <Text>{position.salary}</Text>
                          <Text>{position.salary_type}</Text>
                        </div>
                        <div className="pr-4 h-full  flex items-center justify-center ">
                          <button onClick={handleClose} type="button">
                            <CgClose />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <Text type="danger">
                  * {t("addEmployee.user.PleaseaddRole")}
                </Text>
              )}
            </div>
            {positions.length == 0 && (
              <Form.Item>
                <Button onClick={() => setOpen(true)}>
                  {t("addEmployee.form.addRole")}
                </Button>
              </Form.Item>
            )}
            <Button type="primary" htmlType="submit">
              {t("addEmployee.form.invite")}
            </Button>
          </Form>

          <InviteForm
            onAddPosition={handleAddPosition}
            setOpen={setOpen}
            open={open}
            editEmployee={null}
            isEditMode={false}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
