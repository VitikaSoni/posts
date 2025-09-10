import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import ROUTES from "@/configs/routes";

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (accessToken) {
    // Redirect logged-in users to /posts
    return <Navigate to={ROUTES.MY_POSTS} replace />;
  }

  return children;
};

export default PublicRoute;
