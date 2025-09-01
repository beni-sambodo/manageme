import { Input, Select } from "antd";
import { useTranslation } from "react-i18next";

export default function EmployeFilter() {
  const { t } = useTranslation();
  return (
    <div className="flex gap-5">
      <Input placeholder={t("reception.filter.status")} size="large" allowClear />
      <Select
        placeholder={t("reception.filter.status")}
        //   onChange={handleFilterStatus}
        //   value={URLStatus}
        allowClear
        options={[
          { value: "", label: t("reception.status.all") },
          { value: "NEW", label: t("reception.status.new") },
          { value: "INVIEW", label: t("reception.status.inview") },
          { value: "ACCEPTED", label: t("reception.status.accepted") },
          { value: "CANCELLED", label: t("reception.status.cancelled") },
        ]}
        size="large"
      />
    </div>
  );
}
