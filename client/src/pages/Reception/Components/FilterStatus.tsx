import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

interface FilterStatusProps {
  URLStatus: string | null;
  handleFilterStatus: (status: string) => void;
}

const FilterStatus: React.FC<FilterStatusProps> = ({ URLStatus, handleFilterStatus }) => {
  const { t } = useTranslation();
  return (
    <Select
      className="md:w-[250px]"
      placeholder={t("reception.filter.status")}
      onChange={handleFilterStatus}
      value={URLStatus}
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
  );
};

export default FilterStatus;
