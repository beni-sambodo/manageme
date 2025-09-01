
import useFetchUser from "../hooks/useFetchUser";
import Dashboard from "../pages/Dashboard/Dashboard";
import SelectRole from "../pages/Select-Role/SelectRole";
import TeacherGroups from "../pages/TeacherGroups/TeacherGroups";

export default function Layout() {
  const { user, userLoading } = useFetchUser();


  if (userLoading) {
    return <div>loading...</div>; // You can render a loading indicator here if needed
  }

  if (!userLoading && !user?.selected_role) {
    return <SelectRole />;
  }

  const role = user?.selected_role.role.toLowerCase();

  if ( !userLoading && role === "ceo" || role === "admin" || role === "manager") {
    return <Dashboard />;
  } else if (role === "teacher" || role === "student") {
    return <TeacherGroups />;
  } else {
    return <SelectRole />; // Fallback to select role page if no matching role found
  }
}
