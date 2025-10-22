import { Navigate } from "react-router-dom";
import { storage } from "../utils/storage";
import { jwtDecode } from "jwt-decode";

type UserRole =
  | "Doctor"
  | "Receptionist"
  | "Registered_user"
  | "Unregistered_user"
  | "Admin";

interface Props {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = storage.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let claims: any = null;

  try {
    // 1️⃣ Spróbuj zdekodować token
    claims = jwtDecode(token);
  } catch {
    // 2️⃣ Jeśli nie da się zdekodować, spróbuj z localStorage
    const claimsString = localStorage.getItem("claims");
    claims = claimsString ? JSON.parse(claimsString) : null;
  }

  if (!claims) {
    console.warn("Brak danych użytkownika — przekierowanie do logowania");
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Pobierz rolę z JWT (Azure lub backend custom claim)
  const role =
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    claims.role ||
    claims.Role ||
    claims.roles?.[0];

  console.log("ProtectedRoute → decoded role:", role);

  // 4️⃣ Sprawdź uprawnienia
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(`Brak dostępu: rola ${role} nie jest w ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return children;
}
