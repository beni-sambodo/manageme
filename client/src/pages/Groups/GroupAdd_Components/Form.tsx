import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  TimePicker,
} from "antd";
import {
  ICourse,
  IEmploye,
  IGRoup,
  IRoom,
  Teacher,
  position,
} from "../../../Types/Types";
import { useApiGet } from "../../../services/queryConfig";
import roomService from "../../../services/room.service";
import courseService from "../../../services/course.service";
import employeesService from "../../../services/employees.service";
import { Dispatch, SetStateAction, useEffect } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import moment from "moment";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const oddWeekdays = ["mon", "wed", "fri"];
const evenWeekdays = ["tue", "thu", "sat"];

interface Props {
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
  setGroupStart: Dispatch<SetStateAction<string | null>>;
  setDayPattern: Dispatch<SetStateAction<string | null>>;
  handleSubmit: (values: IGRoup) => void;
  submitting: boolean;
  setGroupDuration: Dispatch<SetStateAction<number | null>>;
  dayPattern: string | null;
  selectedDays: string[];
  EGroup: UseQueryResult<IGRoup | null, unknown> | null;
}

export default function FormGR({
  setSelectedDays,
  setGroupStart,
  setDayPattern,
  handleSubmit,
  submitting,
  setGroupDuration,
  dayPattern,
  selectedDays,
  EGroup,
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const Rooms = useApiGet(["getRooms"], roomService.getRooms);
  const Courses = useApiGet(["getCourses"], courseService.getCourses);
  const getInvites = useApiGet(["getInvites"], employeesService.getInvites);
  const handleStartDateChange = (date: null | moment.Moment) => {
    if (date) setGroupStart(date.format("YYYY-MM-DD"));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupDuration(parseInt(e.target.value, 10));
  };

  const handleDayPatternChange = (value: string) => {
    setDayPattern(value);
    if (value === "odd") setSelectedDays(oddWeekdays);
    else if (value === "even") setSelectedDays(evenWeekdays);
  };

  const handleSelectedDaysChange = (value: string[]) => {
    setSelectedDays(value);
  };

  const Teachers = getInvites.data?.filter((employee: IEmploye) =>
    employee.positions?.some((pos: position) => pos?.position?.type === "TEACHER")
  );

  useEffect(() => {
    if (EGroup && EGroup.data && !EGroup.isLoading) {
      const init = {
        name: EGroup.data.name,
        room: EGroup.data.room?._id,
        teachers: EGroup.data.teachers?.map((t: Teacher) => t._id),
        level: EGroup.data.level,
        space: EGroup.data.space,
        course: EGroup.data.course?._id,
        startTime: moment(EGroup.data.startTime, "HH:mm"),
        endTime: moment(EGroup.data.endTime, "HH:mm"),
        startDate: dayjs(EGroup.data.startDate),
        day_pattern:
          EGroup?.data?.day_pattern?.[0] !== "even" &&
            EGroup?.data?.day_pattern?.[0] !== "odd"
            ? "custom"
            : EGroup.data.day_pattern || dayPattern,
        courseDuration: EGroup?.data?.days?.length,
      };

      if (
        EGroup.data?.day_pattern?.[0] !== "even" &&
        EGroup.data?.day_pattern?.[0] !== "odd"
      ) {
        // form.setFieldValue('selectedDays', EGroup.data.day_pattern);
        setSelectedDays(EGroup.data?.day_pattern)
        setDayPattern('custom');
      }

      form.setFieldsValue(init);
    }
  }, [EGroup, form, dayPattern]);

  if (EGroup?.isLoading) {
    return (
      <div className="xl:w-1/2 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form
      layout="vertical"
      className="bg-white rounded-lg shadow-lg p-4 xl:w-1/2"
      form={form}
      onFinish={handleSubmit}
    >
      <div className="md:grid grid-cols-2 md:gap-x-4">
        <Form.Item
          label={t("groupForm.name")}
          name="name"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseInput")} ${t("groupForm.name")}!`,
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t("groupForm.room")}
          name="room"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseSelect")} ${t("groupForm.room")}!`,
            },
          ]}
        >
          <Select
            size="large"
            placeholder={t("groupForm.room")}
            loading={Rooms.isLoading}
            options={Rooms.data?.map((i: IRoom) => ({
              label: i.name,
              value: i._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={t("groupForm.teachers")}
          name="teachers"
          rules={[
            {
              required: true,
              message: t("groupForm.pleaseSelectAtLeastOneTeacher"),
            },
          ]}
        >
          <Select
            size="large"
            loading={getInvites.isLoading}
            mode="multiple"
            options={Teachers?.map((t: IEmploye) => ({
              value: t.user._id,
              label: `${t.user.name} ${t.user.surname ? t.user.surname : ''}`,
            }))}
            placeholder={t("groupForm.teachers")}
          />
        </Form.Item>

        <Form.Item
          label={t("groupForm.level")}
          name="level"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseSelect")} ${t("groupForm.level")}!`,
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t("groupForm.space")}
          name="space"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseInput")} ${t("groupForm.space")}!`,
            },
          ]}
        >
          <Input size="large" type="number" />
        </Form.Item>

        <Form.Item
          label={t("groupForm.course")}
          name="course"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseSelect")} ${t("groupForm.course")}!`,
            },
          ]}
        >
          <Select
            size="large"
            loading={Courses.isLoading}
            options={Courses.data?.datas?.map((t: ICourse) => ({
              value: t._id,
              label: t.name,
            }))}
            placeholder={t("groupForm.course")}
          />
        </Form.Item>

        <Form.Item
          label={t("groupForm.startTime")}
          name="startTime"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseSelect")} ${t("groupForm.startTime")}!`,
            },
          ]}
        >
          <TimePicker size="large" className="w-full" needConfirm={false} format="HH:mm" />
        </Form.Item>

        <Form.Item
          label={t("groupForm.endTime")}
          name="endTime"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseSelect")} ${t("groupForm.endTime")}!`,
            },
          ]}
        >
          <TimePicker size="large" needConfirm={false} className="w-full" format="HH:mm" />
        </Form.Item>

        <Form.Item
          label={t("groupForm.startDate")}
          name="startDate"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseSelect")} ${t("groupForm.startDate")}!`,
            },
          ]}
        >
          <DatePicker
            size="large"
            className="w-full"
            onChange={handleStartDateChange}
            format="DD.MM.YYYY"
          />
        </Form.Item>

        <Form.Item
          label={t("groupForm.courseDuration")}
          name="courseDuration"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseInput")} ${t("groupForm.courseDuration")}!`,
            },
          ]}
        >
          <Input
            size="large"
            className="w-full"
            type="number"
            onChange={handleDurationChange}
            placeholder={t("groupForm.courseDuration")}
          />
        </Form.Item>

        <Form.Item
          label={t("groupForm.dayPattern")}
          name="day_pattern"
          rules={[
            {
              required: true,
              message: `${t("groupForm.pleaseSelect")} ${t("groupForm.dayPattern")}!`,
            },
          ]}
        >
          <Select
            size="large"
            onChange={handleDayPatternChange}
            className="w-[120px]"
            options={[
              { value: "odd", label: t("groupForm.oddDays") },
              { value: "even", label: t("groupForm.evenDays") },
              { value: "custom", label: t("groupForm.customDays") },
            ]}
          />
        </Form.Item>

        {dayPattern === "custom" && (
          <Form.Item label={t("groupForm.selectDays")} name="selectedDays">
            <Select
              size="large"
              mode="multiple"
              value={selectedDays}
              onChange={handleSelectedDaysChange}
              className="w-[150px]"
              options={[
                { value: "mon", label: t("groupForm.monday") },
                { value: "tue", label: t("groupForm.tuesday") },
                { value: "wed", label: t("groupForm.wednesday") },
                { value: "thu", label: t("groupForm.thursday") },
                { value: "fri", label: t("groupForm.friday") },
                { value: "sat", label: t("groupForm.saturday") },
                { value: "sun", label: t("groupForm.sunday") },
              ]}
            />
          </Form.Item>
        )}
      </div>
      <Form.Item>
        <Button
          size="large"
          type="primary"
          className="mt-4"
          htmlType="submit"
          loading={submitting}
        >
          {t("groupForm.submit")}
        </Button>
      </Form.Item>
    </Form>
  );
}
