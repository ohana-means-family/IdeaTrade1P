import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

/* ================= CROWN ================= */
const CrownIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 pointer-events-none" fill={color}>
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19H5V18H19V19Z" />
  </svg>
);

/* ================= 🔥 REUSABLE TOOLTIP COMPONENT 🔥 ================= */
const Tooltip = ({ text }) => (
  // 🔥 ใช้ fixed เพื่อให้แน่ใจว่ามันจะลอยทะลุทุก Layer และไม่อิงกับ parent container ที่อาจจะบังอยู่
  // แต่เนื่องจากเราไม่รู้ตำแหน่ง Mouse ที่แน่นอนใน component นี้ เราจะใช้ absolute แบบเดิม
  // แต่หัวใจสำคัญคือการแก้ overflow-visible ที่ตัว nav ด้านล่างครับ
  <div className="absolute left-[calc(100%+15px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#333333] text-white text-[13px] rounded-md border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999]">
    {/* Arrow */}
    <div className="absolute top-1/2 -left-1.5 -mt-1.5 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-[#333333]"></div>
    {text}
  </div>
);

/* ================= SIDEBAR COMPONENT ================= */
export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
  openProject,
}) {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [unlockedList, setUnlockedList] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <aside
        // 🔥 ตั้ง z-index สูงสุด (z-[9999]) เพื่อให้ Sidebar ลอยทับหน้า Content หลัก
        className={`fixed top-0 left-0 z-[9999] h-screen bg-gradient-to-b from-[#0c0f14] to-[#0a0d11] border-r border-white/10 flex flex-col transition-all duration-300 ${
          collapsed ? "w-[80px] items-center py-4 overflow-visible" : "w-[280px] overflow-hidden"
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
          // 🔥 จุดสำคัญ: ถ้า collapsed ให้ใช้ overflow-visible เพื่อให้ Tooltip ทะลุออกมาได้
          // ถ้าไม่ collapsed ให้ใช้ overflow-y-auto เหมือนเดิมเพื่อเลื่อนดูรายการ
          className={`flex-1 no-scrollbar w-full ${
            collapsed 
              ? "px-2 flex flex-col items-center gap-2 overflow-visible" 
              : "px-3 mt-4 overflow-y-auto"
          }`}
        >
          
          {/* SEARCH BAR */}
          <div className={`transition-all duration-300 mb-2 ${collapsed ? "w-10" : "w-full"}`}>
            <div 
              onClick={() => collapsed && setCollapsed(false)}
              className={`relative group flex items-center bg-[#1A1D23] border border-white/5 rounded-lg transition-all 
              ${collapsed ? "w-10 h-10 justify-center cursor-pointer hover:bg-white/10" : "w-full h-10 px-3"}`}
            >
              <svg 
                className={`w-4 h-4 text-gray-500 shrink-0 ${!collapsed && "mr-2"}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {collapsed && <Tooltip text="Search" />}

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
            onClick={() => setActivePage("preview-projects")}
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

            {collapsed && <Tooltip text="Preview Projects" />}

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
            onClick={() => setActivePage("mit")}
            className={`rounded-lg flex items-center shrink-0 transition-all relative group cursor-pointer
            ${activePage === "mit" ? "bg-slate-800 text-white" : "hover:bg-white/5 text-gray-300"}
            ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 justify-between"}`}
          >
             <div className={`flex items-center gap-3 pointer-events-none ${collapsed ? "justify-center w-full" : ""}`}>
               <img src={getIcon("mit", activePage === "mit")} className="w-5" alt="mit" />
               {!collapsed && <span>MIT</span>}
             </div>
             
             {collapsed && <Tooltip text="MIT" />}

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
                  onClick={() => { setActivePage(p.id); if(openProject) openProject(p); }}
                  className={`rounded-lg flex items-center shrink-0 transition-all mb-1 cursor-pointer relative group
                  ${active ? "bg-slate-800" : "hover:bg-white/5"}
                  ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 justify-between"}`}
                >
                   {/* 🔥 ส่วนจัดการสี Text และ Icon (ปรับใหม่ตามเงื่อนไข) 🔥 */}
                   <div className={`flex items-center gap-3 font-medium transition-colors pointer-events-none
                     ${active 
                        ? (unlocked ? "text-[#facc15]" : "text-white") // ถ้าเลือก: ซื้อแล้ว=ทองสว่าง, ยังไม่ซื้อ=ขาว(เดิม)
                        : (unlocked ? "text-[#9E7F15]" : "text-gray-400") // ถ้าไม่เลือก: ซื้อแล้ว=ทองด้าน, ยังไม่ซื้อ=เทา
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
                                // Active + Unlocked = สีทองสว่าง (#facc15)
                                ? { filter: "brightness(0) saturate(100%) invert(87%) sepia(26%) saturate(6838%) hue-rotate(359deg) brightness(101%) contrast(103%)" }
                                // Active + Locked = สีขาว (Original)
                                : { filter: "brightness(0) invert(1)" } 
                              )
                            : (unlocked 
                                // Inactive + Unlocked = สีทองหม่นจากภาพ (#9E7F15)
                                ? { filter: "brightness(0) saturate(100%) invert(49%) sepia(77%) saturate(1634%) hue-rotate(24deg) brightness(93%) contrast(89%)" } 
                                // Inactive + Locked = สีเดิม (เทา)
                                : {} 
                              )
                        }
                      />
                      {!collapsed && <span>{p.name}</span>}
                   </div>
                   
                   {collapsed && <Tooltip text={p.name} />}
                   
                   {!collapsed && <CrownIcon color="#facc15" />}
                </button>
              );
            })
          ) : (
            !collapsed && <div className="text-gray-500 text-[12px] text-center mt-4">No projects found</div>
          )}

          {/* Account Label */}
          {collapsed ? <div className="w-8 h-[1px] bg-white/10 my-1 shrink-0" /> : <div className="mt-6 mb-2 px-2 text-[11px] uppercase text-gray-500 shrink-0">Account</div>}

          <button
            onClick={handleSignUp}
            className={`rounded-lg flex items-center shrink-0 transition-all mb-1 hover:bg-white/5 text-gray-300 cursor-pointer relative group
            ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
          >
             <img src={signupIcon} alt="Sign Up" className="w-5 opacity-80 pointer-events-none" />
             {!collapsed && <span className="pointer-events-none">Sign Up</span>}
             {collapsed && <Tooltip text="Sign Up" />}
          </button>

          <button
            onClick={handleSignIn}
            className={`rounded-lg flex items-center shrink-0 transition-all hover:bg-white/5 text-gray-300 cursor-pointer relative group
            ${collapsed ? "w-10 h-10 justify-center" : "w-full h-11 px-4 gap-3"}`}
          >
             <img src={signinIcon} alt="Sign In" className="w-5 opacity-80 pointer-events-none" />
             {!collapsed && <span className="pointer-events-none">Sign In</span>}
             {collapsed && <Tooltip text="Sign In" />}
          </button>

          <div className="h-10 shrink-0" />
        </nav>

        {/* ================= FOOTER ================= */}
        <div className={`px-2 pb-2 w-full flex justify-center shrink-0`}>
          <button
            onClick={() => setActivePage("premiumtools")}
            className={`flex items-center justify-center transition-all shadow-lg overflow-hidden shrink-0 cursor-pointer relative group
            ${collapsed 
              ? "w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400" 
              : "w-full h-11 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold gap-2"}`}
          >
            <CrownIcon color="#000" />
            {!collapsed && <span className="whitespace-nowrap pointer-events-none">Join Membership</span>}
            {collapsed && <Tooltip text="Join Membership" />}
          </button>
        </div>

      </aside>
    </>
  );
}