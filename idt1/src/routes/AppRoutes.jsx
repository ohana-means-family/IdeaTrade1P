// idt1/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Landing from "@/pages/Landing/Landing";
import Welcome from "@/pages/Welcome/Welcome";
import Register from "@/pages/Register/Register";
import MemberRegister from "@/pages/MemberRegister/MemberRegister";
import Dashboard from "@/pages/Dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🌐 Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/member-register" element={<MemberRegister />} />

      {/* 🔐 Protected */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
