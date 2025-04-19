import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;
  const location = useLocation();

  if (!user || userRole !== "manager") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
