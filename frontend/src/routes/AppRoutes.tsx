import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { USER_ROLES } from "../constants";
import { AuthContext } from "../contexts/AuthContext";
import { PrivateRoutes } from "./PrivateRoutes";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { CreatePolicyPage } from "../pages/CreatePolicyPage/CreatePolicyPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { AgentsPage } from "../pages/AgentsPage/AgentsPage";
import { CreateAgentPage } from "../pages/CreateAgentPage/CreateAgentPage";

export const AppRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route element={<PrivateRoutes allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SALES_AGENT]} />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/create-policy" element={<CreatePolicyPage />}></Route>

        <Route element={<PrivateRoutes allowedRoles={[USER_ROLES.ADMIN]} />}>
          <Route path="/agents" element={<AgentsPage />}></Route>
          <Route path="/create-agent" element={<CreateAgentPage />}></Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}></Route>
    </Routes>
  );
};
