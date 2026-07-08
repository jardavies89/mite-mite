import { Navigate, Outlet } from "react-router-dom";

// Temporary: presence of VITE_ADMIN_SECRET is used as a stand-in for admin identity.
// Replace with a proper auth check (e.g. GitHub SSO) once auth is implemented.
const isAdmin = Boolean(import.meta.env.VITE_ADMIN_SECRET);

function RequireAdmin() {
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default RequireAdmin;
