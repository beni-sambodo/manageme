import { useState } from "react";
import {
  Breadcrumb,
  message,
  Spin,
  Empty,
  Modal,
  Button,
  Select,
  Form,
} from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApiGet, useApiMutation } from "../../services/queryConfig";
import receptionService from "../../services/reception.service";
import groupService from "../../services/group.service";
import { ICourse, IGRoup, newStudent } from "../../Types/Types";
import FilterGroup from "./Components/FilterGroup";
import FilterStatus from "./Components/FilterStatus";
import AcceptModal from "./Components/AcceptModal";
import StatusChangeModal from "./Components/StatusChangeModal";
import StudentTable from "./Components/StudentTable";
import { CgUserAdd } from "react-icons/cg";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import courseService from "../../services/course.service";
import { useStore } from "../../base/store";

declare global {
  interface Window {
    clearReceptionSelections?: () => void;
  }
}

export default function Reception() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDModalOpen, setIsDModalOpen] = useState(false);
  const [groupId, setGroupId] = useState<string | undefined>("");
  const [acceptModal, setAcceptModal] = useState(false);
  const [selectedRows, setselectedRows] = useState<string[] | null>(null);
  const { isStudentModalOpen, setStudentModalOpen } = useStore();

  // Add global function to clear selections
  window.clearReceptionSelections = () => {
    setSelect([]);
    setselectedRows([]);
  };

  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [currentStudent, setCurrentStudent] = useState<newStudent | null>(null);
  const [acceptStudent, setAcceptStudent] = useState<newStudent | undefined>(
    undefined
  );
  const [updateStudentModalVisible, setupdateStudentModalVisible] =
    useState(false);
  // const [addStudentModalVisible, setAddStudentModalVisible] = useState(false);
  const [addStudentGModalVisible, setAddStudentGModalVisible] = useState(false);
  const [select, setSelect] = useState<string[]>([]);

  const URLStatus = searchParams.get("status");
  const URLGroup = searchParams.get("group");

  const { isLoading, data, error, refetch } = useApiGet(
    ["getStudents", URLStatus, URLGroup, page, limit],
    () => receptionService.getStudents(page, URLStatus, URLGroup, limit)
  );
  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
  };
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const groupFetch = useApiGet(["getGroups"], () => groupService.getGroups());

  const updateSearchParams = (status: string | null, group: string | null) => {
    const params: Record<string, string> = {};
    if (status) params["status"] = status;
    if (group) params["group"] = group;
    setSearchParams(params);
    refetch();
  };

  const handleAcceptChange = (record: { student: newStudent }) => {
    setAcceptStudent(record.student);
    setAcceptModal(true);
  };

  const handleSelectChange = (
    value: string,
    record: { student: newStudent }
  ) => {
    setStatus(value);
    setCurrentStudent(record.student);
    setIsModalOpen(true);
  };

  const handleFilterGroup = (group: string) => {
    updateSearchParams(URLStatus, group);
  };

  const handleFilterStatus = (status: string) => {
    updateSearchParams(status, URLGroup);
  };
  const massEdit = useApiMutation(
    (value) => receptionService.editManyReception(value),
    {
      onSuccess: () => {
        setupdateStudentModalVisible(false);
        setselectedRows([]);
        setSelect([]);
        message.success(t("delete.success"));
        refetch();
      },
      onError: () => message.error(t("payment.error")),
    }
  );
  const deleteRecept = useApiMutation(
    (ids: { receptions: string[] }) => receptionService.deleteStudent(ids),
    {
      onSuccess: () => {
        setIsDModalOpen(false);
        setselectedRows([]);
        setSelect([]);
        message.success(t("delete.success"));
        refetch();
      },
      onError: () => message.error(t("payment.error")),
    }
  );

  const handlePageChange = (page: number) => {
    setPage(page);
    refetch();
  };
  const { isLoading: isGroupLoading, data: groups } = useApiGet(
    ["getGroups"],
    () => groupService.getGroups()
  );
  const { isLoading: isCourseLoading, data: courses } = useApiGet(
    ["getCourses"],
    () => courseService.getCourses()
  );
  const handleAddToGroup = async (groupId: string | undefined) => {
    setLoading(true);
    try {
      await receptionService.addToGroup(select, groupId);
      message.success(t("reception.successAddToGroup"));
      setAddStudentGModalVisible(false);
      setSelect([]);
      setselectedRows([]);
      setGroupId(undefined);
      refetch();
    } catch (error) {
      message.error(t("reception.errorAddToGroup"));
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = (values: any) => {
    const c = {
      id: select,
      ...values,
    };
    massEdit.mutate(c);
  };
  const handleGroupIdChange = (groupId: string) => {
    setGroupId(groupId);
  };
  const courseOptions = courses?.datas?.map((c: ICourse) => ({
    value: c?._id,
    label: c?.name,
  }));

  const filteredGroups = selectedCourseId
    ? groups?.filter((g: IGRoup) => g.course._id === selectedCourseId)
    : groups;

  const groupOptions = filteredGroups?.map((g: IGRoup) => ({
    value: g._id,
    label: g.name,
  }));

  if (error) {
    message.error(t("reception.errorLoadingData"));
    return <p>{t("reception.errorLoadingData")}</p>;
  }
  const handleDelete = (select: string[]) => {
    const d = { receptions: select };
    deleteRecept.mutate(d);
  };

  const showAddStudentModal = () => {
    // setAddStudentModalVisible(true);
    setStudentModalOpen(true);
  };

  const handleAddStudentModalClose = () => {
    // setAddStudentModalVisible(false);
    setStudentModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={[
            { title: <Link to="/dashboard">{t("reception.breadcrumb.home")}</Link> },
            { title: t("reception.breadcrumb.reception") },
          ]}
        />
      </div>

      <div className="flex justify-between xs:justify-start md:items-start mt-4 gap-5 flex-col-reverse xs:flex-row xs:gap-0">
        <div className="flex flex-col gap-5 md:flex-row md:w-fit">
          <FilterGroup
            URLGroup={URLGroup}
            groupFetch={groupFetch}
            handleFilterGroup={handleFilterGroup}
          />
          <FilterStatus
            URLStatus={URLStatus}
            handleFilterStatus={handleFilterStatus}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button size="large" type="primary" onClick={showAddStudentModal}>
            {t("reception.addButton.text")}
          </Button>
          <Button.Group>
            <Button
              size="large"
              onClick={() => setAddStudentGModalVisible(true)}
              disabled={select && select?.length <= 0}
            >
              {t("groupCard.accept")}{" "}
              {select && select.length > 0 && select.length}
            </Button>
            <Button
              size="large"
              onClick={() => setupdateStudentModalVisible(true)}
              disabled={select && select?.length <= 0}
            >
              {t("groupCard.edit")}{" "}
              {select && select.length > 0 && select.length}
            </Button>
            <Button
              disabled={select && select?.length <= 0}
              danger
              onClick={() => setIsDModalOpen(true)}
              size="large"
            >
              {t("groupCard.delete")}{" "}
              {select && select.length > 0 && select.length}
            </Button>
          </Button.Group>
        </div>
      </div>

      <AcceptModal
        acceptModal={acceptModal}
        acceptStudent={acceptStudent}
        refetch={refetch}
        onClose={() => setAcceptModal(false)}
      />

      <StatusChangeModal
        isModalOpen={isModalOpen}
        currentStudent={currentStudent}
        refetch={refetch}
        status={status}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />

      {isLoading ? (
        <div className="w-full flex justify-center items-center min-h-[80vh]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-4 border max-w-full bg-white shadow-box rounded-xl">
          {data && data.students.length > 0 ? (
            <StudentTable
              handlePageChange={handlePageChange}
              data={data}
              isLoading={isLoading}
              handleSelectChange={handleSelectChange}
              handleAcceptChange={handleAcceptChange}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              selectedRows={selectedRows}
              setselectedRows={setselectedRows}
              setSelect={setSelect}
              limit={limit}
              setLimit={setLimit}
            />
          ) : (
            <div className="py-10">
              <Empty description={t("reception.filter.noData")} />
            </div>
          )}
        </div>
      )}

      <Modal
        title={t("reception.addModal.title")}
        open={isStudentModalOpen} // Use state from store
        onCancel={handleAddStudentModalClose} // Use action from store
        footer={null}
      >
        <div className="py-5 flex justify-between gap-5">
          <Link
            to="./invite"
            onClick={handleAddStudentModalClose} // Modal yopilishi uchun
            className="flex py-10 flex-col text-lg duration-300 rounded-lg w-1/2 items-center justify-center hover:bg-gray-100 transition-all"
          >
            <CgUserAdd size={40} className="mb-2" />
            {t("reception.addModal.invite")}
          </Link>

          <Link
            to="./create"
            onClick={handleAddStudentModalClose} // Modal yopilishi uchun
            className="flex py-10 flex-col text-lg rounded-lg w-1/2 items-center justify-center hover:bg-gray-100 transition-all duration-300"
          >
            <AiOutlineUsergroupAdd size={40} className="mb-2" />
            {t("reception.addModal.create")}
          </Link>
        </div>
      </Modal>

      <Modal
        title={t("massAddModal.title")}
        open={addStudentGModalVisible}
        onCancel={() => setAddStudentGModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setAddStudentGModalVisible(false)}
          >
            {t("massAddModal.cancelButton")}
          </Button>,
          <Button
            disabled={!groupId}
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => handleAddToGroup(groupId)}
          >
            {t("massAddModal.submitButton")}
          </Button>,
        ]}
      >
        <div className="flex justify-between flex-col gap-5">
          <p>
            {t("massAddModal.confirmText")}
            <span> {select?.length}</span>
          </p>

          <Select
            placeholder={t("massAddModal.selectGroup")}
            style={{ minWidth: 200 }}
            onChange={handleGroupIdChange}
            options={groupFetch?.data?.map(
              (group: { name: string; _id: string }) => ({
                label: group?.name,
                value: group?._id,
              })
            )}
          />
        </div>
      </Modal>
      <Modal
        title={t("massUpdateModal.title")}
        open={updateStudentModalVisible}
        footer={null}
        onCancel={() => setupdateStudentModalVisible(false)}
      >
        <div className="flex justify-between flex-col gap-5">
          <p>
            {t("massUpdateModal.confirmText")}
            <span> {select?.length}</span>
          </p>
          <Form onFinish={handleFinish} layout="vertical">
            <Form.Item label={t("addStudent.courseLabel")} name="course">
              <Select
                options={courseOptions}
                allowClear
                size="large"
                loading={isCourseLoading}
                onChange={handleCourseChange}
                placeholder={t("addStudent.coursePlaceholder")}
              />
            </Form.Item>
            <Form.Item label={t("addStudent.groupLabel")} name="group">
              <Select
                options={groupOptions}
                allowClear
                size="large"
                loading={isGroupLoading}
                placeholder={t("addStudent.groupPlaceholder")}
              />
            </Form.Item>
            <Form.Item className="flex gap-4 w-full justify-end">
              <Button
                key="cancel"
                onClick={() => setupdateStudentModalVisible(false)}
              >
                {t("massAddModal.cancelButton")}
              </Button>

              <Button
                htmlType="submit"
                loading={massEdit.isPending}
                type="primary"
                className="ml-2"
              >
                {t("massAddModal.submitButton")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title={t("massDeleteModal.title")}
        open={isDModalOpen}
        onCancel={() => setIsDModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDModalOpen(false)}>
            {t("massAddModal.cancelButton")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={deleteRecept.isPending}
            onClick={() => handleDelete(select)}
          >
            {t("massAddModal.submitButton")}
          </Button>,
        ]}
      >
        <div className="flex justify-between flex-col gap-5">
          <p>
            {t("massDeleteModal.confirmText")} <span> {select?.length}</span>
          </p>
        </div>
      </Modal>
    </div>
  );
}
