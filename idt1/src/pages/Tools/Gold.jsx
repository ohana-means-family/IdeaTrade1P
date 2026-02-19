// src/pages/tools/Gold.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function Gold() {
  const navigate = useNavigate();

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);
  const [timeframe, setTimeframe] = useState("Day");

  const scrollContainerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // --- [NEW] Refs สำหรับระบบเลื่อนอัตโนมัติ ---
  const scrollDirection = useRef(1); // 1 = ขวา, -1 = ซ้าย
  const isPaused = useRef(false);    // เก็บสถานะว่าเมาส์ชี้อยู่ไหม

  /* ================= MEMBER CHECK ================= */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");

      if (userProfile) {
        const user = JSON.parse(userProfile);

        if (user.unlockedItems?.includes("gold")) {
          setIsMember(true);

          const hasEntered = sessionStorage.getItem("GoldToolEntered");
          if (hasEntered === "true") {
            setEnteredTool(true);
          }
        }
      }
    } catch (error) {
      console.error("Error checking member status:", error);
    }
  }, []);

  /* ================= SCROLL LOGIC (Manual + Auto) ================= */
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } =
      scrollContainerRef.current;

    setShowLeft(scrollLeft > 1);
    setShowRight(
      Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2
    );
  };

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    // [NEW] หยุด Auto ชั่วคราวเมื่อกดปุ่ม
    isPaused.current = true;

    const { current } = scrollContainerRef;
    const scrollAmount = 350;

    if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        scrollDirection.current = -1; // อัปเดตทิศทาง Auto เป็นซ้าย
    } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        scrollDirection.current = 1;  // อัปเดตทิศทาง Auto เป็นขวา
    }

    setTimeout(checkScroll, 300);
    
    // [NEW] ให้ Auto ทำงานต่อหลังจากกดปุ่มไปสักพัก (0.5 วิ)
    setTimeout(() => { isPaused.current = false }, 500);
  };

  // [NEW] Auto Scroll Effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    
    // ถ้าหา container ไม่เจอ (เช่น อยู่หน้า Dashboard) ให้จบ
    if (!container) return;

    const speed = 1;         // ความเร็ว (pixel)
    const intervalTime = 15; // ความถี่ (ms)

    const autoScrollInterval = setInterval(() => {
      // ถ้าเมาส์ชี้อยู่ (Pause) หรือ Container หายไป ให้ข้ามรอบนี้
      if (isPaused.current || !container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;

      // ตรวจสอบการชนขอบ เพื่อกลับทิศ
      if (scrollDirection.current === 1 && Math.ceil(scrollLeft) >= maxScroll - 2) {
        scrollDirection.current = -1; // ชนขวา -> เด้งกลับซ้าย
      } else if (scrollDirection.current === -1 && scrollLeft <= 2) {
        scrollDirection.current = 1;  // ชนซ้าย -> เด้งกลับขวา
      }

      // สั่งเลื่อน
      container.scrollLeft += (scrollDirection.current * speed);
      
      // อัปเดตปุ่มลูกศร
      checkScroll();
    }, intervalTime);

    return () => clearInterval(autoScrollInterval);
  }, [isMember, enteredTool]); // รันใหม่เมื่อเปลี่ยนหน้า View

  // Resize Listener
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const features = [
    {
      title: "Gold (Smart Signal)",
      desc: "Advanced gold flow detection with smart filtering.",
    },
    {
      title: "VIX Index",
      desc: "Volatility monitoring to detect fear-driven gold spikes.",
    },
    {
      title: "DXY Correlation",
      desc: "Dollar strength vs gold inverse movement tracking.",
    },
    {
      title: "US10YY",
      desc: "Yield monitoring for capital rotation signals.",
    },
  ];

  /* ==========================================================
    CASE 1 : PREVIEW VERSION (Not Member)
  ========================================================== */
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
                Gold
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Look beyond the price tag
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
                  src="/src/assets/images/Gold.png"
                  alt="Gold Dashboard Preview"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
                />
              </div>
            </div>
          </div>

          {/* --- Features Section (Scroll Layout) --- */}
          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              4 Main Features
            </h2>

            {/* [NEW] Wrapper for Pause on Hover */}
            <div 
              className="relative group"
              onMouseEnter={() => isPaused.current = true}
              onMouseLeave={() => isPaused.current = false}
            >
              
              {/* 1. ปุ่มซ้าย */}
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

              {/* 2. Scroll Container (Removed snap-x, scroll-smooth for Auto Scroll) */}
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

              {/* 3. ปุ่มขวา */}
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
                Gold
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Look beyond the price tag
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
                  src="/src/assets/images/Gold.png"
                  alt="Gold Dashboard Preview"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
                />
              </div>
            </div>
          </div>

          {/* --- Features Section (Scroll Layout) --- */}
          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              4 Main Features
            </h2>

            {/* [NEW] Wrapper for Pause on Hover */}
            <div 
              className="relative group"
              onMouseEnter={() => isPaused.current = true}
              onMouseLeave={() => isPaused.current = false}
            >
              
              {/* 1. ปุ่มซ้าย */}
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

              {/* 3. ปุ่มขวา */}
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
            <button
              onClick={() => {
                setEnteredTool(true);
                localStorage.setItem("GoldToolEntered", "true"); // 🔥 จำสถานะ
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

return (
  <div className="w-full min-h-screen bg-[#0b111a] text-white px-6 py-6">

    <div className="max-w-[1700px] mx-auto">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between mb-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => {
              setEnteredTool(false);
              localStorage.removeItem("GoldToolEntered");
            }}
            className="text-slate-400 hover:text-white"
          >
            ←
          </button>

          <div className="relative">
            <div className="
                flex items-center gap-2 
                bg-[#111827] 
                border border-slate-700 
                px-4 py-2 
                rounded-full 
                hover:border-cyan-500/50 
                hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]
                transition-all duration-300
              "
            >
              <span className="text-slate-400 text-sm">🔍</span>

              <select
                className="
                  bg-transparent 
                  text-white 
                  text-sm 
                  outline-none 
                  appearance-none 
                  cursor-pointer
                  pr-6
                "
              >
                <option value="XAUUSD" className="bg-[#111827] text-white">
                  XAUUSD
                </option>
                <option value="GOLD THAI" className="bg-[#111827] text-white">
                  GOLD THAI
                </option>
                <option value="SILVER" className="bg-[#111827] text-white">
                  SILVER
                </option>
              </select>

              {/* Custom Arrow */}
              <svg
                className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>

        {/* ALERT BUTTON */}
        <button className="bg-[#111827] border border-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition">
          🔔 Alert
        </button>

      </div>

      {/* ================= STAT STRIP ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <StatBox title="GOLD SPOT" value="2,034.50" change="+24.0 (+0.66%)" positive />
        <StatBox title="GOLD THAI (96.5%)" value="34,550" change="+50" positive />
        <StatBox title="SILVER" value="22.85" change="-0.12 (-0.5%)" />
        <StatBox title="THB/USD" value="35.60" change="-0.10 (Stronger)" />

      </div>

      {/* ================= MAIN CHART ================= */}
      <div className="bg-[#111827] border border-slate-700 rounded-xl mb-6 overflow-hidden">

        {/* HEADER */}
        <div className="px-4 py-3 border-b border-slate-700 text-sm text-slate-300">
          Gold (COMEX)
        </div>

        {/* CHART AREA */}
        <div className="relative h-[420px]">

        {/* GRID */}
        <div className="absolute inset-0 grid grid-rows-6 grid-cols-8 opacity-10 z-0">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-slate-500"></div>
          ))}
        </div>

        {/* MOCK LINE GRAPH */}
        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        >
          <polyline
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.5"
            points="0,40 10,38 20,34 30,36 40,28 50,30 60,24 70,26 80,20 90,18 100,12"
          />
        </svg>

        {/* REAL CHART MOUNT POINT */}
        <div
          id="real-gold-chart"
          className="absolute inset-0 z-20"
        />

      </div>
      </div>

      {/* ================= LOWER GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <ChartCard title="Trends" />
        <ChartCard title="VIX" />
        <ChartCard title="DXY" />
        <ChartCard title="US10YY" />

      </div>

    </div>
  </div>
);
}

function StatBox({ title, value, change, positive }) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-lg px-4 py-3 
                    flex items-center justify-between">

      <span className="text-xs text-slate-400">
        {title}
      </span>

      <span className="text-base font-semibold text-white">
        {value}
      </span>

      <span className={`text-xs ${positive ? "text-green-400" : "text-red-400"}`}>
        {change}
      </span>

    </div>
  );
}

function Badge({ label, value, color = "text-white" }) {
  return (
    <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 px-4 py-2 rounded-full">
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function ChartCard({ title }) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden">

      <div className="px-4 py-3 bg-[#0f172a] border-b border-slate-700 text-sm text-slate-300">
        {title}
      </div>

      <div className="relative h-[280px]">

        <div className="absolute inset-0 grid grid-rows-5 grid-cols-6 opacity-10 z-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="border border-slate-500"></div>
          ))}
        </div>

        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        >
          <polyline
            fill="none"
            stroke="#22d3ee"
            strokeWidth="0.6"
            points="0,35 15,32 30,28 45,30 60,24 75,26 90,20 100,18"
          />
        </svg>

        {/* future real chart */}
        <div className="absolute inset-0 z-20" />

      </div>
    </div>
  );
}
