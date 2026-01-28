import { Routes, Route } from "react-router-dom";

import Welcome from "@/pages/Welcome/Welcome";
import Register from "@/pages/Register/Register"; 
import MemberRegister from "@/pages/MemberRegister/MemberRegister";
import Dashboard from "@/pages/Dashboard/Dashboard";
import PreviewProjects from "@/pages/Dashboard/PremiumTools"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/member-register" element={<MemberRegister />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Shortcuts */}
      <Route path="/shortcuts" element={<PreviewProjects />} />

      {/* MIT ✅ */}
      <Route
        path="/mit"
        element={<Dashboard initialPage="mit" />}
      />

      {/* ตัวอย่างหน้าอื่น */}
      <Route path="/fortune" element={<div>หน้าหมอดูหุ้น</div>} />
    </Routes>
  );
}
