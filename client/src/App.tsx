import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { message } from "antd";
import HomeLayout from "./components/HomeLayout";
import Reception from "./pages/Reception/Reception";
import AddStudent from "./pages/Reception/AddStudent";
import ErrorPage from "./pages/Errors/ErrorPage";
import Groups from "./pages/Groups/Groups";
import AddGroup from "./pages/Groups/AddGroup";
import Profile from "./pages/Profile/Profile";
import TeacherDetail from "./pages/Employees/EmployeDetail";
import NotFound from "./pages/Errors/NotFound";
import Login from "./pages/auth/Login";
import Courses from "./pages/Courses/Courses";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/auth/Register";
import Employees from "./pages/Employees/Employees";
import CenterSettings from "./pages/Centers/CenterSettings";
import SelectRole from "./pages/Select-Role/SelectRole";
import SelectLayout from "./pages/Select-Role/Layout";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Payment from "./pages/Payment/Payment";
import Community from "./pages/Community/Community";
import Achievments from "./pages/Achievments";
import CreateSchool from "./pages/School/CreateSchool";
import AddEmploye from "./pages/Employees/AddEmploye";
import i18next from "./i18next";
import { I18nextProvider } from "react-i18next";
import Notifications from "./pages/Notifications";
import AddCourse from "./pages/Courses/AddCourse";
import EditGroups from "./pages/Groups/EditGroups";
import ResetPass from "./pages/auth/ResetPassword/ResetPass";
import TeacherGroupCard from "./pages/TeacherGroups/TeacherGroupCard";
import AdminLogin from "./pages/admin/auth/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPanel from "./pages/admin/Pages/AdminPanel";
import CourseCategories from "./pages/admin/Pages/CCategories";
import AdminSchools from "./pages/admin/Pages/Schools";
import HomeC from "./pages/Studentcard/HomeC";
import Support from "./pages/admin/Pages/Support";
import UserAgreement from "./pages/UserAgreement";
import Home from "./home/Home";
import CourseDetail from "./pages/Courses/CourseDetail";
// import { useStore } from "./base/store"; // Removed
// import { Modal } from "antd"; // Removed
// import { Link } from "react-router-dom"; // Removed
// import { CgUserAdd } from "react-icons/cg"; // Removed
// import { AiOutlineUsergroupAdd } from "react-icons/ai"; // Removed
// import { useTranslation } from "react-i18next"; // Removed

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

// Test CI/CD workflow

