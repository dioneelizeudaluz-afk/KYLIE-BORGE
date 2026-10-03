import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import LoadingScreen from "./LoadingScreen";

export default function AdminRoute() {
  const { loading, session, profile } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!profile || profile.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
