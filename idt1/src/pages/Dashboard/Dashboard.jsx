import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ================= PAGES =================
import PreviewProjects from "@/pages/Dashboard/PreviewProjects.jsx";
import PremiumTools from "@/pages/Dashboard/PremiumTools.jsx";
import Navbar from "@/layouts/Navbar.jsx";
import Sidebar from "@/layouts/Sidebar.jsx";

// ✅ Import หน้า Profile และ Subscription
import Profile from "@/pages/Profile/Profile.jsx";
// ตรวจสอบ Path นี้ให้ตรงกับไฟล์จริงของคุณนะครับ (บางทีอาจอยู่ที่ pages/Subscription/ManageSubscription)
import ManageSubscription from "@/pages/Profile/Subscriptions"; 

// URL รูปกราฟหน้า MIT
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
          <div className="bg-slate-900/90 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl backdrop-blur-sm max-w-lg mx-4">
            <div className="mb-4 text-4xl">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {title} (Premium)
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              This content is reserved for Premium members only.
              <br />
              Please upgrade to access it.
            </p>
            <button
              onClick={() =>
                navigate("/dashboard", {
                  state: { goTo: "premiumtools" },
                })
              }
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:brightness-110 transition shadow-lg cursor-pointer"
            >
              Join Membership
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================
   Dashboard Page (Main)
====================== */
export default function Dashboard({ initialPage }) { // ✅ รับ prop initialPage
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  // ✅ ใช้ initialPage เป็นค่าเริ่มต้น (ถ้ามี)
  const [activePage, setActivePage] = useState(initialPage || "preview-projects");
  const [unlockedItems, setUnlockedItems] = useState([]);

  // ✅ รับค่า goTo จาก navigate (Join Membership) หรือ URL
  useEffect(() => {
    if (location.state?.goTo) {
      setActivePage(location.state.goTo);
    }
  }, [location.state]);

  // โหลดสิทธิ์ user
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
      setUnlockedItems(user.unlockedItems || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const PREMIUM_PROJECTS = {
    fortune: { title: "หมอดูหุ้น", desc: "วิเคราะห์แนวโน้มหุ้นด้วย AI" },
    petroleum: { title: "Petroleum", desc: "ข้อมูลตลาดน้ำมันโลก" },
    rubber: { title: "Rubber Thai", desc: "อุตสาหกรรมยางพาราไทย" },
    flow: { title: "Flow Intraday", desc: "ติดตาม Flow นักลงทุน" },
    s50: { title: "S50", desc: "ดัชนี SET50 และ TFEX" },
    gold: { title: "Gold", desc: "วิเคราะห์ราคาทองคำ" },
    bidask: { title: "BidAsk", desc: "Volume Bid / Ask" },
    tickmatch: { title: "TickMatch", desc: "Tick Data" },
    dr: { title: "DR", desc: "Depositary Receipt" },
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={(page) => {
          if (page === "home") {
            setActivePage("preview-projects");
          } else {
            setActivePage(page);
          }
        }}
        // เพิ่มบรรทัดนี้เพื่อให้ Sidebar สั่งเปลี่ยนหน้าได้จริง (ตามโค้ด Sidebar ก่อนหน้า)
        openProject={(p) => setActivePage(p.id)}
      />

      {/* Main Content */}
      <main
        // 🔴 จุดที่แก้ไข: ปรับ Margin ให้ตรงกับขนาด Sidebar (80px ตอนย่อ, 280px ตอนขยาย)
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          collapsed ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        {/* ✅ ปรับ Container: ถ้าเป็นหน้า Profile/Sub ให้เอา Padding ออก (p-0) เพื่อให้เต็มจอ */}
        <div className={["profile", "subscription"].includes(activePage) ? "p-0" : "p-8 pb-20"}>
          
          {/* <Navbar activePage={activePage} setActivePage={setActivePage} /> */}

          {/* ✅ 1. ส่วนแสดงผล Profile */}
          {activePage === "profile" && (
             <div className="min-h-screen bg-[#0f172a] text-white"> {/* ใส่ BG สีเข้มรองไว้ */}
                <Profile />
             </div>
          )}

          {/* ✅ 2. ส่วนแสดงผล Manage Subscription */}
          {activePage === "subscription" && (
             <ManageSubscription />
          )}

          {/* ===== Preview Projects ===== */}
          {(activePage === "preview-projects" ||
            activePage === "whatsnew") && <PreviewProjects />}

          {/* ===== Premium Tools ===== */}
          {activePage === "premiumtools" && <PremiumTools />}

          {/* ===== MIT ===== */}
          {activePage === "mit" && (
            <div className="relative w-full max-w-5xl mx-auto text-center py-10 animate-fade-in">
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight whitespace-nowrap">
                  MIT : <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Multi-Agent Intelligent Analyst</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto tracking-tight whitespace-nowrap">
                  Multi-agent AI system that debates, validates risk, and delivers objective trading insights.
                </p>
                <div className="relative group mx-auto max-w-4xl mb-12">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                  <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-slate-800/50 px-4 py-2 flex items-center gap-2 border-b border-white/5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="aspect-video w-full bg-slate-900 relative group">
                      <img src={CHART_IMAGE_URL} alt="Chart Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700 ease-in-out" />
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate("/member-register")} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer">
                  Start Using Tool
                </button>
              </div>
            </div>
          )}

          {/* ===== Other Premium Pages ===== */}
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