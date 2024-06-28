import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const PrivateRoutes = ({ allowedRoles }) => {
  const { isAuthenticated, roles, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(roles)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};
