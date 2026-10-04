import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import LoadingScreen from "./LoadingScreen";

export default function AdminRoute() {
  const { loading, profileLoading, session, profile, refreshProfile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (session && !loading) {
      void refreshProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  if (loading) return <LoadingScreen label="A verificar sessao..." />;

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (profileLoading) return <LoadingScreen label="A verificar permissoes..." />;

  if (!profile) return <LoadingScreen label="A carregar perfil..." />;

  if (profile.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
