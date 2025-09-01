
import { Spin, message, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { IGRoup } from "../../../Types/Types";
import GroupCard from "../GroupCard";

interface GroupsListProps {
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  data: IGRoup[] | undefined;
  refetch?: () => void;
}

const GroupsList: React.FC<GroupsListProps> = ({
  isLoading,
  error,
  data,
  refetch,
}) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[80vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    message.error(t("groups.error"));
    return <p>{t("groups.error")}</p>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[80vh] mt-10">
        <Empty description={t("groups.noData")} />
      </div>
    )
  }

  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
      {data.map((group: IGRoup, idx: number) => (
        <GroupCard key={idx} group={group} refetch={refetch} />
      ))}
    </div>
  );
};

export default GroupsList;
