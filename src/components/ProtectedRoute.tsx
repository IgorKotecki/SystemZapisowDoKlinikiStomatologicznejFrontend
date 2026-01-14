import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type UserRole =
  | "Doctor"
  | "Receptionist"
  | "Registered_user"
  | "Unregistered_user"
  | "Admin";

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isLoggedIn, claims, initialized, userRole} = useAuth();
   console.log("ProtectedRoute context:", { initialized, isLoggedIn, claims, userRole });
  if (!initialized) {
    return null; 
  }

  if (!isLoggedIn || !claims) {
    return <Navigate to="/login" replace />;
  }

  const role =
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    claims.role ||
    claims.Role ||
    claims.roles?.[0] ||
    "Unregistered_user";

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
