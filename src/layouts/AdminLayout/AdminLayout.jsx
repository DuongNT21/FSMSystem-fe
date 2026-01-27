import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
