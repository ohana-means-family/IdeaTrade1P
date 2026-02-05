import React, { useState, useEffect } from "react"; // 1. อย่าลืม import useEffect
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import Sidebar from "@/layouts/Sidebar";

function MainLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("preview-projects");

  // ✅ เพิ่ม logic ให้ Sidebar รู้จักหน้า profile และ subscription
  useEffect(() => {
    if (location.pathname === "/profile") setActivePage("profile");
    if (location.pathname === "/subscription") setActivePage("subscription");
  }, [location.pathname]);

  // ✅ รายชื่อหน้าที่จะ "ซ่อน" Sidebar (Dashboard มันมี Sidebar ของมันเอง เราเลยซ่อนอันกลาง)
  // อย่าใส่ "/profile" ลงในนี้ เพราะหน้า Profile ไม่มี Sidebar เราเลยต้องใช้อันกลาง
  const hideSidebarPaths = ["/", "/register", "/member-register", "/welcome", "/dashboard"];
  
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white flex">
      {!shouldHideSidebar && (
        <Sidebar 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          activePage={activePage}
          setActivePage={setActivePage}
        />
      )}

      <main className={`flex-1 min-h-screen transition-all duration-300 relative ${
          shouldHideSidebar ? "ml-0 w-full" : collapsed ? "ml-[80px]" : "ml-[280px]"
        }`}>
        {/* ลบ Padding ออกถ้าต้องการให้พื้นหลังเต็มจอ หรือใส่ p-6 ถ้าอยากได้ขอบ */}
        <div className={shouldHideSidebar ? "p-0" : "p-0"}>
           <AppRoutes />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
       <MainLayout />
    </BrowserRouter>
  );
}

export default App;