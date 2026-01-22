import React, { useState } from "react";
import logo from "@/assets/images/logo.png";
import ToggleIcon from "@/assets/icons/Vector.svg";
import WhatsNew from "@/pages/Dashboard/PreviewProjects.jsx";
import mitIcon from "@/assets/icons/elements.png";
import Navbar from "@/layouts/Navbar.jsx";
import Sidebar from "@/layouts/Sidebar.jsx";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("previewProjects");
  const [activeTab, setActiveTab] = useState("Shortcuts");

 const menuIcons = {
    "หมอดูหุ้น": (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M6 9h12v2H6zm8 5H6v-2h8zm4-6H6V6h12z" />
      </svg>
    ),

    Petroleum: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20 13c.55 0 1-.45 1-1s-.45-1-1-1h-1V5h1c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1h1v6H4c-.55 0-1 .45-1 1s.45 1 1 1h1v6H4c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1h-1v-6zm-8 3c-1.66 0-3-1.32-3-2.95 0-1.3.52-1.67 3-4.55 2.47 2.86 3 3.24 3 4.55 0 1.63-1.34 2.95-3 2.95" />
      </svg>
    ),

    "Rubber Thai": (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M16 12 9 2 2 12h1.86L0 18h7v4h4v-4h7l-3.86-6z" />
        <path d="M20.14 12H22L15 2l-2.39 3.41L17.92 13h-1.95l3.22 5H24zM13 19h4v3h-4z" />
      </svg>
    ),

    "Flow Intraday": (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M6.99 11 3 15l3.99 4v-3H14v-2H6.99zM21 9l-3.99-4v3H10v2h7.01v3z" />
      </svg>
    ),

    S50: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="m3.5 18.49 6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
      </svg>
    ),

    Gold: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 14H6v-2h6zm3-4H9v-2h6zm3-4h-6V7h6z" />
      </svg>
    ),

    BidAsk: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04-.66-.63c-1.17-1.17-1.17-3.07 0-4.24l4.24-4.24c1.17-1.17 3.07-1.17 4.24 0L16.48 9c.39.39.39 1.02 0 1.41" />
      </svg>
    ),

    TickMatch: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z" />
      </svg>
    ),

    DR: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">

      {/* ================= SIDEBAR ================= */}
<Sidebar
  collapsed={collapsed}
  setCollapsed={setCollapsed}
  activePage={activePage}
  setActivePage={setActivePage}
  projects={[
    { id: "petroleum", name: "Petroleum", free: false },
    { id: "rubber", name: "Rubber Thai", free: false },
    { id: "flow", name: "Flow Intraday", free: false },
    { id: "s50", name: "S50", free: false },
    { id: "gold", name: "Gold", free: false },
    { id: "bidask", name: "BidAsk", free: false },
    { id: "tickmatch", name: "TickMatch", free: false },
    { id: "dr", name: "DR", free: false },
  ]}
  unlocked={[]}
  openProject={() => {}}
  menuIcons={menuIcons}
/>

      {/* ================= MAIN CONTENT ================= */}
      <main
        className={`min-h-screen transition-all duration-300
          ${collapsed ? "ml-0" : "ml-72"}
          px-10 py-8 overflow-y-auto`}
      >
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="mb-6">
            <img src={ToggleIcon} className="w-4 h-4" />
          </button>
        )}

      {/* Navbar */}
      <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Content ตาม tab */}
      {activeTab === "MIT" && <div>MIT Content</div>}
      {activeTab === "Stock Mover" && <div>Stock Mover Content</div>}
      {activeTab === "Project Name" && <div>Project Content</div>}
      </div>

        {/* Render Page */}
        {activePage === "whatsnew" && <WhatsNew />}
        {activePage === "dashboard" && <div>
          <h1 className="text-3xl font-bold mb-6">Mit Content</h1>
        </div>}
      </main>
    </div>
  );
}