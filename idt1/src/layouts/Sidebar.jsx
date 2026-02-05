import React, { useState, useEffect } from "react";
// ✅ เพิ่ม useLocation เข้ามา
import { useNavigate, useLocation } from "react-router-dom";

import logo from "@/assets/images/logo.png";
import ToggleIcon from "@/assets/icons/Vector.svg";

/* ================= ICONS ================= */
import preview from "@/assets/icons/preview.svg";
import apreview from "@/assets/icons/apreview.svg";
import mit from "@/assets/icons/mit.svg";
import amit from "@/assets/icons/amit.svg";
import fortune from "@/assets/icons/fortune.svg";
import afortune from "@/assets/icons/afortune.svg";
import petroleum from "@/assets/icons/petroleum.svg";
import apetroleum from "@/assets/icons/apetroleum.svg";
import rubber from "@/assets/icons/rubber.svg";
import arubber from "@/assets/icons/arubber.svg";
import flow from "@/assets/icons/flow.svg";
import aflow from "@/assets/icons/aflow.svg";
import s50 from "@/assets/icons/s50.svg";
import as50 from "@/assets/icons/as50.svg";
import gold from "@/assets/icons/gold.svg";
import agold from "@/assets/icons/agold.svg";
import bidask from "@/assets/icons/bidask.svg";
import abidask from "@/assets/icons/abidask.svg";
import tickmatch from "@/assets/icons/tickmatch.svg";
import atickmatch from "@/assets/icons/atickmatch.svg";
import dr from "@/assets/icons/dr.svg";
import adr from "@/assets/icons/adr.svg";
import signinIcon from "@/assets/icons/signin.svg";
import signupIcon from "@/assets/icons/signup.svg";

/* ================= ICON MAP ================= */
const sidebarIcons = {
  preview: { default: preview, active: apreview },
  mit: { default: mit, active: amit },
  fortune: { default: fortune, active: afortune },
  petroleum: { default: petroleum, active: apetroleum },
  rubber: { default: rubber, active: arubber },
  flow: { default: flow, active: aflow },
  s50: { default: s50, active: as50 },
  gold: { default: gold, active: agold },
  bidask: { default: bidask, active: abidask },
  tickmatch: { default: tickmatch, active: atickmatch },
  dr: { default: dr, active: adr },
};

const getIcon = (key, active) =>
  active ? sidebarIcons[key].active : sidebarIcons[key].default;

/* ================= PROJECTS ================= */
const projects = [
  { id: "fortune", name: "หมอดูหุ้น", iconKey: "fortune" },
  { id: "petroleum", name: "Petroleum", iconKey: "petroleum" },
  { id: "rubber", name: "Rubber Thai", iconKey: "rubber" },
  { id: "flow", name: "Flow Intraday", iconKey: "flow" },
  { id: "s50", name: "S50", iconKey: "s50" },
  { id: "gold", name: "Gold", iconKey: "gold" },
  { id: "bidask", name: "BidAsk", iconKey: "bidask" },
  { id: "tickmatch", name: "TickMatch", iconKey: "tickmatch" },
  { id: "dr", name: "DR", iconKey: "dr" },
];

/* ================= INLINE ICONS ================= */
const CrownIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 pointer-events-none" fill={color}>
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19H5V18H19V19Z" />
  </svg>
);

const ProfileIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const LogoutIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

/* ================= 🔥 NEW FLOATING TOOLTIP 🔥 ================= */
const FloatingTooltip = ({ visible, top, text }) => {
  if (!visible) return null;
  return (
    <div
      style={{ top: top, left: 85 }} 
      className="fixed z-[10000] -translate-y-1/2 px-3 py-1.5 bg-[#333333] text-white text-[13px] rounded-md border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none whitespace-nowrap animate-fade-in"
    >
      <div className="absolute top-1/2 -left-1.5 -mt-1.5 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-[#333333]"></div>
      {text}
    </div>
  );
};

