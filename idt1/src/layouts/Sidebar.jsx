import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import ToggleIcon from "@/assets/icons/Vector.svg";

/* =======================
   Sidebar Icons
======================= */
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

/* =======================
   ICON MAP
======================= */
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

const getSidebarIcon = (key, isActive) =>
  isActive ? sidebarIcons[key]?.active : sidebarIcons[key]?.default;

/* =======================
   Projects
======================= */
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

/* =======================
   Crown Icon
======================= */
const CrownIcon = ({ color }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill={color}>
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19H5V18H19V19Z" />
  </svg>
);

/* =======================
   Sidebar Component
======================= */
export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
  openProject,
}) {
  const [isMember, setIsMember] = useState(false);
  const [unlockedList, setUnlockedList] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    if (!savedUser) return;

    const user = JSON.parse(savedUser);
    if (user.unlockedItems) setUnlockedList(user.unlockedItems);
    if (user.role === "member" || user.unlockedItems?.length > 0) {
      setIsMember(true);
    }
  }, []);

  if (collapsed) return null;

  return (
    <aside className="fixed top-0 left-0 z-40 w-72 h-screen bg-slate-900/70 border-r border-sky-400/20 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center">
        <img src={logo} className="w-40" />
        <button onClick={() => setCollapsed(true)}>
          <img src={ToggleIcon} className="w-4 h-4" />
        </button>
      </div>

      {/* Status */}
      <div className="px-6 py-4 flex gap-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-sky-600/20 text-sky-400 flex items-center gap-1">
          <CrownIcon color="#38bdf8" />
          {isMember ? "MEMBERSHIP" : "FREE ACCESS"}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
          STATUS: ONLINE
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4 text-sm space-y-2 overflow-y-auto">
        {/* Preview */}
        <button
          onClick={() => setActivePage("whatsnew")}
          className={`w-full px-4 py-2 rounded-lg flex justify-between items-center
          ${
            activePage === "whatsnew"
              ? "bg-sky-500/20 text-sky-300"
              : "hover:bg-white/5 text-gray-300"
          }`}
        >
          <div className="flex gap-3 items-center">
            <img
              src={getSidebarIcon("preview", activePage === "whatsnew")}
              className="w-5 h-5"
            />
            <span>Preview Projects</span>
          </div>
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
        </button>

        {/* Beta */}
        <div className="text-gray-400 uppercase text-xs mt-6 mb-2">
          Beta Tools
        </div>

        <button
          onClick={() => setActivePage("dashboard")}
          className={`w-full px-4 py-2 rounded-lg flex justify-between items-center
          ${
            activePage === "dashboard"
              ? "bg-sky-500/20 text-sky-300"
              : "hover:bg-white/5 text-gray-300"
          }`}
        >
          <div className="flex gap-3 items-center">
            <img
              src={getSidebarIcon("mit", activePage === "dashboard")}
              className="w-5 h-5"
            />
            <span>MIT</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-400 text-black">
            FREE
          </span>
        </button>

        {/* Premium */}
        <div className="text-gray-400 uppercase text-xs mt-6 mb-2">
          Premium Tools
        </div>

        {projects.map(project => {
          const unlocked = unlockedList.includes(project.id);
          const isActive = activePage === project.id;

          return (
            <button
              key={project.id}
              onClick={() => {
                setActivePage(project.id);
                openProject(project);
              }}
              className={`w-full px-4 py-2 rounded-lg flex justify-between items-center
              ${
                isActive
                  ? "bg-sky-500/20 text-sky-300"
                  : "hover:bg-white/5 text-gray-400 opacity-90"
              }`}
            >
              <div className="flex gap-3 items-center">
                <img
                  src={getSidebarIcon(project.iconKey, isActive)}
                  className="w-5 h-5"
                />
                <span>{project.name}</span>
              </div>
              <CrownIcon color={isActive ? "#38bdf8" : "#fbbf24"} />
            </button>
          );
        })}
      </nav>
      {/* Upgrade to Pro */}
      <div className="px-4 pb-6 pt-2">
        <button
          onClick={() => {
            console.log("Upgrade to Pro");
          }}
          className="w-full flex items-center justify-center gap-2
          rounded-xl px-4 py-3
          bg-gradient-to-r from-amber-400 to-yellow-500
          text-black font-semibold
          hover:brightness-110 transition"
        >
          <CrownIcon color="#000000" />
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
}
