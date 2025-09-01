import { Link, useParams } from "react-router-dom";
import { useApiGet } from "../../services/queryConfig";
import courseService from "../../services/course.service";
import { Spin, Card, Typography, List, Image, Modal, Button } from "antd";
import { useTranslation } from "react-i18next";
import Photo from "../../assets/course.avif";
import { useState } from "react";
import EditCourse from "./EditCourses";
import { BiPencil } from "react-icons/bi";

const { Title, Text } = Typography;

export default function CourseDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { isLoading, data, error, refetch } = useApiGet(["getCourses"], () =>
    courseService.getCoursesByID(id)
  );

  if (isLoading) return <Spin />;
  if (error) return <div>{t("error_loading_course")}</div>;

  const course = data;

  return (
    <div className=" gap-4 w-full grid md:grid-cols-2">
      <div>
        <Card title={false}>
          <Image
            className="object-cover"
            height={250}
            width={"100%"}
            src={course?.image?.location || Photo}
          ></Image>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <div className="flex justify-between ">
            <Title level={2}>{course?.name}</Title>
            <Button
              shape="circle"
              onClick={() => setIsEditModalVisible(true)}
              className="flex items-center justify-center"
            >
              <BiPencil />
            </Button>
          </div>
          <Text>
            <strong>{t("course.category")}:</strong> {course?.category?.name}
          </Text>
          <br />
          <Text>
            <strong>{t("course.price")}:</strong> {course?.price} UZS
          </Text>
          <br />
          <Text>
            <strong>{t("course.duration")}:</strong> {course?.duration}{" "}
            {t("course.months")}
          </Text>
          <br />
          <Text>
            <strong>{t("course.type")}:</strong> {course?.type?.join(", ")}
          </Text>
        </Card>
      </div>

      <div>
        <Card title={t("course.teachers")}>
          <List
            dataSource={course?.teachers}
            renderItem={(teacher: any) => (
              <List.Item>
                <Text>
                  {teacher.user.name} ({teacher.user.username})
                </Text>
              </List.Item>
            )}
          />
        </Card>
      </div>

      <div>
        <Card title={t("course.groups")}>
          <List
            dataSource={course?.groups}
            renderItem={(group: any) => (
              <List.Item>
                <Text>
                  <strong>{t("course.group")}:</strong>
                  <Link to={"/groups/" + group._id}> {group.name} </Link> <br />
                </Text>
              </List.Item>
            )}
          />
        </Card>
      </div>
      <Card title="Students">
        <List
          dataSource={course?.students || []}
          renderItem={(student: { name: string; surname: string }) => (
            <List.Item>
              <Text>
                {student?.name} {student?.surname}
              </Text>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={t("groupCard.edit")}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        centered
        footer={null}
      >
        <EditCourse
          Course={data}
          setIsEditModalVisible={setIsEditModalVisible}
          refetch={refetch}
        />
      </Modal>
    </div>
  );
}
