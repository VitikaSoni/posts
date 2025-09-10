import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/store";
import { refreshAccessToken } from "@/store/authSlice";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        try {
          // Try to refresh the token
          await dispatch(refreshAccessToken() as any).unwrap();
        } catch (error) {
          // If refresh fails, user will be redirected to login
          console.log("Token refresh failed in ProtectedRoute:", error);
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [dispatch, accessToken]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!accessToken) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
