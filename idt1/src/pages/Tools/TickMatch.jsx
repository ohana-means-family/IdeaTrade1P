// src/pages/tools/TickMatch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Style ซ่อน Scrollbar
const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function TickMatch() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // States
  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  // Scroll Button States
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Refs สำหรับระบบเลื่อนอัตโนมัติ
  const scrollDirection = useRef(1); 
  const isPaused = useRef(false);    

  /* ===============================
      1. MEMBER CHECK & LOGIC
  ================================ */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);

        // เช็คสิทธิ์ 'tickmatch'
        if (user.unlockedItems && user.unlockedItems.includes("tickmatch")) {
          setIsMember(true);

          // เช็คว่าเคยเข้า tool แล้วหรือยัง
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
      2. SCROLL LOGIC (Manual + Auto)
  ================================ */
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeft(scrollLeft > 1);
      const isEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2;
      setShowRight(!isEnd);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
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
      setTimeout(() => { isPaused.current = false }, 500);
    }
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
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
  }, []);

  /* ===============================
      3. DATA CONTENT & MOCK DATABASE (10 หุ้น)
  ================================ */
  const features = [
    { title: "Net Accumulated Volume", desc: "Track global gold prices with an intelligent filtering system designed to eliminate market noise." },
    { title: "Flip Signal", desc: "Instantly detect the moment capital flow reverses direction from bullish to bearish." },
    { title: "Granular Tick Data", desc: "Audit every single transaction to scan for whale orders hidden within the noise." },
    { title: "Price-Based Distribution", desc: "Identifies price levels where the heaviest trading volume has occurred." },
  ];

  const stockList = [
    "DELTA", "NVDA", "TSLA"
  ];

  const mockDatabase = {
    "": {
        sumBuy: "0", sumSell: "0", netVol: "0",
        ticks: [], flips: [], charts: []
    },
    "DELTA": {
        sumBuy: "2,871,341,000", sumSell: "2,799,804,200", netVol: "71,536,800",
        ticks: [
            { time: "09:58.472", last: "224.00", vol: "500", type: "S", sum: "43,321,300" },
            { time: "09:58.472", last: "224.00", vol: "10,000", type: "S", sum: "41,081,300" },
            { time: "09:58.472", last: "224.00", vol: "100", type: "S", sum: "41,058,900" },
            { time: "09:58.472", last: "224.00", vol: "2,000", type: "B", sum: "40,610,900" },
            { time: "09:58.472", last: "224.00", vol: "1,000", type: "S", sum: "40,386,900" },
            { time: "09:58.472", last: "224.00", vol: "100", type: "S", sum: "40,364,500" },
            { time: "09:58.472", last: "224.00", vol: "1,000", type: "B", sum: "40,140,500" },
        ],
        flips: [
            { id: 1, time: "15:42.905", from: "822,100", to: "-34,882,900" },
            { id: 2, time: "15:42.905", from: "18,480,200", to: "-17,204,800" },
            { id: 3, time: "16:36.001", from: "-175,452,500", to: "53,878,700" },
            { id: 4, time: "16:36.001", from: "-157,794,400", to: "71,536,800" },
        ],
        charts: [
            { price: "225.00", buy: 35, sell: 55 }, { price: "224.00", buy: 50, sell: 15 },
            { price: "226.00", buy: 55, sell: 20 }, { price: "227.00", buy: 15, sell: 10 },
            { price: "228.00", buy: 40, sell: 40 }, { price: "229.00", buy: 5, sell: 2 },
            { price: "223.00", buy: 15, sell: 20 }, { price: "222.00", buy: 5, sell: 5 },
            { price: "221.00", buy: 0, sell: 2 },
        ]
    },
    "NVDA": {
        sumBuy: "14,520,100,000", sumSell: "11,200,450,000", netVol: "3,319,650,000",
        ticks: [
            { time: "21:30.112", last: "138.50", vol: "4,500", type: "B", sum: "8,321,300" },
            { time: "21:30.114", last: "138.55", vol: "1,200", type: "B", sum: "8,581,300" },
            { time: "21:30.200", last: "138.50", vol: "500", type: "S", sum: "8,511,300" },
            { time: "21:30.450", last: "138.60", vol: "10,000", type: "B", sum: "9,911,300" },
        ],
        flips: [
            { id: 1, time: "22:15.000", from: "-1,200,500", to: "5,400,200" },
        ],
        charts: [
            { price: "138.00", buy: 60, sell: 15 }, { price: "138.50", buy: 45, sell: 30 },
            { price: "139.00", buy: 20, sell: 50 }, { price: "139.50", buy: 10, sell: 70 },
        ]
    },
    "TSLA": {
        sumBuy: "5,110,000,000", sumSell: "8,900,200,000", netVol: "-3,790,200,000",
        ticks: [
            { time: "21:45.001", last: "198.20", vol: "1,000", type: "S", sum: "-1,500,200" },
            { time: "21:45.005", last: "198.15", vol: "5,000", type: "S", sum: "-2,490,200" },
            { time: "21:45.010", last: "198.10", vol: "10,000", type: "S", sum: "-4,470,200" },
        ],
        flips: [
            { id: 1, time: "22:00.100", from: "500,000", to: "-1,500,000" },
            { id: 2, time: "23:15.400", from: "-2,000,000", to: "-3,790,200" },
        ],
        charts: [
            { price: "199.00", buy: 15, sell: 65 }, { price: "198.50", buy: 25, sell: 50 },
            { price: "198.00", buy: 10, sell: 80 }, { price: "197.50", buy: 40, sell: 40 },
        ]
    },
 };

  /* ===============================
      COMPONENTS: Panel ย่อย 
  ================================ */
  const AnalysisPanel = ({ defaultSymbol = "", defaultDate = "" }) => {
    // เก็บค่าชั่วคราวตอนเปลี่ยน Input
    const [inputSymbol, setInputSymbol] = useState(defaultSymbol);
    const [inputDate, setInputDate] = useState(defaultDate);
    const todayMax = new Date().toISOString().split('T')[0];

    // เก็บค่าจริงที่นำไปค้นหา
    const [activeSymbol, setActiveSymbol] = useState(defaultSymbol);

    // สถานะสำหรับการจำลองโหลดข้อมูล (Sync) เฉพาะของ Panel นี้
    const [isSyncing, setIsSyncing] = useState(false);

    // ดึงข้อมูล
    const data = mockDatabase[activeSymbol] || mockDatabase[""];

    // ฟังก์ชันเมื่อกดปุ่ม SEARCH หรือปุ่ม SYNC
    const handleSearch = () => {
        setIsSyncing(true);
        // จำลองการโหลดดีเลย์ 0.8 วินาที
        setTimeout(() => {
            setActiveSymbol(inputSymbol);
            setIsSyncing(false);
        }, 800);
    };

    // คำนวณหลอด Progress ด้านบน
    const totalBuy = parseInt(data.sumBuy.replace(/,/g, '')) || 0;
    const totalSell = parseInt(data.sumSell.replace(/,/g, '')) || 0;
    const total = totalBuy + totalSell;
    const buyPercent = total === 0 ? 50 : (totalBuy / total) * 100;

    return (
      <div className="flex flex-col h-full bg-[#111827] border border-slate-700 rounded-lg p-3 shadow-lg overflow-y-auto hide-scrollbar relative" style={scrollbarHideStyle}>
        
        {/* เลเยอร์ Loading หมุนติ้วบังหน้าจอจางๆ ตอนกด Sync */}
        {isSyncing && (
            <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-lg">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {/* --- Header & Inputs --- */}
        <div className="grid grid-cols-12 gap-2 mb-3 items-end shrink-0">
            <div className="col-span-5 flex flex-col gap-1">
               <div className="flex items-center gap-2">
                  {/* [NEW] เปลี่ยน SYNC เป็นปุ่มกดได้ */}
                  <button 
                      onClick={handleSearch}
                      disabled={isSyncing}
                      className="bg-purple-600 hover:bg-purple-500 text-[10px] text-white px-1.5 py-0.5 rounded font-bold cursor-pointer transition active:scale-90 flex items-center gap-1"
                  >
                      <svg className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      SYNC
                  </button>
                  <span className="text-xs text-slate-400">Symbol *</span>
               </div>
               <div className="bg-[#0B1221] border border-slate-600 rounded px-2 h-9 flex items-center relative">
                  <select 
                      value={inputSymbol} 
                      onChange={(e) => setInputSymbol(e.target.value)}
                      className="bg-transparent text-white font-bold text-sm w-full focus:outline-none uppercase appearance-none cursor-pointer z-10 relative"
                  >
                      <option value="" className="bg-[#0B1221] text-slate-300">SELECT</option>
                      {stockList.map(s => <option key={s} value={s} className="bg-[#0B1221] text-slate-300">{s}</option>)}
                  </select>
                  <span className="absolute right-2 text-slate-400 text-[10px] pointer-events-none">▼</span>
               </div>
            </div>
            
            <div className="col-span-4 flex flex-col gap-1">
               <span className="text-xs text-slate-400 pl-1">Date</span>
               <div className="bg-[#0B1221] border border-slate-600 rounded px-2 h-9 flex items-center justify-between relative overflow-hidden">
                  <span className="text-white text-sm absolute left-2 pointer-events-none z-0">
                      {inputDate ? `${inputDate.split('-')[2]}/${inputDate.split('-')[1]}/${inputDate.split('-')[0]}` : ''}
                  </span>
                  <input 
                      type="date" 
                      value={inputDate} 
                      max={todayMax} 
                      onChange={(e) => setInputDate(e.target.value)}
                      className="w-full focus:outline-none cursor-pointer text-transparent bg-transparent z-10" 
                      style={{colorScheme: 'dark'}}
                  />
               </div>
            </div>
            
            <div className="col-span-3">
               <button 
                  onClick={handleSearch}
                  disabled={isSyncing}
                  className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition shadow-[0_0_10px_rgba(37,99,235,0.3)] active:scale-95 disabled:opacity-50"
               >
                  SEARCH
               </button>
            </div>
        </div>

        {/* --- Summary --- */}
        <div className="grid grid-cols-3 gap-2 mb-1 shrink-0">
          <div className="bg-[#1e1e1e] border border-green-900/50 rounded p-2 flex flex-col relative overflow-hidden">
            <span className="text-[10px] text-slate-400">Sum Buy</span>
            <span className={`font-bold text-lg text-right ${activeSymbol ? 'text-green-500' : 'text-white'}`}>{data.sumBuy}</span>
            <div className="absolute bottom-0 left-0 h-[2px] bg-green-500 w-full"></div>
          </div>
          <div className="bg-[#1e1e1e] border border-red-900/50 rounded p-2 flex flex-col relative overflow-hidden">
             <span className="text-[10px] text-slate-400">Sum Sell</span>
             <span className={`font-bold text-lg text-right ${activeSymbol ? 'text-red-500' : 'text-white'}`}>{data.sumSell}</span>
             <div className="absolute bottom-0 left-0 h-[2px] bg-red-500 w-full"></div>
          </div>
          <div className="bg-[#1e1e1e] border border-slate-700/50 rounded p-2 flex flex-col relative overflow-hidden">
             <span className="text-[10px] text-slate-400">Net Acc. Vol</span>
             <span className={`${data.netVol === "0" ? 'text-white' : (data.netVol.includes('-') ? 'text-red-500' : 'text-green-500')} font-bold text-lg text-right`}>
                 {data.netVol}
             </span>
             <div className={`absolute bottom-0 left-0 h-[2px] w-full ${data.netVol === "0" ? 'bg-slate-500' : (data.netVol.includes('-') ? 'bg-red-500' : 'bg-green-500')}`}></div>
          </div>
        </div>

        <div className="w-full h-1 bg-red-600 rounded-full mb-3 flex overflow-hidden shrink-0">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${buyPercent}%` }}></div>
        </div>

        {/* --- Tick Table --- */}
        <div className="rounded overflow-hidden border border-slate-800/50 bg-[#0B1221] shrink-0 min-h-[150px] mb-4">
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
                {data.ticks.map((row, idx) => (
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

        {/* --- Extra Sections (Flip & Charts) จะโชว์เมื่อมีการค้นหาข้อมูลแล้วเท่านั้น --- */}
        {activeSymbol && data.flips.length > 0 && (
            <>
                <div className="bg-[#0B1221] border border-slate-800/50 rounded mb-4 overflow-hidden shrink-0">
                    <div className="bg-[#1f2937] p-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Total Flip Count: {data.flips.length}</span>
                        <div className="flex gap-3 text-[10px]">
                            <span className="flex items-center gap-1 text-red-400"><div className="w-3 h-1.5 bg-red-500"></div> Net Vol &lt; 0</span>
                            <span className="flex items-center gap-1 text-green-400"><div className="w-3 h-1.5 bg-green-500"></div> Net Vol &gt; 0</span>
                        </div>
                    </div>
                    <div className="p-3 border-b border-slate-700/50 bg-[#111827]">
                        <div className="h-2 w-full flex rounded overflow-hidden">
                            <div className="bg-[#22c55e] w-[60%]"></div>
                            <div className="bg-[#ef4444] w-[5%] border-x border-[#111827]"></div>
                            <div className="bg-[#22c55e] w-[10%] border-r border-[#111827]"></div>
                            <div className="bg-[#ef4444] w-[25%]"></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                            <span>13:57</span><span>14:30</span><span>15:00</span><span>15:30</span><span>16:00</span><span>16:30</span>
                        </div>
                    </div>
                    <table className="w-full text-center border-collapse">
                        <thead className="bg-[#1f2937] text-slate-400 text-[10px] font-medium border-t border-slate-700/50">
                            <tr>
                                <th className="p-1.5">ครั้งที่</th>
                                <th className="p-1.5">Time</th>
                                <th className="p-1.5">From Acc. Vol</th>
                                <th className="p-1.5">To Acc. Vol</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-mono text-slate-300">
                            {data.flips.map((flip, idx) => (
                                <tr key={idx} className="border-b border-slate-800/50">
                                    <td className="p-1.5 text-white">{flip.id}</td>
                                    <td className="p-1.5">{flip.time}</td>
                                    <td className={`p-1.5 font-bold ${flip.from.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{flip.from}</td>
                                    <td className={`p-1.5 font-bold ${flip.to.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{flip.to}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-[#0B1221] border border-slate-800/50 rounded p-3 h-[200px] flex flex-col relative shrink-0">
                    <div className="flex justify-center gap-4 text-[10px] mb-2 z-10">
                        <span className="flex items-center gap-1 text-slate-400"><div className="w-4 h-2 bg-green-600 rounded-sm"></div> Buy Volume</span>
                        <span className="flex items-center gap-1 text-slate-400"><div className="w-4 h-2 bg-red-600 rounded-sm"></div> Sell Volume</span>
                    </div>
                    <div className="flex-1 flex items-end gap-2 relative pl-10 border-b border-slate-700/50 pb-5 pt-2">
                        <div className="absolute inset-y-0 left-10 right-0 flex flex-col justify-between pointer-events-none pb-5 pt-2">
                            <div className="border-t border-slate-800 w-full opacity-50"></div>
                            <div className="border-t border-slate-800 w-full opacity-50"></div>
                            <div className="border-t border-slate-800 w-full opacity-50"></div>
                        </div>
                        <div className="absolute left-0 top-0 bottom-5 flex flex-col justify-between text-[8px] text-slate-600 py-1 font-mono w-8 text-right">
                            <span>8M</span><span>6M</span><span>4M</span><span>2M</span><span>0</span>
                        </div>
                        {data.charts.map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end items-center h-full group relative z-10">
                                <div className="w-full flex flex-col-reverse max-w-[30px] opacity-80 hover:opacity-100 transition h-full cursor-pointer">
                                    <div className="w-full bg-[#ef4444]" style={{ height: `${bar.sell}%` }}></div>
                                    <div className="w-full bg-[#22c55e]" style={{ height: `${bar.buy}%` }}></div>
                                </div>
                                <span className="absolute -bottom-5 text-[8px] text-slate-500">{bar.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}
      </div>
    );
  };

  /* ==========================================================
      CASE 1 & 2 : PREVIEW / START SCREEN
  =========================================================== */
  if (!isMember || (isMember && !enteredTool)) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
          
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

          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              4 Main Features
            </h2>
            
            <div className="relative group" onMouseEnter={() => isPaused.current = true} onMouseLeave={() => isPaused.current = false}>
              <button onClick={() => scroll("left")} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 transition-all duration-300 ${showLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div ref={scrollContainerRef} onScroll={checkScroll} className="flex overflow-x-auto gap-6 py-4 px-1 hide-scrollbar" style={scrollbarHideStyle}>
                {features.map((item, index) => (
                  <div key={index} className="w-[350px] md:w-[400px] flex-shrink-0 group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => scroll("right")} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 transition-all duration-300 ${showRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center w-full">
            {!isMember ? (
               <>
                 <button onClick={() => navigate("/login")} className="px-8 py-3 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 transition">Sign In</button>
                 <button onClick={() => navigate("/member-register")} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold hover:shadow-lg transition">Join Membership</button>
               </>
            ) : (
                <button
                onClick={() => {
                  setEnteredTool(true);
                  localStorage.setItem("tickToolEntered", "true"); 
                }}
                className="group relative inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2 text-lg">Start Using Tool</span>
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
      CASE 3 : FULL TICKMATCH DASHBOARD
  =========================================================== */
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full min-h-screen bg-[#0B1221] text-white p-4 animate-fade-in flex flex-col gap-4">
      
      <h1 className="text-xl font-bold mb-2 text-white border-l-4 border-cyan-500 pl-3">TickMatch Analysis</h1>

      {/* Main Grid Layout (2 Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-100px)]">
        
        {/* Left Panel: เริ่มมาหน้าว่างเปล่า (Select) */}
        <AnalysisPanel defaultSymbol="" defaultDate={todayStr} />

        {/* Right Panel: เริ่มมาหน้าว่างเปล่า (Select) */}
        <AnalysisPanel defaultSymbol="" defaultDate={todayStr} />

      </div>
    </div>
  );
}