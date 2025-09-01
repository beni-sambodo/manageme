import { Breadcrumb, Button } from "antd";
import { Link, useParams } from "react-router-dom";
import { Avatar, List, Typography, Card } from "antd";
import { useState } from "react";
export default function TeacherDetail() {
  const { name } = useParams();

  const [activeList, setActiveList] = useState("list1");

  const listData1 = [
    { title: "Role", value: "Developer" },
    { title: "Groups", value: "6" },
    { title: "Country", value: "USA" },
    { title: "Students", value: "152" },
    { title: "Status", value: "Active" },
    { title: "Contact", value: "+998 (91) 026 61 26" },
    { title: "Telegram", value: "@Teacher_dev" },
  ];

  const listData2 = [
    { title: "Status", value: "Active" },
    { title: "Telegram", value: "@Teacher_dev" },
    { title: "Role", value: "Developer" },
    { title: "Country", value: "USA" },
    { title: "Contact", value: "+998 (91) 026 61 26" },
    { title: "Groups", value: "6" },
    { title: "Students", value: "152" },
  ];
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">ManageMe</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/employees">employees</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="mt-4">
        <Card className="md:w-1/2 shadow-md rounded-lg">
          <div className="flex flex-col items-center p-4">
            <Avatar
              className="border"
              size={96}
              src="https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-6299533-5187865.png?f=webp"
            />
            <Typography.Title level={2} className="mt-4">
              John Doe
            </Typography.Title>
            <Typography.Text className="text-gray-600">
              UX Designer - Vatican City
            </Typography.Text>
          </div>
          <div className="menu">
            <Button.Group>
              <Button onClick={() => setActiveList("list1")}>List 1</Button>
              <Button onClick={() => setActiveList("list2")}>List 2</Button>
            </Button.Group>
          </div>
          <div>
            {activeList === "list1" ? (
              <List
                className="mt-4"
                itemLayout="horizontal"
                dataSource={listData1}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      className="text-gray-700 font-medium"
                    />
                    <Typography.Text className="text-gray-600">
                      {item.value}
                    </Typography.Text>
                  </List.Item>
                )}
              />
            ) : (
              <List
                className="mt-4"
                itemLayout="horizontal"
                dataSource={listData2}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      className="text-gray-700 font-medium"
                    />
                    <Typography.Text className="text-gray-600">
                      {item.value}
                    </Typography.Text>
                  </List.Item>
                )}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
