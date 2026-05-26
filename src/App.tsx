import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/login";
import { ProtectedRoute } from "./components/auth/protected-route";
import { PublicRoute } from "./components/auth/public-route";
import { DashboardLayout } from "./components/layout/dashboard-layout";

// Admin Views
import { AdminDashboard } from "./pages/admin/dashboard";
import { AdminUsers } from "./pages/admin/users";
import { AdminRoles } from "./pages/admin/roles";
import { AdminVouchers } from "./pages/admin/vouchers";

// Staff Views
import { StaffDashboard } from "./pages/staff/dashboard";
import { StaffBooks } from "./pages/staff/books";
import { StaffCategories } from "./pages/staff/categories";
import { StaffOrders } from "./pages/staff/orders";
import { StaffPromotions } from "./pages/staff/promotions";
import { StaffInventory } from "./pages/staff/inventory";
import { StaffInventoryLogs } from "./pages/staff/inventory-logs";
import { StaffShipments } from "./pages/staff/shipments";

import { Toaster } from "@/components/ui/sonner";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Admin Dashboard Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="vouchers" element={<AdminVouchers />} />
        </Route>

        {/* Staff Dashboard Protected Routes */}
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="books" element={<StaffBooks />} />
          <Route path="categories" element={<StaffCategories />} />
          <Route path="orders" element={<StaffOrders />} />
          <Route path="promotions" element={<StaffPromotions />} />
          <Route path="inventory" element={<StaffInventory />} />
          <Route path="inventory/logs" element={<StaffInventoryLogs />} />
          <Route path="shipments" element={<StaffShipments />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
