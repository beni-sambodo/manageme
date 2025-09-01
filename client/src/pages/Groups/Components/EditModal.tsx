import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import {
  ICourse,
  IEmploye,
  IGRoup,
  IRoom,
  position,
} from "../../../Types/Types";
import { useTranslation } from "react-i18next";
import { useApiGet } from "../../../services/queryConfig";
import roomService from "../../../services/room.service";
import employeesService from "../../../services/employees.service";
import courseService from "../../../services/course.service";
import { useState } from "react";

export default function EditModal({
  handleUpdate,
  // group,
}: {
  handleUpdate: (values: unknown) => Promise<void>;
  group: IGRoup;
}) {
  const { t } = useTranslation(); // Initialize translation
  const [dayPattern, setDayPattern] = useState<string | null>("odd");
  const [selectedDays, setSelectedDays] = useState<string[]>();

  const Rooms = useApiGet(["getRooms"], () => roomService.getRooms());
  const Courses = useApiGet(["getCourses"], () => courseService.getCourses());
  const getInvites = useApiGet(["getInvites"], () =>
    employeesService.getInvites()
  );

  const Teachers = getInvites.data?.filter((employee: IEmploye) =>
    employee.positions?.some((pos: position) => pos.position.type === "TEACHER")
  );
  return (
    <Form
      layout="vertical"
      className="bg-white rounded-lg shadow-lg p-4"
      // initialValues={group}
      onFinish={handleUpdate}
    >
      <Form.Item
        label={t("groupCard.nameLabel")}
        name="name"
        rules={[{ required: true, message: t("groupCard.nameRequired") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("groupCard.roomLabel")}
        name="room"
        rules={[{ required: true, message: t("groupCard.roomRequired") }]}
      >
        <Select
          placeholder={t("groupCard.selectRoom")}
          loading={Rooms.isLoading}
          options={Rooms.data?.map((i: IRoom) => ({
            label: i.name,
            value: i._id,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t("groupCard.teachersLabel")}
        name="teachers"
        rules={[
          {
            required: true,
            message: t("groupCard.teachersRequired"),
          },
        ]}
      >
        <Select
          loading={getInvites.isLoading}
          mode="multiple"
          options={Teachers?.map((t: IEmploye) => ({
            value: t._id,
            label: t.user.name,
          }))}
          placeholder={t("groupCard.selectTeachers")}
        />
      </Form.Item>

      <Form.Item
        label={t("groupCard.levelLabel")}
        name="level"
        rules={[{ required: true, message: t("groupCard.levelRequired") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("groupCard.spaceLabel")}
        name="space"
        rules={[{ required: true, message: t("groupCard.spaceRequired") }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label={t("groupCard.courseLabel")}
        name="course"
        rules={[{ required: true, message: t("groupCard.courseRequired") }]}
      >
        <Select
          loading={Courses.isLoading}
          options={Courses.data?.map((t: ICourse) => ({
            value: t._id,
            label: t.name,
          }))}
          placeholder={t("groupCard.selectCourse")}
        />
      </Form.Item>

      <Form.Item
        label={t("groupCard.startTimeLabel")}
        name="startTime"
        rules={[{ required: true, message: t("groupCard.startTimeRequired") }]}
      >
        <TimePicker format={"HH:mm"} className="w-full" />
      </Form.Item>

      <Form.Item
        label={t("groupCard.endTimeLabel")}
        name="endTime"
        rules={[{ required: true, message: t("groupCard.endTimeRequired") }]}
      >
        <TimePicker format={"HH:mm"} className="w-full" />
      </Form.Item>

      <Form.Item
        label={t("groupCard.startDateLabel")}
        name="startDate"
        rules={[{ required: true, message: t("groupCard.startDateRequired") }]}
      >
        <DatePicker className="w-full" format="DD.MM.YYYY" />
      </Form.Item>

      <Form.Item
        label={t("groupCard.courseDurationLabel")}
        name="courseDuration"
        rules={[
          { required: true, message: t("groupCard.courseDurationRequired") },
        ]}
      >
        <Input
          className="w-full"
          type="number"
          placeholder={t("groupCard.courseDurationPlaceholder")}
        />
      </Form.Item>

      <Form.Item
        label={t("groupCard.dayPatternLabel")}
        name="dayPattern"
        rules={[{ required: true, message: t("groupCard.dayPatternRequired") }]}
      >
        <Select
          className="w-[120px]"
          value={dayPattern}
          onChange={setDayPattern}
          options={[
            { value: "odd", label: t("groupCard.oddDays") },
            { value: "even", label: t("groupCard.evenDays") },
            { value: "custom", label: t("groupCard.customDays") },
          ]}
        />
      </Form.Item>

      {dayPattern === "custom" && (
        <Form.Item label={t("groupCard.selectDaysLabel")} name="selectedDays">
          <Select
            mode="multiple"
            value={selectedDays}
            onChange={setSelectedDays}
            className="w-[150px]"
            options={[
              { value: "mon", label: t("groupCard.monday") },
              { value: "tue", label: t("groupCard.tuesday") },
              { value: "wed", label: t("groupCard.wednesday") },
              { value: "thu", label: t("groupCard.thursday") },
              { value: "fri", label: t("groupCard.friday") },
              { value: "sat", label: t("groupCard.saturday") },
              { value: "sun", label: t("groupCard.sunday") },
            ]}
          />
        </Form.Item>
      )}

      <Form.Item>
        <Button size="large" type="primary" className="mt-4" htmlType="submit">
          {t("groupCard.submit")}
        </Button>
      </Form.Item>
    </Form>
  );
}
