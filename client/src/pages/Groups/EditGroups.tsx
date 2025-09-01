import { Breadcrumb } from "antd";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddForm from "./GroupAdd_Components/AddForm";

export default function EditGroups() {
  const { t } = useTranslation(); // Initialize translation
  const { id } = useParams();
  return (
    <div className="w-full relative">
      <Breadcrumb
        items={[
          {
            title: <Link to="/">{t("editGroup.breadcrumb.home")}</Link>,
          },
          {
            title: <Link to="/groups">{t("editGroup.breadcrumb.groups")}</Link>,
          },
          {
            title: t("editGroup.breadcrumb.editGroup"),
          },
        ]}
      />
      <div className="mt-5">
        <h2 className="text-2xl font-bold mb-4">{t("editGroup.form.title")}</h2>
        <div className="flex">
          <AddForm id={id} method={'edit'} />
        </div>
      </div>
    </div>
  );
}
