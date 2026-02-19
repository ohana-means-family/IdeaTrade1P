// src/pages/tools/S50.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import S50Dashboard from "./components/S50Dashboard.jsx";

const scrollbarHideStyle = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none'
};

// ===== MOCK DATA GENERATOR =====
const generateMockData = (seed = 1, points = 60, volatility = 2) => {
  const data = [];
  let value = 100 + seed * 5;

  for (let i = 0; i < points; i++) {
    const change = (Math.sin(i + seed) + Math.random() - 0.5) * volatility;
    value += change;
    data.push(value);
  }

  return data;
};

// ===== DETERMINISTIC MASTER DATA =====
const generateMasterData = (seed = 1, totalPoints = 300) => {
  const data = [];
  let value = 100 + seed * 5;

  for (let i = 0; i < totalPoints; i++) {
    const random = Math.sin(i * 0.7 + seed) * 10000;
    const change = (random - Math.floor(random)) * 2 - 1;
    value += change;
    data.push(value);
  }

  return data;
};

const normalizeData = (data, height = 280) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
};

export default function S50() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [timeframe, setTimeframe] = useState("Day");

  const scrollDirection = useRef(1);
  const isPaused = useRef(false);

  /* ================= MEMBER CHECK ================= */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");

      if (userProfile) {
        const user = JSON.parse(userProfile);

        if (user.unlockedItems?.includes("s50")) {
          setIsMember(true);

          const hasEntered = sessionStorage.getItem("s50ToolEntered");
          if (hasEntered === "true") {
            setEnteredTool(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* ================= SCROLL LOGIC ================= */
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setShowLeft(scrollLeft > 1);
    setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
  };

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    isPaused.current = true;

    const { current } = scrollContainerRef;
    const scrollAmount = 350;

    if (direction === "left") {
      current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      scrollDirection.current = -1;
    } else {
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      scrollDirection.current = 1;
    }

    setTimeout(checkScroll, 300);
    setTimeout(() => { isPaused.current = false; }, 500);
  };

  // Auto Scroll Effect
  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const speed = 1;
    const intervalTime = 15;

    const autoScrollInterval = setInterval(() => {
      if (isPaused.current || !container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollDirection.current === 1 && Math.ceil(scrollLeft) >= maxScroll - 2) {
        scrollDirection.current = -1;
      } else if (scrollDirection.current === -1 && scrollLeft <= 2) {
        scrollDirection.current = 1;
      }

      container.scrollLeft += (scrollDirection.current * speed);
      checkScroll();
    }, intervalTime);

    return () => clearInterval(autoScrollInterval);
  }, [isMember, enteredTool]);

  // Resize Listener
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const features = [
    {
      title: "Last",
      desc: "Track the daily price action of the SET50 Index.",
    },
    {
      title: "Confirm Up/Down S50",
      desc: "Forecast bullish or bearish momentum.",
    },
    {
      title: "Trend (Flow Analysis)",
      desc: "Visualizes net buying/selling in SET50.",
    },
    {
      title: "Mid-Trend (Market Sentiment)",
      desc: "Monitor overall SET market activity.",
    },
  ];

  /* ==========================================================
    SHARED JSX — Features Scroll Section (inline, not a component,
    so scrollContainerRef / isPaused refs work correctly)
  ========================================================== */
  const featuresSectionJSX = (
    <div className="w-full max-w-5xl mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
        4 Main Features
      </h2>

      <div
        className="relative group"
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
      >
        {/* Left Button */}
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

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-6 py-4 px-1 hide-scrollbar"
          style={scrollbarHideStyle}
        >
          {features.map((item, index) => (
            <div
              key={index}
              className="
                w-[350px] md:w-[400px] flex-shrink-0 snap-center
                group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl
                hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300
              "
            >
              <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Right Button */}
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
  );

  const dashboardPreviewJSX = (
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
          <div className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out">
            <S50Dashboard />
          </div>
        </div>
      </div>
    </div>
  );

  /* ==========================================================
    CASE 1 : PREVIEW VERSION (Not Member)
  ========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-x-hidden animate-fade-in pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                S50
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Master the S50 Index Futures with absolute conviction
            </p>
          </div>

          {/* Dashboard Preview */}
          {dashboardPreviewJSX}

          {/* Features */}
          {featuresSectionJSX}

          {/* CTA Buttons */}
          <div className="text-center w-full max-w-md mx-auto mt-4">
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
          </div>

        </div>
      </div>
    );
  }

  /* ==========================================================
    CASE 2 : START SCREEN (Member but not entered)
  ========================================================== */
  if (isMember && !enteredTool) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-x-hidden animate-fade-in pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                S50
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Master the S50 Index Futures with absolute conviction
            </p>
          </div>

          {/* Dashboard Preview */}
          {dashboardPreviewJSX}

          {/* Features */}
          {featuresSectionJSX}

          {/* CTA Button */}
          <div className="text-center w-full max-w-md mx-auto mt-4">
            <button
              onClick={() => {
                setEnteredTool(true);
                sessionStorage.setItem("s50ToolEntered", "true");
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
    CASE 3 : FULL DASHBOARD (Member + Entered)
  ========================================================== */
  return (
    <div className="w-full min-h-screen bg-[#0b111a] text-white px-6 py-6">
      <div className="max-w-[1600px] mx-auto">

        {/* ================= TOP HEADER ================= */}
        <div className="flex items-center justify-between mb-6">

          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setEnteredTool(false);
                sessionStorage.removeItem("s50ToolEntered");
              }}
              className="text-slate-400 hover:text-white transition"
            >
              ←
            </button>

            <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 px-4 py-2 rounded-full">
              <span className="text-sm">🔍</span>
              <select className="bg-transparent text-sm outline-none text-white">
                <option>S50H26</option>
                <option>S50M26</option>
                <option>S50U26</option>
              </select>
            </div>
          </div>

          {/* Center Badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 px-4 py-2 rounded-full">
              <span className="text-xs text-slate-400">SIGNAL</span>
              <span className="text-green-400 font-semibold text-sm">LONG ↑</span>
            </div>

            <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 px-4 py-2 rounded-full">
              <span className="text-xs text-slate-400">TREND SCORE</span>
              <span className="text-white font-semibold text-sm">8/10</span>
            </div>

            <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 px-4 py-2 rounded-full">
              <span className="text-xs text-slate-400">STATUS</span>
              <span className="text-blue-400 font-semibold text-sm">CONFIRM</span>
            </div>
          </div>

          {/* Right Side Timeframe */}
          <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 p-1 rounded-lg">
            {["15m", "1H", "Day", "Week"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs rounded-md transition-all duration-200
                  ${timeframe === tf
                    ? "bg-slate-600 text-white shadow-inner"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CHART GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="1. Last (SET50 Daily)" timeframe={timeframe} />
          <ChartCard title="2. Confirm Up/Down S50" timeframe={timeframe} />
          <ChartCard title="3. Trend (Volume Flow)" timeframe={timeframe} />
          <ChartCard title="4. Mid-Trend (SET Context)" timeframe={timeframe} />
        </div>

      </div>
    </div>
  );
}

/* ================= REUSABLE CHART CARD ================= */
function ChartCard({ title, timeframe }) {
  const seed = title.length;

  const masterDataRef = useRef(generateMasterData(seed));

  const data = useMemo(() => {
    const master = masterDataRef.current;

    let sliceSize = 60;
    if (timeframe === "15m") sliceSize = 40;
    if (timeframe === "1H") sliceSize = 80;
    if (timeframe === "Day") sliceSize = 150;
    if (timeframe === "Week") sliceSize = 300;

    return master.slice(master.length - sliceSize);
  }, [timeframe]);

  const points = normalizeData(data);
  const isUp = data[data.length - 1] >= data[0];

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-[#0f172a] border-b border-slate-700 flex justify-between items-center">
        <span className="text-sm text-slate-300">{title}</span>
        <span className="text-xs text-slate-500">{timeframe}</span>
      </div>

      <div className="h-[300px] relative">
        <svg
          viewBox="0 0 100 280"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          <polygon
            fill={`url(#grad-${seed})`}
            points={`0,280 ${points} 100,280`}
          />

          <polyline
            fill="none"
            stroke={isUp ? "#22c55e" : "#ef4444"}
            strokeWidth="2"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}