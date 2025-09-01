import React, { useState, useMemo } from "react";
import { Select, message, Button, Modal, Tabs } from "antd";
import moment from "moment";
import "tailwindcss/tailwind.css";
import { IGRoup } from "../../Types/Types";
import attandanceService from "../../services/attandance.service";
import { useApiGet, useApiMutation } from "../../services/queryConfig";
import { CgLock } from "react-icons/cg";
import { getTodayOrFirstDate } from "../../utility/attandace";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceModal from "./components/AttendanceModal";
import MonthlyAttendance from "./components/MonthlyAttendance";
import JournalAttendance from "./components/JournalAttendance";
import { useTranslation } from "react-i18next";

const { Option } = Select;

type AttendanceProps = {
  data: IGRoup;
  refetch: () => void;
  isLoading: boolean;
};

interface IType {
  attendance: string;
  id: string;
  status: string;
  comment: string;
}

const Attendance: React.FC<AttendanceProps> = ({
  data,
  refetch,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [loadingA, setLoadingA] = useState<boolean>(isLoading);
  const [selectedDayId, setSelectedDayId] = useState<string>(
    getTodayOrFirstDate(data.days)
  );
  const [activeTab, setActiveTab] = useState<string>("daily");
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format("YYYY-MM"));

  const selectedDay: { _id: string; attendance: string | null; date: string } =
    useMemo(
      () => data.days.find((day) => day._id === selectedDayId) || data.days[0],
      [selectedDayId, data.days]
    );

  const attendanceIdForApi = useMemo(() => {
    if (!selectedDay?.attendance) {
      return null;
    }
    if (typeof selectedDay.attendance === 'object' && selectedDay.attendance !== null && '_id' in selectedDay.attendance) {
      return (selectedDay.attendance as { _id: string })._id;
    }
    if (typeof selectedDay.attendance === 'string') {
      return selectedDay.attendance;
    }
    console.warn("Unexpected type for selectedDay.attendance:", selectedDay.attendance);
    return null;
  }, [selectedDay?.attendance]);

  const { data: attendanceDetails, refetch: fetchAttendanceDetails } =
    useApiGet(
      ["getAttendanceById", attendanceIdForApi],
      () =>
        attendanceIdForApi
          ? attandanceService.getAttendanceById(attendanceIdForApi)
          : undefined,
      {
        enabled: !!attendanceIdForApi,
      }
    );

  const { data: monthlyAttendanceData, isLoading: monthlyLoading } = useApiGet(
    ["getMonthlyAttendance", data._id, selectedMonth],
    () => attandanceService.getMonthlyAttendance(data._id, selectedMonth),
    {
      enabled: activeTab === "monthly",
    }
  );
  const [isEndLessonModalVisible, setIsEndLessonModalVisible] = useState(false);
  const [isEndMonthModalVisible, setIsEndMonthModalVisible] = useState(false);
  const [clicked, setClicked] = useState<string>("");

  const isLessonStarted = (date: string) =>
    moment().isSameOrAfter(moment(date));
  const handleEndMonthOk = async () => {
    if (!selectedDay.attendance) {
      message.error("No attendance record found for the selected day.");
      setIsEndMonthModalVisible(false);
      return;
    }

    try {
      await endGroup.mutate();
    } catch (error) {
      message.error("Error ending the month.");
    } finally {
      setIsEndMonthModalVisible(false);
    }
  };

  const handleAttendance = async (id: string, status: string) => {
    const attandID = selectedDay ? selectedDay.attendance : null;
    if (!attandID) {
      message.error("Error: Attendance ID not found");
      return;
    }

    const attendanceData = {
      attendance: attandID,
      id,
      status,
      comment: "",
    };

    if (status === "NOT_ATTENDED") {
      setSelectedStudent(id);
      setIsModalVisible(true);
    } else {
      try {
        setLoadingA(true);
        await attandanceService.attand(attendanceData);
        message.success("Attendance recorded successfully");
        setClicked("");
      } catch (error) {
        setLoadingA(false);
        message.error(`Error recording attendance`);
      } finally {
        setLoadingA(false);
        fetchAttendanceDetails();
      }
    }
  };

  const handleOk = async () => {
    if (!selectedStudent) return;

    const attandID = selectedDay ? selectedDay.attendance : null;
    if (!attandID) {
      message.error("Error: Attendance ID not found");
      return;
    }

    const comment = reason == "Другое" ? customReason : reason;
    const attendanceData: IType = {
      attendance: attandID,
      id: selectedStudent,
      status: reason == "NO_REASON" ? "NOT_ATTENDED" : "KNOWN",
      comment,
    };

    setLoading(true);
    try {
      await attandanceService.attand(attendanceData);
      setIsModalVisible(false);
      setReason("");
      setClicked("");
      setCustomReason("");
      message.success("Attendance recorded successfully");
    } catch (error) {
      message.error("Error recording attendance");
    } finally {
      fetchAttendanceDetails();
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setReason("");
    setCustomReason("");
  };

  const handleCreateAttendance = async () => {
    if (!selectedDay) {
      message.error("Selected day not found in schedule.");
      return;
    }
    const value = { group: data._id, day: selectedDay._id };
    await create.mutate(value);
  };

  const handleDayChange = (value: string) => {
    setSelectedDayId(value);
  };

  const create = useApiMutation(
    (value: { day: string; group: string }) => attandanceService.create(value),
    {
      onSuccess: () => {
        message.success("Attendance created successfully.");
        refetch();
      },
      onError: () => message.error(`Error creating attendance`),
    }
  );

  const end = useApiMutation((id: string) => attandanceService.end(id), {
    onSuccess: () => {
      fetchAttendanceDetails();
      message.success("Lesson ended successfully.");
    },
    onError: () => message.error(`Error ending the lesson`),
  });

  const endGroup = useApiMutation(() => attandanceService.endGroup(data._id), {
    onSuccess: () => {
      message.success("Month ended successfully.");
    },
    onError: () => message.error(`Error ending the month`),
  });

  const handleEndLessonOk = async () => {
    if (!attendanceIdForApi) {
      message.error("No attendance record found for the selected day.");
      setIsEndLessonModalVisible(false);
      return;
    }

    try {
      await end.mutate(attendanceIdForApi);
    } catch (error) {
      message.error("Error ending the lesson.");
    } finally {
      setIsEndLessonModalVisible(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          {
            key: "daily",
            label: t("groupPage.dailyAttendance"),
            children: (
              <>
                <div className="flex justify-between items-center mb-4">
                  <Select
                    value={selectedDayId}
                    onChange={handleDayChange}
                    style={{ width: 200 }}
                  >
                    {data.days
                      .filter((day) => moment(day.date).isSameOrBefore(moment(), "day"))
                      .map((day) => (
                        <Option key={day._id} value={day._id}>
                          {moment(day.date).format("DD MMM YYYY")}
                        </Option>
                      ))}
                  </Select>
                  <Button
                    loading={end.isPending}
                    disabled={
                      !attendanceDetails ||
                      attendanceDetails?.end ||
                      !isLessonStarted(selectedDay.date)
                    }
                    onClick={() => setIsEndLessonModalVisible(true)}
                    type="primary"
                  >
                    {t("finishLesson")}
                  </Button>
                </div>
                <div className="relative">
                  {!selectedDay?.attendance && (
                    <div className="flex justify-center items-center absolute inset-0 z-[999]">
                      <Button
                        className="w-fit flex items-center gap-2"
                        type="primary"
                        disabled={
                          (data.students.length == 0 && !isLoading) ||
                          !isLessonStarted(selectedDay.date)
                        }
                        loading={create.isPending}
                        onClick={handleCreateAttendance}
                      >
                        {t("createAttendance")} <CgLock />
                      </Button>
                    </div>
                  )}
                  <AttendanceTable
                    selectedDay={selectedDay}
                    isLessonStarted={isLessonStarted}
                    attendanceDetails={attendanceDetails}
                    fetchAttendanceDetails={fetchAttendanceDetails}
                    handleAttendance={handleAttendance}
                    loading={loadingA}
                    clicked={clicked}
                    setClicked={setClicked}
                  />
                </div>
              </>
            ),
          },
          {
            key: "monthly",
            label: t("monthlyAttendance"),
            children: (
              <div className="mt-4">
                <MonthlyAttendance
                  attendanceData={monthlyAttendanceData}
                  loading={monthlyLoading}
                  onMonthChange={(month) => {
                    setSelectedMonth(month);
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    type="primary"
                    onClick={() => setIsEndMonthModalVisible(true)}
                  >
                    {t("endMonth")}
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: "journal",
            label: t("groupPage.journalAttendance"),
            children: (
              <div className="mt-4">
                <JournalAttendance
                  attendanceData={monthlyAttendanceData}
                  loading={monthlyLoading}
                  onMonthChange={(month) => {
                    setSelectedMonth(month);
                  }}
                />
              </div>
            ),
          },
        ]}
      />
      <AttendanceModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        reason={reason}
        setReason={setReason}
        customReason={customReason}
        setCustomReason={setCustomReason}
        loading={loading}
      />
      <Modal
        title={t("endLessonConfirmation")}
        open={isEndLessonModalVisible}
        onOk={handleEndLessonOk}
        onCancel={() => setIsEndLessonModalVisible(false)}
        okText={t("end")}
        cancelText={t("cancel")}
      >
        <p>{t("endLessonConfirmation")}</p>
      </Modal>
      <Modal
        title={t("endMonthConfirmation")}
        open={isEndMonthModalVisible}
        onOk={handleEndMonthOk}
        onCancel={() => setIsEndMonthModalVisible(false)}
        okText={t("end")}
        cancelText={t("cancel")}
      >
        <p>{t("endMonthConfirmation")}</p>
      </Modal>
    </div>
  );
};

export default Attendance;
