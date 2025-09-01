import { Button, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import useFetchUser from "../../hooks/useFetchUser";
import { useNavigate } from "react-router-dom";
import {  useEffect } from "react";
import { useTranslation } from "react-i18next";
import authService from "../../services/auth.service";
import RoleCard from "./RoleCard";
import { RiParentFill, RiBriefcaseFill, RiBookFill } from "react-icons/ri";
import { useApiMutation } from "../../services/queryConfig";

const { Title } = Typography;

export default function SelectRole() {
  const { t } = useTranslation();
  const { user, userLoading, fetchData } = useFetchUser();
  const navigate = useNavigate();

  const changeRole = useApiMutation(
    (value: string) => authService.updateRole(value),
    {
      success: () => {
        navigate("/mycenter"),
          fetchData(),
          message.success(t("role.role_updated_successfully"));
      },
      error: () => message.error(t("failed_to_update_role")),
      invalidateKeys: ["currentSchool"],
    }
  );
  const handleRoleChange = (id: string) => {
    changeRole.mutate(id);
  };

  useEffect(() => {
    if (!userLoading && user?.roles?.length !== 0) {
      navigate("/");
    }
  }, [user, navigate, userLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
      <Title className="text-center mb-8">{t("role.choose_your_role")}</Title>

      {user?.roles && user?.roles?.length > 0 ? (
        user?.roles.map((i: { _id: string; role: string }) => (
          <Button
            key={i._id}
            type="primary"
            size="large"
            onClick={() => handleRoleChange(i._id)}
            className="w-2/3 bg-green-500 hover:bg-green-600"
            icon={<UserOutlined />}
          >
            {i.role}
          </Button>
        ))
      ) : (
        <div className="w-3/4 mt-5 flex flex-col md:flex-row items-center justify-center gap-6">
          <RoleCard
            title={t("role.parent")}
            description={t("role.parent_description")}
            link="/school"
            icon={<RiParentFill />}
          />
          <RoleCard
            title={t("role.ceo")}
            description={t("role.ceo_description")}
            link="/corporate"
            icon={<RiBriefcaseFill />}
          />
          <RoleCard
            title={t("role.student")}
            description={t("role.student_description")}
            link="/student"
            icon={<RiBookFill />}
          />
        </div>
      )}
    </div>
  );
}
