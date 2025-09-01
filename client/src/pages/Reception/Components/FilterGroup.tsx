import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { IGRoup } from '../../../Types/Types';

interface FilterGroupProps {
  URLGroup: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupFetch: any;
  handleFilterGroup: (group: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ URLGroup, groupFetch, handleFilterGroup }) => {
  const { t } = useTranslation();
  return (
    <Select
      className="md:w-[250px]"
      placeholder={t("reception.filter.group")}
      value={URLGroup}
      onChange={handleFilterGroup}
      allowClear
      notFoundContent={t("dashboard.noData")}
      options={groupFetch?.data?.map((group: IGRoup) => ({
        value: group._id,
        label: group?.name,
      }))}
      size="large"
    />
  );
};

export default FilterGroup;
