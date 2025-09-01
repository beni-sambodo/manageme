import {
  Select,
  InputNumber,
  Input,
  DatePicker,
  Form,
  Button,
  Collapse,
  CollapseProps,
} from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment"; // Import moment for DatePicker

interface FilterConfigItem {
  key: string;
  label: string;
  type: "select" | "inputNumber" | "input" | "datePicker" | "timePicker";
  options?: { label: string; value: any }[]; // For select options
}

interface DynamicFilterProps {
  filters: any;
  filterConfig: FilterConfigItem[];
  handleFilterChange: (key: string, value: any) => void;
}

export default function DynamicFilter({
  filters,
  filterConfig,
  handleFilterChange,
}: DynamicFilterProps) {
  const { t } = useTranslation();

  const renderFilterField = (config: FilterConfigItem) => {
    switch (config.type) {
      case "select":
        return (
          <Select
            placeholder={config.label}
            options={config.options}
            allowClear
            value={filters[config.key]} // Changed to value
            onChange={(value) => handleFilterChange(config.key, value)}
            size="large"
            className="w-full"
          />
        );
      case "inputNumber":
        return (
          <InputNumber
            placeholder={config.label}
            value={filters[config.key]} // Changed to value
            onChange={(value) => handleFilterChange(config.key, value)}
            size="large"
            className="w-full"
          />
        );
      case "input":
        return (
          <Input
            placeholder={config.label}
            value={filters[config.key]}
            onChange={(e) => handleFilterChange(config.key, e.target.value)}
            size="large"
            className="w-full"
          />
        );
      case "datePicker":
        return (
          <DatePicker
            value={filters[config.key] ? moment(filters[config.key]) : null} // Handle moment object
            onChange={(date) => handleFilterChange(config.key, date)}
            className="w-full"
            size="large"
          />
        );
      default:
        return null;
    }
  };

  const clearFilters = () => {
    filterConfig.forEach((config) => handleFilterChange(config.key, null));
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: t("course.filtertitle"),
      children: (
        <div>
          <Form layout="vertical" className="w-full grid grid-cols-4 gap-x-4">
            {filterConfig.map((config) => (
              <Form.Item label={config.label} key={config.key}>
                {renderFilterField(config)}
              </Form.Item>
            ))}
          </Form>
          <Button onClick={clearFilters} size="large" danger>
            {t("clearFilter")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Collapse className="bg-white mt-4" items={items} defaultActiveKey={[]} />
  );
}
