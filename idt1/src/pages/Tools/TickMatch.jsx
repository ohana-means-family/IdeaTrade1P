// src/pages/tools/TickMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Style ซ่อน Scrollbar (เหมือนต้นแบบ DR 100%)
const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function TickMatch() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // States (เหมือน DR 100%)
  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  // Scroll Button States (เหมือน DR 100%)
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Filter States (Dashboard TickMatch - Mock Data)
  // (DR มี usaFilter/asiaFilter แต่ TickMatch เป็น Split View เดี๋ยวเราใช้ Mock Data แทน)

  /* ===============================
      1. MEMBER CHECK & LOGIC (เหมือน DR 100%)
      - Logic: อ่าน session แต่เขียน local ทำให้รีหน้าทุกครั้งที่เข้าใหม่
  ================================ */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);

        // เช็คสิทธิ์ 'tickmatch' (เปลี่ยนแค่ชื่อสิทธิ์)
        if (user.unlockedItems && user.unlockedItems.includes("tickmatch")) {
          setIsMember(true);

          // เช็คว่าเคยเข้า tool แล้วหรือยัง (อ่านจาก sessionStorage เหมือน DR)
          const hasEntered = sessionStorage.getItem("tickToolEntered");
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
      2. SCROLL LOGIC (เหมือน DR 100%)
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
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
      setTimeout(checkScroll, 300);
    }
  };
  
  // เพิ่ม useEffect สำหรับ scroll event listener (เพื่อให้ scroll logic ทำงานสมบูรณ์แบบ DR)
  useEffect(() => {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
  }, []);

  /* ===============================
      3. DATA CONTENT (TickMatch Content)
  ================================ */
  const features = [
    { title: "Net Accumulated Volume", desc: "Track global gold prices with an intelligent filtering system designed to eliminate market noise." },
    { title: "Flip Signal", desc: "Instantly detect the moment capital flow reverses direction from bullish to bearish." },
    { title: "Granular Tick Data", desc: "Audit every single transaction to scan for whale orders hidden within the noise." },
    { title: "Price-Based Distribution", desc: "Identifies price levels where the heaviest trading volume has occurred." },
  ];

  // Mock Data สำหรับ Dashboard (Split View)
  const leftTableData = [
    { time: "10:00:15", last: "72.23", vol: "12,987", type: "S", sum: "938,089.179" },
    { time: "10:02:15", last: "72.12", vol: "5,796", type: "S", sum: "417,991.665" },
    { time: "10:04:15", last: "72.98", vol: "14,844", type: "B", sum: "1,083,277.256" },
    { time: "10:06:15", last: "72.13", vol: "17,249", type: "S", sum: "1,244,200.647" },
    { time: "10:08:15", last: "72.87", vol: "145", type: "B", sum: "10,566.171" },
    { time: "10:10:15", last: "72.67", vol: "11,026", type: "S", sum: "801,276.964" },
    { time: "10:12:15", last: "72.54", vol: "16,405", type: "S", sum: "1,190,007.093" },
    { time: "10:14:15", last: "72.33", vol: "10,811", type: "B", sum: "781,984.248" },
    { time: "10:16:15", last: "72.27", vol: "1,372", type: "B", sum: "99,158.565" },
    { time: "10:18:15", last: "72.63", vol: "2,273", type: "B", sum: "165,083.674" },
    { time: "11:20:15", last: "72.67", vol: "11,282", type: "B", sum: "819,814.095" },
  ];

  const rightTableData = [
    { time: "10:00:15", last: "70.57", vol: "16,125", type: "B", sum: "1,137,908.283" },
    { time: "10:02:15", last: "71.14", vol: "16,746", type: "B", sum: "1,191,232.309" },
    { time: "10:04:15", last: "70.62", vol: "3,010", type: "B", sum: "212,554.283" },
    { time: "10:06:15", last: "71.26", vol: "6,055", type: "S", sum: "431,452.581" },
    { time: "10:08:15", last: "70.87", vol: "8,692", type: "B", sum: "616,040.729" },
    { time: "10:10:15", last: "71.27", vol: "14,964", type: "S", sum: "1,066,452.79" },
    { time: "10:12:15", last: "70.75", vol: "9,488", type: "S", sum: "671,293.226" },
    { time: "10:14:15", last: "71.05", vol: "5,496", type: "B", sum: "390,490.332" },
    { time: "10:16:15", last: "71.18", vol: "11,662", type: "S", sum: "830,147.228" },
    { time: "10:18:15", last: "70.63", vol: "12,415", type: "S", sum: "876,871.749" },
    { time: "11:20:15", last: "70.58", vol: "11,584", type: "S", sum: "817,633.933" },
  ];

