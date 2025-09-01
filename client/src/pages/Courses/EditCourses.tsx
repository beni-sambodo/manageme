import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  message,
  Spin,
  Checkbox,
} from "antd";
import { ICategory, ICourse, IEmploye, position } from "../../Types/Types";
import { useApiGet, useApiMutation } from "../../services/queryConfig";
import courseService from "../../services/course.service";
import employeesService from "../../services/employees.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUpload from "../../components/ImgUpload";

const { Option } = Select;

interface EditCourseProps {
  Course: ICourse;
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

interface FormValues {
  name: string;
  category: string;
  type: string[];
  duration: number;
  teachers: string[];
  price: number;
  isPublic: boolean;
}

const EditCourse = ({
  Course,
  setIsEditModalVisible,
  refetch,
}: EditCourseProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [imageId, setImageId] = useState<string>(Course?.image?._id);

  // Mutation for editing the course
  const editCourse = useApiMutation(
    (values: FormValues) => courseService.editCourse(Course._id, values),
    {
      onSuccess: () => {
        message.success(t("CourseUpdatedSuccessfully"));
        refetch();
        setImageId('');
        setIsEditModalVisible(false);
      },
      onError: () => {
        message.error(t("FailedToUpdateCourse"));
        setIsEditModalVisible(false);
      },
    }
  );

  // Fetch teachers who are employees with the position of "TEACHER"
  const getInvites = useApiGet(["getInvites"], employeesService.getInvites);
  const Categories = useApiGet(
    ["getCourseCategories"],
    courseService.getCourseCategories
  );

  const Teachers = getInvites.data?.filter((employee: IEmploye) =>
    employee.positions?.some((pos: position) => pos.position.type === "TEACHER")
  );
  const handleUploadSuccess = (image: string) => {
    setImageId(image);
    message.success(`Image uploaded with ID: ${image}`);
  };
  // Initial form values based on the current course data
  const initialValues: FormValues = {
    name: Course?.name,
    category: Course.category?._id,
    type: Course?.type,
    duration: Course?.duration,
    teachers: Course.teachers.map((t) => t?._id),
    price: Course?.price,
    isPublic: typeof Course.isPublic === 'boolean' ? Course.isPublic : false,
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [Course, form]);

  // Handle form submission
  const onFinish = (values: FormValues) => {
    const v = {
      ...values,
      image: imageId,
    };
    editCourse.mutate(v);
  };

  if (getInvites.isLoading || Categories.isLoading) {
    return <Spin />;
  }

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="image"
        label={t("Image")}
        extra={t("PleaseUploadYourPhoto")}
      >
        <ImageUpload
          type="course"
          initialImages={Course?.image}
          onUploadSuccess={handleUploadSuccess}
        />
      </Form.Item>
      <Form.Item
        label={t("CourseName")}
        name="name"
        rules={[{ required: true, message: t("PleaseInputCourseName") }]}
      >
        <Input placeholder={t("CourseName")} />
      </Form.Item>

      <Form.Item
        label={t("Category")}
        name="category"
        rules={[{ required: true, message: t("PleaseSelectCategory") }]}
      >
        <Select
          className="capitalize"
          loading={Categories.isLoading}
          placeholder={t("SelectCategory")}
          options={Categories.data?.map((c: ICategory) => ({
            value: c._id,
            label: c.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t("Type")}
        name="type"
        rules={[{ required: true, message: t("PleaseSelectType") }]}
      >
        <Select mode="multiple" placeholder={t("SelectType")}>
          <Option value="OFFLINE">{t("OFFLINE")}</Option>
          <Option value="ONLINE">{t("ONLINE")}</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t("Teachers")}
        name="teachers"
        rules={[{ required: true, message: t("PleaseSelectTeacher") }]}
      >
        <Select
          loading={getInvites.isLoading}
          mode="multiple"
          options={Teachers?.map((t: IEmploye) => ({
            value: t._id,
            label: t.user.name,
          }))}
          placeholder={t("SelectTeachers")}
        />
      </Form.Item>

      <Form.Item
        label={t("Duration")}
        name="duration"
        rules={[{ required: true, message: t("PleaseInputDuration") }]}
      >
        <InputNumber
          className="w-full"
          controls={false}
          addonAfter={t("Month")}
          type="number"
          placeholder={t("Duration")}
        />
      </Form.Item>

      <Form.Item
        label={t("Price")}
        name="price"
        rules={[{ required: true, message: t("PleaseInputPrice") }]}
      >
        <InputNumber
          className="w-full"
          controls={false}
          addonAfter={t("payment.modal.currency")}
          placeholder={t("Price")}
        />
      </Form.Item>

      <Form.Item
        label={t("IsPublic")}
        name="isPublic"
        valuePropName="checked"
      >
        <Checkbox>{t("Public")}</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button loading={editCourse.isPending} type="primary" htmlType="submit">
          {t("Submit")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCourse;
