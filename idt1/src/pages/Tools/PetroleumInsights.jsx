import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function PetroleumInsights() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [period, setPeriod] = useState("MAX");
  const [symbol, setSymbol] = useState("TOP");
  const [darkMode, setDarkMode] = useState(true);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  /* ===============================
     MEMBER CHECK (เหมือน StockFortune)
  ================================ */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");

      if (userProfile) {
        const user = JSON.parse(userProfile);

        if (user.unlockedItems?.includes("petroleum")) {
          setIsMember(true);

          const hasEntered = sessionStorage.getItem("petroleumToolEntered");
          if (hasEntered === "true") {
            setEnteredTool(true);
          }
        }
      }
    } catch (error) {
      console.error("Error checking member status:", error);
    }
  }, []);

  /* ===============================
     SCROLL LOGIC (เหมือนเดิมทุกอย่าง)
  ================================ */
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeft(scrollLeft > 1);
      const isEnd =
        Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2;
      setShowRight(!isEnd);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 350;

      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkScroll, 300);
    }
  };

  /* ===============================
     FEATURES DATA
  ================================ */
  const features = [
    {
      title: "WTI & Brent Tracking",
      desc: "Monitor global crude oil benchmarks in real-time.",
    },
    {
      title: "Refinery Margin",
      desc: "Track GRM changes and refining profitability instantly.",
    },
    {
      title: "Oil Fund Analysis",
      desc: "Understand government oil stabilization mechanisms.",
    },
    {
      title: "Energy Macro Signals",
      desc: "Macro-driven energy market trend detection.",
    },
    {
      title: "Gas & LNG Insights",
      desc: "Natural gas movement and global supply chain flow.",
    },
    {
      title: "Institutional Flow",
      desc: "Follow capital rotation in energy sector.",
    },
  ];

  /* ==========================================================
     CASE 1 : PREVIEW VERSION (เหมือน StockFortune 90%+)
  =========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Style ซ่อน Scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}
      </style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

        {/* --- Header Section --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              Petroleum Insights
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Stop relying on crude oil prices alone
          </p>
        </div>

        {/* --- Dashboard Image --- */}
        <div className="relative group w-full max-w-5xl mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
            </div>

            <div className="aspect-[16/9] w-full bg-[#0B1221] relative overflow-hidden group">
              <img
                src="/src/assets/images/Petroleum.png"
                alt="Petroleum Dashboard"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* --- Features Section (ใช้แบบ Scroll เหมือน StockFortuneTeller) --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            4 Main Features
          </h2>

          <div className="relative group">
            
            {/* 1. ปุ่มซ้าย (ปรับระยะห่างเหมือนกัน) */}
            <button 
              onClick={() => scroll("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20 
                         w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                         hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                         hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                         flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                         active:scale-95
                         ${showLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
              aria-label="Scroll Left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 2. Scroll Container */}
            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll} 
              className="flex overflow-x-auto gap-6 py-4 px-1 snap-x snap-mandatory hide-scrollbar scroll-smooth"
              style={scrollbarHideStyle}
            >
              {features.map((item, index) => (
                <div
                  key={index}
                  // ล็อคความกว้าง w-[350px] md:w-[400px] เหมือนต้นแบบ
                  className="
                      w-[350px] md:w-[400px] flex-shrink-0 snap-center
                      group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl 
                      hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300
                  "
                >
                  <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  {/* ไม่จำกัดบรรทัด (เอา line-clamp ออก) */}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 3. ปุ่มขวา (ปรับระยะห่างเหมือนกัน) */}
            <button 
              onClick={() => scroll("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20 
                         w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                         hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                         hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                         flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                         active:scale-95
                         ${showRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
              aria-label="Scroll Right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>
        </div>

        {/* --- CTA Buttons --- */}
        <div className="text-center w-full max-w-md mx-auto mt-4">
          {isMember ? (
            <button
              onClick={() => navigate("/member-register")}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">Start Using Tool</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="w-full md:w-auto px-8 py-3 rounded-full bg-slate-800 text-white font-semibold border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all duration-300"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/member-register")}
                className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:brightness-110 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Join Membership
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
    );
  }

  /* ==========================================================
     CASE 2 : Start Screen (เหมือน StockFortune)
  =========================================================== */
  if (isMember && !enteredTool) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Style ซ่อน Scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}
      </style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

        {/* --- Header Section --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              Petroleum Insights
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Stop relying on crude oil prices alone
          </p>
        </div>

        {/* --- Dashboard Image --- */}
        <div className="relative group w-full max-w-5xl mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
            </div>

            <div className="aspect-[16/9] w-full bg-[#0B1221] relative overflow-hidden group">
              <img
                src="/src/assets/images/Petroleum.png"
                alt="Petroleum Dashboard"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* --- Features Section  --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            4 Main Features
          </h2>

          <div className="relative group">
            
            {/* 1. ปุ่มซ้าย  */}
            <button 
              onClick={() => scroll("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20 
                         w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                         hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                         hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                         flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                         active:scale-95
                         ${showLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
              aria-label="Scroll Left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 2. Scroll Container */}
            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll} 
              className="flex overflow-x-auto gap-6 py-4 px-1 snap-x snap-mandatory hide-scrollbar scroll-smooth"
              style={scrollbarHideStyle}
            >
              {features.map((item, index) => (
                <div
                  key={index}
                  // ล็อคความกว้าง w-[350px] md:w-[400px] เหมือนต้นแบบ
                  className="
                      w-[350px] md:w-[400px] flex-shrink-0 snap-center
                      group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl 
                      hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300
                  "
                >
                  <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  {/* ไม่จำกัดบรรทัด (เอา line-clamp ออก) */}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 3. ปุ่มขวา  */}
            <button 
              onClick={() => scroll("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20 
                         w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                         hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                         hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                         flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                         active:scale-95
                         ${showRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
              aria-label="Scroll Right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>
        </div>

        {/* --- CTA Buttons --- */}
         <div className="flex gap-4">
            <button
              onClick={() => {
                setEnteredTool(true);
                localStorage.setItem("petroleumToolEntered", "true"); // 🔥 จำสถานะ
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
    </div>
    );
  }

/* ==========================================================
   CASE 3 : FULL PRODUCTION PETROLEUM DASHBOARD
========================================================== */
if (isMember && enteredTool) {

  const metrics = [
    { title: "WTI CRUDE", value: 78.45, change: 1.2 },
    { title: "BRENT CRUDE", value: 82.10, change: 0.8 },
    { title: "NATURAL GAS", value: 2.45, change: -0.5 },
    { title: "USD/THB", value: 35.80, change: 0.1 },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0c111b] text-white px-6 py-6">

      <div className="max-w-[1600px] mx-auto">

        {/* ================= TOP CONTROL BAR ================= */}
        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-3">

            {/* Toggle */}
            <div
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer"
            >
              <div
                className={`w-4 h-4 bg-cyan-400 rounded-full absolute top-0.5 transition-all ${
                  darkMode ? "left-0.5" : "left-5"
                }`}
              />
            </div>

            {/* Symbol */}
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-md text-sm"
            >
              <option value="TOP">Symbol: TOP</option>
              <option value="PTT">Symbol: PTT</option>
              <option value="BCP">Symbol: BCP</option>
            </select>

            {/* Oil Type */}
            <select className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-md text-sm">
              <option>GASOHOL95</option>
              <option>WTI</option>
              <option>BRENT</option>
            </select>
          </div>

          {/* Period Buttons */}
          <div className="flex gap-2">
            {["3M","6M","1Y","YTD","MAX"].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs rounded-md border
                  ${period === p
                    ? "bg-[#1f2937] border-cyan-400 text-cyan-400"
                    : "border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ================= METRIC STRIP ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          {metrics.map(m => (
            <div
              key={m.title}
              className="bg-[#111827] border border-slate-700 rounded-lg p-4"
            >
              <p className="text-xs text-slate-400">{m.title}</p>

              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-semibold">{m.value}</p>
                <p className={`text-xs ${m.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {m.change >= 0 ? "+" : ""}{m.change}%
                </p>
              </div>
            </div>
          ))}

        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BIG NUMBER CARD */}
          <div className="bg-[#111827] border border-slate-700 rounded-xl p-8 flex items-center justify-center relative">

            <div className="text-center">
              <p className="text-5xl font-bold">0.45</p>
              <p className="text-green-400 text-sm mt-2">
                ▲ 0.02 (+4.65%)
              </p>
              <p className="text-xs text-slate-500 mt-6">
                Last Update 16:30:00
              </p>
            </div>

          </div>

          <PremiumChart title="EX-REFIN" />
          <PremiumChart title="Marketing Margin" />
          <PremiumChart title="Oil Fund" step />

        </div>

      </div>
    </div>
  );
}
}

function PremiumChart({ title, step }) {
  const gradientId = `area-${title.replace(/\s/g, "")}`;

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5">

      <p className="text-xs text-slate-400 mb-4">{title}</p>

      <div className="relative w-full h-[230px] bg-[#0f172a] rounded-xl overflow-hidden">

        <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full">

          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
            </linearGradient>
          </defs>

          <path
            d={
              step
                ? "M0 8 H40 V22 H80 V28 H100"
                : "M0 28 Q20 8 40 20 T80 12 T100 5"
            }
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
          />

          <path
            d={
              step
                ? "M0 8 H40 V22 H80 V28 H100 V40 H0 Z"
                : "M0 28 Q20 8 40 20 T80 12 T100 5 V40 H0 Z"
            }
            fill={`url(#${gradientId})`}
          />

        </svg>
      </div>
    </div>
  );
}