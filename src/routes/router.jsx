import React from "react";
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
import ListCategories from "../pages/admin/category/ListCategories";
import CreateCategory from "../pages/admin/category/CreateCategory";
import { CustomerGuard } from "../guards/CustomerGuard";
import { RoleBasedGuard } from "../guards/RoleBasedGuard";
import { StaffLayout } from "../layouts/StaffLayout/StaffLayout";
import TestAdminPage from "../pages/admin/TestPage";
import InventoryPage from "../pages/admin/inventory/InventoryPage";
import InventoryLogPage from "../pages/admin/inventory/InventoryLogPage";
import CreateBatchPage from "../pages/admin/inventory/CreateBatchPage";
import CategoryDetail from "../pages/admin/category/CategoryDetail";
import { ShopLayout } from "../layouts/ShopLayout/ShopLayout";
import { BouquetCreateLayout } from "../layouts/BouquetCreateLayout/BouquetCreateLayout";
// import { BouquetCreatePage } from "../pages/bouquetCreate/BouquetCreatePage";
import { AdminProductList } from "../pages/admin/AdminProductList.jsx";
import { AdminPromotionList } from "../pages/admin/AdminPromotionList.jsx";
import { CustomerProductList } from "../pages/shop/CustomerProductList.jsx";
import { CustomerProductDetail } from "../pages/shop/CustomerProductDetail.jsx";
// import CategoryDetail from "../pages/admin/category/CategoryDetail";

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
          element: <Navigate to="test" replace />,
        },
        {
          path: "test",
          element: <TestAdminPage />,
        },

        // ===== CATEGORY (giữ nguyên code team) =====
        {
          path: "products",
          element: <AdminProductList />,
        },
        {
          path: "promotions",
          element: <AdminPromotionList />,
        },
        {
          path: "inventory",
          element: <InventoryPage />,
        },
        {
          path: "inventory/:id/logs",
          element: <InventoryLogPage />,
        },
        {
          path: "inventory/create",
          element: <CreateBatchPage />,
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
        { index: true, element: <Navigate to="list" replace /> },
        { path: "list", element: <ListCategories /> },
        { path: "create", element: <CreateCategory /> },
        { path: ":id", element: <CategoryDetail /> },
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
        { index: true, element: <CustomerProductList /> },
        // { path: "create", element: <CreateProduct /> }, // "/shop/create"
        { path: ":id", element: <CustomerProductDetail /> }, // "/shop/123"
      ],
    },
    
  ]);

