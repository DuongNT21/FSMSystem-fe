import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { CustomerLayout } from "../layouts/CustomerLayout/CustomerLayout";
import { HomePage } from "../pages/HomePage";
import { GuestGuard } from "../guards/GuestGuard";
import { RoleBasedGuard } from "../guards/RoleBasedGuard";
import { CustomerGuard } from "../guards/CustomerGuard";
import { LoginPage } from "../pages/auth/LoginPage";
import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";
import TestAdminPage from "../pages/admin/TestPage";
import { StaffLayout } from "../layouts/StaffLayout/StaffLayout";
import RegisterPage from "../pages/auth/RegisterPage";
import ListRawMaterials from "../pages/staff/raw-material/ListRawMaterials";
import CreateRawMaterial from "../pages/staff/raw-material/CreateRawMaterial";
import RawMaterialDetail from "../pages/staff/raw-material/RawMaterialDetail";
import ListCategories from "../pages/admin/category/ListCategories";
import CreateCategory from "../pages/admin/category/CreateCategory";
import CategoryDetail from "../pages/admin/category/CategoryDetail";

export const AppRoutes = () =>
  useRoutes([
    {
      path: "/login",
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      ),
    },
    {
      path: "/register",
      element: (
        <GuestGuard>
          <RegisterPage />
        </GuestGuard>
      ),
    },
    {
      path: "/",
      element: (
        <CustomerGuard>
          <CustomerLayout />
        </CustomerGuard>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <RoleBasedGuard allowedRoles={["Admin"]}>
          <AdminLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/admin/test" replace />,
        },
        {
          path: "test",
          element: <TestAdminPage />,
        },
      ],
    },
    {
      path: "/admin/categories",
      element: (
        <RoleBasedGuard allowedRoles={["Admin"]}>
          <AdminLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="list" replace />,
        },
        {
          path: "list",
          element: <ListCategories />,
        },
        {
          path: "create",
          element: <CreateCategory />,
        },
        {
          path: ":id",
          element: <CategoryDetail />,
        },
      ],
    },
    {
      path: "/staff",
      element: (
        <RoleBasedGuard allowedRoles={["Staff"]}>
          <StaffLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/staff/raw-material" replace />,
        },
        {
          path: "raw-material",
          children: [
            { index: true, element: <ListRawMaterials /> },
            { path: "create", element: <CreateRawMaterial /> },
            { path: ":id", element: <RawMaterialDetail /> },
          ],
        },
      ],
    },
  ]);
