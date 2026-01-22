import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import ToggleIcon from "@/assets/icons/Vector.svg";
import mitIcon from "@/assets/icons/elements.png";

const projects = [
  { id: "fortune", name: "หมอดูหุ้น", free: false },
  { id: "petroleum", name: "Petroleum", free: false },
  { id: "rubber", name: "Rubber Thai", free: false },
  { id: "flow", name: "Flow Intraday", free: false },
  { id: "s50", name: "S50", free: false },
  { id: "gold", name: "Gold", free: false },
  { id: "bidask", name: "BidAsk", free: false },
  { id: "tickmatch", name: "TickMatch", free: false },
  { id: "dr", name: "DR", free: false },
];

const menuIcons = {
  "หมอดูหุ้น": (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M6 9h12v2H6zm8 5H6v-2h8zm4-6H6V6h12z" /></svg>),
  Petroleum: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M20 13c.55 0 1-.45 1-1s-.45-1-1-1h-1V5h1c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1h1v6H4c-.55 0-1 .45-1 1s.45 1 1 1h1v6H4c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1h-1v-6z" /></svg>),
  "Rubber Thai": (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M16 12 9 2 2 12h1.86L0 18h7v4h4v-4h7l-3.86-6z" /></svg>),
  "Flow Intraday": (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M6.99 11 3 15l3.99 4v-3H14v-2H6.99zM21 9l-3.99-4v3H10v2h7.01v3z" /></svg>),
  S50: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="m3.5 18.49 6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" /></svg>),
  Gold: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2" /></svg>),
  BidAsk: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04" /></svg>),
  TickMatch: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z" /></svg>),
  DR: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>),
};

const CrownIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill={color || "currentColor"}>
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
  </svg>
);

export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
  openProject,
}) {
  const [isMember, setIsMember] = useState(false); // สถานะรวม (เอาไว้โชว์ป้ายบน)
  const [unlockedList, setUnlockedList] = useState([]); // รายการที่ปลดล็อค (เอาไว้โชว์มงกุฎ)

  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      const hasPurchasedItems = user.unlockedItems && user.unlockedItems.length > 0;
      const isFullMember = user.role === "member";

      // 1. อัปเดตรายการที่ซื้อ
      if (user.unlockedItems) {
        setUnlockedList(user.unlockedItems);
      }

      // 🔥 2. แก้ตรงนี้: ถ้าเป็น Member หรือ มีของที่ซื้อแล้ว ให้ถือว่าเป็น Member (โชว์ป้ายฟ้า)
      if (isFullMember || hasPurchasedItems) {
        setIsMember(true);
      }
    }
  }, []);

  if (collapsed) return null;

  return (
    <aside className="fixed top-0 left-0 z-40 w-72 h-screen bg-slate-900/70 border-r border-sky-400/20 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 flex justify-between">
        <img src={logo} alt="Idea Trade" className="w-40" />
        <button onClick={() => setCollapsed(true)}>
          <img src={ToggleIcon} className="w-4 h-4" />
        </button>
      </div>

      {/* Status */}
      <div className="px-6 py-4 flex gap-2 text-xs">
        {isMember ? (
          // ถ้าซื้อแล้ว (ไม่ว่าจะเหมาหรือแยกชิ้น) ขึ้น Membership สีฟ้า
          <span className="px-2 py-0.5 rounded-full bg-sky-600/20 text-sky-400 font-bold border border-sky-500/30 flex items-center gap-1">
             <CrownIcon color="#38bdf8" /> MEMBERSHIP
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-sky-600/20 text-sky-400">
            FREE ACCESS
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
          STATUS: ONLINE
        </span>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <input
          placeholder="Search Something..."
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4 text-sm space-y-2 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => setActivePage("whatsnew")}
          className={`w-full px-4 py-2 rounded-lg flex justify-between
            ${activePage === "whatsnew" ? "bg-sky-500/20 text-sky-300" : "hover:bg-white/5 text-gray-300"}`}
        >
          Preview Projects
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <div className="text-gray-400 uppercase text-xs mt-6 mb-2">Beta Tools</div>

        <button
          onClick={() => setActivePage("dashboard")}
          className={`w-full px-4 py-2 rounded-lg flex justify-between
            ${activePage === "dashboard" ? "bg-sky-500/20 text-sky-300" : "hover:bg-white/5 text-gray-300"}`}
        >
          <div className="flex gap-3">
            <img src={mitIcon} className="w-5 h-5" />
            <span>MIT</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-400 text-black">FREE</span>
        </button>

        <div className="text-gray-400 uppercase text-xs mt-6 mb-2">Premium Tools</div>

        {projects.filter(p => !p.free).map(project => {
            // เช็คว่าอันไหนซื้อแล้ว
            const isUnlocked = unlockedList.includes(project.id);

            return (
              <button
                key={project.id}
                onClick={() => openProject(project)}
                className="w-full px-4 py-2 rounded-lg flex justify-between hover:bg-white/5 text-gray-300 group"
              >
                <div className="flex gap-3">
                  <span className={`transition-colors ${isUnlocked ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-300'}`}>
                    {menuIcons[project.name]}
                  </span>
                  <span>{project.name}</span>
                </div>
                
                {/* ถ้าซื้ออันไหน มงกุฎอันนั้นเป็นสีฟ้า อันที่ยังไม่ซื้อเป็นสีทอง */}
                <CrownIcon color={isUnlocked ? "#38bdf8" : "#fbbf24"} />
              </button>
            );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-sm text-gray-400">
        {isMember ? (
            <button 
                onClick={() => {
                    localStorage.removeItem("userProfile");
                    window.location.reload();
                }}
                className="text-red-400 hover:text-red-300 w-full text-left flex items-center gap-2"
            >
                <span>Log Out</span>
            </button>
        ) : (
            "Upgrade to Pro"
        )}
      </div>
    </aside>
  );
}