"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Breadcrumb, Card, Spin, Alert, message, Modal, Dropdown, Button, type MenuProps, Empty } from "antd"
import { Link } from "react-router-dom"
import { useApiGet, useApiMutation } from "../services/queryConfig"
import employeesService from "../services/employees.service"
import type { School, position } from "../Types/Types"
import {
  MoreVertical,
  RefreshCw,
  Building,
  Briefcase,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import useFetchUser from "../hooks/useFetchUser"

interface Invite {
  _id: string
  school: School
  message: string
  status?: string
  positions: position[]
}

export default function Notifications() {
  const { t } = useTranslation()
  const { fetchData } = useFetchUser()
  const { isLoading, data, error, refetch } = useApiGet(["getMyInvites"], () => employeesService.getMyInvites())

  const changeInvite = useApiMutation(
    ({ action, id }: { action: string; id: string }) => employeesService.changeInvite(action, id),
    {
      onSuccess: () => {
        message.success(t("roleChanged"))
        refetch()
        fetchData()
      },
      onError: () => {
        message.error(t("roleChangeFailed"))
      },
    },
  )

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [modalAction, setModalAction] = useState("")
  const [currentInviteId, setCurrentInviteId] = useState<string | null>(null)

  const showModal = (action: string, id: string) => {
    setModalAction(action)
    setCurrentInviteId(id)
    setIsModalVisible(true)
  }

  const handleAction = () => {
    if (currentInviteId) {
      changeInvite.mutate({ action: modalAction, id: currentInviteId })
      setIsModalVisible(false)
    }
  }

  const onMenuClick = (key: string) => {
    if (currentInviteId) {
      showModal(key, currentInviteId)
    }
  }

  const items: MenuProps["items"] = [
    {
      key: "accept",
      label: (
        <button
          onClick={() => onMenuClick("accept")}
          className="flex items-center gap-2 w-full px-2 py-1 text-green-600"
        >
          <CheckCircle size={16} />
          {t("accept")}
        </button>
      ),
    },
    {
      key: "cancel",
      label: (
        <button onClick={() => onMenuClick("cancel")} className="flex items-center gap-2 w-full px-2 py-1 text-red-600">
          <XCircle size={16} />
          {t("cancel")}
        </button>
      ),
    },
  ]

  const renderDropdownButton = (invite: Invite) => (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button
        type="text"
        className="flex justify-center items-center text-main"
        onClick={() => setCurrentInviteId(invite._id)}
      >
        <MoreVertical size={20} />
      </Button>
    </Dropdown>
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message={t("error")}
        description={t("loadError")}
        type="error"
        showIcon
        icon={<AlertCircle className="text-red-500" />}
      />
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb
          items={[
            {
              title: <Link to={"/dashboard"}>{t("addEmployee.breadcrumb.home")}</Link>,
            },
            {
              title: t("notifications"),
            },
          ]}
        />
        <Button
          onClick={async () => {
            setLoading(true)
            await refetch()
            setLoading(false)
          }}
          type="text"
          className="flex items-center justify-center"
          loading={loading}
        >
          {!loading && <RefreshCw size={18} className="text-gray-600" />}
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {data?.length > 0 ? (
          data?.map((invite: Invite) => (
            <Card
              key={invite._id}
              className="shadow-md hover:shadow-lg transition-shadow duration-200 border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Building size={18} className="text-gray-600" />
                    <h3 className="text-xl font-bold">{invite.school.name}</h3>
                  </div>

                  <div className="space-y-2 mb-3">
                    {invite.positions.map((i: position, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-gray-800">
                        <Briefcase size={16} className="text-gray-500" />
                        <span className="font-medium">{i?.position?.name}</span>
                        <span className="text-gray-400">|</span>
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} className="text-gray-500" />
                          <span>
                            {i.salary} {i.salary_type === "MONTHLY" ? "so'm" : "%"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {invite.message && (
                    <div className="bg-gray-50 p-3 rounded-md mb-2 text-gray-700">
                      <p>{invite.message}</p>
                    </div>
                  )}

                  <p className="text-gray-500 text-sm">{invite.school.contact}</p>
                </div>

                <div className="flex space-x-2">
                  {invite.status === "ACCEPTED" ? (
                    <Button
                      type="primary"
                      disabled
                      className="flex items-center gap-1"
                      icon={<CheckCircle size={16} />}
                    >
                      {t("accepted")}
                    </Button>
                  ) : invite.status === "CANCELLED" ? (
                    <Button
                      type="default"
                      danger
                      disabled
                      className="flex items-center gap-1"
                      icon={<XCircle size={16} />}
                    >
                      {t("cancelled")}
                    </Button>
                  ) : (
                    renderDropdownButton(invite)
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Empty description={t("noData")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            {modalAction === "accept" ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <XCircle size={18} className="text-red-500" />
            )}
            {t(modalAction === "accept" ? "confirmAccept" : "confirmDecline")}
          </div>
        }
        open={isModalVisible}
        onOk={handleAction}
        onCancel={() => setIsModalVisible(false)}
        okText={t(modalAction === "accept" ? "accept" : "cancel")}
        cancelText={t("cancel")}
        okButtonProps={{
          className: modalAction === "accept" ? "bg-green-500" : "bg-red-500",
        }}
      >
        <p>{t("confirmActionText", { action: modalAction })}</p>
      </Modal>
    </div>
  )
}
