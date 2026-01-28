import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  UserCircle,
  Flower2,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const StaffHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Menu button & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-rose-500 focus:outline-none"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link to="/staff" className="flex items-center gap-2 group">
            <div className="bg-rose-100 p-1.5 rounded-full group-hover:bg-rose-200 transition-colors">
              <Flower2 className="w-5 h-5 text-rose-600" />
            </div>
            <span className="hidden sm:block text-lg font-bold text-gray-800">
              Staff <span className="text-rose-500">Panel</span>
            </span>
          </Link>
        </div>

        {/* Right side - Notifications & User */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative text-gray-500 hover:text-rose-500 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800">
                  {user?.fullname || user?.username || "Staff"}
                </span>
                <span className="text-xs text-gray-500">Nhân viên</span>
              </div>
              <UserCircle className="w-8 h-8 text-rose-500" />
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                <Link
                  to="/staff/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>
                <Link
                  to="/staff/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Cài đặt
                </Link>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={() => {
                    handleLogout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
