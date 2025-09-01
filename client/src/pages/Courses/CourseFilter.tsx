import {
  Select,
  InputNumber,
  Input,
  Form,
  Button,
  Collapse,
  CollapseProps,
} from "antd";
import { useTranslation } from "react-i18next";

import { useApiGet } from "../../services/queryConfig";
import courseService from "../../services/course.service";

interface prop {
  handleFilterChange: any;
  filters: any;
}

export default function CourseFilter({ handleFilterChange, filters }: prop) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const CourseCategory = useApiGet(["getCourseCategories"], () =>
    courseService.getCourseCategories()
  );

  const courseCOptions = CourseCategory.data?.map(
    (c: { name: any; _id: any }) => ({
      label: c.name,
      value: c._id,
    })
  );
  const clearFilters = () => {
    form.setFieldsValue({
      category: undefined,
      minDuration: undefined,
      maxDuration: undefined,
      type: undefined,
      name: "",
      priceMin: undefined,
      priceMax: undefined,
    });
    handleFilterChange("clear", {});
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: t("course.filtertitle"),
      children: (
        <>
          <Form
            form={form}
            layout="vertical"
            initialValues={filters}
            className="w-full grid md:grid-cols-4 2xl:grid-cols-5 gap-x-4"
          >
            <Form.Item label={t("course.filterCategory")} name="category">
              <Select
                placeholder={t("course.filterCategory")}
                size="large"
                allowClear
                loading={CourseCategory.isLoading}
                options={courseCOptions}
                onChange={(value) => handleFilterChange("category", value)}
              />
            </Form.Item>

            {/* Min and Max Duration Inputs */}
            <Form.Item label={t("course.filterDurationMin")} name="minDuration">
              <InputNumber
                placeholder={t("course.filterDurationMin")}
                className="w-full"
                size="large"
                onChange={(value) => handleFilterChange("minDuration", value)}
              />
            </Form.Item>

            <Form.Item label={t("course.filterDurationMax")} name="maxDuration">
              <InputNumber
                placeholder={t("course.filterDurationMax")}
                size="large"
                className="w-full"
                onChange={(value) => handleFilterChange("maxDuration", value)}
              />
            </Form.Item>

            <Form.Item label={t("course.filterType")} name="type">
              <Select
                placeholder={t("course.filterType")}
                allowClear
                size="large"
                onChange={(value) => handleFilterChange("type", value)}
                className="w-full"
                options={[
                  { label: t("course.typeOnline"), value: "online" },
                  { label: t("course.typeOffline"), value: "offline" },
                ]}
              />
            </Form.Item>

            <Form.Item label={t("course.filterName")} name="name">
              <Input
                placeholder={t("course.filterName")}
                className="w-full"
                size="large"
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </Form.Item>

            <Form.Item label={t("course.filterPriceMin")} name="priceMin">
              <InputNumber
                placeholder={t("course.filterPriceMin")}
                className="w-full"
                size="large"
                onChange={(value) => handleFilterChange("priceMin", value)}
              />
            </Form.Item>
            <Form.Item label={t("course.filterPriceMax")} name="priceMax">
              <InputNumber
                placeholder={t("course.filterPriceMax")}
                size="large"
                className="w-full"
                onChange={(value) => handleFilterChange("priceMax", value)}
              />
            </Form.Item>
          </Form>
          <Button onClick={clearFilters} size="large" danger>
            {t("course.clearFilters")}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="w-full mt-4">
      <Collapse
        className="bg-white"
        items={items}
        defaultActiveKey={[]}
      ></Collapse>
    </div>
  );
}
