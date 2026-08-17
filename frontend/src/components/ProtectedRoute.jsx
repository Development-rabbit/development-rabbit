import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDevMode } from "../hooks/useDevMode";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const { devModeEnabled } = useDevMode();
  const location = useLocation();

  if (devModeEnabled) return <Outlet />;
  if (loading) return <div className="p-10 text-center text-gray-500">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
