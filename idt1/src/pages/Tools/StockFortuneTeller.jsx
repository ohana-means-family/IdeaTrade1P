// src/pages/tools/stockfortuneteller.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function StockFortuneTeller() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const [filters, setFilters] = useState({
    chart1: "Last",
    chart2: "%Short",
    chart3: "PredictTrend",
    chart4: "Peak",
    chart5: "Shareholder",
    chart6: "Manager",
  });

  /* ===============================
     MEMBER CHECK
  ================================ */
useEffect(() => {
  try {
    const userProfile = localStorage.getItem("userProfile");

    if (userProfile) {
      const user = JSON.parse(userProfile);

      if (user.unlockedItems && user.unlockedItems.includes("fortune")) {
        setIsMember(true);

        // 🔥 เช็คว่าเคยเข้า tool แล้วหรือยัง
        const hasEntered = localStorage.getItem("fortuneToolEntered");
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
     SCROLL LOGIC (ของเดิมทั้งหมด)
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
     FEATURES DATA (ของเดิม)
  ================================ */
  const features = [
    {
      title: "Last",
      desc: "Stay updated with intuitive, real-time daily price action charts.",
    },
    {
      title: "PredictTrend",
      desc: "Visualizes the pulse of the market by tracking real-time capital inflows and outflows.",
    },
    {
      title: "Volume Analysis",
      desc: "Deep dive into volume patterns to confirm trend strength.",
    },
    {
      title: "Smart Signals",
      desc: "AI-driven entry and exit points.",
    },
    {
      title: "Sector Rotation",
      desc: "Identify which sectors are leading the market in real-time.",
    },
    {
      title: "Risk Management",
      desc: "Calculated risk metrics to help you protect your capital.",
    },
  ];

  /* ==========================================================
     CASE 1 : ยังไม่ซื้อ → PREVIEW VERSION (โค้ดเดิม 100%)
  =========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Stock Fortune Teller
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Stop guessing, start calculating
            </p>
          </div>

          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              <div className="aspect-[16/9] w-full bg-[#0B1221]">
                <img
                  src="/src/assets/images/StockFortune.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* --- Features Section (ใช้แบบ Scroll เหมือน StockFortuneTeller) --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            6 Main Features
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

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-full bg-slate-800 border border-slate-600"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/member-register")}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold"
            >
              Join Membership
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     CASE 2 : ซื้อแล้ว แต่ยังไม่กด Start
  =========================================================== */
  if (isMember && !enteredTool) {
     return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Stock Fortune Teller
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Stop guessing, start calculating
            </p>
          </div>

          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              <div className="aspect-[16/9] w-full bg-[#0B1221]">
                <img
                  src="/src/assets/images/StockFortune.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 border-l-4 border-cyan-500 pl-4">
              6 Main Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#0f172a]/60 border border-slate-700/50 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setEnteredTool(true);
                localStorage.setItem("fortuneToolEntered", "true"); // 🔥 จำสถานะ
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
     CASE 3 : เข้า Full Dashboard แล้ว
  =========================================================== */
  return (
    <div className="w-full min-h-screen bg-[#0B1221] text-white px-6 py-6">

                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-72">
                    <input
                      type="text"
                      defaultValue="BANPU"
                      className="w-full bg-[#111827] border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
                      🔍
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-lg hover:border-cyan-500">
                      🔔
                    </button>
                    <button className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-lg hover:border-cyan-500">
                      ⟳
                    </button>
                    <button className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-lg hover:border-cyan-500">
                      ⬇
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-xs">LAST PRICE</p>
                    <p className="text-green-400 text-lg font-bold">5.30 (+1.92%)</p>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-xs">VOLUME</p>
                    <p className="text-yellow-400 text-lg font-bold">62.8M</p>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-xs">HIGH / LOW</p>
                    <p className="text-white text-lg font-bold">5.35 / 5.15</p>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-xs">MARKET STATUS</p>
                    <p className="text-green-400 font-bold">● OPEN</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(filters).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-[#111827] rounded-xl border border-slate-700 p-4 h-[320px]"
                    >
                      <div className="mb-3">
                        <select
                          value={value}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              [key]: e.target.value,
                            })
                          }
                          className="bg-[#1f2937] text-xs border border-slate-600 rounded-md px-2 py-1 focus:outline-none focus:border-cyan-500"
                        >
                          <option>Last</option>
                          <option>%Short</option>
                          <option>PredictTrend</option>
                          <option>Peak</option>
                          <option>Shareholder</option>
                          <option>Manager</option>
                        </select>
                      </div>

                      <div className="w-full h-[250px] bg-[#0f172a] rounded-lg flex items-center justify-center text-slate-500 text-sm">
                        {value} Chart
                      </div>
                    </div>
                  ))}
                </div>

              </div>
  );
}
