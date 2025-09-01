import { Spin, Tabs, message } from "antd";
import { useState, useEffect } from "react";
import positionsService from "../../services/positions.service";
import Positions from "./Positions";
import CenterSettingsForm from "./Components/CenterSettingsForm";
import { School } from "../../Types/Types";
import Rooms from "./Rooms";
import roomService from "../../services/room.service";
import { useApiGet } from "../../services/queryConfig";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Part2Props {
  schoolData: School | undefined;
}

const Part2: React.FC<Part2Props> = ({ schoolData }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("tab") || "1"
  );

  const handleUpdateSuccess = () => {
    message.success("Center settings updated successfully");
  };

  const handleUpdateError = () => {
    const errorMessage = "Failed to update center settings";
    message.error(errorMessage);
  };

  const positions = useApiGet(["getPositions"], () =>
    positionsService.getPositions()
  );
  const rooms = useApiGet(["getRooms"], () => roomService.getRooms());

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const items = [
    {
      key: "1",
      label: t("addEmployee.form.position"),
      children: positions.isLoading ? (
        <Spin size="large" />
      ) : (
        <Positions positions={positions.data} refetch={positions.refetch} />
      ),
    },
    {
      key: "2",
      label: t("groupCard.roomLabel"),
      children: rooms.isLoading ? (
        <Spin size="large" />
      ) : (
        <Rooms rooms={rooms.data} refetch={rooms.refetch} />
      ),
    },
    {
      key: "3",
      label: t("header.centerSettings"),
      children: (
        <CenterSettingsForm
          schoolData={schoolData}
          onUpdateSuccess={handleUpdateSuccess}
          onUpdateError={handleUpdateError}
        />
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div>
      {/* <h1 className="mb-3 text-lg font-semibold">Settings</h1> */}
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        items={items}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default Part2;
