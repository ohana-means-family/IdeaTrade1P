// src/pages/tools/FlowIntraday.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import FlowIntradayDashboard from "./components/FlowIntradayDashboard.jsx";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function FlowIntraday() {

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [layout, setLayout] = useState("4");
  const [symbols, setSymbols] = useState(Array(12).fill(""));
  const [fullscreenIndex, setFullscreenIndex] = useState(null);

  const boxes = Array.from({ length: 12 });

  // ===== Deterministic Mock Chart Generator =====
  const generateSeededData = (symbol, points = 40) => {
    let seed = 0;
    for (let i = 0; i < symbol.length; i++) {
      seed += symbol.charCodeAt(i);
    }
    const data = [];
    let value = 100 + (seed % 20);
    for (let i = 0; i < points; i++) {
      const random = Math.sin(seed + i) * 10000;
      const change = (random - Math.floor(random)) * 4 - 2;
      value += change;
      data.push(value);
    }
    return data;
  };

  const chartData = useMemo(() => {
    return symbols.map((symbol) =>
      symbol ? generateSeededData(symbol) : null
    );
  }, [symbols]);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scrollDirection = useRef(1);
  const isPaused = useRef(false);

  /* ================= MEMBER CHECK ================= */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);
        if (user.unlockedItems?.includes("flow")) {
          setIsMember(true);
          const hasEntered = sessionStorage.getItem("flowToolEntered");
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

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setFullscreenIndex(null);
    }
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);

  const features = [
    {
      title: "Multi-Asset Flow Monitor",
      desc: "Monitor up to 12 stocks at once in a powerful grid layout.",
    },
    {
      title: "Smart Flow Alerts",
      desc: "Set custom triggers and receive instant notifications.",
    },
    {
      title: "Customizable Layout",
      desc: "Switch layouts and adapt to your trading style.",
    },
  ];

  /* ==========================================================
      CASE 1 : PREVIEW VERSION (Not Member)
  ========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">

        {/* Background Ambience — จำกัดความสูงไม่ให้ล้นลงมา */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Flow Intraday
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Turn your trading screen into an elite surveillance system
            </p>
          </div>

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
                  <FlowIntradayDashboard />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              3 Main Features
            </h2>
            <div
              className="relative group"
              onMouseEnter={() => isPaused.current = true}
              onMouseLeave={() => isPaused.current = false}
            >
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

              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-6 py-4 px-1 hide-scrollbar"
                style={scrollbarHideStyle}
              >
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="w-[350px] md:w-[400px] flex-shrink-0 snap-center
                      group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl 
                      hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300"
                  >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

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
      CASE 2 : START SCREEN (MEMBER BUT NOT ENTERED)
  ========================================================== */
  if (isMember && !enteredTool) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">

        {/* Background Ambience — จำกัดความสูงไม่ให้ล้นลงมา */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Flow Intraday
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Turn your trading screen into an elite surveillance system
            </p>
          </div>

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
              <div className="aspect-[14/10] w-full bg-[#0B1221] relative overflow-hidden group">
                <div className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out">
                  <FlowIntradayDashboard />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              3 Main Features
            </h2>
            <div
              className="relative group"
              onMouseEnter={() => isPaused.current = true}
              onMouseLeave={() => isPaused.current = false}
            >
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

              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-6 py-4 px-1 hide-scrollbar"
                style={scrollbarHideStyle}
              >
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="w-[350px] md:w-[400px] flex-shrink-0 snap-center
                      group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl 
                      hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300"
                  >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

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

          <div className="flex gap-4">
            <button
              onClick={() => {
                setEnteredTool(true);
                localStorage.setItem("flowToolEntered", "true");
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
      CASE 3 : FULL PRODUCTION DASHBOARD
  ========================================================== */
  const normalizeData = (data, height = 150) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1; // 🔥 กันหาร 0

    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  const handleSymbolChange = (index, value) => {
    const updated = [...symbols];
    updated[index] = value;
    setSymbols(updated);
  };

  return (
    <div className="w-full min-h-screen bg-[#0b111a] text-white px-6 py-6">
      <div className="max-w-[1600px] mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 px-4 py-2 rounded-lg">
              <span className="text-sm text-slate-400">Select Layout :</span>
              <div className="flex gap-2">
                {["4", "3", "2"].map((col) => (
                  <button
                    key={col}
                    onClick={() => setLayout(col)}
                    className={`w-7 h-7 rounded text-xs flex items-center justify-center transition
                      ${layout === col ? "bg-purple-600 text-white" : "bg-[#1f2937] text-slate-400 hover:text-white"}`}
                  >
                    {col === "4" ? "▦" : col === "3" ? "▤" : "☰"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>Price</span>
              <div className="w-8 h-[2px] bg-white"></div>
              <span>Value</span>
              <div className="flex gap-1">
                <div className="w-3 h-[2px] bg-green-400"></div>
                <div className="w-3 h-[2px] bg-red-400"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-[#111827] border border-slate-700 px-4 py-2 rounded-lg text-sm">
              <option>Favorites</option>
              <option>SET50</option>
              <option>Energy</option>
            </select>
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold">
              ♥ ADD
            </button>
          </div>
        </div>

        <div
          className={`grid gap-5 transition-all duration-300
            ${layout === "4" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : layout === "3" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"}`}
        >
          {boxes.map((_, index) => (
            <div
              key={index}
              className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition"
            >
              <div className="flex items-center justify-between px-3 py-2 bg-[#0f172a] border-b border-slate-700">
                <select
                  value={symbols[index]}
                  onChange={(e) => handleSymbolChange(index, e.target.value)}
                  className="bg-transparent text-xs text-slate-400 outline-none"
                >
                  <option value="">Symbol...</option>
                  <option value="PTT">PTT</option>
                  <option value="TOP">TOP</option>
                  <option value="DELTA">DELTA</option>
                </select>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Notify</span>
                  <select className="bg-[#1f2937] px-2 py-0.5 rounded text-xs">
                    <option>Flow</option>
                    <option>Price</option>
                  </select>
                   {/* 🔔 */}
                  <span className="cursor-pointer hover:text-white transition">
                    🔔
                  </span>

                  {/* 🔍 แสดงเฉพาะตอนมี symbol */}
                  {symbols[index] && (
                    <ZoomInIcon
                      onClick={() => setFullscreenIndex(index)}
                      sx={{
                        fontSize: 18,
                        color: "#94a3b8",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "#ffffff",
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                  )}

                  {/* 🔄 */}
                  <span className="cursor-pointer hover:text-white transition">
                    🔄
                  </span>

                </div>
              </div>

              <div className="h-[180px] bg-[#0b1220] relative flex items-center justify-center">
                {!symbols[index] ? (
                  <div className="text-slate-600 text-sm">Select Symbol to View Chart</div>
                ) : (
                  (() => {
                    const data = chartData[index];
                    const points = normalizeData(data);
                    const isUp = data[data.length - 1] >= data[0];
                    return (
                      <svg viewBox="0 0 100 150" preserveAspectRatio="none" className="w-full h-full">
                        <defs>
                          <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity="0.4" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        <polygon fill={`url(#grad-${index})`} points={`0,150 ${points} 100,150`} />
                        <polyline fill="none" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth="2" points={points} />
                      </svg>
                    );
                  })()
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
      {fullscreenIndex !== null && (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col" onClick={() => setFullscreenIndex(null)}>
    
    {/* ===== OUTER TOPBAR (Outside Chart Box) ===== */}
    <div className="bg-[#0b111a] border-b border-slate-700 px-6 py-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        
        {/* 1. ปุ่ม กลับ/ปิด */}
        <button
          onClick={() => setFullscreenIndex(null)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700/40 hover:bg-red-600/60 rounded-full text-sm text-slate-300 hover:text-white transition font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* 2. ปุ่ม Refresh */}
        <button className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* 3,4,5. Capsule Box (Search + Clear + Dropdown) */}
        <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-full h-9 px-4 gap-3">
          {/* 3. Search Icon & Input */}
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Type a Symbol..."
            className="bg-transparent border-none outline-none text-xs text-slate-300 placeholder-slate-600 w-32 font-medium"
          />

          {/* 4. Clear Icon */}
          <button className="text-slate-500 hover:text-red-400 text-sm">✕</button>

          {/* Separator */}
          <div className="w-px h-5 bg-slate-600"></div>

          {/* 5. Dropdown Button */}
          <select className="bg-transparent border-none outline-none text-xs text-slate-300 font-medium cursor-pointer">
            <option>1DIV</option>
            <option>2DIV</option>
          </select>
        </div>
      </div>

      {/* Title (Center) */}
      <h2 className="text-2xl font-bold text-white">{symbols[fullscreenIndex]}</h2>

      {/* Close X Button (Right) */}
      <button
        onClick={() => setFullscreenIndex(null)}
        className="text-slate-400 hover:text-white text-2xl font-light"
      >
        ✕
      </button>
    </div>

    {/* ===== CHART CONTAINER ===== */}
    <div className="flex-1 p-6 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-700 p-6 relative flex flex-col">

        {/* Info Box (Top Right) */}
        <div className="absolute top-8 right-8 bg-slate-800/90 border border-slate-700 rounded-lg p-4 z-10">
          <div className="text-xs text-slate-400 font-semibold mb-3">12:03</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              <span className="text-slate-300">Price: <span className="text-white font-bold">5,300</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-orange-400 rounded-full"></div>
              <span className="text-slate-300">Flow: <span className="text-white font-bold">-1,800</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">Limit: <span className="text-white font-bold">400</span></span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        {(() => {
          const data = chartData[fullscreenIndex];
          if (!data) return null;

          const generateMultipleLines = (baseData) => {
            return {
              prices: baseData,
              flows: baseData.map(v => v * 0.7 - 50),
              limits: baseData.map(v => v * 0.5)
            };
          };

          const { prices, flows, limits } = generateMultipleLines(data);
          
          const normalizeData = (dataset, height = 350) => {
            const max = Math.max(...dataset);
            const min = Math.min(...dataset);
            const range = max - min || 1;
            return dataset.map((val, i) => {
              const x = (i / (dataset.length - 1)) * 100;
              const y = height - ((val - min) / range) * height;
              return `${x},${y}`;
            }).join(" ");
          };

          const priceLine = normalizeData(prices);
          const flowLine = normalizeData(flows);
          const limitLine = normalizeData(limits);

          const timeLabels = ['09:57', '10:08', "26 ต.ค.'25 10:32:00", '10:47', '11:40', '12:03', '12:28', '13:55'];
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          const gridLines = [];
          for (let i = 0; i <= 6; i++) {
            const ratio = i / 6;
            gridLines.push({
              y: ratio * 100,
              label: Math.round(maxPrice - (maxPrice - minPrice) * ratio)
            });
          }

          return (
            <svg viewBox="0 0 1200 500" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="priceGradFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* ===== HORIZONTAL GRID LINES (Y-Axis) ===== */}
              {gridLines.map((line, i) => (
                <g key={`hgrid-${i}`}>
                  <line
                    x1="80"
                    y1={line.y * 5}
                    x2="1200"
                    y2={line.y * 5}
                    stroke="#444"
                    strokeWidth="0.8"
                    opacity="0.5"
                    strokeDasharray="4,4"
                  />
                  <text
                    x="65"
                    y={line.y * 5 + 4}
                    fontSize="12"
                    fill="#a0aec0"
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {line.label.toLocaleString()}
                  </text>
                </g>
              ))}

              {/* ===== VERTICAL GRID LINES (X-Axis) ===== */}
              {timeLabels.map((label, i) => {
                const x = 80 + (i / (timeLabels.length - 1)) * 1120;
                return (
                  <g key={`vgrid-${i}`}>
                    <line
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="350"
                      stroke="#444"
                      strokeWidth="0.8"
                      opacity="0.3"
                    />
                    <text
                      x={x}
                      y="380"
                      fontSize="11"
                      fill="#a0aec0"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* ===== REFERENCE LINE (Green Dashed) ===== */}
              <line
                x1="80"
                y1="175"
                x2="1200"
                y2="175"
                stroke="#10b981"
                strokeWidth="1"
                opacity="0.4"
                strokeDasharray="6,3"
              />

              {/* ===== PRICE LINE (WHITE) ===== */}
              <polyline
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={priceLine.split(" ").map((p, i) => {
                  const [x, y] = p.split(",");
                  return `${80 + (parseFloat(x) / 100) * 1120},${parseFloat(y) * 3.5}`;
                }).join(" ")}
              />

              {/* Price Points */}
              {priceLine.split(" ").map((p, i) => {
                if (i % 5 === 0) {
                  const [x, y] = p.split(",");
                  return (
                    <circle
                      key={`pprice-${i}`}
                      cx={80 + (parseFloat(x) / 100) * 1120}
                      cy={parseFloat(y) * 3.5}
                      r="4.5"
                      fill="white"
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                }
                return null;
              })}

              {/* ===== FLOW LINE (ORANGE) ===== */}
              <polyline
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={flowLine.split(" ").map((p, i) => {
                  const [x, y] = p.split(",");
                  return `${80 + (parseFloat(x) / 100) * 1120},${parseFloat(y) * 3.5}`;
                }).join(" ")}
              />

              {/* ===== LIMIT LINE (GREEN) ===== */}
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={limitLine.split(" ").map((p, i) => {
                  const [x, y] = p.split(",");
                  return `${80 + (parseFloat(x) / 100) * 1120},${parseFloat(y) * 3.5}`;
                }).join(" ")}
              />

              {/* Limit Points */}
              {limitLine.split(" ").map((p, i) => {
                if (i % 5 === 0) {
                  const [x, y] = p.split(",");
                  return (
                    <circle
                      key={`plimit-${i}`}
                      cx={80 + (parseFloat(x) / 100) * 1120}
                      cy={parseFloat(y) * 3.5}
                      r="4.5"
                      fill="#22c55e"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  );
                }
                return null;
              })}

            </svg>
          );
        })()}
      </div>
    </div>

  </div>
)}
    </div>
  );
}