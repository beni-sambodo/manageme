import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

export default function Claims() {

  return (
    <div className="w-full min-h-[80vh]">
    <Breadcrumb
      items={[
        {
          title: <Link to={"/"}>ManageMe</Link>,
        },
        {
          title: "Claims",
        },
      ]}
    />
  </div>
  )
}
