import React, { useState } from "react";
import logo from "@/assets/images/logo.png";
import ToggleIcon from "@/assets/icons/Vector.svg";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 to-slate-900 text-white">

      {/* SIDEBAR */}
      {!collapsed && (
        <aside className="w-72 bg-black/60 border-r border-purple-500/30 flex flex-col transition-all duration-300">

          {/* Logo + Toggle */}
          <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
            <img src={logo} alt="Idea Trade" className="w-40" />

            {/* Vector Toggle */}
            <button
              onClick={() => setCollapsed(true)}
              className="p-2 bg-transparent border-none outline-none
                         focus:outline-none focus:ring-0 hover:opacity-80 transition"
            >
              <img src={ToggleIcon} alt="Toggle Sidebar" className="w-4 h-4" />
            </button>
          </div>

          {/* Status */}
          <div className="px-6 py-4 flex gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400">
              FREE ACCESS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-green-600/20 text-green-400">
              STATUS: ONLINE
            </span>
          </div>

          {/* Search */}
          <div className="px-6 py-4">
            <input
              placeholder="Search Something..."
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10
                         text-sm outline-none focus:border-purple-500"
            />
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-4 text-sm space-y-2">
            <button className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-white/5">
              What's New
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </button>

            <div className="text-gray-400 uppercase text-xs mt-6 mb-2">
              Beta Tools
            </div>

            <button className="flex items-center justify-between w-full px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300">
              MIT
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-600 text-black">
                FREE
              </span>
            </button>

            <div className="text-gray-400 uppercase text-xs mt-6 mb-2">
              Premium Tools
            </div>

            {[
              "หุ้นดัชนี",
              "Petroleum",
              "Rubber Thai",
              "Flow Intraday",
              "S50",
              "Gold",
              "BidAsk",
              "TickMatch",
              "DR",
            ].map((item) => (
              <button
                key={item}
                className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300"
              >
                {item}
                <span>👑</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 text-sm text-gray-400 space-y-2">
            <div>Help center</div>
            <div>Settings</div>
            <div className="text-white">Upgrade to Pro</div>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <main className="flex-1 px-10 py-8 transition-all duration-300">

        {/* Top Bar (ใช้ปุ่มเดิมตอน sidebar ปิด) */}
        {collapsed && (
          <div className="mb-6">
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 bg-transparent border-none outline-none
                         focus:outline-none focus:ring-0 hover:opacity-80 transition"
            >
              <img src={ToggleIcon} alt="Open Sidebar" className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-10">
          <button className="px-5 py-2 rounded-full bg-purple-500/30 text-purple-300">
            Shortcuts
          </button>
          {["MIT", "Stock Mover", "Project Name", "Project Name"].map((tab) => (
            <button
              key={tab}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-neutral-600 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center">
                  ⦿
                </div>
                <h3 className="text-lg font-semibold">
                  Project name
                </h3>
              </div>

              <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <div className="h-10 rounded-full bg-purple-500" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
