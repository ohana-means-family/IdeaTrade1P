import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Welcome from "../pages/Welcome/Welcome";
import Register from "../pages/Register/Register";
import MemberRegister from "../pages/MemberRegister/MemberRegister";
import Dashboard from "../pages/Dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/member-register" element={<MemberRegister />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
