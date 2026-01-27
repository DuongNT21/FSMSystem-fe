import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const GuestGuard = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Nếu đang tải (đang check localStorage), hiển thị loading hoặc null để tránh flick
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

  // 2. Nếu đã có user (đã đăng nhập) -> Đẩy về trang chủ ngay lập tức
  if (user && user.roleName === "User") {
    return <Navigate to="/" replace />;
  }

  if (user && user.roleName === "Staff") {
    return <Navigate to="/staff" replace />;
  }

  if (user && user.roleName === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  // 3. Nếu chưa đăng nhập -> Cho phép hiển thị trang (Login/Register)
  return children;
};
