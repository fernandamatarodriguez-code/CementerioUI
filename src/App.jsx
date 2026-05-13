import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Dashboard from "./pages/Dashboard";
import SearchNiches from "./pages/SearchNiches";
import AllocateNiche from "./pages/AllocateNiche";
import AvailableNiches from "./pages/AvailableNiches";
import NicheDetails from "./pages/NicheDetails";
import LoginPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <Routes>
      {/* Páginas de autenticación (SIN header) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />  
        <Route path="/forgot-password" element={<ForgotPassword />} />      
      </Route>

      {/* App (CON header global) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/niches/search" element={<SearchNiches />} />
        <Route path="/niches/allocate" element={<AllocateNiche />} />
        <Route path="/niches/available" element={<AvailableNiches />} />
        <Route path="/niches/:id" element={<NicheDetails />} />
      </Route>
    </Routes>
  );
}
