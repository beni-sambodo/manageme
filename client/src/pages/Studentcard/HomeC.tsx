import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Card, Avatar, Descriptions, Divider, Tag } from "antd";

import { UserOutlined } from "@ant-design/icons";
import { useApiGet } from "../../services/queryConfig";
import receptionService from "../../services/reception.service";

export default function UserProfile() {
  const { id } = useParams();
  const { data, isLoading } = useApiGet(
    ["getReceptionById", id],
    () => receptionService.getReceptionById(id),
    {
      enabled: !!id,
    }
  );

  return (
    <div className="w-full min-h-[80vh] bg-gray-100">
      <Breadcrumb
        items={[
          {
            title: <Link to={"/"}>ManageMe</Link>,
          },
          {
            title: "User Profile",
          },
        ]}
      />

      <div className="mt-4">
        <Card loading={isLoading} className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center">
            <Avatar
              src={data?.user?.avatar?.location}
              size={64}
              icon={<UserOutlined />}
              className="mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {data?.user?.name} {data?.user.surname}
              </h2>
              <p className="text-gray-600">@{data?.user.username}</p>
            </div>
          </div>

          <Divider />

          <Descriptions title="User Info" bordered column={1}>
            <Descriptions.Item label="Phone Number">
              +998 {data?.user.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Age">{data?.user.age}</Descriptions.Item>
            <Descriptions.Item label="Group">
              {data?.group.name}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag
                color={
                  data?.student?.payment?.[0] &&
                  data?.student?.payment?.[0]?.status === "paid"
                    ? "green"
                    : "red"
                }
              >
                {/* {data?.student.payment?.[0].status.toUpperCase()} */}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
}
