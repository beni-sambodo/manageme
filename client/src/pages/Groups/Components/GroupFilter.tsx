import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

interface GroupFilterProps {
  status: string | null;
  onChange: (status: string) => void;
}

const GroupFilter: React.FC<GroupFilterProps> = ({ status, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <Select
      placeholder={t("groups.filterPlaceholder")}
      className="w-full md:w-44 mt-4"
      value={status}
      onChange={onChange}
      size="large"
      options={[
        { value: '', label: t("groups.statusOptions.all") },
        { value: "new", label: t("groups.statusOptions.new") },
        { value: "inview", label: t("groups.statusOptions.inview") },
        { value: "waiting", label: t("groups.statusOptions.waiting") },
        { value: "freezed", label: t("groups.statusOptions.freezed") },
      ]}
    />
  );
};

export default GroupFilter;
