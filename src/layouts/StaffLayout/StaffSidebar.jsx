import React from "react";
import { NavLink } from "react-router-dom";
import {
  FlaskConical,
  ShoppingBag,
  Package,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const StaffSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  // Sidebar navigation items
  const navItems = [
    { to: "/staff/raw-material", icon: FlaskConical, label: "Nguyên liệu" },
    { to: "/staff/orders", icon: ShoppingBag, label: "Đơn hàng" },
    { to: "/staff/products", icon: Package, label: "Sản phẩm" },
    { to: "/staff/reviews", icon: MessageSquare, label: "Đánh giá" },
  ];

  const sidebarLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg transition-all duration-200 ${
      isSidebarCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3"
    } ${
      isActive
        ? "bg-rose-500 text-white shadow-md"
        : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
    }`;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 z-30 transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Collapse Toggle Button - Desktop Only */}
        <div className="hidden lg:flex justify-end p-2 border-b border-gray-100">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title={isSidebarCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={sidebarLinkClass}
              onClick={() => setIsSidebarOpen(false)}
              title={isSidebarCollapsed ? item.label : ""}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};
