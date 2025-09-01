import { List, Skeleton, Avatar, Empty } from "antd";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { Teacher } from "../../../Types/Types";
import { useTranslation } from "react-i18next";

interface TeachersListProps {
  teachers: Teacher[];
  isLoading: boolean;
}

export default function TeachersList({
  teachers,
  isLoading,
}: TeachersListProps) {
  const { t } = useTranslation();
  if (teachers.length <= 0) {
    return <Empty description={t("noData")} />;
  }

  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={teachers}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderItem={(item: any) => (
        <List.Item>
          {isLoading ? (
            <Skeleton avatar title={false} active>
              <List.Item.Meta
                avatar={<Avatar />}
                title={<a href="https://ant.design">{item.name}</a>}
                description="Teacher"
              />
              <div>
                <CgMoreVerticalAlt />
              </div>
            </Skeleton>
          ) : (
            <div className="flex gap-3 items-center">
              <Avatar>{item.name[0]}</Avatar>
              {item.name}
            </div>
          )}
        </List.Item>
      )}
    />
  );
}
