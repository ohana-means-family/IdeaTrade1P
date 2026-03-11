// src/pages/tools/TickMatch.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../context/SubscriptionContext";

import TickMatchDashboard from "./components/TickMatchDashboard.jsx";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

/* ===============================
    TICKMATCH DATA MOCKUP
================================ */
const features = [
  { title: "Net Accumulated Volume", desc: "Track global gold prices with an intelligent filtering system designed to eliminate market noise." },
  { title: "Flip Signal", desc: "Instantly detect the moment capital flow reverses direction from bullish to bearish." },
  { title: "Granular Tick Data", desc: "Audit every single transaction to scan for whale orders hidden within the noise." },
  { title: "Price-Based Distribution", desc: "Identifies price levels where the heaviest trading volume has occurred." },
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
      { id: 1, time: "10:22.787", from: "-51,044", to: "58,160" },
      { id: 2, time: "10:35.724", from: "4,819", to: "-18,382" },
      { id: 3, time: "10:55.770", from: "17,307", to: "-99,893" },
      { id: 4, time: "11:02.759", from: "-97,549", to: "58,061" },
      { id: 5, time: "14:05.012", from: "-1,998", to: "3,777" },
    ],
    charts: [
      { price: "221.50", buy: 8, sell: 12 },
      { price: "222.00", buy: 15, sell: 20 },
      { price: "222.50", buy: 12, sell: 18 },
      { price: "223.00", buy: 22, sell: 15 },
      { price: "223.50", buy: 18, sell: 25 },
      { price: "224.00", buy: 50, sell: 15 },
      { price: "224.50", buy: 35, sell: 28 },
      { price: "225.00", buy: 35, sell: 55 },
      { price: "225.50", buy: 28, sell: 32 },
      { price: "226.00", buy: 55, sell: 20 },
      { price: "226.50", buy: 42, sell: 38 },
      { price: "227.00", buy: 15, sell: 10 },
      { price: "227.50", buy: 20, sell: 22 },
      { price: "228.00", buy: 40, sell: 40 },
      { price: "228.50", buy: 18, sell: 15 },
      { price: "229.00", buy: 5, sell: 2 },
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
  "1DIV": {
    sumBuy: "1,354,802",
    sumSell: "1,111,900",
    netVol: "243,002",
    ticks: [
      { time: "09:57.002", last: "12.15", vol: "1,000", type: "B", sum: "12,150" },
      { time: "10:01.004", last: "12.15", vol: "400", type: "S", sum: "7,290" },
      { time: "10:01.004", last: "12.15", vol: "200", type: "S", sum: "4,860" },
      { time: "09:57.002", last: "12.15", vol: "1,000", type: "B", sum: "17,010" },
      { time: "10:01.004", last: "12.15", vol: "400", type: "S", sum: "12,150" },
      { time: "10:01.004", last: "12.15", vol: "200", type: "S", sum: "9,720" },
      { time: "10:08.238", last: "12.15", vol: "800", type: "S", sum: "0" },
      { time: "10:07.917", last: "12.10", vol: "100", type: "S", sum: "-1,210" },
      { time: "10:07.917", last: "12.10", vol: "100", type: "S", sum: "-3,420" },
      { time: "10:07.917", last: "12.10", vol: "400", type: "S", sum: "-7,260" },
      { time: "10:14.151", last: "12.00", vol: "1,000", type: "S", sum: "-19,260" },
      { time: "10:14.151", last: "12.00", vol: "400", type: "S", sum: "-24,060" },
      { time: "10:14.151", last: "12.00", vol: "100", type: "S", sum: "-25,260" },
    ],
    flips: [
      { id: 1, time: "10:22.787", from: "-51,045", to: "58,180" },
      { id: 2, time: "10:35.724", from: "4,818", to: "-18,382" },
      { id: 3, time: "10:55.770", from: "17,307", to: "-99,893" },
      { id: 4, time: "11:02.759", from: "-97,549", to: "58,061" },
      { id: 5, time: "14:05.012", from: "-1,998", to: "3,777" },
    ],
    charts: [
      { price: "12.10", buy: 5200, sell: 6800 },
      { price: "12.00", buy: 4100, sell: 5900 },
      { price: "11.90", buy: 3800, sell: 4200 },
      { price: "11.88", buy: 9200, sell: 12800 },
      { price: "11.80", buy: 28000, sell: 7200 },
      { price: "11.79", buy: 14200, sell: 22800 },
      { price: "11.78", buy: 14200, sell: 4800 },
      { price: "11.77", buy: 13800, sell: 3200 },
      { price: "11.72", buy: 8200, sell: 30200 },
      { price: "11.70", buy: 4600, sell: 19500 },
      { price: "11.68", buy: 19600, sell: 4200 },
      { price: "11.63", buy: 3200, sell: 16200 },
      { price: "11.62", buy: 18200, sell: 20100 },
      { price: "11.61", buy: 18400, sell: 6200 },
      { price: "11.59", buy: 7200, sell: 19800 },
      { price: "11.58", buy: 16800, sell: 8200 },
      { price: "11.57", buy: 17500, sell: 23500 },
      { price: "11.56", buy: 19800, sell: 12800 },
      { price: "11.55", buy: 9800, sell: 27800 },
      { price: "11.54", buy: 28200, sell: 18200 },
      { price: "11.52", buy: 18200, sell: 4200 },
    ]
  },
};

