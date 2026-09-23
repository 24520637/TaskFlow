import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="page-loader">Preparing your workspace...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
