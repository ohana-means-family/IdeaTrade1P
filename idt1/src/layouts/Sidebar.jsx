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
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill={color}>
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19H5V18H19V19Z" />
  </svg>
);

/* ================= SIDEBAR ================= */
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

  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    if (!savedUser) return;
    const user = JSON.parse(savedUser);
    setUnlockedList(user.unlockedItems || []);
    setIsMember(user.role === "member" || user.unlockedItems?.length > 0);
  }, []);

  if (collapsed) return null;

  return (
    <aside className="fixed top-0 left-0 z-40 w-[280px] h-screen
      bg-gradient-to-b from-[#0c0f14] to-[#0a0d11]
      border-r border-white/10 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6 flex justify-between items-center">
        <img src={logo} className="w-36" />
        <button onClick={() => setCollapsed(true)}>
          <img src={ToggleIcon} className="w-4 opacity-60" />
        </button>
      </div>

      {/* Status */}
      <div className="px-6 flex gap-2 text-[11px]">
        <span
          className={`px-2 py-1 rounded-full
          ${isMember
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-sky-500/20 text-sky-400"}`}
        >
          {isMember ? "MEMBERSHIP" : "FREE ACCESS"}
        </span>
        <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
          STATUS: ONLINE
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 mt-6 text-sm overflow-y-auto">

        {/* Preview */}
        <button
          onClick={() => setActivePage("preview-projects")}
          className={`w-full h-11 px-4 rounded-lg flex items-center
          ${activePage === "preview-projects"
            ? "bg-slate-800 text-white"
            : "hover:bg-white/5 text-gray-300"}`}
        >
          <img src={getIcon("preview", activePage === "preview-projects")} className="w-5 mr-3" />
          Preview Projects
        </button>

        {/* Beta */}
        <div className="mt-6 mb-2 px-2 text-[11px] uppercase text-gray-500">
          Beta Tools
        </div>

        <button
          onClick={() => setActivePage("mit")}
          className={`w-full h-11 px-4 rounded-lg flex items-center justify-between
          ${activePage === "mit"
            ? "bg-slate-800 text-white"
            : "hover:bg-white/5 text-gray-300"}`}
        >
          <div className="flex items-center gap-3">
            <img src={getIcon("mit", activePage === "mit")} className="w-5" />
            MIT
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-400 text-black">
            FREE
          </span>
        </button>

        {/* Membership */}
        <div className="mt-6 mb-2 px-2 text-[11px] uppercase text-gray-500">
          Membership Tools
        </div>

        {projects.map((p) => {
          const active = activePage === p.id;
          const unlocked = unlockedList.includes(p.id);

          return (
            <button
              key={p.id}
              onClick={() => {
                setActivePage(p.id);
                openProject?.(p);
              }}
              className={`w-full h-11 px-4 rounded-lg flex items-center justify-between
              ${active
                ? "bg-slate-800 text-white"
                : "hover:bg-white/5 text-gray-400"}`}
            >
              <div className="flex items-center gap-3">
                <img src={getIcon(p.iconKey, active)} className="w-5" />
                {p.name}
              </div>
              <CrownIcon color={unlocked ? "#38bdf8" : "#facc15"} />
            </button>
          );
        })}

        <div className="h-10" />
      </nav>

      {/* ✅ Join Membership (แก้ตรงนี้สำคัญที่สุด) */}
      <div className="px-4 pb-6">
        <button
          onClick={() => setActivePage("premiumtools")}
          className="w-full h-11 rounded-xl
          bg-gradient-to-r from-yellow-400 to-amber-400
          text-black font-semibold flex items-center justify-center gap-2"
        >
          <CrownIcon color="#000" />
          Join Membership
        </button>
      </div>
    </aside>
  );
}