// Component ย่อยสำหรับ Panel Dashboard (อัปเดต Header ตามรูปที่ 2)
  const AnalysisPanel = ({ symbol, date, sumBuy, sumSell, netVol, data }) => {
    const total = parseInt(sumBuy.replace(/,/g, '')) + parseInt(sumSell.replace(/,/g, ''));
    const buyPercent = (parseInt(sumBuy.replace(/,/g, '')) / total) * 100;

    return (
      <div className="flex flex-col h-full bg-[#111827] border border-slate-700 rounded-lg p-3 shadow-lg overflow-hidden">
        
        {/* --- 1. New Header Layout (Grid) --- */}
        <div className="grid grid-cols-12 gap-2 mb-3 items-end">
            
            {/* Symbol Column */}
            <div className="col-span-7 flex flex-col gap-1">
               {/* Label Row */}
               <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-[10px] text-white px-1.5 rounded font-bold">SYNC</span>
                  <span className="text-xs text-slate-400">Symbol *</span>
               </div>
               {/* Input Box */}
               <div className="bg-[#0B1221] border border-slate-600 rounded px-3 py-1.5 h-9 flex items-center">
                  <input type="text" defaultValue={symbol} className="bg-transparent text-white font-bold text-sm w-full focus:outline-none uppercase" />
               </div>
            </div>

            {/* Date Column */}
            <div className="col-span-3 flex flex-col gap-1">
               {/* Label Row */}
               <span className="text-xs text-slate-400 pl-1">Date</span>
               {/* Input Box */}
               <div className="bg-[#0B1221] border border-slate-600 rounded px-3 py-1.5 h-9 flex items-center justify-center">
                  <input type="text" defaultValue={date} className="bg-transparent text-white text-sm w-full focus:outline-none text-center" />
               </div>
            </div>

            {/* Button Column */}
            <div className="col-span-2">
               <button className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                 SEARCH
               </button>
            </div>

        </div>

        {/* 2. Summary Cards (คงเดิม) */}
        <div className="grid grid-cols-3 gap-2 mb-1">
          <div className="bg-[#1e1e1e] border border-green-900/50 rounded p-2 flex flex-col relative overflow-hidden">
            <span className="text-[10px] text-slate-400">Sum Buy</span>
            <span className="text-green-500 font-bold text-lg text-right">{sumBuy}</span>
            <div className="absolute bottom-0 left-0 h-[2px] bg-green-500 w-full"></div>
          </div>
          <div className="bg-[#1e1e1e] border border-red-900/50 rounded p-2 flex flex-col relative overflow-hidden">
             <span className="text-[10px] text-slate-400">Sum Sell</span>
             <span className="text-red-500 font-bold text-lg text-right">{sumSell}</span>
             <div className="absolute bottom-0 left-0 h-[2px] bg-red-500 w-full"></div>
          </div>
          <div className="bg-[#1e1e1e] border border-slate-700/50 rounded p-2 flex flex-col relative overflow-hidden">
             <span className="text-[10px] text-slate-400">Net Acc. Vol</span>
             <span className={`${netVol.includes('-') ? 'text-red-500' : 'text-green-500'} font-bold text-lg text-right`}>{netVol}</span>
             <div className={`absolute bottom-0 left-0 h-[2px] w-full ${netVol.includes('-') ? 'bg-red-500' : 'bg-green-500'}`}></div>
          </div>
        </div>

        {/* 3. Progress Bar (คงเดิม) */}
        <div className="w-full h-1 bg-red-600 rounded-full mb-3 flex overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${buyPercent}%` }}></div>
        </div>

        {/* 4. Filters (คงเดิม) */}
        <div className="flex gap-2 mb-3">
          <button className="bg-slate-700 text-white text-[10px] px-3 py-1 rounded hover:bg-slate-600">All</button>
          <button className="bg-[#1f2937] text-slate-400 border border-slate-600 text-[10px] px-3 py-1 rounded hover:text-white">Buy Only</button>
          <button className="bg-[#1f2937] text-slate-400 border border-slate-600 text-[10px] px-3 py-1 rounded hover:text-white">Sell Only</button>
          <button className="bg-[#1f2937] text-slate-400 border border-slate-600 text-[10px] px-3 py-1 rounded hover:text-white">{'>'} 100K (Big Lot)</button>
        </div>

        {/* 5. Table (คงเดิม) */}
        <div className="flex-1 overflow-y-auto bg-[#0B1221] rounded border border-slate-800/50 scrollbar-thin scrollbar-thumb-slate-700">
           <table className="w-full text-right border-collapse">
             <thead className="bg-[#1f2937] text-slate-400 text-[10px] font-medium sticky top-0 z-10 shadow-sm">
               <tr>
                 <th className="p-2 text-center">Time</th>
                 <th className="p-2">Last</th>
                 <th className="p-2">Vol</th>
                 <th className="p-2 text-center">Type</th>
                 <th className="p-2">Sum</th>
               </tr>
             </thead>
             <tbody className="text-xs font-mono text-slate-300">
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors">
                    <td className="p-2 text-center text-slate-400">{row.time}</td>
                    <td className="p-2 text-yellow-500">{row.last}</td>
                    <td className="p-2 font-bold text-slate-200">{row.vol}</td>
                    <td className="p-2 flex justify-center items-center">
                      <span className={`flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-black ${row.type === 'B' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="p-2 text-slate-500">{row.sum}</td>
                  </tr>
                ))}
             </tbody>
           </table>
        </div>
      </div>
    );
  };

  /* ==========================================================
      VIEW 1 : ยังไม่ซื้อ (CASE 1) - เหมือน DR 100%
  =========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                TickMatch
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Tracking "Big Money" Footprints
            </p>
          </div>

          {/* Preview Image Card */}
          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="aspect-[16/9] w-full bg-[#0B1221]">
                {/* เปลี่ยนรูปเป็น TickMatch */}
                <img src="/src/assets/images/TickMatch.png" alt="TickMatch Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" />
              </div>
            </div>
          </div>

          {/* Features Section (Scrollable) */}
          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              4 Main Features
            </h2>
            <div className="relative group">
              {/* Left Button */}
              <button 
                onClick={() => scroll("left")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center transition-all duration-300 backdrop-blur-sm active:scale-95 ${showLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* Scroll Container */}
              <div ref={scrollContainerRef} onScroll={checkScroll} className="flex overflow-x-auto gap-6 py-4 px-1 snap-x snap-mandatory hide-scrollbar scroll-smooth" style={scrollbarHideStyle}>
                {features.map((item, index) => (
                  <div key={index} className="w-[350px] md:w-[400px] flex-shrink-0 snap-center group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Right Button */}
              <button 
                onClick={() => scroll("right")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center transition-all duration-300 backdrop-blur-sm active:scale-95 ${showRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
             <button onClick={() => navigate("/login")} className="px-8 py-3 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 transition">Sign In</button>
             <button onClick={() => navigate("/member-register")} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold hover:shadow-lg transition">Join Membership</button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
      VIEW 2 : ซื้อแล้ว แต่ยังไม่กด Start (CASE 2) - เหมือน DR 100%
  =========================================================== */
  if (isMember && !enteredTool) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                TickMatch
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Tracking "Big Money" Footprints
            </p>
          </div>

          {/* Preview Image Card */}
          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="aspect-[16/9] w-full bg-[#0B1221]">
                <img src="/src/assets/images/TickMatch.png" alt="TickMatch Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" />
              </div>
            </div>
          </div>

          {/* Features Section (Scrollable) */}
          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              4 Main Features
            </h2>
            <div className="relative group">
              {/* Left Button */}
              <button 
                onClick={() => scroll("left")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center transition-all duration-300 backdrop-blur-sm active:scale-95 ${showLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* Scroll Container */}
              <div ref={scrollContainerRef} onScroll={checkScroll} className="flex overflow-x-auto gap-6 py-4 px-1 snap-x snap-mandatory hide-scrollbar scroll-smooth" style={scrollbarHideStyle}>
                {features.map((item, index) => (
                  <div key={index} className="w-[350px] md:w-[400px] flex-shrink-0 snap-center group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Right Button */}
              <button 
                onClick={() => scroll("right")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center transition-all duration-300 backdrop-blur-sm active:scale-95 ${showRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex gap-4 justify-center w-full">
            <button
              onClick={() => {
                setEnteredTool(true);
                localStorage.setItem("tickToolEntered", "true"); 
              }}
              className="group relative inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2 text-lg">Start Using Tool</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
      VIEW 3: DASHBOARD (Real Tool - Split View)
  =========================================================== */
  return (
    <div className="w-full min-h-screen bg-[#0B1221] text-white p-4 animate-fade-in flex flex-col gap-4">
      
      {/* Title Header */}
      <h1 className="text-xl font-bold mb-2 text-white border-l-4 border-cyan-500 pl-3">TickMatch Analysis</h1>

      {/* Main Grid Layout (2 Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-100px)]">
        
        {/* Left Panel */}
        <AnalysisPanel 
          symbol="DELTA" 
          date="20/01/2026" 
          sumBuy="12,500,400" 
          sumSell="8,200,100" 
          netVol="+4,300,300" 
          data={leftTableData} 
        />

        {/* Right Panel */}
        <AnalysisPanel 
          symbol="DELTA" 
          date="19/01/2026" 
          sumBuy="5,100,000" 
          sumSell="6,200,000" 
          netVol="-1,100,000" 
          data={rightTableData} 
        />

      </div>
    </div>
  );
}