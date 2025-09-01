/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Table } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { CgClose } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AttendanceTableProps = {
  selectedDay: any;
  attendanceDetails: any;
  isLessonStarted: (arg0: string) => boolean;
  fetchAttendanceDetails: () => void;
  handleAttendance: (id: string, status: string) => void;
  clicked: string;
  loading: boolean;
  setClicked: Dispatch<SetStateAction<string>>;
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  selectedDay,
  isLessonStarted,
  attendanceDetails,
  loading,
  handleAttendance,
  clicked,
  setClicked,
}) => {
  const { t } = useTranslation();
  const [lessonEnd] = useState<boolean>(attendanceDetails?.end);
  const handleCenter = (id: string) => {
    if (!lessonEnd && clicked !== id) {
      setClicked(id);
    } else {
      setClicked("");
    }
  };
  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
    },
    {
      title: t("studentName"),
      dataIndex: "name",
      key: "name",
      render: (
        _: string,
        record: {
          student: { name: string; username: string; _id: string };
        }
      ) => (
        <Link to={"/dashboard/user/" + record.student.username}>
          {record.student.name} | {record.student.username}
        </Link>
      ),
    },
    {
      title: t("status"),
      key: "status",
      align: "center",
      render: (
        _: string,
        record: {
          comment: string;
          status: string;
          _id: string;
        }
      ) =>
        isLessonStarted(selectedDay.date) ? (
          <div className="relative flex items-center justify-center">
            <div className="flex justify-center items-center">
              {/* ATTENDED button */}
              <button
                disabled={lessonEnd || record.status === "ATTENDED"}
                className={`rounded-full w-7 aspect-square flex items-center justify-center
    ${record.status === "ATTENDED" ? "z-50 bg-green-300" : "z-0 bg-green-300"}
    ${record._id === clicked ? "-translate-x-1.5" : "translate-x-7"}
    duration-200`}
                onClick={() => handleAttendance(record._id, "ATTENDED")}
              >
                <CheckCircleOutlined />
              </button>

              {/* CENTER button */}
              <button
                disabled={lessonEnd}
                onClick={() => handleCenter(record._id)}
                className={`w-7 aspect-square cursor-pointer bg-gray-200 rounded-full
    ${record.status === "NOT_SELECTED" ? "z-10" : "z-0"}`}
              />

              {/* NOT ATTENDED button */}
              <button
                disabled={lessonEnd || record.status === "NOT_ATTENDED"}
                className={`rounded-full w-7 aspect-square flex items-center justify-center
    ${record.status === "NOT_ATTENDED" ? "z-50 bg-red-300" : "z-0 bg-red-300"}
    ${record._id === clicked ? "translate-x-1.5" : "-translate-x-7"}
    duration-200`}
                onClick={() => handleAttendance(record._id, "NOT_ATTENDED")}
              >
                <CloseCircleOutlined />
              </button>
            </div>

            {!lessonEnd && record.status !== "NOT_SELECTED" && (
              <div className="absolute top-0 z-50 w-full h-5">
                <button
                  onClick={() => handleAttendance(record._id, "NOT_SELECTED")}
                  className="-top-2 border bg-cyan-800 text-white rounded-full text-sm absolute"
                >
                  <CgClose />
                </button>
              </div>
            )}
          </div>
        ) : (
          <span>{t("accessClosed")}</span>
        ),
    },
  ];

  const dataSource = useMemo(
    () =>
      attendanceDetails?.students.map(
        (student: { _id: any }, index: number) => ({
          ...student,
          key: student._id,
          index: index + 1,
        })
      ),
    [attendanceDetails]
  );

  return (
    <Table
      dataSource={dataSource}
      loading={loading}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      columns={columns}
      pagination={false}
      className={`${!selectedDay?.attendance && "blur-sm pointer-events-none"}`}
    />
  );
};

export default AttendanceTable;