/* ================= SIDEBAR COMPONENT ================= */
export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
  openProject,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMember, setIsMember] = useState(false);
  const [unlockedList, setUnlockedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ State สำหรับ Modal ยืนยัน Logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State สำหรับ Tooltip
  const [tooltipState, setTooltipState] = useState({ visible: false, top: 0, text: "" });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("userProfile");
      if (!savedUser) return;
      const user = JSON.parse(savedUser);
      setUnlockedList(user.unlockedItems || []);
      setIsMember(user.role === "member" || user.unlockedItems?.length > 0);
    } catch (e) {
      console.error("Error parsing user profile", e);
    }
  }, []);

  /* ================= AUTH ACTIONS ================= */
  const handleSignUp = () => navigate("/register");
  const handleSignIn = () => navigate("/welcome");
  
  // 🟢 แก้ไข: เปลี่ยนจาก Logout ทันที เป็นแค่เปิด Modal
  const handleSignOutClick = () => {
    setShowLogoutModal(true);
  };

  // 🟢 ฟังก์ชันใหม่: Logout จริงๆ เมื่อกดปุ่มแดงใน Modal
  const confirmSignOut = () => {
    localStorage.removeItem("userProfile");
    setIsMember(false);
    setShowLogoutModal(false);
    navigate("/welcome");
    window.location.reload();
  };

  const handleNavigation = (id, projectItem = null) => {
    setActivePage(id);
    if (projectItem && openProject) openProject(projectItem);
    if (location.pathname !== "/dashboard") {
        navigate("/dashboard", { state: { goTo: id } });
    }
  };

  const handleMouseEnter = (e, text) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipState({
      visible: true,
      top: rect.top + (rect.height / 2),
      text: text
    });
  };

  const handleMouseLeave = () => {
    setTooltipState({ ...tooltipState, visible: false });
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.1s ease-out; }
      `}</style>

      {/* ✅ Floating Tooltip */}
      <FloatingTooltip 
        visible={tooltipState.visible} 
        top={tooltipState.top} 
        text={tooltipState.text} 
      />

      {/* ✅ LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[10002] bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#1F2937] p-8 rounded-lg shadow-2xl flex flex-col items-center gap-6 w-[400px] border border-white/10">
            <h2 className="text-lg text-gray-200 font-medium text-center">
              Are you sure you want to log out?
            </h2>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-2 rounded bg-[#9CA3AF] text-white font-semibold hover:bg-gray-500 transition"
              >
                CANCEL
              </button>
              <button
                onClick={confirmSignOut}
                className="px-6 py-2 rounded bg-[#EF4444] text-white font-semibold hover:bg-red-700 transition"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`fixed top-0 left-0 z-[9999] h-screen bg-gradient-to-b from-[#0c0f14] to-[#0a0d11] border-r border-white/10 flex flex-col transition-all duration-300 ${
          collapsed ? "w-[80px] items-center py-4" : "w-[280px] overflow-hidden"
        }`}
      >
        {/* ================= HEADER & LOGO ================= */}
        <div className={`flex items-center shrink-0 transition-all duration-300 ${collapsed ? "flex-col-reverse gap-6 mb-4" : "justify-between px-6 py-6"}`}>
          {!collapsed && <img src={logo} className="w-36 transition-opacity object-contain pointer-events-none" alt="logo" />}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`transition-all hover:opacity-100 p-1 rounded-full hover:bg-white/5 ${collapsed ? "opacity-60 rotate-180" : "opacity-60"}`}
          >
            <img src={ToggleIcon} className="w-4 pointer-events-none" alt="toggle" />
          </button>
        </div>

        {/* ================= STATUS BADGES ================= */}
        <div className={`flex shrink-0 transition-all duration-300 ${collapsed ? "flex-col gap-1 w-full px-2 mb-3" : "flex-row gap-2 px-6 mb-0"}`}>
           <div className={`font-bold rounded border text-emerald-400 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center transition-all whitespace-nowrap overflow-hidden
             ${collapsed ? "text-[10px] py-1 w-full" : "text-[11px] px-2 py-1 rounded-full"}`}
           >
               {collapsed ? "ONLINE" : "STATUS: ONLINE"}
           </div>

           <div className={`font-bold rounded border flex items-center justify-center transition-all whitespace-nowrap overflow-hidden
             ${isMember ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" : "text-sky-400 border-sky-500/30 bg-sky-500/10"}
             ${collapsed ? "text-[10px] py-1 w-full" : "text-[11px] px-2 py-1 rounded-full"}`}
           >
               {collapsed ? (isMember ? "MEMBER" : "FREE") : (isMember ? "MEMBERSHIP" : "FREE ACCESS")}
           </div>
        </div>

        {/* ================= MENU ITEMS ================= */}
        <nav 
          // ✅ คืนค่า overflow-y-auto เพื่อให้ Scroll ได้
          className={`flex-1 no-scrollbar w-full ${
            collapsed 
              ? "px-2 flex flex-col items-center gap-2 overflow-y-auto" 
              : "px-3 mt-4 overflow-y-auto"
          }`}
        >
          
          {/* SEARCH BAR */}
          <div className={`transition-all duration-300 mb-2 ${collapsed ? "w-10" : "w-full"}`}>
            <div 
              onClick={() => collapsed && setCollapsed(false)}
              onMouseEnter={(e) => handleMouseEnter(e, "Search")}
              onMouseLeave={handleMouseLeave}
              className={`relative group flex items-center bg-[#1A1D23] border border-white/5 rounded-lg transition-all 
              ${collapsed ? "w-10 h-10 justify-center cursor-pointer hover:bg-white/10" : "w-full h-10 px-4"}`}
            >
              <svg className={`w-4 h-4 text-gray-500 shrink-0 ${!collapsed && "mr-4"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {!collapsed && (
                <input
                  type="text"
                  placeholder="Search Something..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-gray-300 text-[13px] placeholder-gray-600 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Preview Button */}
          <button
            onClick={() => handleNavigation("preview-projects")} 
            onMouseEnter={(e) => handleMouseEnter(e, "Preview Projects")}
            onMouseLeave={handleMouseLeave}
            className={`rounded-lg flex items-center shrink-0 transition-all cursor-pointer relative group
            ${activePage === "preview-projects" ? "bg-slate-800 text-white" : "hover:bg-white/5 text-gray-300"}
            ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
          >
            <div className="relative flex items-center justify-center pointer-events-none">
                <img src={getIcon("preview", activePage === "preview-projects")} className="w-5" alt="preview" />
                {collapsed && (
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00ff47] rounded-full border-2 border-[#15181e]"></div>
                )}
            </div>
            {!collapsed && (
              <>
                <span className="pointer-events-none">Preview Projects</span>
                <div className="ml-auto w-2 h-2 bg-[#00ff47] rounded-full shadow-[0_0_5px_#00ff47]"></div>
              </>
            )}
          </button>

          {/* Beta Label */}
          {collapsed ? <div className="w-8 h-[1px] bg-white/10 my-1 shrink-0" /> : <div className="mt-6 mb-2 px-2 text-[11px] uppercase text-gray-500 shrink-0">Beta Tools</div>}

          {/* MIT Button */}
          <button
            onClick={() => handleNavigation("mit")} 
            onMouseEnter={(e) => handleMouseEnter(e, "MIT")}
            onMouseLeave={handleMouseLeave}
            className={`rounded-lg flex items-center shrink-0 transition-all relative group cursor-pointer
            ${activePage === "mit" ? "bg-slate-800 text-white" : "hover:bg-white/5 text-gray-300"}
            ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 justify-between"}`}
          >
             <div className={`flex items-center gap-3 pointer-events-none ${collapsed ? "justify-center w-full" : ""}`}>
               <img src={getIcon("mit", activePage === "mit")} className="w-5" alt="mit" />
               {!collapsed && <span>MIT</span>}
             </div>
             
             {collapsed ? (
               <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 pointer-events-none"></span>
             ) : (
               <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-400 text-black pointer-events-none">FREE</span>
             )}
          </button>

          {/* Member Label */}
          {collapsed ? <div className="w-8 h-[1px] bg-white/10 my-1 shrink-0" /> : <div className="mt-6 mb-2 px-2 text-[11px] uppercase text-gray-500 shrink-0">Membership Tools</div>}

          {/* Project List */}
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => {
              const active = activePage === p.id;
              const unlocked = unlockedList.includes(p.id);

              return (
                <button
                  key={p.id}
                  onClick={() => handleNavigation(p.id, p)}
                  onMouseEnter={(e) => handleMouseEnter(e, p.name)}
                  onMouseLeave={handleMouseLeave}
                  className={`rounded-lg flex items-center shrink-0 transition-all mb-1 cursor-pointer relative group
                  ${active ? "bg-slate-800" : "hover:bg-white/5"}
                  ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 justify-between"}`}
                >
                   <div className={`flex items-center gap-3 font-medium transition-colors pointer-events-none
                     ${active 
                       ? (unlocked ? "text-[#ffcc00]" : "text-white") 
                       : (unlocked ? "text-[#977100]" : "text-gray-400")
                     }
                     ${collapsed ? "justify-center w-full" : ""}`}
                   >
                      <img 
                        src={getIcon(p.iconKey, active)} 
                        className="w-5 transition-all" 
                        alt={p.name}
                        style={
                          active 
                            ? (unlocked 
                                ? { filter: "brightness(0) saturate(100%) invert(87%) sepia(26%) saturate(6838%) hue-rotate(359deg) brightness(101%) contrast(103%)" }
                                : { filter: "brightness(0) invert(1)" } 
                              )
                            : (unlocked 
                                ? { filter: "brightness(0) saturate(100%) invert(43%) sepia(70%) saturate(2264%) hue-rotate(24deg) brightness(92%) contrast(101%)" } 
                                : {} 
                              )
                        }
                      />
                      {!collapsed && <span>{p.name}</span>}
                   </div>
                   
                   {!collapsed && <CrownIcon color="#facc15" />}
                </button>
              );
            })
          ) : (
            !collapsed && <div className="text-gray-500 text-[12px] text-center mt-4">No projects found</div>
          )}

          {/* ================= ACCOUNT SECTION ================= */}
          {collapsed ? <div className="w-8 h-[1px] bg-white/10 my-1 shrink-0" /> : <div className="mt-6 mb-2 px-2 text-[11px] uppercase text-gray-500 shrink-0">Account</div>}

          {isMember ? (
            <>
              {/* Profile */}
              <button
                onClick={() => handleNavigation("profile")}
                onMouseEnter={(e) => handleMouseEnter(e, "Profile")}
                onMouseLeave={handleMouseLeave}
                className={`rounded-lg flex items-center shrink-0 transition-all mb-1 cursor-pointer relative group
                ${activePage === "profile" ? "bg-slate-800 text-white" : "hover:bg-white/5 text-gray-300"}
                ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
              >
                 <ProfileIconSVG />
                 {!collapsed && <span className="pointer-events-none">Profile</span>}
              </button>

              {/* Manage Subscription */}
              <button
                onClick={() => handleNavigation("subscription")}
                onMouseEnter={(e) => handleMouseEnter(e, "Manage Subscription")}
                onMouseLeave={handleMouseLeave}
                className={`rounded-lg flex items-center shrink-0 transition-all mb-1 cursor-pointer relative group
                ${activePage === "subscription" ? "bg-slate-800 text-white" : "hover:bg-white/5 text-gray-300"}
                ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
              >
                 <SettingsIconSVG />
                 {!collapsed && <span className="pointer-events-none">Manage Subscription</span>}
              </button>

              {/* Sign Out */}
              <button
                // 🟢 เรียกใช้ handleSignOutClick เพื่อเปิด Modal
                onClick={handleSignOutClick}
                onMouseEnter={(e) => handleMouseEnter(e, "Sign Out")}
                onMouseLeave={handleMouseLeave}
                className={`rounded-lg flex items-center shrink-0 transition-all mb-1 hover:bg-white/5 text-gray-300 cursor-pointer relative group
                ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
              >
                 <LogoutIconSVG />
                 {!collapsed && <span className="pointer-events-none">Sign Out</span>}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSignUp}
                onMouseEnter={(e) => handleMouseEnter(e, "Sign Up")}
                onMouseLeave={handleMouseLeave}
                className={`rounded-lg flex items-center shrink-0 transition-all mb-1 hover:bg-white/5 text-gray-300 cursor-pointer relative group
                ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
              >
                 <img src={signupIcon} alt="Sign Up" className="w-5 opacity-80 pointer-events-none" />
                 {!collapsed && <span className="pointer-events-none">Sign Up</span>}
              </button>

              <button
                onClick={handleSignIn}
                onMouseEnter={(e) => handleMouseEnter(e, "Sign In")}
                onMouseLeave={handleMouseLeave}
                className={`rounded-lg flex items-center shrink-0 transition-all hover:bg-white/5 text-gray-300 cursor-pointer relative group
                ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
              >
                 <img src={signinIcon} alt="Sign In" className="w-5 opacity-80 pointer-events-none" />
                 {!collapsed && <span className="pointer-events-none">Sign In</span>}
              </button>
            </>
          )}

          <div className="h-10 shrink-0" />
        </nav>

        {/* ================= FOOTER ================= */}
        <div className={`px-2 pb-2 w-full flex justify-center shrink-0`}>
          <button
            onClick={() => setActivePage("premiumtools")}
            onMouseEnter={(e) => handleMouseEnter(e, "Join Membership")}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center justify-center transition-all shadow-lg overflow-hidden shrink-0 cursor-pointer relative group
            ${collapsed 
              ? "w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400" 
              : "w-full h-11 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold gap-2"}`}
          >
            <CrownIcon color="#000" />
            {!collapsed && <span className="whitespace-nowrap pointer-events-none">Join Membership</span>}
          </button>
        </div>

      </aside>
    </>
  );
}