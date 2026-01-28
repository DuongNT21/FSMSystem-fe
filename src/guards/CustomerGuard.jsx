import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ADMIN_ROOT_PATH, STAFF_ROOT_PATH } from "../routes/path";

export const CustomerGuard = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. If loading, show loading screen
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 2. If user is logged in, check their role
  if (user) {
    const userRole = user.roleName;

    // Redirect Staff and Admin to their respective dashboards
    switch (userRole) {
      case "Admin":
        return <Navigate to={ADMIN_ROOT_PATH} replace />;
      case "Staff":
        return <Navigate to={STAFF_ROOT_PATH} replace />;
      case "User":
      default:
        // User role is allowed to access customer pages
        break;
    }
  }

  // 3. Allow access (either User role or not logged in)
  return children;
};
