import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/router";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer />
    </>
  );
}

export default App;
