import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ================= COMPONENT IMPORTS ================= */
import Navbar from "@/layouts/Navbar.jsx";
import Sidebar from "@/layouts/Sidebar.jsx";
import PreviewProjects from "@/pages/Dashboard/PreviewProjects.jsx";
import PremiumTools from "@/pages/Dashboard/PremiumTools.jsx";
import Profile from "@/pages/Profile/Profile.jsx";
import ManageSubscription from "@/pages/Profile/Subscriptions";
import StockFortuneTeller from "@/pages/Tools/StockFortuneTeller";

/* ================= CONSTANTS ================= */
const CHART_IMAGE_URL = "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1964&auto=format&fit=crop";

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

// ✅ แก้ไข: เอา "stock-fortune" ออกจาก List นี้
// เพื่อให้หน้าหมอดูหุ้นเว้นระยะ Sidebar และจัดกึ่งกลางสวยงามเหมือนหน้า MIT
const FULL_WIDTH_PAGES = ["profile", "subscription"];
const FULL_WIDTH_PATHS = ["/profile", "/subscription"];

/* ================= SUB-COMPONENT: BLUR CONTENT ================= */
function BlurContent({ isLocked, title, children }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full mb-8">
      <div className={`transition-all duration-300 ${isLocked ? "blur-md pointer-events-none select-none opacity-50" : ""}`}>
        {children}
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-slate-900/90 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl backdrop-blur-sm max-w-lg mx-4">
            <div className="mb-4 text-4xl">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">{title} (Premium)</h3>
            <p className="text-sm text-gray-400 mb-6">
              This content is reserved for Premium members only.<br />Please upgrade to access it.
            </p>
            <button
              onClick={() => navigate("/dashboard", { state: { goTo: "premiumtools" } })}
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

/* ================= MAIN COMPONENT: DASHBOARD ================= */
export default function Dashboard({ initialPage }) {
  const navigate = useNavigate();
  const location = useLocation();

  /* --- State --- */
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState(initialPage || "preview-projects");
  const [unlockedItems, setUnlockedItems] = useState([]);

  /* --- Effects --- */
  // Sync activePage with URL or Navigation State
  useEffect(() => {
    if (location.state?.goTo) {
      setActivePage(location.state.goTo);
    } else {
      const path = location.pathname;
      if (path === "/stock-fortune") setActivePage("stock-fortune");
      else if (path === "/profile") setActivePage("profile");
      else if (path === "/subscription") setActivePage("subscription");
    }
  }, [location.state, location.pathname]);

  // Load User Permissions
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
      setUnlockedItems(user.unlockedItems || []);
    } catch (e) {
      console.error("Error loading user profile:", e);
    }
  }, []);

  // Sync with prop change
  useEffect(() => {
    if (initialPage) setActivePage(initialPage);
  }, [initialPage]);

  /* --- Helpers --- */
  const isFullWidthPage = () => {
    return FULL_WIDTH_PAGES.includes(activePage) || FULL_WIDTH_PATHS.includes(location.pathname);
  };

  /* --- Render --- */
  return (
    <div className="flex h-screen bg-[#0B0E14] text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={(page) => {
          if (page === "home") setActivePage("preview-projects");
          else setActivePage(page);
        }}
        openProject={(p) => setActivePage(p.id)}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          isFullWidthPage() 
            ? "ml-0" 
            : (collapsed ? "ml-[80px]" : "ml-[280px]")
        }`}
      >
        <div className={isFullWidthPage() ? "p-0" : "p-8 pb-20"}>
          
          {/* <Navbar activePage={activePage} setActivePage={setActivePage} /> */}

          {/* --- Page Routing Logic --- */}

          {/* Profile */}
          {(activePage === "profile" || location.pathname === "/profile") && (
             <div className="min-h-screen bg-[#0f172a] text-white"><Profile /></div>
          )}

          {/* Subscription */}
          {(activePage === "subscription" || location.pathname === "/subscription") && (
             <ManageSubscription />
          )}

          {/* Dashboard Projects */}
          {(activePage === "preview-projects" || activePage === "whatsnew") && <PreviewProjects />}
          {activePage === "premiumtools" && <PremiumTools />}

          {/* Stock Fortune Teller (แสดงผลแบบปกติ เว้น Sidebar) */}
          {(activePage === "stock-fortune" || location.pathname === "/stock-fortune") && (
             <StockFortuneTeller />
          )}

          {/* MIT Page */}
          {activePage === "mit" && (
            <div className="relative w-full max-w-5xl mx-auto text-center py-10 animate-fade-in">
              {/* MIT Content */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight whitespace-nowrap">
                  MIT : <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Multi-Agent Intelligent Analyst</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto tracking-tight whitespace-nowrap">
                  Multi-agent AI system that debates, validates risk, and delivers objective trading insights.
                </p>
                {/* MIT Chart Preview */}
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

          {/* Other Premium Projects (Locked) */}
          {Object.keys(PREMIUM_PROJECTS).map((key) => {
            if (activePage !== key) return null;
            const isUnlocked = unlockedItems.includes(key);

            return (
              <BlurContent key={key} isLocked={!isUnlocked} title={PREMIUM_PROJECTS[key].title}>
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl min-h-[400px]">
                  <h1 className="text-3xl font-bold mb-4">{PREMIUM_PROJECTS[key].title}</h1>
                  <p className="text-gray-400">{PREMIUM_PROJECTS[key].desc}</p>
                </div>
              </BlurContent>
            );
          })}

        </div>
      </main>
    </div>
  );
}