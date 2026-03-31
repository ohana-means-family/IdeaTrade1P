// src/pages/tools/BidAsk.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../context/SubscriptionContext";

import BidAskDashboard from "./components/BidAskDashboard.jsx";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CloseIcon from "@mui/icons-material/Close"; // เพิ่ม Icon
import ToolHint from "@/components/ToolHint.jsx";

const scrollbarHideStyle = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none'
};

export default function BidAsk() {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const scrollContainerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scrollDirection = useRef(1);
  const isPaused = useRef(false);

  const { accessData, isFreeAccess, currentUser } = useSubscription();

  /* =============================== MEMBER CHECK ================================ */
  useEffect(() => {
    if (isFreeAccess) {
      setIsMember(true);
      return;
    }
    const toolId = 'bidask';
    if (accessData && accessData[toolId]) {
      const expireTimestamp = accessData[toolId];
      let expireDate;
      try {
        expireDate = typeof expireTimestamp.toDate === 'function' ? expireTimestamp.toDate() : new Date(expireTimestamp);
      } catch (e) { expireDate = new Date(0); }
      setIsMember(expireDate.getTime() > new Date().getTime());
    } else {
      setIsMember(false);
    }
  }, [accessData, isFreeAccess]);

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
    setTimeout(() => { isPaused.current = false }, 500);
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

  const features = [
    { title: "Historical Market Replay", desc: "Replay market tick-by-tick to analyze order flow impact." },
    { title: "Supply & Demand Profiling", desc: "Analyze order density at every price level." },
    { title: "Comparative Liquidity View", desc: "Compare liquidity between assets side-by-side." },
    { title: "Momentum Visualization", desc: "Visualize bid/ask pressure over time." }
  ];

  // ฟังก์ชันช่วย Render หน้า Preview / Landing
  const renderLandingPage = (showStartBtn = false) => (
    <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">BidAsk</span>
          </h1>
          <p className="text-slate-400 text-lg">Deciphering "Big Money" through Order Flow Intelligence</p>
        </div>
        <div className="relative group w-full max-w-5xl mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700" />
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-[16/9] w-full bg-[#0B1221]"><BidAskDashboard /></div>
          </div>
        </div>
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl font-bold mb-8 border-l-4 border-cyan-500 pl-4">4 Main Features</h2>
          <div className="relative group" onMouseEnter={() => isPaused.current = true} onMouseLeave={() => isPaused.current = false}>
            <button onClick={() => scroll("left")} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white flex items-center justify-center transition-all ${showLeft ? 'opacity-100' : 'opacity-0'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div ref={scrollContainerRef} onScroll={checkScroll} className="flex overflow-x-auto gap-4 py-4 hide-scrollbar" style={scrollbarHideStyle}>
              {features.map((item, index) => (
                <div key={index} className="w-[280px] md:w-[350px] flex-shrink-0 bg-[#0f172a]/60 border border-slate-700/50 p-6 rounded-xl hover:border-cyan-500/30 transition duration-300">
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => scroll("right")} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-20 w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white flex items-center justify-center transition-all ${showRight ? 'opacity-100' : 'opacity-0'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div className="text-center w-full max-w-md mx-auto mt-4">
          {showStartBtn ? (
             <button onClick={() => { setEnteredTool(true); localStorage.setItem("BidAskToolEntered", "true"); }} className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition-all">Start Using Tool</button>
          ) : (
            <div className="flex gap-4 justify-center">
              {!currentUser && <button onClick={() => navigate("/login")} className="px-8 py-3 rounded-full bg-slate-800 border border-slate-600">Sign In</button>}
              <button onClick={() => navigate("/member-register")} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">Join Membership</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isMember) return renderLandingPage(false);
  if (isMember && !enteredTool) return renderLandingPage(true);

  // ส่วน Dashboard จริง
  return (
    <div className="w-full min-h-screen lg:h-[calc(100dvh-64px)] lg:overflow-hidden bg-[#0b111a] text-white px-3 md:px-6 py-3 md:py-6 flex flex-col">
      <div className="max-w-[1800px] mx-auto flex-1 lg:min-h-0 flex flex-col">
        <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 overflow-visible pt-4">
          <ReplayPanel
            toolHint={
              <ToolHint onViewDetails={() => { setEnteredTool(false); window.scrollTo({ top: 0 }); }}>
                Replay market tick-by-tick data, analyze bid/ask pressure, and visualize order flow intelligence to decipher "big money" moves
              </ToolHint>
            }
          />
          <ReplayPanel />
        </div>
      </div>
    </div>
  );
}

// ---------------- Sub Components ----------------

function ReplayPanel({ toolHint }) {
  const [symbol, setSymbol] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [symbolHistory, setSymbolHistory] = useState(["PTT", "TOP", "DELTA", "AOT", "ADVANC", "SCB", "KBANK", "CPALL"]);

  const filteredSymbols = useMemo(() => {
    if (!symbol) return symbolHistory.slice(0, 8);
    return symbolHistory.filter(s => s.toLowerCase().includes(symbol.toLowerCase()));
  }, [symbol, symbolHistory]);

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("10:00:00");
  const [orderBook, setOrderBook] = useState(Array(10).fill({ bidVol: 0, bid: "-", ask: "-", askVol: 0 }));

  const totalBid = orderBook.reduce((sum, row) => sum + (row.bidVol || 0), 0);
  const totalAsk = orderBook.reduce((sum, row) => sum + (row.askVol || 0), 0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSliderValue((prev) => {
        if (prev >= 100) { setIsPlaying(false); return 100; }
        return prev + speed;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!isSearched) return;
    // จำลองการเปลี่ยน OrderBook ตาม Slider
    const basePrice = 72 - (sliderValue * 0.02);
    const newBook = Array(10).fill(0).map((_, i) => ({
      bidVol: Math.floor(200000 + Math.random() * 400000),
      bid: (basePrice - i * 0.25).toFixed(2),
      ask: (basePrice - i * 0.25 + 0.25).toFixed(2),
      askVol: Math.floor(200000 + Math.random() * 400000),
    }));
    setOrderBook(newBook);
  }, [sliderValue, isSearched]);

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-xl flex flex-col h-[600px] lg:h-full lg:min-h-0 relative">
      {toolHint && <div className="absolute -top-3 -left-3 z-50">{toolHint}</div>}
      <div className="p-3 md:p-4 border-b border-slate-700 bg-[#0f172a] shrink-0 relative">
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* SYMBOL INPUT */}
          <div className="relative">
            <div className={`flex items-center bg-[#111827] border rounded-md px-3 py-2 ${isFocused ? 'border-cyan-500' : 'border-slate-600'}`}>
              <input
                value={symbol}
                onChange={(e) => { setSymbol(e.target.value.toUpperCase()); setShowSymbolDropdown(true); }}
                onFocus={() => { setIsFocused(true); setShowSymbolDropdown(true); }}
                onBlur={() => setTimeout(() => { setShowSymbolDropdown(false); setIsFocused(false); }, 200)}
                placeholder=""
                className="w-full bg-transparent outline-none text-white text-xs font-bold"
              />
              {symbol && <button onClick={() => {setSymbol(""); setIsSearched(false);}} className="text-slate-500 hover:text-red-400"><CloseIcon sx={{ fontSize: 14 }} /></button>}
            </div>
            {showSymbolDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-[#0f172a] border border-slate-700 rounded-md shadow-2xl z-[100] max-h-40 overflow-y-auto">
                {filteredSymbols.map(s => (
                  <div key={s} onMouseDown={(e) => { e.preventDefault(); setSymbol(s); setShowSymbolDropdown(false); }} className="px-3 py-2 text-xs hover:bg-cyan-500/20 cursor-pointer font-bold">{s}</div>
                ))}
              </div>
            )}
            <label className="absolute left-2 -top-2 text-[10px] px-1 bg-[#0f172a] text-slate-300">Symbol*</label>
          </div>
          <div className="relative">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-[#111827] border border-slate-600 rounded-md px-2 py-2 text-white text-xs [&::-webkit-calendar-picker-indicator]:invert" />
            <label className="absolute left-2 -top-2 text-[10px] px-1 bg-[#0f172a] text-slate-300">Start Date</label>
          </div>
          <div className="relative opacity-50">
            <input type="date" disabled value={startDate} className="w-full bg-[#0f172a] border border-slate-700 rounded-md px-2 py-2 text-slate-500 text-xs" />
            <label className="absolute left-2 -top-2 text-[10px] px-1 bg-[#0f172a] text-slate-300">End Date</label>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#111827] border border-slate-600 rounded-md px-2 py-2 text-white text-xs">10:00</div>
            <div className="bg-[#0f172a] border border-slate-700 rounded-md px-2 py-2 text-slate-500 text-xs">16:30</div>
            <button onClick={() => { if(symbol) setIsSearched(true); setIsPlaying(true); }} className="bg-indigo-600 hover:bg-indigo-500 rounded-md text-xs font-bold text-white">SEARCH</button>
        </div>
        <div className="mt-2 bg-black text-yellow-400 font-mono text-center py-1.5 rounded">10:00:00</div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-[#0b111a]">
        <div className="flex-1 overflow-y-auto">
          {orderBook.map((row, i) => (
            <OrderRow key={i} bidVol={row.bidVol.toLocaleString()} bid={row.bid} ask={row.ask} askVol={row.askVol.toLocaleString()} />
          ))}
        </div>
        <div className="shrink-0 grid grid-cols-4 h-9 items-center border-t border-slate-700 bg-[#111827] text-xs font-semibold px-3">
          <div className="text-right text-blue-400">Total: {totalBid.toLocaleString()}</div>
          <div/><div/>
          <div className="text-left text-red-400">Total: {totalAsk.toLocaleString()}</div>
        </div>
      </div>

      <div className="px-4 py-3 bg-[#0f172a] border-t border-slate-700 shrink-0">
        <div className="flex items-center gap-4">
          <input type="range" min="0" max="100" value={sliderValue} onChange={(e) => setSliderValue(e.target.value)} className="flex-1 h-1 bg-slate-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:rounded-full" />
          <button onClick={() => setIsPlaying(!isPlaying)} disabled={!isSearched} className={isSearched ? "text-white" : "text-slate-600"}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 border-t border-slate-700 bg-[#0f172a] shrink-0">
        <StatSection title="In Range" />
        <StatSection title="Actual" />
      </div>
    </div>
  );
}

function OrderRow({ bidVol, bid, ask, askVol }) {
  const bidWidth = (parseInt(bidVol.replace(/,/g, "")) / 600000) * 100;
  const askWidth = (parseInt(askVol.replace(/,/g, "")) / 600000) * 100;
  return (
    <div className="grid grid-cols-4 items-center text-xs h-8 border-b border-slate-800 relative">
      <div className="relative text-right pr-3 text-slate-300 overflow-hidden h-full flex items-center justify-end">
        <div className="absolute right-0 top-0 h-full bg-blue-900/40" style={{ width: `${bidWidth}%` }} />
        <span className="relative z-10">{bidVol === "0" ? "-" : bidVol}</span>
      </div>
      <div className="text-center text-green-400 font-bold">{bid}</div>
      <div className="text-center text-red-400 font-bold">{ask}</div>
      <div className="relative text-left pl-3 text-slate-300 overflow-hidden h-full flex items-center justify-start">
        <div className="absolute left-0 top-0 h-full bg-red-900/40" style={{ width: `${askWidth}%` }} />
        <span className="relative z-10">{askVol === "0" ? "-" : askVol}</span>
      </div>
    </div>
  );
}

function StatSection({ title }) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded overflow-hidden">
      <div className="px-3 py-1.5 text-[10px] text-slate-400 border-b border-slate-700 bg-[#1e293b]">{title}</div>
      <div className="grid grid-cols-4 px-3 py-2 text-[12px] font-bold text-white">
        <span>71.00</span><span>73.50</span><span>70.75</span><span>72.25</span>
      </div>
    </div>
  );
}