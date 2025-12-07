import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public pages
import LandingPage from "./pages/public/LandingPage";
import RegisterPage from "./pages/public/RegisterPage";
import LoginPage from "./pages/public/LoginPage";

// Restaurant dashboard
import RestaurantDashboard from "./pages/restaurant/Dashboard";

// Admin panel
import AdminLogin from "./pages/admin/LoginPage";
import AdminDashboard from "./pages/admin/Dashboard";

// Customer ordering
import CustomerMenu from "./pages/customer/CustomerMenu";

// 404
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Restaurant Dashboard Routes */}
        <Route path="/restaurant/*" element={<RestaurantDashboard />} />

        {/* Admin Panel Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Customer Ordering Route */}
        <Route path="/menu/:slug" element={<CustomerMenu />} />

        {/* 404 */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
