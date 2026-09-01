import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Landing Page
import { LandingPage } from './pages/Landing/LandingPage';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';

// Patient Pages
import { PatientDashboard } from './pages/Patient/PatientDashboard';
import { PatientProfile } from './pages/Patient/PatientProfile';
import { PatientMedicalRecord } from './pages/Patient/PatientMedicalRecord';
import { PatientMedications } from './pages/Patient/PatientMedications';
import { PatientPrescriptions } from './pages/Patient/PatientPrescriptions';
import { PatientLabs } from './pages/Patient/PatientLabs';
import { PatientAppointments } from './pages/Patient/PatientAppointments';

// Doctor Pages
import { DoctorDashboard } from './pages/Doctor/DoctorDashboard';
import { DoctorPatients } from './pages/Doctor/DoctorPatients';
import { DoctorAppointments } from './pages/Doctor/DoctorAppointments';
import { DoctorPrescriptions } from './pages/Doctor/DoctorPrescriptions';
import { DoctorLaboratory } from './pages/Doctor/DoctorLaboratory';
import { DoctorRadiology } from './pages/Doctor/DoctorRadiology';

// Hospital Manager Pages
import { ManagerDashboard } from './pages/HospitalManager/ManagerDashboard';
import { HospitalPatients } from './pages/HospitalManager/HospitalPatients';
import { HospitalDoctors } from './pages/HospitalManager/HospitalDoctors';
import { HospitalStaff } from './pages/HospitalManager/HospitalStaff';
import { HospitalDepartments } from './pages/HospitalManager/HospitalDepartments';
import { HospitalBeds } from './pages/HospitalManager/HospitalBeds';
import { HospitalAppointments } from './pages/HospitalManager/HospitalAppointments';
import { HospitalReports } from './pages/HospitalManager/HospitalReports';
import { HospitalStatistics } from './pages/HospitalManager/HospitalStatistics';

// Lab Analyst Pages
import { LabDashboard } from './pages/LabAnalyst/LabDashboard';
import { LabRequests } from './pages/LabAnalyst/LabRequests';
import { LabResults } from './pages/LabAnalyst/LabResults';
import { LabPatients } from './pages/LabAnalyst/LabPatients';
import { LabReports } from './pages/LabAnalyst/LabReports';

// Role Constants
import { ROLES } from './context/AuthContext';
import { ShieldAlert, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center p-6 text-center">
    <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-black text-slate-900 dark:text-white">غير مصرح بالدخول</h2>
      <p className="text-xs text-slate-500">ليس لديك الصلاحية السريرية أو الإدارية للوصول إلى هذا القسم.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors">
        <Home className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </Link>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center p-6 text-center">
    <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
      <h1 className="text-6xl font-black text-sky-600">404</h1>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">الصفحة غير موجودة</h2>
      <p className="text-xs text-slate-500">الصفحة المطلوبة غير متاحة أو تم نقلها.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors">
        <Home className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </Link>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Authentication Pages wrapped in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Patient Portal Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.PATIENT]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="medical-record" element={<PatientMedicalRecord />} />
        <Route path="medications" element={<PatientMedications />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="labs" element={<PatientLabs />} />
        <Route path="appointments" element={<PatientAppointments />} />
      </Route>

      {/* Doctor Portal Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="laboratory" element={<DoctorLaboratory />} />
        <Route path="radiology" element={<DoctorRadiology />} />
      </Route>

      {/* Hospital Manager Portal Routes */}
      <Route
        path="/hospital-manager"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.HOSPITAL_MANAGER]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="patients" element={<HospitalPatients />} />
        <Route path="doctors" element={<HospitalDoctors />} />
        <Route path="staff" element={<HospitalStaff />} />
        <Route path="departments" element={<HospitalDepartments />} />
        <Route path="beds" element={<HospitalBeds />} />
        <Route path="appointments" element={<HospitalAppointments />} />
        <Route path="reports" element={<HospitalReports />} />
        <Route path="statistics" element={<HospitalStatistics />} />
      </Route>

      {/* Lab Analyst Portal Routes */}
      <Route
        path="/lab-analyst"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.LAB_ANALYST]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<LabDashboard />} />
        <Route path="dashboard" element={<LabDashboard />} />
        <Route path="requests" element={<LabRequests />} />
        <Route path="results" element={<LabResults />} />
        <Route path="patients" element={<LabPatients />} />
        <Route path="reports" element={<LabReports />} />
      </Route>

      {/* Errors and Catch-All */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
