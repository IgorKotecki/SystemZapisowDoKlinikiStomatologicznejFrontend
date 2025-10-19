import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';
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

  //const claims = jwtDecode(accessToken);

  // Pobieranie claims z localStorage
  const claimsString = localStorage.getItem('claims');
  //console.log('siema siema elo elo ' , claimsString);
  //console.log(claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
  const claims = claimsString ? JSON.parse(claimsString) : null;
  console.log("siema siema ", claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
  // Brak claims lub brak wymaganej roli → przekieruj
  if (allowedRoles && (!claims || !allowedRoles.includes(claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]))) {
    return <Navigate to="/" replace />;
  }
  return children;
}
