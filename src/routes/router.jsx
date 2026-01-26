import React from "react";
import { useRoutes } from "react-router-dom";
import { CustomerLayout } from "../layouts/CustomerLayout/CustomerLayout";
import { HomePage } from "../pages/HomePage";
import { ShopLayout } from "../layouts/ShopLayout/ShopLayout";
import { ShopPage } from "../pages/ShopPage";

export const AppRoutes = () =>
  useRoutes([
    {
      path: "/",
      element: <CustomerLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
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
  ]);
