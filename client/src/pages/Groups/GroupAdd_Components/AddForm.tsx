import { useState, useEffect } from "react";
import { message } from "antd";
import moment from "moment";
import { IGRoup } from "../../../Types/Types";
import { useApiGet, useApiMutation } from "../../../services/queryConfig";
import { Calendar } from "react-multi-date-picker";
import groupService from "../../../services/group.service";
import { useNavigate } from "react-router-dom";
import FormGR from "./Form";
import { useTranslation } from "react-i18next";

const oddWeekdays = ["mon", "wed", "fri"];
const weekDayMap = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 0,
};

const AddForm = ({
  id,
  method,
}: {
  id: string | undefined;
  method?: string;
}) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [groupStart, setGroupStart] = useState<string | null>(null);
  const [groupDuration, setGroupDuration] = useState<number | null>(null);
  const [dayPattern, setDayPattern] = useState<string | null>("odd");
  const [selectedDays, setSelectedDays] = useState<string[]>(oddWeekdays);
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  // const calendarRef = useRef(null);
  const navigate = useNavigate();
  const EGroup = useApiGet(
    ["getGroupById", id],
    () => groupService.getGroupById(id),
    {
      enabled: !!id,
    }
  );

  const createGroup = useApiMutation(
    (value: IGRoup) => groupService.createGroup(value),
    {
      success: () => {
        message.success(t("done")), navigate("/groups");
        localStorage.removeItem("addGroupFormValues");
      },
      error: () => message.error(t("addGroup.failedToChangeRole")),
      invalidateKeys: ["createGroup"],
    }
  );
  const updateGroup = useApiMutation(
    (value: IGRoup) => groupService.updateGroup(id, value),
    {
      success: () => {
        message.success(t("done")), navigate("/groups");
        localStorage.removeItem("addGroupFormValues");
      },
      error: () => message.error(t("addGroup.failedToChangeRole")),
      invalidateKeys: ["updateGroup"],
    }
  );

  useEffect(
    () => generateHighlightedDates(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayPattern, groupStart, groupDuration, selectedDays]
  );
  const generateHighlightedDates = () => {
    if (!groupStart || !groupDuration) return;

    const dates: string[] = [];
    let lessonCount = 0;
    const current = new Date(groupStart);

    while (lessonCount < groupDuration) {
      const dayOfWeek = current.getDay();
      const dayName = Object.keys(weekDayMap).find(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (key) => weekDayMap[key] === dayOfWeek
      );

      if (dayOfWeek !== 0 && dayName && selectedDays.includes(dayName)) {
        dates.push(moment(current).format("YYYY-MM-DD"));
        lessonCount++;
      }
      current.setDate(current.getDate() + 1);
    }
    setHighlightedDates(dates);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (selectedDates: any[]) => {
    const updatedDates = selectedDates.map((date) =>
      date.format ? date.format("YYYY-MM-DD") : date
    );
    setHighlightedDates(updatedDates);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    setSubmitting(true);
    generateHighlightedDates();
    values.startTime = values.startTime.format("HH:mm");
    values.endTime = values.endTime.format("HH:mm");
    values.startDate = moment(values.startDate).format("DD.MM.YYYY");
    values.endDate = highlightedDates[highlightedDates.length - 1];
    values.days = highlightedDates;
    if (values.day_pattern == "custom") {
      values.day_pattern = values.selectedDays;
    }
    if (method == "edit") {
      updateGroup.mutate(values);
    } else {
      createGroup.mutate(values);
    }
    setSubmitting(false);
  };

  return (
    <div className="w-full  gap-5 flex flex-col xl:flex-row">
      <FormGR
        setSelectedDays={setSelectedDays}
        setGroupStart={setGroupStart}
        setDayPattern={setDayPattern}
        handleSubmit={handleSubmit}
        submitting={
          submitting || createGroup.isPending || updateGroup.isPending
        }
        setGroupDuration={setGroupDuration}
        dayPattern={dayPattern}
        selectedDays={selectedDays}
        EGroup={method == "edit" ? EGroup : null}
      />
      <div className="sticky top-0">
        <Calendar
          numberOfMonths={2}
          shadow={false}
          multiple
          value={highlightedDates}
          onChange={handleDateChange}
          weekStartDayIndex={1}
        />
      </div>
    </div>
  );
};

export default AddForm;
