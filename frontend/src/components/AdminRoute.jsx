import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDevMode } from "../hooks/useDevMode";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const { devModeEnabled } = useDevMode();

  if (devModeEnabled) return <Outlet />;
  if (loading) return <div className="p-10 text-center text-gray-500">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
