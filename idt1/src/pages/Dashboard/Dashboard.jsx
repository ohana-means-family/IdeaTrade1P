// Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToggleIcon from "@/assets/icons/Vector.svg";
import WhatsNew from "@/pages/Dashboard/PreviewProjects.jsx";
import Navbar from "@/layouts/Navbar.jsx";
import Sidebar from "@/layouts/Sidebar.jsx";

/* ======================
   Blur Wrapper
====================== */
function BlurContent({ isLocked, title, children }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      <div className={`transition-all ${isLocked ? "blur-sm pointer-events-none" : ""}`}>
        {children}
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/70 p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold mb-2">{title} (Premium)</h3>
            <p className="text-sm text-gray-300 mb-4">
              โปรเจคนี้ต้องซื้อก่อนจึงจะเข้าใช้งานได้
            </p>
            <button
              onClick={() => navigate("/member-register")}
              className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold"
            >
              JOIN MEMBERSHIP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================
   Dashboard Page
====================== */
export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("whatsnew");
  const [activeTab, setActiveTab] = useState("Shortcuts");

  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const unlockedItems = user.unlockedItems || [];

  const PREMIUM_PROJECTS = {
    fortune: { title: "หมอดูหุ้น", desc: "วิเคราะห์แนวโน้มหุ้น" },
    petroleum: { title: "Petroleum", desc: "ตลาดน้ำมัน" },
    rubber: { title: "Rubber Thai", desc: "อุตสาหกรรมยาง" },
    flow: { title: "Flow Intraday", desc: "Flow นักลงทุน" },
    s50: { title: "S50", desc: "SET50" },
    gold: { title: "Gold", desc: "ราคาทองคำ" },
    bidask: { title: "BidAsk", desc: "Bid / Ask" },
    tickmatch: { title: "TickMatch", desc: "Tick Data" },
    dr: { title: "DR", desc: "Depositary Receipt" },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        openProject={() => {}}
      />

      <main className={`${collapsed ? "ml-0" : "ml-72"} px-10 py-8`}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activePage === "whatsnew" && <WhatsNew />}

        {Object.keys(PREMIUM_PROJECTS).map((key) => {
          if (activePage !== key) return null;

          // ✅ FIX: ปลดล็อคต่อโปรเจค
          const isUnlocked = unlockedItems.includes(key);

          return (
            <BlurContent
              key={key}
              isLocked={!isUnlocked}
              title={PREMIUM_PROJECTS[key].title}
            >
              <div className="bg-slate-800 p-8 rounded-xl">
                <h1 className="text-2xl font-bold">
                  {PREMIUM_PROJECTS[key].title}
                </h1>
                <p className="text-gray-300 mt-2">
                  {PREMIUM_PROJECTS[key].desc}
                </p>
              </div>
            </BlurContent>
          );
        })}
      </main>
    </div>
  );
}
