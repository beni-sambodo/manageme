// import {
//   Breadcrumb,
//   Spin,
//   Table,
//   Typography,
//   message,
// } from "antd";
// import { Link, useSearchParams } from "react-router-dom";
// import { Student } from "../Types/Types";
// import receptionService from "../services/reception.service";
// import { useApiGet } from "../services/queryConfig";

// export default function Students() {
//   const { Text } = Typography;
//   const [searchParams, setSearchParams] = useSearchParams();

//   const { isLoading, data, error } = useApiGet(["getStudents", "NEW", 1], () =>
//     receptionService.getStudents(1, "NEW")
//   );
//   const dataSource = data?.students?.map((student: Student, index: number) => ({
//     key: index.toString(),
//     student: student?.fullName,
//     payment: student?.payment,
//     email: student?.bioData?.email,
//   }));

//   const columns = [
//     {
//       title: "#",
//       dataIndex: "key",
//       key: "key",
//     },
//     {
//       title: "Student",
//       dataIndex: "student",
//       key: "student",
//     },
//     {
//       title: "Payment",
//       dataIndex: "payment",
//       key: "payment",
//       render: (payment: boolean) =>
//         payment ? (
//           <Text type="success">PAID</Text>
//         ) : (
//           <Text type="warning">UNPAID</Text>
//         ),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="w-full flex justify-center items-center min-h-[80vh]">
//         <Spin size="large" />
//       </div>
//     );
//   }
//   if (error) {
//     message.error("Error");
//     return <p>Error getting students</p>;
//   }
//   return (
//     <div className="w-full">
//       <Breadcrumb
//         items={[
//           {
//             title: <Link to={"/"}>ManageMe</Link>,
//           },
//           {
//             title: "Students",
//           },
//         ]}
//       />
//       <div className="mt-4 gap-5 grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-6">
      
    
//       </div>
//       <div className="mt-4 bg-white rounded-xl">
//         <Table
//           className="overflow-x-scroll md:overflow-auto"
//           dataSource={dataSource}
//           columns={columns}
//         />
//       </div>
//     </div>
//   );
// }
