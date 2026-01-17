import React from "react"
import { useRoutes } from "react-router-dom";
import { CustomerLayout } from "../layouts/CustomerLayout/CustomerLayout";
import { HomePage } from "../pages/HomePage";

export const AppRoutes = () => 
    useRoutes([
        {
            path: "/",
            element: <CustomerLayout/>,
            children: [
                {
                    path: "/",
                    element: <HomePage/>
                }
            ]
        }
    ])