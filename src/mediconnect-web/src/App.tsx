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
import OutpatientRecordPage from "./pages/OutpatientRecordPage";
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
              path="/outpatient-record"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.Doctor, UserRole.Nurse]}>
                  <OutpatientRecordPage />
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
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

