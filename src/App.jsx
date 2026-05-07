import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Dashboard from "./pages/Dashboard";
import SearchNiches from "./pages/SearchNiches";
import AddNiche from "./pages/AddNiche";
import AvailableNiches from "./pages/AvailableNiches";
import NicheDetails from "./pages/NicheDetails";
import LoginPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />  
        <Route path="/forgot-password" element={<ForgotPassword />} />      
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/niches/search" element={<SearchNiches />} />
        <Route path="/niches/add" element={<AddNiche />} />
        <Route path="/niches/available" element={<AvailableNiches />} />
        <Route path="/niches/:id" element={<NicheDetails />} />
      </Route>
    </Routes>
  );
}
