"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Breadcrumb, Button, Form, Input, InputNumber, Select, message } from "antd"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useApiGet, useApiMutation } from "../../services/queryConfig"
import receptionService from "../../services/reception.service"
import groupService from "../../services/group.service"
import type { ICourse, IGRoup, User, newStudent } from "../../Types/Types"
import authService from "../../services/auth.service"
import { CgClose } from "react-icons/cg"
import { useQueryClient } from "@tanstack/react-query"
import courseService from "../../services/course.service"
import {
  CopyOutlined,
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons"

export default function AddStudentImproved() {
  const navigate = useNavigate()
  const { action } = useParams()
  const [user, setUser] = useState<User | null>()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [form] = Form.useForm()
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [generatedUsername, setGeneratedUsername] = useState<string>("")
  const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] = useState(false)

  // Generate username in real-time
  const generateUsername = (name: string, surname: string, phone: string) => {
    if (!name || !surname || !phone) return ""

    const namePrefix = name.slice(0, 3).toLowerCase()
    const surnamePrefix = surname.slice(0, 3).toLowerCase()
    const phoneSuffix = phone.slice(-4)
    const currentDate = new Date()
    const day = currentDate.getDate().toString().padStart(2, "0")
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")

    return `${namePrefix}${surnamePrefix}${phoneSuffix}${day}${month}`
  }

  // Watch form values for real-time username generation
  const watchedValues = Form.useWatch([], form)

  useEffect(() => {
    if (watchedValues?.name && watchedValues?.surname && watchedValues?.phone && !isUsernameManuallyEdited) {
      const username = generateUsername(watchedValues.name, watchedValues.surname, watchedValues.phone)
      setGeneratedUsername(username)
      form.setFieldValue("username", username)
    } else if (!watchedValues?.name || !watchedValues?.surname || !watchedValues?.phone) {
      setGeneratedUsername("")
      if (!isUsernameManuallyEdited) {
        form.setFieldValue("username", "")
      }
    }
  }, [watchedValues?.name, watchedValues?.surname, watchedValues?.phone, form, isUsernameManuallyEdited])

  useEffect(() => {
    const savedValues = localStorage.getItem("addStudentFormValues")
    if (savedValues) {
      form.setFieldsValue(JSON.parse(savedValues))
    }
  }, [form])

  const {
    isLoading: isGroupLoading,
    data: groups,
    error: groupError,
  } = useApiGet(["getGroups"], () => groupService.getGroups())

  const { isLoading: isCourseLoading, data: courses } = useApiGet(["getCourses"], () => courseService.getCourses())

  const { mutate, isPending } = useApiMutation(
    (newStudentData: newStudent) => {
      if (action == "create") {
        return receptionService.createNewStudent(newStudentData)
      }
      return receptionService.inviteStudent(newStudentData)
    },
    {
      onSuccess: () => {
        message.success("O'quvchi muvaffaqiyatli qo'shildi")
        navigate("/dashboard/reception")
      },
      onError: (error: any) => {
        if (
          action === "invite" &&
          error.response &&
          error.response.data &&
          error.response.data.message &&
          error.response.data.message.error === "User not found"
        ) {
          message.error("Bunday o'quvchi topilmadi!")
        } else {
          message.error("Bunday foydalanuvchi allaqachon mavjud!")
        }
      },
    },
  )

  const courseOptions =
    courses && courses.datas
      ? courses.datas.map((c: ICourse) => ({
        value: c._id,
        label: c.name,
      }))
      : []

  const handleSearch = async (searchTerm: string) => {
    try {
      const user = await authService.findUser(searchTerm)
      setSelectedUserId(user._id)
      setUser(user)
      message.success(`${user.name} topildi`)
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.error === "User not found"
      ) {
        message.error("Foydalanuvchi topilmadi!")
      } else {
        message.error("Qidirishda xatolik yuz berdi")
      }
      setUser(null)
      setSelectedUserId(null)
    }
  }

  const filteredGroups = selectedCourseId
    ? groups?.filter((g: IGRoup) => g.course && g.course._id === selectedCourseId)
    : groups

  const groupOptions = filteredGroups?.map((g: IGRoup) => ({
    value: g._id,
    label: g.name,
  }))

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value)
    // Reset group selection when course changes
    form.setFieldValue("group", undefined)
  }

  const queryClient = useQueryClient()
  const handleValuesChange = (_: string, allValues: any) => {
    localStorage.setItem("addStudentFormValues", JSON.stringify(allValues))
  }

  const handleInviteStudent = (studentData: any) => {
    const updatedStudentData: newStudent = {
      ...studentData,
      user: selectedUserId || "",
    }
    mutate(updatedStudentData)
  }

  const handleFinish = (values: any) => {
    form.validateFields()
    queryClient.invalidateQueries({ queryKey: ["getStudents"] })
    localStorage.removeItem("addStudentFormValues")
    handleInviteStudent(values)
  }

  // Handle Enter key submission
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.ctrlKey) {
      form.submit()
    }
  }

  const handleCopyUsername = () => {
    const username = form.getFieldValue("username")
    if (username) {
      navigator.clipboard.writeText(username)
      message.success("Foydalanuvchi nomi nusxalandi!")
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value !== generatedUsername) {
      setIsUsernameManuallyEdited(true)
    } else {
      setIsUsernameManuallyEdited(false)
    }
  }

  if (groupError) {
    message.error("Guruhlarni yuklashda xatolik")
  }

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields)
  }

  return (
    <div className="w-full" onKeyDown={handleKeyPress}>
      <Breadcrumb
        items={[
          { title: <Link to="/dashboard">Bosh sahifa</Link> },
          { title: <Link to="/dashboard/reception">Qabul</Link> },
          { title: "Yangi o'quvchi qo'shish" },
        ]}
      />

      <div className="mt-6 bg-white rounded-xl p-6 xl:w-1/2 shadow-lg border border-gray-100">
        <Form
          autoComplete="off"
          onFinish={handleFinish}
          onValuesChange={handleValuesChange}
          form={form}
          layout="vertical"
          size="large"
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Yangi o'quvchi qo'shish</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {action == "create" ? (
              <>
                <Form.Item label="Ism" name="name" rules={[{ required: true, message: "Ism kiritish shart!" }]}>
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Masalan: Ahmad"
                    className="rounded-lg"
                  />
                </Form.Item>
                <Form.Item
                  label="Familiya"
                  name="surname"
                  rules={[{ required: true, message: "Familiya kiritish shart!" }]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Masalan: Karimov"
                    className="rounded-lg"
                  />
                </Form.Item>
                <Form.Item
                  label="Telefon raqami"
                  name="phone"
                  rules={[
                    { required: true, message: "Telefon raqami kiritish shart!" },
                    { pattern: /^\d{9}$/, message: "9 ta raqam kiriting!" },
                  ]}
                  className="md:col-span-1"
                >
                  <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    addonBefore="+998"
                    maxLength={9}
                    placeholder="99 999-99-99"
                    className="rounded-lg"
                    type="tel"
                    onKeyPress={(event) => {
                      if (!/^\d$/.test(event.key)) {
                        event.preventDefault()
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Foydalanuvchi nomi"
                  name="username"
                  tooltip="Avtomatik generatsiya qilinadi yoki o'zingiz kiriting"
                  rules={[
                    {
                      required: true,
                      message: "Foydalanuvchi nomi talab qilinadi",
                    },
                    {
                      pattern: /^[a-zA-Z0-9.-]*$/,
                      message: "Faqat harflar, raqamlar va nuqta ishlatiladi!",
                    },
                  ]}
                  className="md:col-span-1"
                >
                  <Input
                    size="large"
                    placeholder="Avtomatik generatsiya qilinadi..."
                    className="rounded-lg"
                    prefix={<UserOutlined className="text-gray-400" />}
                    onChange={handleUsernameChange}
                    suffix={
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={handleCopyUsername}
                        disabled={!form.getFieldValue("username")}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      >
                        Nusxalash
                      </Button>
                    }
                  />
                </Form.Item>
              </>
            ) : user ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanlangan foydalanuvchi:</label>
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="font-medium">
                    {user.name} | {user.username}
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<CgClose />}
                    onClick={() => setUser(null)}
                    className="text-gray-500 hover:text-red-500"
                  />
                </div>
              </div>
            ) : (
              <Form.Item
                label="Foydalanuvchi qidirish"
                name="username"
                rules={[
                  { required: true, message: "Foydalanuvchi nomini kiriting!" },
                  { pattern: /^[a-zA-Z0-9.-]*$/, message: "Faqat harflar, raqamlar va nuqta ishlatiladi!" },
                ]}
                className="md:col-span-2"
              >
                <Input.Search
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Foydalanuvchi nomini kiriting va qidiring"
                  onSearch={handleSearch}
                  className="rounded-lg"
                />
              </Form.Item>
            )}
          </div>

          <Form.Item label="Izoh" name="comment">
            <Input.TextArea placeholder="Qo'shimcha izohlar yozing..." rows={4} className="rounded-lg" />
          </Form.Item>

          {/* Additional Fields Section */}
          <div className="my-6">
            <Button
              type="dashed"
              icon={showAdditionalFields ? <UpOutlined /> : <PlusOutlined />}
              onClick={toggleAdditionalFields}
              className="mb-4 rounded-lg border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700"
              size="large"
            >
              {showAdditionalFields ? "Qo'shimcha maydonlarni yashirish" : "Qo'shimcha ma'lumotlar qo'shish"}
            </Button>

            {showAdditionalFields && (
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item label="Yoshi" name="age">
                    <InputNumber
                      placeholder="Yoshini kiriting"
                      className="w-full rounded-lg"
                      max={99}
                      min={5}
                      controls={false}
                    />
                  </Form.Item>

                  <Form.Item label="Taklif qilgan" name="referal">
                    <Input
                      prefix={<TeamOutlined className="text-gray-400" />}
                      placeholder="Taklif qilgan shaxsni kiriting"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item label="Kurs" name="course">
                    <Select
                      options={courseOptions}
                      placeholder="Kursni tanlang"
                      loading={isCourseLoading}
                      onChange={handleCourseChange}
                      className="rounded-lg"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item label="Guruh" name="group">
                    <Select
                      options={groupOptions}
                      placeholder={selectedCourseId ? "Guruhni tanlang" : "Avval kursni tanlang"}
                      loading={isGroupLoading}
                      disabled={!selectedCourseId}
                      className="rounded-lg"
                      size="large"
                    />
                  </Form.Item>
                </div>
              </div>
            )}
          </div>

          <Form.Item className="mb-0">
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending || isGroupLoading}
                size="large"
                className="px-8 rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                {isPending || isGroupLoading ? "Saqlanmoqda..." : "O'quvchini qo'shish"}
              </Button>
              <Button size="large" onClick={() => navigate("/dashboard/reception")} className="rounded-lg">
                Bekor qilish
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
