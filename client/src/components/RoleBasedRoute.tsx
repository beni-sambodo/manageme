import { Navigate } from "react-router-dom";
import useFetchUser from "../hooks/useFetchUser";

interface RoleBasedRouteProps {
  requiredPermition: string; // List of permissions required for accessing this route
  component: JSX.Element; // The component to render if the permission is allowed
  redirectTo?: string; // Where to redirect if the permission doesn't match
}

export default function RoleBasedRoute({
  requiredPermition,
  component,
  redirectTo = "/", // Default redirect if permission doesn't match
}: RoleBasedRouteProps) {
  const { user } = useFetchUser(); // Get user data including permissions

  const userPermitions = user?.selected_role?.permissions || [];

  const hasRequiredPermition = userPermitions.includes(
    requiredPermition.toLowerCase()
  );


  return !requiredPermition ? (
    component
  ) : hasRequiredPermition ||
    user?.selected_role?.role?.toLocaleLowerCase() == "ceo" ? (
    component
  ) : (
    <Navigate to={redirectTo} replace />
  );
}
