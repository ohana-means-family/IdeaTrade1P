import React, { useState, useMemo, useRef, useEffect } from "react";

/* ================= MOCK DATA ================= */
const CATEGORIES = ["SET100", "NON-SET100", "MAI", "WARRANT"];

const MOCK_TABLE_DATA = [
  { rank: 1, symbol: "PTT",    value: "1,245.50", change: "+2.50",  isUp: true  },
  { rank: 2, symbol: "AOT",    value: "850.00",   change: "-1.20",  isUp: false },
  { rank: 3, symbol: "CPALL",  value: "620.25",   change: "0.00",   isUp: null  },
  { rank: 4, symbol: "ADVANC", value: "450.75",   change: "+1.05",  isUp: true  },
  { rank: 5, symbol: "GULF",   value: "310.00",   change: "-0.50",  isUp: false },
];

/* ================= TOOLTIP ================= */
const Tooltip = ({ children, lines = [], linkText = "", linkHref = "#" }) => {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);

  const show = () => {
    clearTimeout(hideTimer.current);
    setVisible(true);
  };
  const hide = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 100);
  };

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  return (
    <div className="relative inline-flex items-center">
      <div onMouseEnter={show} onMouseLeave={hide}>
        {children}
      </div>

      {visible && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute left-full top-0 ml-3 z-[9999] w-64
            bg-[#1a2235] border border-slate-600/70
            rounded-xl shadow-2xl shadow-black/60
            px-4 py-3 pointer-events-auto"
        >
          {/* Arrow ชี้ซ้าย — จัดให้ตรงกับกึ่งกลางปุ่ม (ปุ่มสูง 36px = h-9) */}
          <div
            className="absolute -left-[7px] w-0 h-0
              border-t-[7px] border-t-transparent
              border-b-[7px] border-b-transparent
              border-r-[7px] border-r-[#1a2235]"
            style={{ top: "calc(18px - 7px)" }}
          />
          {/* Arrow border layer */}
          <div
            className="absolute -left-[9px] w-0 h-0
              border-t-[8px] border-t-transparent
              border-b-[8px] border-b-transparent
              border-r-[8px] border-r-slate-600/70"
            style={{ top: "calc(18px - 8px)" }}
          />

          <div className="text-slate-200 text-[13px] leading-relaxed space-y-0.5 mb-2">
            {lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          {linkText && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-[13px] underline transition-colors"
            >
              {linkText}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */
const RankTable = ({ data }) => (
  <div className="w-full lg:w-[35%] bg-[#0f172a] rounded-lg border border-slate-700 overflow-hidden flex flex-col">
    <div className="bg-slate-800 text-[11px] text-slate-300 font-semibold grid grid-cols-4 px-2 py-3 uppercase tracking-wider shrink-0">
      <div className="text-center">Rank</div>
      <div>Symbol</div>
      <div className="text-right">Value</div>
      <div className="text-right">%Change</div>
    </div>
    <div className="overflow-y-auto flex-1 custom-scrollbar">
      <table className="w-full text-sm">
        <tbody>
          {data.map((row) => {
            const changeColor =
              row.isUp === true
                ? "text-green-400"
                : row.isUp === false
                ? "text-red-400"
                : "text-slate-400";
            return (
              <tr
                key={row.rank}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-2 px-2 text-center text-slate-400">{row.rank}</td>
                <td className="py-2 px-2 font-bold text-white">{row.symbol}</td>
                <td className="py-2 px-2 text-right text-slate-200">{row.value}</td>
                <td className={`py-2 px-2 text-right font-semibold ${changeColor}`}>
                  {row.change}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const SectionCard = ({ category, type }) => {
  const isPositive = type === "+";
  const accentColor = isPositive ? "#22c55e" : "#ef4444";
  const gradientFrom = isPositive ? "from-green-500/20" : "from-red-500/20";

  return (
    <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700/60 shadow-lg hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white">{category}</h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {type === "+" ? "▲ BUY FLOW" : "▼ SELL FLOW"}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-600" />
          <div className="w-2 h-2 rounded-full bg-slate-600" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:h-64">
        <div
          className={`w-full lg:w-[65%] bg-gradient-to-br ${gradientFrom} to-transparent rounded-lg border border-slate-700/50 flex items-center justify-center relative overflow-hidden group cursor-default`}
        >
          <svg
            viewBox="0 0 200 80"
            className="absolute inset-0 w-full h-full opacity-30"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              points="0,60 20,50 40,55 60,30 80,40 100,20 120,35 140,15 160,25 180,10 200,20"
            />
            <polygon
              fill={accentColor}
              fillOpacity="0.15"
              points="0,80 0,60 20,50 40,55 60,30 80,40 100,20 120,35 140,15 160,25 180,10 200,20 200,80"
            />
          </svg>
          <span className="relative z-10 text-white/30 font-bold tracking-widest text-sm group-hover:text-white/50 transition-colors select-none">
            GRAPH AREA
          </span>
        </div>
        <RankTable data={MOCK_TABLE_DATA} />
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
export default function RealFlow() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");

  const allSections = useMemo(() => {
    const result = [];
    CATEGORIES.forEach((cat) => {
      result.push({ category: cat, type: "+" });
      result.push({ category: cat, type: "-" });
    });
    return result;
  }, []);

  const visibleSections = useMemo(() => {
    return allSections.filter(({ category }) => {
      const matchCat    = activeCategory === null || activeCategory === category;
      const matchSearch =
        searchQuery.trim() === "" ||
        category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allSections, activeCategory, searchQuery]);

  const handleFilterClick = (cat) =>
    setActiveCategory((prev) => (prev === cat ? null : cat));

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-white">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>

      <div className="max-w-[1600px] mx-auto px-4 py-6">

        {/* ============= HEADER ============= */}
        <header className="flex flex-wrap items-center gap-3 mb-8">

          {/* Info Button + Tooltip */}
          <Tooltip
            lines={[
              "Real Flow ติดตามกระแสเงินตลาดหุ้น Real-time",
              "วิเคราะห์ Buy/Sell Flow แยกตาม SET100 / MAI / WARRANT",
            ]}
            linkText="View feature details here"
            linkHref="#"
          >
            <button className="w-9 h-9 rounded-full border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-400 transition-all text-sm font-bold shrink-0">
              ?
            </button>
          </Tooltip>

          {/* Search */}
          <div className="relative w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] rounded-lg py-2 pl-9 pr-8 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 ml-auto lg:ml-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleFilterClick(cat)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border focus:outline-none ${
                    isActive
                      ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/50"
                      : "bg-transparent border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        {/* ============= CONTENT SECTIONS ============= */}
        <div className="space-y-6 pb-12">
          {visibleSections.length > 0 ? (
            visibleSections.map(({ category, type }) => (
              <SectionCard
                key={`${category}-${type}`}
                category={category}
                type={type}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <svg className="w-12 h-12 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No sections found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}