"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Table, Tag, Select, Tooltip } from "antd"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import moment from "moment"

type JournalAttendanceProps = {
    attendanceData: any
    loading: boolean
    onMonthChange?: (month: string) => void
}

const JournalAttendance: React.FC<JournalAttendanceProps> = ({ attendanceData, loading, onMonthChange }) => {
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

    // Process attendance data
    const processedData = useMemo(() => {
        if (!attendanceData || !attendanceData.students) return []

        return attendanceData.students.map((student: any, index: number) => {
            const studentRecord = {
                ...student,
                key: student._id,
                index: index + 1,
                student: student.student,
                // Add days as separate fields
                ...(student.monthlyAttendance || []).reduce((acc: any, day: any, dayIndex: number) => {
                    acc[`day_${dayIndex + 1}`] = day.status
                    acc[`day_${dayIndex + 1}_comment`] = day.comment
                    acc[`day_${dayIndex + 1}_date`] = day.date
                    return acc
                }, {}),
            }
            return studentRecord
        })
    }, [attendanceData])

    // Generate columns - compact version
    const columns = useMemo(() => {
        if (!attendanceData || !attendanceData.students || !attendanceData.students[0]?.monthlyAttendance) {
            return [
                {
                    title: "№",
                    dataIndex: "index",
                    key: "index",
                    width: 40,
                    fixed: "left",
                },
                {
                    title: t("studentName"),
                    key: "name",
                    fixed: "left",
                    width: 180,
                    render: (_: string, record: any) => (
                        <Link to={`/dashboard/user/${record.student.username}`}>
                            {record.student.name} | {record.student.username}
                        </Link>
                    ),
                },
            ]
        }

        const daysInMonth = attendanceData.students[0]?.monthlyAttendance?.length || 0
        const baseColumns = [
            {
                title: "№",
                dataIndex: "index",
                key: "index",
                width: 40,
                fixed: "left",
            },
            {
                title: t("studentName"),
                key: "name",
                fixed: "left",
                width: 180,
                render: (_: string, record: any) => (
                    <Link to={`/dashboard/user/${record.student.username}`}>
                        {record.student.name} | {record.student.username}
                    </Link>
                ),
            },
        ]

        // Compact day columns - smaller width to fit more
        const dayColumns = Array.from({ length: daysInMonth }, (_, i) => {
            const dayIndex = i + 1
            return {
                title: () => {
                    const firstStudent = attendanceData.students[0]
                    const date = firstStudent?.monthlyAttendance?.[i]?.date
                    return date ? moment(date).format("DD") : dayIndex.toString()
                },
                key: `day_${dayIndex}`,
                dataIndex: `day_${dayIndex}`,
                width: 35, // Very compact width
                align: "center" as const,
                render: (status: string, record: any) => {
                    const comment = record[`day_${dayIndex}_comment`]

                    let color = ""
                    let icon = ""

                    if (status === "ATTENDED") {
                        color = "green"
                        icon = "✓"
                    } else if (status === "NOT_ATTENDED") {
                        color = "red"
                        icon = "✗"
                    } else if (status === "KNOWN") {
                        color = "orange"
                        icon = "!"
                    } else {
                        color = "gray"
                        icon = "-"
                    }

                    return (
                        <Tooltip title={comment ? `${t("reason")}: ${comment}` : ""}>
                            <Tag
                                color={color}
                                style={{
                                    margin: 0,
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "10px",
                                    lineHeight: "18px",
                                    textAlign: "center",
                                }}
                            >
                                {icon}
                            </Tag>
                        </Tooltip>
                    )
                },
            }
        })

        return [...baseColumns, ...dayColumns] as any
    }, [attendanceData, t])

    return (
        <Table
            dataSource={processedData}
            columns={columns}
            loading={loading}
            pagination={false}
            size="small"
            bordered
            scroll={{ x: "max-content" }}
            title={() => (
                <div className="flex justify-between items-center">
                    <div className="font-semibold">
                        {attendanceData?.month ? (
                            <span>
                                {moment(attendanceData.month.date).format("MMMM YYYY")} - {t("journalAttendance")}
                            </span>
                        ) : (
                            t("journalAttendance")
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

export default JournalAttendance
