import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "@/pages/Welcome/Welcome";
import Register from "@/pages/Register/Register"; 
import MemberRegister from "@/pages/MemberRegister/MemberRegister";
import Dashboard from "@/pages/Dashboard/Dashboard";
import PremiumTools from "@/pages/Dashboard/PremiumTools"; 
import ManageSubscription from "@/pages/Profile/Subscriptions"; 
import Profile from "@/pages/Profile/Profile"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/member-register" element={<MemberRegister />} />

      {/* Dashboard Main */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* ✅ เรียกใช้ Component Profile ที่เพิ่ง Import มา */}
      <Route path="/profile" element={<Profile />} />

      {/* Placeholder ส่วนอื่นๆ */}
      <Route path="/preview-projects" element={<PremiumTools />} />
      <Route path="/shortcuts" element={<Navigate to="/preview-projects" replace />} />
      <Route path="/mit" element={<Dashboard initialPage="mit" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/profile" element={<Dashboard initialPage="profile" />} />
      <Route path="/subscription" element={<Dashboard initialPage="subscription" />} />
    </Routes>
  );
}