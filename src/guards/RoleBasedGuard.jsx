import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ADMIN_ROOT_PATH, STAFF_ROOT_PATH } from "../routes/path";

export const RoleBasedGuard = ({ children, allowedRoles = [] }) => {
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

  // 2. If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Get current user role
  const userRole = user.roleName;

  // 4. Check if user's role is allowed
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on user's actual role
    switch (userRole) {
      case "Admin":
        return <Navigate to={ADMIN_ROOT_PATH} replace />;
      case "Staff":
        return <Navigate to={STAFF_ROOT_PATH} replace />;
      case "User":
      default:
        return <Navigate to="/" replace />;
    }
  }

  // 5. Role is allowed, render the children
  return children;
};
