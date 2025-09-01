import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddForm from "./GroupAdd_Components/AddForm";

export default function AddGroup() {
  const { t } = useTranslation();

  return (
    <div className="w-full relative">
      <Breadcrumb
        items={[
          {
            title: <Link to="/dashboard">{t("addGroup.breadcrumb.home")}</Link>,
          },
          {
            title: <Link to="/dashboard/groups">{t("addGroup.breadcrumb.groups")}</Link>,
          },
          {
            title: t("addGroup.breadcrumb.addGroup"),
          },
        ]}
      />
      <div className="mt-5">
        <h2 className="text-2xl font-bold mb-4">{t("addGroup.form.title")}</h2>
        <div className="flex">
          <AddForm id={undefined} method="add" />
        </div>
      </div>
    </div>
  );
}
