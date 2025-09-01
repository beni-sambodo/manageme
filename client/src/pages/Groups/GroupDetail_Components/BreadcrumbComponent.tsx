import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

export default function BreadcrumbComponent({ name }: { name: string | undefined }) {
  return (
    <Breadcrumb
      items={[
        {
          title: <Link to="/dashboard/groups">Groups</Link>,
        },
        {
          title: name,
        },
      ]}
    />
  );
}
