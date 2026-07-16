import { Navigate, Outlet } from "react-router-dom";

import { useAdminSession } from "@/api/mite_mite";

function RequireAdmin() {
  const { isAdmin, loading } = useAdminSession();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

export default RequireAdmin;
