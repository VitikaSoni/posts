import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (!accessToken) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
