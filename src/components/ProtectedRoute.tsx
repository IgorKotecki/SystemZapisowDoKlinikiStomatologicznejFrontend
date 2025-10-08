import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';

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

  // Pobieranie claims z localStorage
  const claimsString = localStorage.getItem('claims');
  const claims = claimsString ? JSON.parse(claimsString) : null;

  // Brak claims lub brak wymaganej roli → przekieruj
  if (allowedRoles && (!claims || !allowedRoles.includes(claims.role))) {
    return <Navigate to="/" replace />;
  }
  return children;
}
