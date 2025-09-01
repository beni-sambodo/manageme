import { Form, Input, Select, Button, InputNumber, message, Checkbox } from "antd";
import {
  ICategory,
  ICourse,
  IEmploye,
  IRoom,
  position,
} from "../../Types/Types";
import { useApiGet, useApiMutation } from "../../services/queryConfig";
import courseService from "../../services/course.service";
import employeesService from "../../services/employees.service";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import ImageUpload from "../../components/ImgUpload";
import roomService from "../../services/room.service";
import { useTranslation } from "react-i18next";

const { Option } = Select;

export default function AddCourse() {
  const { t } = useTranslation();
  const Categories = useApiGet(["getCourseCategories"], () =>
    courseService.getCourseCategories()
  );
  const [imageId, setImageId] = useState<string>("");

  const [form] = useForm();
  useEffect(() => {
    const savedValues = localStorage.getItem("addStudentFormValues");
    if (savedValues) {
      form.setFieldsValue(JSON.parse(savedValues));
    }
  }, [form]);
  const rooms = useApiGet(["getRooms"], () => roomService.getRooms());

  const navigate = useNavigate();
  const createCourse = useApiMutation(
    (values: any) => courseService.createCourse(values),
    {
      success: () => {
        message.success("Course created successfully");
        navigate("/dashboard/courses");
        localStorage.removeItem("addCourseFormValues");
      },
      error: () => {
        message.error("Failed to create course");
      },
      invalidateKeys: ["createCourse"],
    }
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValuesChange = (_: string, allValues: any) => {
    localStorage.setItem("addCourseFormValues", JSON.stringify(allValues));
  };
  const handleUploadSuccess = (imageId: string) => {
    setImageId(imageId);
    message.success(`Image uploaded with ID: ${imageId}`);
  };
  const getInvites = useApiGet(["getInvites"], () =>
    employeesService.getInvites()
  );
  const Teachers = getInvites.data?.filter((employee: IEmploye) =>
    employee.positions?.some((pos: position) => pos.position.type === "TEACHER")
  );

  const onFinish = (values: ICourse) => {
    const v = {
      ...values, // Include all form values
      image: imageId, // Add the image ID to the form values
    };
    createCourse.mutate(v);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 rounded-xl ">{t("AddCourse")}</h2>
      <Form
        layout="vertical"
        form={form}
        name="Add-course"
        onValuesChange={handleValuesChange}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className="bg-white md:w-1/2 p-6 rounded-lg shadow-lg"
      >
        <Form.Item
          name="image"
          label={t("Image")}
          extra={t("PleaseUploadYourPhoto")}
        >
          <ImageUpload type="course" onUploadSuccess={handleUploadSuccess} />
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
          label={t("Room")}
          name="room"
          rules={[{ required: true, message: t("PleaseSelectRoom") }]}
        >
          <Select
            loading={rooms.isLoading}
            mode="multiple"
            options={rooms.data?.map((t: IRoom) => ({
              value: t._id,
              label: (
                <div>
                  {t.name} - {t.number}
                </div>
              ),
            }))}
            placeholder={t("SelectRooms")}
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
            addonAfter={"oy"}
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
            addonAfter={"so'm"}
            type="number"
            placeholder={t("Price")}
          />
        </Form.Item>
        <Form.Item
          name="isPublic"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox>{t('Public')}</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            loading={createCourse.isPending}
            type="primary"
            htmlType="submit"
          >
            {t("Submit")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
