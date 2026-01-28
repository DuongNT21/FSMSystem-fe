import React from "react";;
import { Navigate, useRoutes } from "react-router-dom";
import { CustomerLayout } from "../layouts/CustomerLayout/CustomerLayout";
import { HomePage } from "../pages/HomePage";
import { GuestGuard } from "../guards/GuestGuard";
import { LoginPage } from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";
import ListRawMaterials from "../pages/staff/raw-material/ListRawMaterials";
import CreateRawMaterial from "../pages/staff/raw-material/CreateRawMaterial";
import RawMaterialDetail from "../pages/staff/raw-material/RawMaterialDetail";
import { ShopLayout } from "../modules/shop/ShopLayout";
import { ShopPage } from "../modules/shop/pages/ShopPage";
import { BouquetCreateLayout } from "../modules/createBouquets/BouquetCreateLayout";
import { BouquetCreatePage } from "../modules/createBouquets/pages/BouquetCreatePage";
import { CustomerGuard } from "../guards/CustomerGuard";
import { RoleBasedGuard } from "../guards/RoleBasedGuard";
import { StaffLayout } from "../layouts/StaffLayout/StaffLayout";
import TestAdminPage from "../pages/admin/TestPage";

export const AppRoutes = () =>
  useRoutes([
    {
      path: "/login",
      element: (
        <GuestGuard>
          <LoginPage/>
        </GuestGuard>
      ),
    },
    {
      path: "/register",
      element: (
        <GuestGuard>
          <RegisterPage/>
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
    {
      path: "/shop",
      element: <ShopLayout />,
      children: [
        { index: true, element: <ShopPage /> },
        // { path: "create", element: <CreateProduct /> }, // "/shop/create"
        // { path: ":id", element: <ProductDetail /> }, // "/shop/123"
      ],
    },
    {
      path: "/shop/create",
      element: <BouquetCreateLayout/>,
      children: [
        { index: true, element: <BouquetCreatePage /> },
        // { path: "create", element: <CreateProduct /> }, // "/shop/create"
        // { path: ":id", element: <ProductDetail /> }, // "/shop/123"
      ],
    },
  ]);