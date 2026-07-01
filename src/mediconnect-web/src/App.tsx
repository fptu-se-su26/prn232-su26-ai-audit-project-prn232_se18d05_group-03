import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ScheduleManagementPage from "./pages/ScheduleManagementPage";
import ClinicDashboardPage from "./pages/ClinicDashboardPage";
import ManageServicesPage from "./pages/ManageServicesPage";
import RevenueDashboardPage from "./pages/RevenueDashboardPage";
import OperationsReportPage from "./pages/OperationsReportPage";
import UserManagementPage from "./pages/UserManagementPage";
import StaffManagementPage from "./pages/StaffManagementPage";
import DrugInteractionPage from "./pages/DrugInteractionPage";
import OtpSecurityPage from "./pages/OtpSecurityPage";
import { UserRole } from "./types";

import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function RoleProtectedRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles: UserRole[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/booking" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Patient]}>
                  <BookingPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Patient]}>
                  <AppointmentsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/clinic-dashboard"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Doctor, UserRole.Nurse, UserRole.Admin]}>
                  <ClinicDashboardPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/manage-services"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <ManageServicesPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/schedules"
              element={
                <ProtectedRoute>
                  <ScheduleManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/revenue"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <RevenueDashboardPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/reports/operations"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <OperationsReportPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/reports" element={<Navigate to="/reports/revenue" replace />} />
            <Route
              path="/admin/users"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <UserManagementPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <StaffManagementPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/drug-interactions"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <DrugInteractionPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/otp-security"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <OtpSecurityPage />
                </RoleProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