// ─── FULLSCREEN SYMBOL INPUT ─────────────────────────────────
function FullscreenSymbolInput({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [hiIdx, setHiIdx] = useState(-1);
  const committed = useRef(value || "");
  const ref = useRef(null);

  useEffect(() => {
    if (value === "" && committed.current !== "") {
      setQuery("");
      committed.current = "";
    }
  }, [value]);

  const STOCK_LIST = [
    "PTT","TOP","DELTA","AOT","ADVANC","SCB","KBANK","BBL","KTB","BAY",
    "CPALL","CPN","CRC","HMPRO","BJC","IVL","SCC","SCCC","TISCO","KKP",
    "1DIV","NVDA","TSLA"
  ];

  const filtered = useMemo(() => {
    if (!query) return STOCK_LIST.slice(0, 10);
    const q = query.toUpperCase();
    const starts = STOCK_LIST.filter((s) => s.startsWith(q));
    const contains = STOCK_LIST.filter((s) => !s.startsWith(q) && s.includes(q));
    return [...starts, ...contains].slice(0, 9);
  }, [query]);

  const commit = useCallback((sym) => {
    const v = sym.toUpperCase();
    setQuery(v);
    committed.current = v;
    onChange(v);
    setOpen(false);
    setHiIdx(-1);
  }, [onChange]);

  const handleKey = (e) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHiIdx((h) => Math.min(h + 1, filtered.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setHiIdx((h) => Math.max(h - 1, -1)); return; }
    if (e.key === "Tab") { if (filtered.length > 0) { e.preventDefault(); commit(filtered[0]); } return; }
    if (e.key === "Enter") { if (hiIdx >= 0 && filtered[hiIdx]) commit(filtered[hiIdx]); else if (query.trim()) commit(query.trim()); }
  };

  useEffect(() => {
    const fn = (e) => {
      if (!ref.current?.contains(e.target)) { setOpen(false); setQuery(committed.current); }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center">
      <div className="relative w-56">
        <div className={`flex items-center gap-2 bg-[#1a2235] border rounded-lg px-3 py-1.5 transition-all ${open ? "border-cyan-500/60" : "border-slate-700 hover:border-slate-500"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value.toUpperCase()); setOpen(true); setHiIdx(-1); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            placeholder="พิมพ์ชื่อหุ้น..."
            className={`flex-1 bg-transparent text-sm outline-none placeholder-slate-600 pr-6 ${value && !open ? "font-bold text-white" : "text-white"}`}
          />
          {query && (
            <button onMouseDown={() => commit("")} className="absolute right-3 text-slate-600 hover:text-slate-300 text-sm transition-colors flex-shrink-0">✕</button>
          )}
        </div>
      </div>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-[#0d1526] border border-slate-600/60 rounded-xl shadow-2xl z-[200] overflow-hidden">
          <div className="max-h-64 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-slate-600 text-[11px] text-center">ไม่พบ — กด Enter เพื่อใช้ "{query}"</div>
            ) : filtered.map((sym, idx) => {
              const isHi = idx === hiIdx;
              return (
                <div key={sym} onMouseDown={() => commit(sym)} onMouseEnter={() => setHiIdx(idx)}
                  className={`px-4 py-2.5 cursor-pointer text-sm font-bold tracking-wider transition-all ${isHi ? "bg-cyan-500/15 border-l-2 border-cyan-400 text-white" : "border-l-2 border-transparent text-slate-300 hover:bg-slate-800/40"}`}
                >
                  {sym}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TickMatch() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scrollDirection = useRef(1);
  const isPaused = useRef(false);

  const { accessData, isFreeAccess } = useSubscription();

  /* ===============================  MEMBER CHECK  ================================ */
  useEffect(() => {
    if (isFreeAccess) { setIsMember(true); return; }
    const toolId = 'tickmatch';
    if (accessData && accessData[toolId]) {
      const expireTimestamp = accessData[toolId];
      let expireDate;
      try {
        if (typeof expireTimestamp.toDate === 'function') expireDate = expireTimestamp.toDate();
        else expireDate = new Date(expireTimestamp);
      } catch (e) { expireDate = new Date(0); }
      setIsMember(expireDate.getTime() > new Date().getTime());
    } else {
      setIsMember(false);
    }
  }, [accessData, isFreeAccess]);

  /* ===============================  SCROLL LOGIC  ================================ */
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeft(scrollLeft > 1);
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      isPaused.current = true;
      const { current } = scrollContainerRef;
      const scrollAmount = 350;
      if (direction === "left") { current.scrollBy({ left: -scrollAmount, behavior: "smooth" }); scrollDirection.current = -1; }
      else { current.scrollBy({ left: scrollAmount, behavior: "smooth" }); scrollDirection.current = 1; }
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
      if (scrollDirection.current === 1 && Math.ceil(scrollLeft) >= maxScroll - 2) scrollDirection.current = -1;
      else if (scrollDirection.current === -1 && scrollLeft <= 2) scrollDirection.current = 1;
      container.scrollLeft += (scrollDirection.current * speed);
      checkScroll();
    }, intervalTime);
    return () => clearInterval(autoScrollInterval);
  }, [isMember, enteredTool]);

  useEffect(() => {
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  /* ===============================  ANALYSIS PANEL  ================================ */
  const AnalysisPanel = ({ defaultSymbol = "", defaultDate = "" }) => {
    const [hasSearched, setHasSearched] = useState(false);
    const [isSynced, setIsSynced] = useState(true);
    const [symbol, setSymbol] = useState(defaultSymbol);
    const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
    const [symbolHistory, setSymbolHistory] = useState([]);
    const [filteredSymbols, setFilteredSymbols] = useState([]);
    const [date, setDate] = useState(defaultDate);
    const [activeSymbol, setActiveSymbol] = useState(defaultSymbol);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isFlipOpen, setIsFlipOpen] = useState(true);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");

    const todayMax = new Date().toISOString().split("T")[0];

    useEffect(() => {
      const saved = localStorage.getItem("tickmatch_symbol_history");
      if (saved) setSymbolHistory(JSON.parse(saved));
    }, []);

    useEffect(() => {
      if (!symbol.trim()) { setFilteredSymbols(symbolHistory); return; }
      setFilteredSymbols(symbolHistory.filter((item) => item.toLowerCase().includes(symbol.toLowerCase())));
    }, [symbol, symbolHistory]);

    useEffect(() => {
      const handleEsc = (e) => { if (e.key === "Escape" && isChartModalOpen) setIsChartModalOpen(false); };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [isChartModalOpen]);

    const handleSearch = () => {
      if (!symbol.trim()) return;
      setIsSyncing(true);
      setTimeout(() => {
        setHasSearched(true);
        setActiveSymbol(symbol.toUpperCase());
        const updated = [symbol.toUpperCase(), ...symbolHistory.filter((s) => s !== symbol.toUpperCase())].slice(0, 10);
        setSymbolHistory(updated);
        localStorage.setItem("tickmatch_symbol_history", JSON.stringify(updated));
        setIsSyncing(false);
      }, 800);
    };

    const data = mockDatabase[activeSymbol?.toUpperCase()] || mockDatabase[""];

    const filteredTicks = data.ticks.filter(tick => {
      const vol = parseInt(tick.vol.replace(/,/g, "")) || 0;
      if (activeFilter === "buy") return tick.type === "B";
      if (activeFilter === "sell") return tick.type === "S";
      if (activeFilter === ">100k") return vol > 100000;
      return true;
    });

    const totalBuy = parseInt(data.sumBuy.replace(/,/g, "")) || 0;
    const totalSell = parseInt(data.sumSell.replace(/,/g, "")) || 0;
    const total = totalBuy + totalSell;
    const buyPercent = total === 0 ? 50 : (totalBuy / total) * 100;

    return (
      <div className="flex flex-col bg-[#111827] border border-slate-700 rounded-lg shadow-lg overflow-hidden
                      h-[680px] md:h-full md:min-h-0"
           style={scrollbarHideStyle}>

        {isSyncing && (
          <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-lg">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ========== FIXED HEADER ========== */}
        <div className="shrink-0">

          {/* Row 1: Sync + Symbol + Date + Search */}
          <div className="grid grid-cols-12 gap-1.5 md:gap-2 p-2 md:p-3 pb-2 items-end bg-[#111827]">

            {/* SYNC */}
            <div className="col-span-2">
              <button
                onClick={() => setIsSynced(!isSynced)}
                className={`w-full h-[36px] md:h-[40px] flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200
                  ${isSynced ? "bg-[#0E3A6D] hover:bg-[#124a8a] text-white" : "bg-[#8FA3B5] hover:bg-[#7f95a8] text-white"}`}
              >
                {isSynced ? (
                  <><LinkOutlinedIcon sx={{ fontSize: 15 }} /><span className="hidden sm:inline">SYNC</span></>
                ) : (
                  <><LinkOffOutlinedIcon sx={{ fontSize: 15 }} /><span className="hidden sm:inline">UNSYNC</span></>
                )}
              </button>
            </div>

            {/* SYMBOL */}
            <div className="col-span-4 relative">
              <input
                value={symbol}
                placeholder=" "
                onChange={(e) => { setSymbol(e.target.value); setShowSymbolDropdown(true); }}
                onFocus={() => setShowSymbolDropdown(true)}
                onBlur={() => setTimeout(() => setShowSymbolDropdown(false), 150)}
                className="peer w-full bg-[#111827] border border-slate-600 rounded-md px-2 md:px-3 py-2 text-white text-xs uppercase outline-none"
              />
              <label className="absolute left-2 md:left-3 px-1 text-[10px] bg-[#0f172a] text-slate-400 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] -top-2">
                Symbol*
              </label>
              {showSymbolDropdown && filteredSymbols.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-[#0f172a] border border-slate-700 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                  {filteredSymbols.map((item, index) => (
                    <div key={index} onClick={() => { setSymbol(item); setShowSymbolDropdown(false); }}
                      className="px-3 py-2 text-xs text-white hover:bg-indigo-600 cursor-pointer transition">{item}</div>
                  ))}
                </div>
              )}
            </div>

            {/* DATE */}
            <div className="col-span-3 relative">
              <input
                type="date"
                value={date}
                max={todayMax}
                placeholder=" "
                onChange={(e) => setDate(e.target.value)}
                className="peer w-full bg-[#0B1221] border border-slate-600 rounded-md px-2 md:px-3 py-2 text-white text-xs outline-none [&::-webkit-calendar-picker-indicator]:invert"
              />
              <label className="absolute left-2 md:left-3 px-1 text-[10px] bg-[#0f172a] text-slate-400 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] -top-2">
                Date
              </label>
            </div>

            {/* SEARCH */}
            <div className="col-span-3">
              <button
                onClick={handleSearch}
                disabled={isSyncing}
                className="w-full h-[34px] md:h-[38px] bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition active:scale-95 disabled:opacity-50"
              >
                SEARCH
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="px-2 md:px-3 pb-2">
            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
              <div className="bg-[#1e1e1e] border border-green-900/50 rounded p-1.5 md:p-2 flex flex-col relative overflow-hidden">
                <span className="text-[9px] md:text-[10px] text-slate-400">Sum Buy</span>
                <span className={`font-bold text-sm md:text-lg text-right truncate ${activeSymbol ? 'text-green-500' : 'text-white'}`}>{data.sumBuy}</span>
                <div className="absolute bottom-0 left-0 h-[2px] bg-green-500 w-full"></div>
              </div>
              <div className="bg-[#1e1e1e] border border-red-900/50 rounded p-1.5 md:p-2 flex flex-col relative overflow-hidden">
                <span className="text-[9px] md:text-[10px] text-slate-400">Sum Sell</span>
                <span className={`font-bold text-sm md:text-lg text-right truncate ${activeSymbol ? 'text-red-500' : 'text-white'}`}>{data.sumSell}</span>
                <div className="absolute bottom-0 left-0 h-[2px] bg-red-500 w-full"></div>
              </div>
              <div className="bg-[#1e1e1e] border border-slate-700/50 rounded p-1.5 md:p-2 flex flex-col relative overflow-hidden">
                <span className="text-[9px] md:text-[10px] text-slate-400">Net Acc. Vol</span>
                <span className={`font-bold text-sm md:text-lg text-right truncate ${data.netVol === "0" ? 'text-white' : (data.netVol.includes('-') ? 'text-red-500' : 'text-green-500')}`}>
                  {data.netVol}
                </span>
                <div className={`absolute bottom-0 left-0 h-[2px] w-full ${data.netVol === "0" ? 'bg-slate-500' : (data.netVol.includes('-') ? 'bg-red-500' : 'bg-green-500')}`}></div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-2 md:px-3 pb-2">
            <div className="w-full h-1 bg-red-600 rounded-full flex overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${buyPercent}%` }}></div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-2 md:px-3 pb-2">
            <div className="flex gap-1 md:gap-2 flex-wrap">
              {[
                { key: "all", label: "All", active: "bg-slate-700 text-white" },
                { key: "buy", label: "Buy", active: "bg-green-700 text-white" },
                { key: "sell", label: "Sell", active: "bg-red-700 text-white" },
                { key: ">100k", label: ">100K", active: "bg-blue-700 text-white" },
              ].map(({ key, label, active }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`text-[9px] md:text-[10px] px-2 md:px-3 py-1 rounded transition ${
                    activeFilter === key ? active : "bg-[#1f2937] text-slate-400 border border-slate-600 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========== SCROLLABLE CONTENT ========== */}
        <div className="flex-1 overflow-y-auto px-2 md:px-3 pb-3 space-y-2" style={scrollbarHideStyle}>

          {/* Tick Table */}
          <div className="rounded overflow-hidden border border-slate-800/50 bg-[#0B1221]">
            <div className="bg-[#1f2937] grid grid-cols-5 text-slate-400 text-[9px] md:text-[10px] font-medium border-b border-slate-800 sticky top-0 z-10">
              <div className="p-1.5 md:p-2 text-center">Time</div>
              <div className="p-1.5 md:p-2 text-right">Last</div>
              <div className="p-1.5 md:p-2 text-right">Vol</div>
              <div className="p-1.5 md:p-2 text-center">Type</div>
              <div className="p-1.5 md:p-2 text-right">Sum</div>
            </div>
            <div className="overflow-y-auto max-h-[160px] md:max-h-[200px]" style={scrollbarHideStyle}>
              {filteredTicks.length > 0 ? (
                filteredTicks.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-5 text-[10px] md:text-xs font-mono text-slate-300 border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors">
                    <div className="p-1.5 md:p-2 text-center text-slate-400">{row.time}</div>
                    <div className="p-1.5 md:p-2 text-right text-yellow-500">{row.last}</div>
                    <div className="p-1.5 md:p-2 text-right font-bold text-slate-200">{row.vol}</div>
                    <div className="p-1.5 md:p-2 flex justify-center items-center">
                      <span className={`flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded text-[9px] md:text-[10px] font-bold text-black ${row.type === 'B' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {row.type}
                      </span>
                    </div>
                    <div className={`p-1.5 md:p-2 text-right ${row.sum.includes('-') ? 'text-red-400' : 'text-green-400'}`}>{row.sum}</div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">No tick data available</div>
              )}
            </div>
          </div>

          {/* Flip Section */}
          {hasSearched && (
            <div className="bg-[#0B1221] border border-slate-800/50 rounded overflow-hidden">
              <div onClick={() => setIsFlipOpen(!isFlipOpen)}
                className="bg-[#374151] p-2 md:p-3 flex justify-between items-center cursor-pointer hover:bg-[#414b5c] transition">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <span className="text-xs md:text-sm font-bold text-white">Total Flip Count: {data.flips.length}</span>
                  <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-2.5 bg-red-500 rounded-sm"></div>
                      <span className="text-slate-300">{'<'} 0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-2.5 bg-green-500 rounded-sm"></div>
                      <span className="text-slate-300">{'>'} 0</span>
                    </div>
                  </div>
                </div>
                <ExpandMoreIcon sx={{ fontSize: 18, transition: 'transform 0.3s ease', transform: isFlipOpen ? 'rotate(0deg)' : 'rotate(-90deg)', color: '#e2e8f0' }} />
              </div>

              {isFlipOpen && (
                <>
                  {/* Timeline Bar */}
                  <div className="p-2 md:p-3 border-b border-slate-700/50 bg-[#111827]">
                    <div className="relative w-full">
                      <div className="relative w-full h-2 bg-slate-700 rounded-full mb-6">
                        {data.flips.map((flip, idx) => {
                          const position = data.flips.length > 1 ? (idx / (data.flips.length - 1)) * 100 : 50;
                          const isNegative = flip.to.includes('-');
                          return (
                            <div key={idx} className="absolute top-0 group/marker" style={{ left: `${position}%` }}>
                              <div className={`w-1 h-2 transition-all hover:h-3 hover:-translate-y-0.5 cursor-pointer ${isNegative ? 'bg-red-500' : 'bg-green-500'}`} />
                              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                <div className="bg-slate-900 border border-slate-700 text-white text-[10px] px-3 py-2 rounded shadow-xl">
                                  <div className="font-bold mb-1">ครั้งที่ {flip.id}</div>
                                  <div className="text-slate-400">Time: {flip.time}</div>
                                  <div className="mt-1 pt-1 border-t border-slate-700">
                                    <div>From: <span className={flip.from.includes('-') ? 'text-red-400' : 'text-green-400'}>{flip.from}</span></div>
                                    <div>To: <span className={flip.to.includes('-') ? 'text-red-400' : 'text-green-400'}>{flip.to}</span></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 -mt-2">
                        <span>10:12</span><span>10:42</span><span>12:20</span><span>14:00</span><span>14:30</span><span>15:01</span>
                      </div>
                    </div>
                  </div>

                  {/* Flip Table */}
                  <div className="overflow-y-auto max-h-[150px] md:max-h-[180px]" style={scrollbarHideStyle}>
                    <table className="w-full text-center border-collapse">
                      <thead className="bg-[#1f2937] text-slate-400 text-[9px] md:text-[10px] font-medium sticky top-0 z-10">
                        <tr>
                          <th className="p-1 md:p-1.5">ครั้งที่</th>
                          <th className="p-1 md:p-1.5">Time</th>
                          <th className="p-1 md:p-1.5">From</th>
                          <th className="p-1 md:p-1.5">To</th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] md:text-xs">
                        {data.flips.length > 0 ? (
                          data.flips.map((flip) => (
                            <tr key={flip.id} className="border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors">
                              <td className="p-1 md:p-1.5 text-slate-400">{flip.id}</td>
                              <td className="p-1 md:p-1.5 text-yellow-500">{flip.time}</td>
                              <td className={`p-1 md:p-1.5 ${flip.from.includes('-') ? 'text-red-400' : 'text-green-400'}`}>{flip.from}</td>
                              <td className={`p-1 md:p-1.5 ${flip.to.includes('-') ? 'text-red-400' : 'text-green-400'}`}>{flip.to}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" className="p-6 text-slate-500 text-xs">No Flip Data</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Chart Section */}
          {hasSearched && (
            <div className="bg-[#0B1221] border border-slate-800/50 rounded overflow-hidden">
              <div className="bg-[#1f2937] p-2 flex justify-between items-center">
                <div className="flex items-center gap-1.5 md:gap-2 text-slate-300 flex-wrap">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-[9px] md:text-[10px] font-semibold">Buy Volume</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 ml-1 md:ml-2"></div>
                  <span className="text-[9px] md:text-[10px] font-semibold">Sell Volume</span>
                </div>
                <button onClick={() => setIsChartModalOpen(true)} className="p-1 md:p-1.5 hover:bg-slate-700 rounded transition" title="ซูม Chart">
                  <SearchIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                </button>
              </div>
              <div className="h-[160px] md:h-[200px] bg-[#111827] p-1.5 md:p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="price" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 7 }} height={18} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 7 }} width={28} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px', fontSize: '10px' }} />
                    <Bar dataKey="buy" fill="#10b981" />
                    <Bar dataKey="sell" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Chart Modal */}
        {isChartModalOpen && (
          <div className="fixed inset-0 bg-[#0d1117] z-[999] flex flex-col">
            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-[#0d1117] border-b border-slate-800 flex-shrink-0">
              <button onClick={() => setIsChartModalOpen(false)}
                className="flex items-center gap-1.5 bg-[#1f2937] hover:bg-slate-700 border border-slate-700 px-2 md:px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white transition-all flex-shrink-0">
                ← Back
              </button>
              <button onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 500); }}
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-400 text-white transition-all flex-shrink-0 text-sm">
                🔄
              </button>
              <FullscreenSymbolInput
                value={activeSymbol}
                onChange={(v) => {
                  setSymbol(v);
                  if (v.trim()) {
                    setActiveSymbol(v.toUpperCase());
                    setHasSearched(true);
                    const updated = [v.toUpperCase(), ...symbolHistory.filter((s) => s !== v.toUpperCase())].slice(0, 10);
                    setSymbolHistory(updated);
                    localStorage.setItem("tickmatch_symbol_history", JSON.stringify(updated));
                  }
                }}
              />
              <h2 className="flex-1 text-center text-base md:text-lg font-bold text-white tracking-widest uppercase">
                {activeSymbol || "PRICE DISTRIBUTION"}
              </h2>
            </div>
            <div className="flex-1 min-h-0 bg-[#0d1117] flex items-center justify-center p-3 md:p-6">
              <div className="w-full h-full bg-[#111827] border border-slate-700 rounded-xl p-3 md:p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="price" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="buy" fill="#10b981" name="Buy Volume" />
                    <Bar dataKey="sell" fill="#ef4444" name="Sell Volume" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ==========================================================
      CASE 1 : PREVIEW VERSION (Not Member)
  =========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">TickMatch</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">Tracking "Big Money" Footprints</p>
          </div>

          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="w-full bg-[#0B1221]">
                <TickMatchDashboard />
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">4 Main Features</h2>
            <div className="relative group w-full" onMouseEnter={() => isPaused.current = true} onMouseLeave={() => isPaused.current = false}>
              <button onClick={() => scroll("left")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-20 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-500 transition shadow-xl ${!showLeft && "opacity-0 pointer-events-none"}`}>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div ref={scrollContainerRef} onScroll={checkScroll} className="flex overflow-x-auto gap-4 md:gap-6 py-4 px-1 hide-scrollbar" style={scrollbarHideStyle}>
                {features.map((item, index) => (
                  <div key={index} className="w-[280px] md:w-[350px] lg:w-[400px] flex-shrink-0 group/card bg-[#0f172a]/60 border border-slate-700/50 p-6 md:p-8 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => scroll("right")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-20 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-500 transition shadow-xl ${!showRight && "opacity-0 pointer-events-none"}`}>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate("/login")} className="px-8 py-3 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 transition">Sign In</button>
            <button onClick={() => navigate("/member-register")} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold hover:shadow-lg transition">Join Membership</button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
      CASE 2 : START SCREEN (MEMBER BUT NOT ENTERED)
  =========================================================== */
  if (isMember && !enteredTool) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">TickMatch</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">Tracking "Big Money" Footprints</p>
          </div>

          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="w-full bg-[#0B1221]">
                <TickMatchDashboard />
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">4 Main Features</h2>
            <div className="relative group w-full" onMouseEnter={() => isPaused.current = true} onMouseLeave={() => isPaused.current = false}>
              <button onClick={() => scroll("left")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-20 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-500 transition shadow-xl ${!showLeft && "opacity-0 pointer-events-none"}`}>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div ref={scrollContainerRef} onScroll={checkScroll} className="flex overflow-x-auto gap-4 md:gap-6 py-4 px-1 hide-scrollbar" style={scrollbarHideStyle}>
                {features.map((item, index) => (
                  <div key={index} className="w-[280px] md:w-[350px] lg:w-[400px] flex-shrink-0 group/card bg-[#0f172a]/60 border border-slate-700/50 p-6 md:p-8 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => scroll("right")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-20 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white hover:bg-cyan-500 hover:border-cyan-500 transition shadow-xl ${!showRight && "opacity-0 pointer-events-none"}`}>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center w-full">
            <button onClick={() => { setEnteredTool(true); localStorage.setItem("tickToolEntered", "true"); }}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300">
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
      CASE 3 : FULL TICKMATCH DASHBOARD
      - Mobile: min-h-screen, panels stack vertically with fixed height
      - Desktop (md+): h-screen overflow-hidden, 2 columns side-by-side
  =========================================================== */
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full md:h-screen min-h-screen bg-[#0B1221] text-white p-3 md:p-4 animate-fade-in flex flex-col gap-3 md:gap-4 md:overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 flex-1 md:overflow-hidden">
        <AnalysisPanel defaultSymbol="" defaultDate={todayStr} />
        <AnalysisPanel defaultSymbol="" defaultDate={todayStr} />
      </div>
    </div>
  );
}