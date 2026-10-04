import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../admin/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Landing from "../pages/Landing";
import AgeGate from "../pages/AgeGate";
import Plans from "../pages/Plans";
import NotFound from "../pages/NotFound";
import CheckoutReturn from "../pages/CheckoutReturn";
import Redeem from "../pages/Redeem";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import DashboardPlaceholder from "../pages/auth/DashboardPlaceholder";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminContents from "../pages/admin/AdminContents";
import AdminCodes from "../pages/admin/AdminCodes";
import AdminClients from "../pages/admin/AdminClients";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminPlans from "../pages/admin/AdminPlans";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/age-gate" element={<AgeGate />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/checkout-return" element={<CheckoutReturn />} />
        <Route path="/redeem" element={<Redeem />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="contents" element={<AdminContents />} />
          <Route path="codes" element={<AdminCodes />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="plans" element={<AdminPlans />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
}