function App() {
  message.config({
    maxCount: 1,
  });

  // const { isStudentModalOpen, setStudentModalOpen } = useStore(); // Removed
  // const { t } = useTranslation(); // Removed

  // const handleAddStudentModalClose = () => { // Removed
  //   setStudentModalOpen(false); // Removed
  // }; // Removed

  const router = createBrowserRouter([
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/reset",
      element: <ResetPass />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/select-role",
      element: <SelectLayout />,
      children: [{ path: "/select-role", element: <SelectRole /> }],
    },
    {
      path: "/corporate",
      element: <CreateSchool />,
    },
    {
      path: "/terms",
      element: <UserAgreement />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/admin", element: <AdminPanel /> },
        { path: "/admin/course-categories", element: <CourseCategories /> },
        { path: "/admin/schools", element: <AdminSchools /> },
        { path: "/admin/support", element: <Support /> },
      ],
    },
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />
    },
    {
      path: "/dashboard",
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Navigate to="opportunities" replace />,
        },
        {
          path: "opportunities", element: <Dashboard />,
        },
        {
          path: "profile",
          element: (
            <RoleBasedRoute requiredPermition={""} component={<Profile />} />
          ),
        },
        {
          path: "finance",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-finance"}
              component={<Payment />}
            />
          ),
        },

        {
          path: "community",
          element: (
            <RoleBasedRoute requiredPermition={""} component={<Community />} />
          ),
        },
        {
          path: "achievements",
          element: (
            <RoleBasedRoute
              requiredPermition={""}
              component={<Achievments />}
            />
          ),
        },
        {
          path: "reception/search/:id",
          element: (
            <RoleBasedRoute requiredPermition={"*-reception"} component={<HomeC />} />
          ),
        },
        {
          path: "courses",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-course"}
              component={<Courses />}
            />
          ),
        },
        {
          path: "notifications",
          element: (
            <RoleBasedRoute
              requiredPermition={""}
              component={<Notifications />}
            />
          ),
        },
        {
          path: "courses/:id",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-course"}
              component={<CourseDetail />}
            />
          ),
        },
        {
          path: "employees",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-employer"}
              component={<Employees />}
            />
          ),
        }, // Restricted to CEOs
        {
          path: "employees/add",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-school"}
              component={<AddEmploye />}
            />
          ),
        }, // Restricted to CEOs
        {
          path: "mycenter",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-school"}
              component={<CenterSettings />}
            />
          ),
        }, // Restricted to Admins
        {
          path: "teacher/:name",
          element: (
            <RoleBasedRoute
              requiredPermition={""}
              component={<TeacherDetail />}
            />
          ),
        }, // Restricted to CEOs

        {
          path: "groups",
          element: (
            <RoleBasedRoute requiredPermition={""} component={<Groups />} />
          ),
        },
        // {
        //   path: "/:id",
        //   element: (
        //     <RoleBasedRoute
        //       requiredPermition={["Student"]}
        //       component={<TeacherGroupCard />}
        //     />
        //   ),
        // },
        // {
        //   path: "/group/:id",
        //   element: (
        //     <RoleBasedRoute
        //       requiredPermition={["Teacher"]}
        //       component={<TeacherGroupCard />}
        //     />
        //   ),
        // },
        {
          path: "groups/:id",
          element: <TeacherGroupCard />,
        },
        {
          path: "courses/add",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-course"}
              component={<AddCourse />}
            />
          ),
        },
        {
          path: "groups/edit/:id",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-group"}
              component={<EditGroups />}
            />
          ),
        }, // Restricted to Admins
        {
          path: "groups/add",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-group"}
              component={<AddGroup />}
            />
          ),
        }, // Restricted to Admins
        {
          path: "reception",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-reception"}
              component={<Reception />}
            />
          ),
        }, // Restricted to Admins
        {
          path: "reception/:action",
          element: (
            <RoleBasedRoute
              requiredPermition={"*-reception"}
              component={<AddStudent />}
            />
          ),
        },
      ],
    },
  ]);

  return (
    <I18nextProvider i18n={i18next}>
      <div className="bg-stroke/50 min-h-screen">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </div>
    </I18nextProvider>
    // <Modal // Removed all modal JSX
    //   title={t("reception.addModal.title")}
    //   open={isStudentModalOpen}
    //   onCancel={handleAddStudentModalClose}
    //   footer={null}
    // >
    //   <div className="py-5 flex justify-between gap-5">
    //     <Link
    //       to="/dashboard/reception/invite"
    //       onClick={handleAddStudentModalClose} 
    //       className="flex py-10 flex-col text-lg duration-300 rounded-lg w-1/2 items-center justify-center hover:bg-gray-100 transition-all"
    //     >
    //       <CgUserAdd size={40} className="mb-2" />
    //       {t("reception.addModal.invite")}
    //     </Link>

    //     <Link
    //       to="/dashboard/reception/create"
    //       onClick={handleAddStudentModalClose} 
    //       className="flex py-10 flex-col text-lg rounded-lg w-1/2 items-center justify-center hover:bg-gray-100 transition-all duration-300"
    //     >
    //       <AiOutlineUsergroupAdd size={40} className="mb-2" />
    //       {t("reception.addModal.create")}
    //     </Link>
    //   </div>
    // </Modal>
  );
}

export default App;
