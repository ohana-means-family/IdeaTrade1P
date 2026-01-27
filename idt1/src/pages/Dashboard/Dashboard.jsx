import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import WhatsNew from "@/pages/Dashboard/PreviewProjects.jsx";
import Navbar from "@/layouts/Navbar.jsx";
import Sidebar from "@/layouts/Sidebar.jsx";

// URL รูปกราฟสำหรับหน้า MIT
const CHART_IMAGE_URL =
  "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1964&auto=format&fit=crop";

/* ======================
   Blur Wrapper
====================== */
function BlurContent({ isLocked, title, children }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full mb-8">
      <div
        className={`transition-all duration-300 ${
          isLocked
            ? "blur-md pointer-events-none select-none opacity-50"
            : ""
        }`}
      >
        {children}
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-slate-900/90 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl backdrop-blur-sm max-w-sm mx-4">
            <div className="mb-4 text-4xl">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {title} (Premium)
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              เนื้อหานี้สงวนสิทธิ์สำหรับสมาชิก Premium <br />
              กรุณาอัปเกรดเพื่อเข้าใช้งาน
            </p>
            <button
              onClick={() => navigate("/member-register")}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:brightness-110 transition shadow-lg"
            >
              อัปเกรดสมาชิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================
   Dashboard
====================== */
export default function Dashboard() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // 🔑 state กลาง (ใช้ทั้ง Sidebar + Navbar)
  const [activePage, setActivePage] = useState("whatsnew");

  // user / permission
  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const unlockedItems = user.unlockedItems || [];

  const PREMIUM_PROJECTS = {
    fortune: { title: "หมอดูหุ้น", desc: "วิเคราะห์แนวโน้มหุ้นด้วย AI" },
    petroleum: { title: "Petroleum", desc: "ข้อมูลตลาดน้ำมันโลก" },
    rubber: { title: "Rubber Thai", desc: "อุตสาหกรรมยางพาราไทย" },
    flow: { title: "Flow Intraday", desc: "Flow นักลงทุนแบบเรียลไทม์" },
    s50: { title: "S50", desc: "SET50 / TFEX" },
    gold: { title: "Gold", desc: "ราคาทองคำและปัจจัย" },
    bidask: { title: "BidAsk", desc: "Volume & Bid/Ask" },
    tickmatch: { title: "TickMatch", desc: "Tick Data" },
    dr: { title: "DR", desc: "Depositary Receipt" },
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        openProject={() => {}}
      />

      {/* Main */}
      <main
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          collapsed ? "ml-0" : "ml-72"
        }`}
      >
        <div className="p-8 pb-20 min-h-full">
          {/* Navbar */}
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
          />

          {/* ===== CONTENT SWITCH ===== */}

          {/* Preview */}
          {activePage === "whatsnew" && <WhatsNew />}

          {/* MIT */}
          {activePage === "mit" && (
            <div className="max-w-5xl mx-auto text-center py-10">
              <h1 className="text-4xl font-bold mb-6">
                MIT : Multi-Agent Intelligent Analyst
              </h1>

              <img
                src={CHART_IMAGE_URL}
                alt="MIT Preview"
                className="rounded-2xl shadow-2xl mb-10"
              />

              <button
                onClick={() => navigate("/member-register")}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
              >
                Join Membership
              </button>
            </div>
          )}

          {/* Premium Projects */}
          {Object.keys(PREMIUM_PROJECTS).map((key) => {
            if (activePage !== key) return null;

            const isUnlocked = unlockedItems.includes(key);

            return (
              <BlurContent
                key={key}
                isLocked={!isUnlocked}
                title={PREMIUM_PROJECTS[key].title}
              >
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl min-h-[400px]">
                  <h1 className="text-3xl font-bold mb-4">
                    {PREMIUM_PROJECTS[key].title}
                  </h1>
                  <p className="text-gray-400">
                    {PREMIUM_PROJECTS[key].desc}
                  </p>
                </div>
              </BlurContent>
            );
          })}
        </div>
      </main>
    </div>
  );
}
