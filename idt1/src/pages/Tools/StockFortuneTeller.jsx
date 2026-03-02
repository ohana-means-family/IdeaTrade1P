// src/pages/tools/StockFortuneTeller.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import StockFortuneTellerDashboard from "./components/StockFortuneTellerDashboard.jsx";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

// ====================================================
// ScaledDashboardPreview
// ใช้ ResizeObserver อัปเดต DOM โดยตรง → ไม่กระตุก
// ====================================================
function ScaledDashboardPreview({ dashboardWidth = 1280, dashboardHeight = 900 }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const applyScale = () => {
      const w = outer.getBoundingClientRect().width;
      const s = w / dashboardWidth;
      inner.style.transform = `scale(${s})`;
      outer.style.height = `${dashboardHeight * s}px`;
    };

    applyScale();
    const ro = new ResizeObserver(applyScale);
    ro.observe(outer);
    return () => ro.disconnect();
  }, [dashboardWidth, dashboardHeight]);

  return (
    <div ref={outerRef} className="w-full bg-[#0B1221]" style={{ overflow: "hidden", position: "relative" }}>
      <div ref={innerRef} style={{ width: dashboardWidth, height: dashboardHeight, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
        <StockFortuneTellerDashboard />
      </div>
    </div>
  );
}

export default function StockFortuneTeller() {
  // ⚠️ ref ต้องอยู่ใน parent — ถ้าย้ายเข้า sub-component จะเสียการเชื่อมต่อกับ interval
  const scrollContainerRef = useRef(null);
  const scrollDirection    = useRef(1);   // 1 = ขวา, -1 = ซ้าย
  const isPaused           = useRef(false);
  const searchInputRef     = useRef(null);

  const [isMember,    setIsMember]    = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [showLeft,  setShowLeft]  = useState(false);
  const [showRight, setShowRight] = useState(true);

  const [filters, setFilters] = useState({
    chart1: "Last",
    chart2: "%Short",
    chart3: "PredictTrend",
    chart4: "Peak",
    chart5: "Shareholder",
    chart6: "Manager",
  });

  const [refreshing,      setRefreshing]      = useState(false);
  const [lastPrice,       setLastPrice]       = useState(5.30);
  const [symbol,          setSymbol]          = useState("");
  const [selectedSymbol,  setSelectedSymbol]  = useState("");
  const [showDropdown,    setShowDropdown]    = useState(false);

  const [globalHoverIndex, setGlobalHoverIndex] = useState(null);
  const chartRefs = useRef({});

  const symbols = [
    "BANPU","BGRIM","EGCO","GPSC","GULF","OR","PTT","PTTEP",
    "PTTGC","RATCH","TOP","IVL","BBL","KBANK","KTB","SCB",
    "TISCO","TTB","KTC","SAWAD","MTC","TLI","ADVANC","DELTA",
    "COM7","CCET","TRUE","CPALL","CPF","CBG","OSP","GLOBAL",
    "HMPRO","BJC","CRC","ITC","TU","AOT","AWC","BDMS",
    "BH","BEM","BTS","CPN","LH","MINT","SCGP",
  ];
  const filteredSymbols = symbols.filter(s =>
    s.toLowerCase().includes(symbol.toLowerCase())
  );

  /* ===============================
      MEMBER CHECK
  ================================ */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);
        if (user.unlockedItems?.includes("fortune")) {
          setIsMember(true);
          // ไม่ restore enteredTool จาก sessionStorage — ให้แสดง preview ทุกครั้งที่เข้า
        }
      }
    } catch (error) {
      console.error("Error checking member status:", error);
    }
  }, []);

  /* ===============================
      SCROLL LOGIC (Manual + Auto)
  ================================ */
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 1);
    setShowRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 2);
  };

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isPaused.current = true;
    el.scrollBy({ left: direction === "left" ? -350 : 350, behavior: "smooth" });
    scrollDirection.current = direction === "left" ? -1 : 1;
    setTimeout(checkScroll, 300);
    setTimeout(() => { isPaused.current = false; }, 500);
  };

  // Auto Scroll — รันใหม่ทุกครั้งที่ view เปลี่ยน
  useEffect(() => {
    const id = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el || isPaused.current) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (scrollDirection.current === 1 && Math.ceil(el.scrollLeft) >= maxScroll - 2) {
        scrollDirection.current = -1;
      } else if (scrollDirection.current === -1 && el.scrollLeft <= 2) {
        scrollDirection.current = 1;
      }
      el.scrollLeft += scrollDirection.current;
      checkScroll();
    }, 15);
    return () => clearInterval(id);
  }, [isMember, enteredTool]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  /* ===============================
      FEATURES DATA
  ================================ */
  const features = [
    { title: "Last",            desc: "Stay updated with intuitive, real-time daily price action charts." },
    { title: "PredictTrend",    desc: "Visualizes the pulse of the market by tracking real-time capital inflows and outflows." },
    { title: "Volume Analysis", desc: "Deep dive into volume patterns to confirm trend strength." },
    { title: "Smart Signals",   desc: "AI-driven entry and exit points." },
    { title: "Sector Rotation", desc: "Identify which sectors are leading the market in real-time." },
    { title: "Risk Management", desc: "Calculated risk metrics to help you protect your capital." },
  ];

  /* ===============================
      SHARED BLOCKS (inline — ไม่ใช่ sub-component)
      เพื่อให้ scrollContainerRef ทำงานได้ใน interval
  ================================ */

  const windowChrome = (
    <div className="bg-[#0f172a] px-4 py-3 flex items-center border-b border-slate-700/50">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
    </div>
  );

  const featuresSection = (
    <div className="w-full max-w-5xl mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
        6 Main Features
      </h2>
      <div className="relative group" onMouseEnter={() => { isPaused.current = true; }} onMouseLeave={() => { isPaused.current = false; }}>

        <button
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20
                      w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white
                      hover:bg-cyan-500 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]
                      flex items-center justify-center transition-all duration-300 backdrop-blur-sm active:scale-95
                      ${showLeft ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div ref={scrollContainerRef} onScroll={checkScroll} className="flex overflow-x-auto gap-6 py-4 px-1 hide-scrollbar" style={scrollbarHideStyle}>
          {features.map((item, index) => (
            <div key={index} className="w-[350px] md:w-[400px] flex-shrink-0 group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300">
              <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20
                      w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white
                      hover:bg-cyan-500 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]
                      flex items-center justify-center transition-all duration-300 backdrop-blur-sm active:scale-95
                      ${showRight ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  /* ==========================================================
      CASE 1 : PREVIEW VERSION (Not Member)
  =========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Stock Fortune Teller
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">Stop guessing, start calculating</p>
          </div>

          <div className="relative group w-full max-w-6xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700" />
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              {windowChrome}
              <ScaledDashboardPreview dashboardWidth={1280} dashboardHeight={900} />
            </div>
          </div>

          {featuresSection}

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.open("/login", "_blank")}
              className="w-full md:w-auto px-8 py-3 rounded-full bg-slate-800 text-white font-semibold border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all duration-300"
            >
              Sign In
            </button>
            <button
              onClick={() => window.open("/member-register", "_blank")}
              className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:brightness-110 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Join Membership
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* ==========================================================
      CASE 2 : START SCREEN (Member, Not Entered)
  =========================================================== */
  if (isMember && !enteredTool) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Stock Fortune Teller
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">Stop guessing, start calculating</p>
          </div>

          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700" />
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              {windowChrome}
              <ScaledDashboardPreview dashboardWidth={1280} dashboardHeight={900} />
            </div>
          </div>

          {featuresSection}

          <button
            onClick={() => {
              setEnteredTool(true);
              sessionStorage.setItem("fortuneToolEntered", "true");
            }}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">Start Using Tool</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

        </div>
      </div>
    );
  }

  /* ==========================================================
      CASE 3 : FULL DASHBOARD
  =========================================================== */
  if (isMember && enteredTool) {
    return (
      <div className="w-full min-h-screen bg-[#0B1221] text-white px-6 py-6">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
            <input
              ref={searchInputRef}
              type="text"
              value={symbol}
              onChange={(e) => { setSymbol(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Type a Symbol..."
              className="w-full bg-[#0f172a] border border-slate-600 rounded-full pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
            {symbol && (
              <button onClick={() => { setSymbol(""); setShowDropdown(false); }} className="absolute right-3 inset-y-0 flex items-center text-slate-400 hover:text-red-400 transition">
                <CloseIcon fontSize="small" />
              </button>
            )}
            {showDropdown && (
              <div className="absolute mt-2 w-full bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto z-50">
                {filteredSymbols.length > 0 ? (
                  filteredSymbols.map((item, index) => (
                    <div key={index} onMouseDown={() => { setSymbol(item); setSelectedSymbol(item); setShowDropdown(false); }} className="px-4 py-2.5 text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-white cursor-pointer transition">
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-slate-500">No results</div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button className="w-10 h-10 bg-[#0f172a] border border-slate-700 rounded-lg flex items-center justify-center hover:border-cyan-500 hover:text-cyan-400 transition">
              <NotificationsNoneIcon fontSize="small" />
            </button>
            <button
              onClick={() => {
                setSymbol("");
                setSelectedSymbol("");
                setShowDropdown(false);
                setRefreshing(true);
                setTimeout(() => { setRefreshing(false); searchInputRef.current?.focus(); }, 500);
              }}
              className="w-10 h-10 bg-[#0f172a] border border-slate-700 rounded-lg flex items-center justify-center hover:border-cyan-500 hover:text-cyan-400 transition"
            >
              <RefreshIcon fontSize="small" className={refreshing ? "animate-spin" : ""} />
            </button>
            <button className="w-10 h-10 bg-[#0f172a] border border-slate-700 rounded-lg flex items-center justify-center hover:border-cyan-500 hover:text-cyan-400 transition">
              <DownloadIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="LAST PRICE"    value={`${lastPrice} (+1.92%)`} color="text-green-400" />
          <StatCard label="VOLUME"        value="62.8M"                   color="text-yellow-400" />
          <StatCard label="HIGH / LOW"    value="5.35 / 5.15"             color="text-white" />
          <StatCard label="MARKET STATUS" value="● OPEN"                  color="text-green-400" />
        </div>

        {/* CHART GRID หรือ Skeleton */}
        {selectedSymbol ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(filters).map(([key, value]) => (
              <ChartCard
                key={key}
                chartId={key}
                title={key}
                type={value}
                globalHoverIndex={globalHoverIndex}
                setGlobalHoverIndex={setGlobalHoverIndex}
                chartRefs={chartRefs}
                onChange={(newValue) => setFilters({ ...filters, [key]: newValue })}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(filters).map(([key, value], cardIdx) => (
              <div key={key} className="bg-[#111827] rounded-xl border border-slate-700/60 p-4 h-[280px]">
                {/* Header */}
                <div className="mb-3 flex justify-between items-center">
                  <select value={value} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })} className="bg-[#1f2937] text-xs border border-slate-600 rounded-md px-2 py-1 focus:outline-none focus:border-cyan-500">
                    <option>Last</option>
                    <option>%Short</option>
                    <option>PredictTrend</option>
                    <option>Peak</option>
                    <option>Shareholder</option>
                    <option>Manager</option>
                  </select>
                  <span className="text-xs text-slate-400">{key}</span>
                </div>
                {/* Wave skeleton */}
                <WaveSkeleton delay={cardIdx * 0.2} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ============================================================
// SMALL HELPER COMPONENTS
// ============================================================

// ============================================================
// SHIMMER SKELETON COMPONENT
// gradient ไหลซ้าย→ขวาผ่านทั้ง row พร้อมกัน แบบ TanStack
// ============================================================
function WaveSkeleton({ delay = 0 }) {
  return (
    <div className="w-full h-[210px] bg-[#0f172a] rounded-lg overflow-hidden relative">
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* base rows */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* แถบบน */}
        <div className="flex gap-2">
          <div className="h-2 rounded-full bg-slate-800 w-1/3" />
          <div className="h-2 rounded-full bg-slate-800 w-1/5" />
        </div>
        {/* กลาง — area กราฟ */}
        <div className="flex-1 my-3 rounded bg-slate-800/60" />
        {/* แถบล่าง label */}
        <div className="flex gap-3 justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-2 rounded-full bg-slate-800 flex-1" />
          ))}
        </div>
      </div>

      {/* shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.08) 40%, rgba(125,211,252,0.18) 50%, rgba(56,189,248,0.08) 60%, transparent 100%)",
          animation: `shimmer 1.8s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
      <p className="text-slate-400 text-xs">{label}</p>
      <p className={`${color} text-lg font-bold`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, type, onChange, chartId, globalHoverIndex, setGlobalHoverIndex, chartRefs }) {
  return (
    <div className="bg-[#111827] rounded-xl border border-slate-700 p-4 h-[280px]">
      <div className="mb-3 flex justify-between items-center">
        <select value={type} onChange={(e) => onChange(e.target.value)} className="bg-[#1f2937] text-xs border border-slate-600 rounded-md px-2 py-1 focus:outline-none focus:border-cyan-500">
          <option>Last</option>
          <option>%Short</option>
          <option>PredictTrend</option>
          <option>Peak</option>
          <option>Shareholder</option>
          <option>Manager</option>
        </select>
        <span className="text-xs text-slate-400">{title}</span>
      </div>
      <div className="w-full h-[210px] bg-[#0f172a] rounded-lg p-4 relative overflow-hidden">
        <ChartRenderer type={type} chartId={chartId} globalHoverIndex={globalHoverIndex} setGlobalHoverIndex={setGlobalHoverIndex} chartRefs={chartRefs} />
      </div>
    </div>
  );
}

// ============================================================
// CHART CONSTANTS
// ============================================================

const CHART_CONFIG = {
  height: 170,
  paddingLeft: 15,
  paddingRight: 60,
  paddingTop: 15,
  paddingBottom: 25,
  pointGap: 40,
  minWidth: 620,
};

const MANAGER_COLORS = ["#f97316", "#22c55e", "#3b82f6", "#0ea5e9", "#eab308"];

const RAW_DATA = {
  Last:         [5.2, 5.0, 4.9, 5.3, 4.6, 4.2, 4.5, 4.8, 5.1, 5.3, 5.0, 4.9, 5.2, 5.5, 5.7, 5.4, 5.6, 5.9, 6.1, 6.0],
  "%ShortA":    [12, 14, 13, 15, 18, 20, 17, 16, 15, 13, 11, 14, 16, 19, 21, 23, 22, 20, 18, 17],
  "%ShortB":    [13, 14, 12, 14, 15, 16, 15, 14, 13, 12, 10, 13, 15, 17, 18, 20, 19, 17, 15, 16],
  PredictTrend: [22, 23, 20, 24, 26, 25, 27, 28, 29, 26, 24, 25, 28, 30, 31, 29, 27, 28, 30, 32],
  Peak:         [5, 6, 5, 18, 9, 7, 6, 15, 12, 10, 8, 14, 16, 11, 9, 13, 17, 12, 10, 8],
  Shareholder:  [10.01, 10.01, 10.01, 10.01, 10.01, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  Manager: [
    Array(20).fill(4.5),
    Array(20).fill(1.53),
    Array(20).fill(0.41),
    Array(20).fill(-4.26),
    Array(20).fill(-8.22),
  ],
};

const LABELS = Array.from({ length: 20 }, (_, i) => `${i + 1} Jan`);

// ============================================================
// CHART PURE HELPER FUNCTIONS
// ============================================================

function getPrimaryData(type) {
  if (type === "%Short")  return RAW_DATA["%ShortA"];
  if (type === "Manager") return RAW_DATA.Manager[0];
  return RAW_DATA[type] ?? RAW_DATA.Last;
}

function getAllDataForScale(type) {
  if (type === "%Short")  return [...RAW_DATA["%ShortA"], ...RAW_DATA["%ShortB"]];
  if (type === "Manager") return RAW_DATA.Manager.flat();
  return getPrimaryData(type);
}

function calcYScale(data) {
  const rawMax = Math.max(...data);
  const rawMin = Math.min(...data);
  const range  = rawMax - rawMin || 1;
  return { max: rawMax + range * 0.15, min: rawMin - range * 0.15 };
}

function makeNormalizeY({ height, paddingTop, paddingBottom }, { max, min }) {
  return (value) =>
    height - paddingBottom - ((value - min) / (max - min)) * (height - paddingTop - paddingBottom);
}

function buildCurvePath(dataset, normalizeY, paddingLeft, pointGap) {
  return dataset.reduce((path, value, i) => {
    const x = paddingLeft + i * pointGap;
    const y = normalizeY(value);
    if (i === 0) return `M ${x},${y}`;
    const prevX = paddingLeft + (i - 1) * pointGap;
    const prevY = normalizeY(dataset[i - 1]);
    const cp1x  = prevX + (x - prevX) / 3;
    const cp2x  = prevX + (x - prevX) * 2 / 3;
    return `${path} C ${cp1x},${prevY} ${cp2x},${y} ${x},${y}`;
  }, "");
}

function buildStepPath(dataset, normalizeY, paddingLeft, pointGap) {
  return dataset.reduce((path, value, i) => {
    const x    = paddingLeft + i * pointGap;
    const y    = normalizeY(value);
    if (i === 0) return `M ${x},${y}`;
    const prevX = paddingLeft + (i - 1) * pointGap;
    const prevY = normalizeY(dataset[i - 1]);
    return `${path} L ${x},${prevY} L ${x},${y}`;
  }, "");
}

function getLineColor(type) {
  const colorMap = {
    Last: "#3b82f6",
    PredictTrend: "#f59e0b",
    Peak: "#eab308",
    Shareholder: "#ef4444",
  };
  return colorMap[type] ?? "#38bdf8";
}

// ============================================================
// CHART RENDERER COMPONENT
// ============================================================

function ChartRenderer({ type, chartId, globalHoverIndex, setGlobalHoverIndex, chartRefs }) {
  const scrollRef = useRef(null);
  const [isDragging,     setIsDragging]     = useState(false);
  const [dragStartX,     setDragStartX]     = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const primaryData = getPrimaryData(type);
  const yScale      = calcYScale(getAllDataForScale(type));
  const normalizeY  = makeNormalizeY(CHART_CONFIG, yScale);

  const { paddingLeft, paddingRight, paddingTop, paddingBottom, pointGap, height, minWidth } = CHART_CONFIG;
  const chartWidth = Math.max(minWidth, paddingLeft + paddingRight + (primaryData.length - 1) * pointGap);

  const curve = (data) => buildCurvePath(data, normalizeY, paddingLeft, pointGap);
  const step  = (data) => buildStepPath(data, normalizeY, paddingLeft, pointGap);

  useEffect(() => {
    if (!scrollRef.current) return;
    chartRefs.current[chartId] = scrollRef.current;
    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    return () => { delete chartRefs.current[chartId]; };
  }, [chartId, type, chartRefs]);

  const syncScroll = (sourceEl) => {
    Object.values(chartRefs.current).forEach((node) => {
      if (node && node !== sourceEl && Math.abs(node.scrollLeft - sourceEl.scrollLeft) > 1)
        node.scrollLeft = sourceEl.scrollLeft;
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.pageX - scrollRef.current.offsetLeft);
    setDragScrollLeft(scrollRef.current.scrollLeft);
    setGlobalHoverIndex(null);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      scrollRef.current.scrollLeft = dragScrollLeft - (x - dragStartX) * 1.5;
      setGlobalHoverIndex(null);
      return;
    }
    const mouseX = e.clientX - scrollRef.current.getBoundingClientRect().left + scrollRef.current.scrollLeft;
    const index  = Math.max(0, Math.min(Math.round((mouseX - paddingLeft) / pointGap), primaryData.length - 1));
    setGlobalHoverIndex(index);
  };

  const isHovering = globalHoverIndex !== null && !isDragging;
  const hoverX     = isHovering ? paddingLeft + globalHoverIndex * pointGap : null;

  return (
    <div className="relative w-full h-full group bg-[#0f172a] rounded-lg">

      <div
        ref={scrollRef}
        className={`w-full h-full relative overflow-x-auto overflow-y-hidden hide-scrollbar select-none ${isDragging ? "cursor-grabbing" : "cursor-crosshair"}`}
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        onScroll={(e) => syncScroll(e.target)}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => { setIsDragging(false); setGlobalHoverIndex(null); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
      >
        <svg width={chartWidth} height={height} className="overflow-visible pointer-events-none">

          {[...Array(5)].map((_, i) => {
            const y = paddingTop + (i * (height - paddingTop - paddingBottom)) / 4;
            return <line key={i} x1={0} y1={y} x2={chartWidth} y2={y} stroke="#1e293b" strokeWidth="1" />;
          })}
          <line x1={0} y1={height - paddingBottom} x2={chartWidth} y2={height - paddingBottom} stroke="#334155" strokeWidth="1.5" />

          {primaryData.map((_, i) => (
            <text key={i} x={paddingLeft + i * pointGap} y={height - paddingBottom + 16} fill="#64748b" fontSize="10" textAnchor="middle">
              {LABELS[i]}
            </text>
          ))}

          {type === "%Short" && <>
            <path d={curve(RAW_DATA["%ShortA"])} fill="none" stroke="#0ea5e9" strokeWidth="2" />
            <path d={curve(RAW_DATA["%ShortB"])} fill="none" stroke="#f97316" strokeWidth="2" />
          </>}

          {(type === "Last" || type === "Peak") && (() => {
            const data   = RAW_DATA[type];
            const color  = getLineColor(type);
            const areaId = `area-${type}`;
            const lastX  = paddingLeft + (data.length - 1) * pointGap;
            return <>
              <defs>
                <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${curve(data)} L ${lastX},${height - paddingBottom} L ${paddingLeft},${height - paddingBottom} Z`} fill={`url(#${areaId})`} />
              <path d={curve(data)} fill="none" stroke={color} strokeWidth="2.5" />
            </>;
          })()}

          {type === "PredictTrend" &&
            <path d={curve(RAW_DATA.PredictTrend)} fill="none" stroke={getLineColor(type)} strokeWidth="2.5" />}

          {type === "Shareholder" &&
            <path d={step(RAW_DATA.Shareholder)} fill="none" stroke={getLineColor(type)} strokeWidth="2" />}

          {type === "Manager" && RAW_DATA.Manager.map((data, idx) => (
            <path key={idx} d={step(data)} fill="none" stroke={MANAGER_COLORS[idx]} strokeWidth="2" />
          ))}

          {isHovering && (
            <g>
              <line x1={hoverX} y1={paddingTop} x2={hoverX} y2={height - paddingBottom} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              {type === "%Short" && <>
                <circle cx={hoverX} cy={normalizeY(RAW_DATA["%ShortA"][globalHoverIndex])} r="4" fill="#0ea5e9" stroke="#0f172a" strokeWidth="2" />
                <circle cx={hoverX} cy={normalizeY(RAW_DATA["%ShortB"][globalHoverIndex])} r="4" fill="#f97316" stroke="#0f172a" strokeWidth="2" />
              </>}
              {type === "Manager" && RAW_DATA.Manager.map((data, idx) => (
                <circle key={idx} cx={hoverX} cy={normalizeY(data[globalHoverIndex])} r="3.5" fill={MANAGER_COLORS[idx]} stroke="#0f172a" strokeWidth="1.5" />
              ))}
              {type !== "%Short" && type !== "Manager" && (
                <circle cx={hoverX} cy={normalizeY(primaryData[globalHoverIndex])} r="4" fill={getLineColor(type)} stroke="#0f172a" strokeWidth="2" />
              )}
            </g>
          )}
        </svg>

        {isHovering && (
          <div
            className="absolute top-2 z-50 flex flex-col items-center min-w-[55px] bg-[#1e293b] border border-slate-600 rounded-md p-1.5 shadow-xl pointer-events-none transition-transform duration-75"
            style={{
              left: `${hoverX}px`,
              transform: globalHoverIndex > primaryData.length - 5 ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
            }}
          >
            <span className="text-[10px] text-slate-400 font-medium mb-1">{LABELS[globalHoverIndex]}</span>
            <div className="flex flex-col items-center gap-0.5">
              {type === "%Short" && <>
                <span className="text-[#0ea5e9] text-[11px] font-bold">{RAW_DATA["%ShortA"][globalHoverIndex].toFixed(2)}</span>
                <span className="text-[#f97316] text-[11px] font-bold">{RAW_DATA["%ShortB"][globalHoverIndex].toFixed(2)}</span>
              </>}
              {type === "Manager" && RAW_DATA.Manager.map((data, idx) => (
                <span key={idx} style={{ color: MANAGER_COLORS[idx] }} className="text-[11px] font-bold">
                  {data[globalHoverIndex] > 0 ? `+${data[globalHoverIndex]}` : data[globalHoverIndex]}
                </span>
              ))}
              {type !== "%Short" && type !== "Manager" && (
                <span className="text-white text-[12px] font-bold">{primaryData[globalHoverIndex].toFixed(2)}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-y-0 left-0 right-[55px] bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent pointer-events-none" style={{ top: "75%" }} />

      <div className="absolute right-0 top-0 w-[55px] h-full pointer-events-none bg-[#0f172a] z-10 border-l border-slate-800/50">
        <svg className="w-full h-full absolute right-0 top-0 overflow-visible pointer-events-none">

          {[...Array(5)].map((_, i) => {
            const y     = paddingTop + (i * (height - paddingTop - paddingBottom)) / 4;
            const value = yScale.max - (i * (yScale.max - yScale.min)) / 4;
            if (type === "Manager") {
              const tooClose = RAW_DATA.Manager.some(
                (data) => Math.abs(normalizeY(data[data.length - 1]) - y) < 12
              );
              if (tooClose) return null;
            }
            return <text key={i} x="48" y={y} fill="#64748b" fontSize="10" textAnchor="end" dominantBaseline="central">{value.toFixed(2)}</text>;
          })}

          {type === "Shareholder" && (() => {
            const lastVal = RAW_DATA.Shareholder[19];
            return (
              <g transform={`translate(6, ${normalizeY(lastVal)})`}>
                <rect x="0" y="-10" width="42" height="20" fill="#ef4444" rx="4" />
                <text x="21" y="0" fill="#ffffff" fontSize="11" textAnchor="middle" dominantBaseline="central" fontWeight="bold">{lastVal}</text>
              </g>
            );
          })()}

          {type === "Manager" && (() => {
            const TAG_H   = 20;
            const TAG_W   = 42;
            const MIN_GAP = TAG_H + 2;

            const tags = RAW_DATA.Manager.map((data, idx) => {
              const lastVal = data[data.length - 1];
              return {
                idx,
                idealY: normalizeY(lastVal),
                realY:  normalizeY(lastVal),
                color:  MANAGER_COLORS[idx],
                label:  lastVal > 0 ? `+${lastVal}` : `${lastVal}`,
              };
            }).sort((a, b) => a.idealY - b.idealY);

            for (let i = 1; i < tags.length; i++) {
              if (tags[i].idealY - tags[i - 1].idealY < MIN_GAP) {
                tags[i].idealY = tags[i - 1].idealY + MIN_GAP;
              }
            }

            return tags.map(({ idx, idealY, realY, color, label }) => {
              const shifted = Math.abs(idealY - realY) > 1;
              return (
                <g key={idx}>
                  {shifted && <line x1="5" y1={realY} x2="5" y2={idealY} stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />}
                  <g transform={`translate(6, ${idealY})`}>
                    <rect x="-1" y={`${-TAG_H / 2 - 1}`} width={TAG_W + 2} height={TAG_H + 2} fill="black" fillOpacity="0.3" rx="5" />
                    <rect x="0" y={`${-TAG_H / 2}`} width={TAG_W} height={TAG_H} fill={color} rx="4" />
                    <rect x="0" y={`${-TAG_H / 2}`} width={TAG_W} height={TAG_H / 2} fill="white" fillOpacity="0.08" rx="4" />
                    <text x={TAG_W / 2} y="0" fill="white" fontSize="10.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central" letterSpacing="-0.2">
                      {label}
                    </text>
                  </g>
                </g>
              );
            });
          })()}
        </svg>
      </div>

    </div>
  );
}