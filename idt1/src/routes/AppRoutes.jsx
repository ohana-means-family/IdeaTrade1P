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

      {/*  เพิ่มบรรทัดนี้ เพื่อให้กด tab Shortcuts แล้วมาหน้านี้ */}
      <Route path="/shortcuts" element={<PreviewProjects />} />
      
      {/* ถ้ามีหน้าอื่นๆ ใน Navbar ก็ต้องมาเพิ่มในนี้ด้วย เช่น */}
      <Route path="/fortune" element={<div>หน้าหมอดูหุ้น</div>} />

    </Routes>
  );
}