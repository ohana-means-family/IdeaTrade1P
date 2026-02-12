import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ================= COMPONENT IMPORTS ================= */
import Navbar from "@/layouts/Navbar.jsx";
import Sidebar from "@/layouts/Sidebar.jsx";
import PreviewProjects from "@/pages/Dashboard/PreviewProjects.jsx";
import PremiumTools from "@/pages/Dashboard/PremiumTools.jsx";
import Profile from "@/pages/Profile/Profile.jsx";
import ManageSubscription from "@/pages/Profile/Subscriptions";

// --- Tools Components ---
import StockFortuneTeller from "@/pages/Tools/StockFortuneTeller";
import PetroleumInsights from "@/pages/Tools/PetroleumInsights";
import RubberThai from "@/pages/Tools/RubberThai";
import FlowIntraday from "@/pages/Tools/FlowIntraday";
import S50 from "@/pages/Tools/S50";
import Gold from "@/pages/Tools/Gold";
import BidAsk from "@/pages/Tools/BidAsk";
import TickMatch from "@/pages/Tools/TickMatch";
import DRInsight from "@/pages/Tools/DRInsight";

/* ================= CONSTANTS ================= */
const CHART_IMAGE_URL = "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1964&auto=format&fit=crop";

// ✅ 1. Mapping: จับคู่ ID -> Component ที่จะแสดงผล
// เพิ่ม Key ทั้งแบบตัวเล็ก (Sidebar id) และแบบชื่อเต็ม (Route path) เพื่อความชัวร์
const TOOL_COMPONENTS = {
  // Fortune
  fortune: StockFortuneTeller,
  "stock-fortune": StockFortuneTeller,

  // Petroleum
  petroleum: PetroleumInsights,
  "petroleum-preview": PetroleumInsights,

  // Rubber
  rubber: RubberThai,
  "RubberThai": RubberThai,

  // Flow
  flow: FlowIntraday,
  "FlowIntraday": FlowIntraday,

  // S50
  s50: S50,
  "S50": S50,

  // Gold
  gold: Gold,
  "Gold": Gold,

  // BidAsk
  bidask: BidAsk,
  "BidAsk": BidAsk,

  // TickMatch
  tickmatch: TickMatch,
  "TickMatch": TickMatch,

  // DR
  dr: DRInsight,
  "DRInsight": DRInsight,
};

const FULL_WIDTH_PAGES = []; 
const FULL_WIDTH_PATHS = [];

// ✅ 2. เพิ่ม ID ของ Tools ทั้งหมดลงในนี้ เพื่อให้แสดงผลเต็มจอ (ไม่มี Padding)
const NO_PADDING_PAGES = [
  "profile", 
  "subscription", 
  "mit",
  ...Object.keys(TOOL_COMPONENTS) // กระจาย key ทั้งหมดลงไปอัตโนมัติ
]; 

/* ================= MAIN COMPONENT: DASHBOARD ================= */
export default function Dashboard({ initialPage }) {
  const navigate = useNavigate();
  const location = useLocation();

  /* --- State --- */
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState(initialPage || "preview-projects");
  
  // Note: unlockedItems อาจไม่จำเป็นต้องใช้ในหน้านี้แล้ว 
  // หากคุณย้าย Logic การเช็คสิทธิ์ไปไว้ในแต่ละ Component
  const [unlockedItems, setUnlockedItems] = useState([]);

  /* --- Effects --- */
  useEffect(() => {
    if (location.state?.goTo) {
      setActivePage(location.state.goTo);
    } else {
      const path = location.pathname;
      
      // ✅ Check path mapping (เพิ่มให้ครบทุก Tools)
      if (path === "/stock-fortune" || path === "/fortune") setActivePage("fortune");
      else if (path.includes("/petroleum")) setActivePage("petroleum");
      else if (path.includes("/rubber") || path.includes("/RubberThai")) setActivePage("rubber");
      else if (path.includes("/flow") || path.includes("/FlowIntraday")) setActivePage("flow");
      else if (path.includes("/s50") || path.includes("/S50")) setActivePage("s50");
      else if (path.includes("/gold") || path.includes("/Gold")) setActivePage("gold");
      else if (path.includes("/bidask") || path.includes("/BidAsk")) setActivePage("bidask");
      else if (path.includes("/tickmatch") || path.includes("/TickMatch")) setActivePage("tickmatch");
      else if (path.includes("/dr") || path.includes("/DRInsight")) setActivePage("dr");
      
      else if (path.includes("/profile")) setActivePage("profile");
      else if (path.includes("/subscription")) setActivePage("subscription");
    }
  }, [location.state, location.pathname]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
      setUnlockedItems(user.unlockedItems || []);
    } catch (e) {
      console.error("Error loading user profile:", e);
    }
  }, []);

  useEffect(() => {
    if (initialPage) setActivePage(initialPage);
  }, [initialPage]);

  /* --- Helpers --- */
  const isFullWidthPage = () => {
    return FULL_WIDTH_PAGES.includes(activePage) || FULL_WIDTH_PATHS.includes(location.pathname);
  };

  const isNoPaddingPage = () => {
    // เช็คว่า activePage อยู่ในลิสต์ NO_PADDING_PAGES หรือไม่
    if (NO_PADDING_PAGES.includes(activePage)) return true;
    if (location.pathname.includes("/profile")) return true;
    return false;
  };

  /* --- Render Content Logic --- */
  const renderContent = () => {
    // 1. Profile & Subscriptions
    if (activePage === "profile") return <div className="w-full min-h-full bg-[#0f172a] p-8"><Profile /></div>;
    if (activePage === "subscription") return <div className="w-full min-h-full bg-[#0f172a] p-8"><ManageSubscription /></div>;
    
    // 2. Dashboard Home
    if (activePage === "preview-projects" || activePage === "whatsnew") return <PreviewProjects />;
    if (activePage === "premiumtools") return <PremiumTools />;

    // 3. MIT Page
    if (activePage === "mit") {
      return (
        <div className="relative w-full max-w-5xl mx-auto text-center py-4 animate-fade-in">
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
      );
    }

    // 4. ✅ Tools Rendering (Render แบบ Dynamic ตาม Map)
    // ตรงนี้จะทำให้ทุกไฟล์เปิดได้เหมือน StockFortuneTeller ครับ
    const ToolComponent = TOOL_COMPONENTS[activePage];
    if (ToolComponent) {
      return <ToolComponent />;
    }

    // Default Fallback
    return <PreviewProjects />;
  };

  /* --- Main Render --- */
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
        // ต้องแน่ใจว่า id ที่ส่งมา ตรงกับ key ใน TOOL_COMPONENTS (fortune, petroleum, etc.)
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
        <div className={isFullWidthPage() || isNoPaddingPage() ? "p-0" : "p-8 pb-20"}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}