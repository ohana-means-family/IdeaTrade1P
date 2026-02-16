// src/pages/tools/DRInsight.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Style ซ่อน Scrollbar (เหมือนต้นแบบ)
const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function DRInsight() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // States
  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  // Scroll Button States
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Filter States for Dashboard Sidebars (ของเดิม DR Insight)
  const [usaFilter, setUsaFilter] = useState("");
  const [asiaFilter, setAsiaFilter] = useState("");

  // Chart Selections (State สำหรับ Dropdown ในแต่ละกราฟ)
  const [chartSelections, setChartSelections] = useState({
    chart1: "AAPL80X",
    chart2: "BABA80",
    chart3: "FUEVFVND01",
  });

  /* ===============================
      1. MEMBER CHECK & LOGIC
  ================================ */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);

        // เช็คสิทธิ์ 'dr'
        if (user.unlockedItems && user.unlockedItems.includes("dr")) {
          setIsMember(true);

          // เช็คว่าเคยเข้า tool แล้วหรือยัง (ใช้ sessionStorage ให้เหมือนกับตอนกดปุ่ม Start)
          const hasEntered = sessionStorage.getItem("drToolEntered");
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
      2. SCROLL LOGIC (เหมือนต้นแบบ)
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

  /* ===============================
      3. DATA MOCKUP (Lists)
  ================================ */
  const features = [
    { title: "Global Symbol Mapping", desc: "Instantly connects every DR on the Thai board to its underlying international parent stock." },
    { title: "Arbitrage Tracking", desc: "Compare the parent stock’s price against the Thai DR on a dual-pane screen." },
    { title: "Real-Time Valuation", desc: "Monitor live P/E ratios and key metrics of global underlying stocks." },
    { title: "Multi-Market Heatmap", desc: "Visualize global market trends (US, China, Vietnam) in one dashboard." },
  ];

  const usaStocks = [
    { dr: "AAPL80X", real: "NASDAQ:AAPL", name: "Apple Inc." },
    { dr: "AMZN80X", real: "NASDAQ:AMZN", name: "Amazon.com" },
    { dr: "GOOG80X", real: "NASDAQ:GOOG", name: "Alphabet Inc." },
    { dr: "TSLABOX", real: "NASDAQ:TSLA", name: "Tesla Inc." },
    { dr: "MSFT80X", real: "NASDAQ:MSFT", name: "Microsoft" },
    { dr: "NVDA80X", real: "NASDAQ:NVDA", name: "NVIDIA" },
    { dr: "METABOX", real: "NASDAQ:META", name: "Meta Platforms" },
  ];

  const europeStocks = [
    { dr: "ASML01", real: "EURONEXT:ASML", name: "ASML Holding" },
    { dr: "LVMH01", real: "EURONEXT:MC", name: "LVMH" },
  ];

  const asiaStocks = [
    { dr: "BABA80", real: "HKEX:9988", name: "Alibaba Group" },
    { dr: "TENCENT80", real: "HKEX:700", name: "Tencent" },
    { dr: "BYDCOM80", real: "HKEX:1211", name: "BYD Company" },
    { dr: "XIAOMI80", real: "HKEX:1810", name: "Xiaomi Corp" },
    { dr: "E1VFVN3001", real: "HOSE:E1VFVN30", name: "Vietnam ETF" },
    { dr: "FUEVFVND01", real: "HOSE:FUEVFVND", name: "Vietnam Diamond ETF" },
    { dr: "JAPAN13", real: "HKEX:3160", name: "Japan ETF" },
  ];

  const allStockOptions = [...usaStocks, ...europeStocks, ...asiaStocks];

  /* ==========================================================
      VIEW 1 : ยังไม่ซื้อ (CASE 1)
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
                DR Insight
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Your Gateway to Global Equity
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
                {/* *** อย่าลืมเปลี่ยน path รูปภาพให้ถูกต้อง *** */}
                <img src="/src/assets/images/DRInsight.png" alt="DR Insight Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" />
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
      VIEW 2 : ซื้อแล้ว แต่ยังไม่กด Start (CASE 2)
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
                DR Insight
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Your Gateway to Global Equity
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
                <img src="/src/assets/images/DRInsight.png" alt="DR Insight Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" />
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
                localStorage.setItem("drToolEntered", "true"); // จำสถานะ
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
      VIEW 3: DASHBOARD (Real Tool - 3 Columns Layout)
      (คง Layout เดิมของ DR Insight ไว้ เพราะต้องใช้พื้นที่แบบ 3 Columns)
  =========================================================== */
  return (
    <div className="w-full min-h-screen bg-[#0B1221] text-white p-4 animate-fade-in flex flex-col gap-4">
      
      {/* 1. Top Bar: Indicators */}
      <div className="flex justify-center gap-6 mb-2">
         <div className="bg-[#1e293b] px-5 py-1.5 rounded-full text-xs text-slate-400 border border-slate-700 flex items-center gap-3">
            <span>ราคาอ้างอิง:</span> 
            <div className="w-10 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></div>
         </div>
         <div className="bg-[#1e293b] px-5 py-1.5 rounded-full text-xs text-slate-400 border border-slate-700 flex items-center gap-3">
            <span>PE Ratio:</span> 
            <div className="w-10 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]"></div>
         </div>
         <div className="bg-[#1e293b] px-5 py-1.5 rounded-full text-xs text-slate-400 border border-slate-700 flex items-center gap-3">
            <span>Last:</span> 
            <div className="w-10 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
         </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-100px)]">
        
        {/* === Left Column: USA & Europe (25%) === */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
            
            {/* USA Panel (Purple Header) */}
            <div className="bg-[#111827] border border-slate-700 rounded-lg flex flex-col flex-1 overflow-hidden">
                <div className="bg-[#312e81] px-3 py-2 flex justify-between items-center">
                    <span className="font-bold text-sm text-white">USA</span>
                    <span className="text-xs opacity-70">🌎</span>
                </div>
                <div className="p-2 border-b border-slate-700/50">
                    <input 
                       type="text" 
                       placeholder="Filter USA..." 
                       value={usaFilter}
                       onChange={(e) => setUsaFilter(e.target.value)}
                       className="w-full bg-[#1f2937] border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 placeholder-slate-600"
                    />
                </div>
                <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-slate-700">
                   <div className="grid grid-cols-2 text-[10px] text-slate-500 mb-2 px-2 uppercase font-semibold">
                      <span>DR/DRx</span>
                      <span className="text-right">TradingView</span>
                   </div>
                   {usaStocks.filter(s => s.dr.toLowerCase().includes(usaFilter.toLowerCase())).map((stock, idx) => (
                       <div key={idx} className="flex justify-between items-center text-xs p-2 hover:bg-slate-800/80 rounded cursor-pointer transition-colors group border-b border-slate-800/30 last:border-0">
                           <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></div>
                               <span className="text-slate-300 group-hover:text-white font-medium">{stock.dr}</span>
                           </div>
                           <span className="text-slate-500">{stock.real.split(':')[1]}</span>
                       </div>
                   ))}
                </div>
            </div>

            {/* Europe Panel (Green Header) */}
            <div className="bg-[#111827] border border-slate-700 rounded-lg flex flex-col h-[35%] overflow-hidden">
                <div className="bg-[#166534] px-3 py-2 flex justify-between items-center">
                    <span className="font-bold text-sm text-white">Europe</span>
                    <span className="text-xs opacity-70">🌍</span>
                </div>
                <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-slate-700">
                   {europeStocks.map((stock, idx) => (
                       <div key={idx} className="flex justify-between items-center text-xs p-2 hover:bg-slate-800/80 rounded cursor-pointer transition-colors group border-b border-slate-800/30 last:border-0">
                           <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></div>
                               <span className="text-slate-300 group-hover:text-white font-medium">{stock.dr}</span>
                           </div>
                           <span className="text-slate-500">{stock.real.split(':')[1]}</span>
                       </div>
                   ))}
                </div>
            </div>
        </div>

        {/* === Middle Column: Charts (50%) === */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar pr-1">
            {['chart1', 'chart2', 'chart3'].map((chartKey, index) => {
                const stockName = chartSelections[chartKey];
                // const stockInfo = allStockOptions.find(s => s.dr === stockName) || { name: stockName };
                const lineColor = index === 2 ? "#22c55e" : (index === 1 ? "#f97316" : "#3b82f6"); 

                return (
                    <div key={chartKey} className="bg-[#111827] border border-slate-700/80 rounded-lg p-4 h-[300px] flex flex-col shadow-lg">
                        {/* Chart Header */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 relative group/select">
                                 <select
                                    value={stockName}
                                    onChange={(e) => setChartSelections({...chartSelections, [chartKey]: e.target.value})}
                                    className="bg-transparent text-sm font-bold text-slate-100 border-none rounded focus:ring-0 cursor-pointer appearance-none pr-6 z-10 relative"
                                 >
                                    {allStockOptions.map(s => (
                                        <option key={s.dr} value={s.dr} className="bg-[#1f2937] text-slate-300">{s.dr} ({s.name})</option>
                                    ))}
                                 </select>
                                 <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</span>
                            </div>
                            <div className="flex gap-3 text-slate-500">
                                <button className="hover:text-white transition">⛶</button>
                                <button className="hover:text-white transition">⚙</button>
                            </div>
                        </div>

                        {/* Graph Area */}
                        <div className="flex-1 w-full bg-[#0c1018] rounded border border-slate-800/50 relative overflow-hidden flex items-end">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            
                            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
                                        <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d={index === 0 
                                        ? "M0,80 C30,70 60,90 90,50 C120,30 150,60 180,40 C210,20 240,30 270,10 L300,5" 
                                        : index === 1 
                                        ? "M0,90 C40,90 80,60 120,80 C160,50 200,60 240,40 L300,20"
                                        : "M0,20 C50,40 100,20 150,50 C200,60 250,80 300,90"
                                    } 
                                    fill="none" 
                                    stroke={lineColor} 
                                    strokeWidth="2" 
                                    vectorEffect="non-scaling-stroke"
                                />
                                <path 
                                    d={(index === 0 
                                        ? "M0,80 C30,70 60,90 90,50 C120,30 150,60 180,40 C210,20 240,30 270,10 L300,5" 
                                        : index === 1 
                                        ? "M0,90 C40,90 80,60 120,80 C160,50 200,60 240,40 L300,20"
                                        : "M0,20 C50,40 100,20 150,50 C200,60 250,80 300,90"
                                       ) + " V 100 H 0 Z"} 
                                    fill={`url(#grad-${index})`} 
                                    stroke="none" 
                                />
                            </svg>

                            <div className="absolute right-1 top-2 bottom-2 flex flex-col justify-between text-[8px] text-slate-600 text-right">
                                <span>189.5</span>
                                <span>188.0</span>
                                <span>186.5</span>
                                <span>185.0</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* === Right Column: Asia (25%) === */}
        <div className="col-span-12 md:col-span-3 flex flex-col h-full overflow-hidden">
             {/* Asia Panel (Blue Header) */}
             <div className="bg-[#111827] border border-slate-700 rounded-lg flex flex-col flex-1 overflow-hidden">
                <div className="bg-[#1e3a8a] px-3 py-2 flex justify-between items-center">
                    <span className="font-bold text-sm text-white">Asia (CN/JP/SG/VN)</span>
                    <span className="text-xs opacity-70">🌏</span>
                </div>
                <div className="p-2 border-b border-slate-700/50">
                    <input 
                       type="text" 
                       placeholder="Filter Asia..." 
                       value={asiaFilter}
                       onChange={(e) => setAsiaFilter(e.target.value)}
                       className="w-full bg-[#1f2937] border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 placeholder-slate-600"
                    />
                </div>
                <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-slate-700">
                   <div className="grid grid-cols-2 text-[10px] text-slate-500 mb-2 px-2 uppercase font-semibold">
                      <span>DR/DRx</span>
                      <span className="text-right">TradingView</span>
                   </div>
                   {asiaStocks.filter(s => s.dr.toLowerCase().includes(asiaFilter.toLowerCase())).map((stock, idx) => (
                       <div key={idx} className="flex justify-between items-center text-xs p-2 hover:bg-slate-800/80 rounded cursor-pointer transition-colors group border-b border-slate-800/30 last:border-0">
                           <div className="flex items-center gap-2">
                               <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_3px] ${stock.dr.includes("VN") ? "bg-green-500 shadow-green-500" : "bg-red-500 shadow-red-500"}`}></div>
                               <span className="text-slate-300 group-hover:text-white font-medium">{stock.dr}</span>
                           </div>
                           <span className="text-slate-500">{stock.real.split(':')[1]}</span>
                       </div>
                   ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}