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
import UpdateBatchPage from "../pages/admin/inventory/UpdateBatchPage";
import CategoryDetail from "../pages/admin/category/CategoryDetail";
import { ShopLayout } from "../layouts/ShopLayout/ShopLayout";
import { BouquetCreateLayout } from "../layouts/BouquetCreateLayout/BouquetCreateLayout";
// import { BouquetCreatePage } from "../pages/bouquetCreate/BouquetCreatePage";
import { AdminProductList } from "../pages/admin/AdminProductList.jsx";
import { AdminPromotionList } from "../pages/admin/AdminPromotionList.jsx";
import { CustomerProductList } from "../pages/shop/CustomerProductList.jsx";
import { PromotionProvider } from "../contexts/PromotionContext.jsx";
import { CustomerProductDetail } from "../pages/shop/CustomerProductDetail.jsx";
import { CartPage } from "../pages/cart/CartPage.jsx";
import PaymentSuccess from "../pages/payment/PaymentSuccess.jsx";
import PaymentFailed from "../pages/payment/PaymentFailed.jsx";
import OrderPage from "../pages/order/OrderPage.jsx";
import { AdminUserList } from "../pages/admin/user/AdminUserList.jsx";
import StaffReviewsPage from "../pages/staff/reviews/StaffReviewsPage.jsx";
import { OccasionsPage } from "../pages/customer/OccasionsPage.jsx";
import { AboutPage } from "../pages/customer/AboutPage.jsx";
import { ContactPage } from "../pages/customer/ContactPage.jsx";
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
          <PromotionProvider>
            <CustomerLayout />
          </PromotionProvider>
        </CustomerGuard>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "orders",
          element: <OrderPage />,
        },
        {
          path: "occasions",
          element: <OccasionsPage />,
        },
        {
          path: "about",
          element: <AboutPage />,
        },
        {
          path: "contact",
          element: <ContactPage />,
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
          path: "inventory/create",
          element: <CreateBatchPage />,
        },
        {
          path: "inventory/:id/logs",
          element: <InventoryLogPage />,
        },
        {
          path: "inventory/:id/update",
          element: <UpdateBatchPage />,
        },
        {
          path: "categories",
          children: [
            { index: true, element: <Navigate to="list" replace /> },
            { path: "list", element: <ListCategories /> },
            { path: "create", element: <CreateCategory /> },
            { path: ":id", element: <CategoryDetail /> },
          ],
        },
        {
          path: "raw-material",
          children: [
            { index: true, element: <ListRawMaterials /> },
            { path: "create", element: <CreateRawMaterial /> },
            { path: ":id", element: <RawMaterialDetail /> },
          ],
        },
        {
          path: "orders",
          element: <OrderPage isAdmin={true} />,
        },
        {
          path: "users",
          element: <AdminUserList />,
        },
        {
          path: "reviews",
          element: <StaffReviewsPage />,
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
        {
          path: "orders",
          element: <OrderPage isAdmin={true} />,
        },
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
          path: "inventory/create",
          element: <CreateBatchPage />,
        },
        {
          path: "inventory/:id/logs",
          element: <InventoryLogPage />,
        },
        {
          path: "inventory/:id/update",
          element: <UpdateBatchPage />,
        },
        {
          path: "categories",
          children: [
            { index: true, element: <Navigate to="list" replace /> },
            { path: "list", element: <ListCategories /> },
            { path: "create", element: <CreateCategory /> },
            { path: ":id", element: <CategoryDetail /> },
          ],
        },
        {
          path: "reviews",
          element: <StaffReviewsPage />,
        },
        {
          path: "users",
          element: <AdminUserList />,
        },
      ],
    },
    {
      path: "/shop",
      element: (
        <PromotionProvider>
          <ShopLayout />
        </PromotionProvider>
      ),
      children: [
        { index: true, element: <CustomerProductList /> },
        // { path: "create", element: <CreateProduct /> }, // "/shop/create"
        { path: ":id", element: <CustomerProductDetail /> }, // "/shop/123"
      ],
    },
    {
      path: "/payment/success/:orderId",
      element: <PaymentSuccess />,
    },
    {
      path: "/payment/failed/:orderId",
      element: <PaymentFailed />,
    },
  ]);
