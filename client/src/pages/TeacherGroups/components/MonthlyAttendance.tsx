"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Table, Tag, Select } from "antd"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import moment from "moment"

type MonthlyAttendanceProps = {
  attendanceData: any
  loading: boolean
  onMonthChange?: (month: string) => void
}

const MonthlyAttendance: React.FC<MonthlyAttendanceProps> = ({ attendanceData, loading, onMonthChange }) => {
  const { t } = useTranslation()
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format("YYYY-MM"))

  const monthOptions = useMemo(() => {
    const options = []
    for (let i = 0; i < 12; i++) {
      const monthDate = moment().subtract(i, "months")
      options.push({
        value: monthDate.format("YYYY-MM"),
        label: monthDate.format("MMMM YYYY"),
      })
    }
    return options
  }, [])

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    if (onMonthChange) {
      onMonthChange(value)
    }
  }

  // Process attendance data - simplified
  const processedData = useMemo(() => {
    if (!attendanceData || !attendanceData.students) return []

    return attendanceData.students.map((student: any, index: number) => {
      const attended = student.monthlyAttendance?.filter((a: any) => a.status === "ATTENDED").length || 0
      const notAttended = student.monthlyAttendance?.filter((a: any) => a.status === "NOT_ATTENDED").length || 0
      const known = student.monthlyAttendance?.filter((a: any) => a.status === "KNOWN").length || 0
      const total = student.monthlyAttendance?.length || 0
      const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0

      return {
        ...student,
        key: student._id,
        index: index + 1,
        attended,
        notAttended,
        known,
        total,
        attendanceRate,
      }
    })
  }, [attendanceData])

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "green"
    if (rate >= 70) return "orange"
    return "red"
  }

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      width: 40,
    },
    {
      title: t("studentName"),
      key: "name",
      width: 180,
      render: (_: string, record: any) => (
        <Link to={`/dashboard/user/${record.student.username}`}>
          {record.student.name} | {record.student.username}
        </Link>
      ),
    },
    {
      title: "✓",
      dataIndex: "attended",
      key: "attended",
      width: 50,
      align: "center" as const,
      render: (attended: number) => <Tag color="green">{attended}</Tag>,
    },
    {
      title: "✗",
      dataIndex: "notAttended",
      key: "notAttended",
      width: 50,
      align: "center" as const,
      render: (notAttended: number) => <Tag color="red">{notAttended}</Tag>,
    },
    {
      title: "!",
      dataIndex: "known",
      key: "known",
      width: 50,
      align: "center" as const,
      render: (known: number) => <Tag color="orange">{known}</Tag>,
    },
    {
      title: "%",
      key: "attendanceRate",
      width: 60,
      align: "center" as const,
      render: (_: string, record: any) => {
        const color = getAttendanceColor(record.attendanceRate)
        return <Tag color={color}>{record.attendanceRate}%</Tag>
      },
    },
  ]

  return (
    <Table
      dataSource={processedData}
      columns={columns}
      loading={loading}
      pagination={false}
      size="small"
      bordered
      title={() => (
        <div className="flex justify-between items-center">
          <div className="font-semibold">
            {attendanceData?.month ? (
              <span>
                {moment(attendanceData.month.date).format("MMMM YYYY")} - {t("monthlyAttendance")}
              </span>
            ) : (
              t("monthlyAttendance")
            )}
          </div>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            options={monthOptions}
            style={{ width: 150 }}
            placeholder={t("selectMonth")}
          />
        </div>
      )}
    />
  )
}

export default MonthlyAttendance
