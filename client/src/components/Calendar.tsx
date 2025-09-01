"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Clock, MapPin, ChevronLeft, ChevronRight, Calendar, Users, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"

interface Teacher {
  name: string
  avatar?: { location: string }
}

interface Room {
  name: string
  location?: string
}

interface Lesson {
  _id: string
  name: string
  subject: string
  startTime: string
  endTime: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  teachers: Teacher[]
  room?: Room
}

interface ScheduleCalendarProps {
  lessonsData: Lesson[]
  loading: boolean
  onDayChange?: (dayOffset: number) => void
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ lessonsData = [], loading = false, onDayChange }) => {
  const [dayOffset, setDayOffset] = useState<number>(0)

  // Generate time slots from 8 AM to 8 PM
  const timeSlots = useMemo(() => {
    const slots: string[] = []
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
    }
    return slots
  }, [])

  // Get current day
  const getCurrentDay = (): Date => {
    const today = new Date()
    const currentDay = new Date(today)
    currentDay.setDate(today.getDate() + dayOffset)
    return currentDay
  }

  const currentDay = getCurrentDay()
  const currentDayOfWeek = currentDay.getDay()

  // Get lessons for current day and specific time
  const getLessonsAt = (timeSlot: string): Lesson[] => {
    if (!lessonsData || !Array.isArray(lessonsData)) {
      return []
    }

    return lessonsData.filter((lesson) => {
      return lesson.dayOfWeek === currentDayOfWeek && lesson.startTime === timeSlot
    })
  }

  // Color palette for lessons
  const lessonColors = [
    "bg-blue-100 border-blue-300 text-blue-800",
    "bg-yellow-100 border-yellow-300 text-yellow-800",
    "bg-purple-100 border-purple-300 text-purple-800",
    "bg-green-100 border-green-300 text-green-800",
    "bg-pink-100 border-pink-300 text-pink-800",
    "bg-indigo-100 border-indigo-300 text-indigo-800",
  ]

  const getColorForLesson = (lessonId: string): string => {
    const index = lessonId.length % lessonColors.length
    return lessonColors[index]
  }

  const handleDayChange = (direction: "prev" | "next"): void => {
    const newOffset = direction === "prev" ? dayOffset - 1 : dayOffset + 1
    setDayOffset(newOffset)
    if (onDayChange) {
      onDayChange(newOffset)
    }
  }

  const formatCurrentDay = (): string => {
    return currentDay.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get lessons for current day
  const todaysLessons = useMemo(() => {
    if (!lessonsData || !Array.isArray(lessonsData)) {
      return []
    }
    return lessonsData.filter((lesson) => lesson.dayOfWeek === currentDayOfWeek)
  }, [lessonsData, currentDayOfWeek])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Schedule</h1>
            <p className="text-gray-600 mt-1">{formatCurrentDay()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDayChange("prev")}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDayChange("next")}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Time slots and lessons - Grid Layout */}
        {timeSlots.map((timeSlot) => {
          const lessons = getLessonsAt(timeSlot)

          return (
            <div key={timeSlot} className="border-b border-gray-100 min-h-[100px] flex">
              {/* Time column */}
              <div className="w-24 p-4 border-r border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                <div className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <Clock className="h-3 w-3" />
                  {timeSlot}
                </div>
              </div>

              {/* Lessons grid - 5 columns for lessons */}
              <div className="flex-1 grid grid-cols-5 gap-2 p-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const lesson = lessons[index]

                  return (
                    <div key={index} className="border border-gray-200 rounded-lg min-h-[80px] p-2">
                      {lesson ? (
                        <Link to={`/dashboard/groups/${lesson._id}`}>
                          <div
                            className={`${getColorForLesson(lesson._id)} border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer h-full`}
                          >
                            <div className="text-xs font-medium mb-1">
                              {lesson.startTime} - {lesson.endTime}
                            </div>
                            <div className="text-sm font-semibold mb-1">{lesson.name}</div>
                            <div className="text-xs opacity-75 mb-1">{lesson.subject}</div>
                            {lesson.room && (
                              <div className="flex items-center gap-1 text-xs opacity-75">
                                <MapPin className="h-2 w-2" />
                                {lesson.room.name}
                              </div>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-gray-300">
                          {/* Empty slot */}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Today's Lessons</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{todaysLessons.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">Active Times</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{new Set(todaysLessons.map((l) => l.startTime)).size}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600">Subjects</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{new Set(todaysLessons.map((l) => l.subject)).size}</p>
        </div>
      </div>
    </div>
  )
}

export default ScheduleCalendar
