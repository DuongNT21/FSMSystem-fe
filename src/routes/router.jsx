import React from "react";
import { useRoutes } from "react-router-dom";
import { CustomerLayout } from "../layouts/CustomerLayout/CustomerLayout";
import { HomePage } from "../pages/HomePage";
import { ShopPage } from "../modules/shop/pages/ShopPage";
import { ShopLayout } from "../modules/shop/ShopLayout";
import { BouquetCreateLayout } from "../modules/createBouquets/BouquetCreateLayout";
import { BouquetCreatePage } from "../modules/createBouquets/pages/BouquetCreatePage";

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
