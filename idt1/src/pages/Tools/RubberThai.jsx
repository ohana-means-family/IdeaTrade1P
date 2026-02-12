import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RubberThai() {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);

  // --- Logic เช็คสถานะ Member ---
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);
        if (user.unlockedItems && user.unlockedItems.includes("rubber")) {
          setIsMember(true);
        }
      }
    } catch (error) {
      console.error("Error checking member status:", error);
    }
  }, []);

  const features = [
    {
      title: "Stock vs Commodity Correlation",
      desc: `Compare stock performance against global rubber prices on a dual-pane chart. 
      Instantly see which stocks are leading the market and which ones are lagging behind.`,
    },
    {
      title: "Cycle Identification",
      desc: `Navigate the "Supercycle" with ease. This feature analyzes long-term bullish and bearish trends, 
      helping you determine if you are at the "Early Accumulation" stage or the "Late-Cycle" danger zone.`,
    },
    {
      title: "Leading Indicator Analysis",
      desc: `Use real-time commodity trends as a crystal ball for corporate earnings. 
      By tracking price shifts today, you can forecast a company's profit margins months before they report to the exchange.`,
    },
    {
      title: "Divergence Detection",
      desc: `Spot market inefficiencies before they correct. Identify "Hidden Gems" where rubber prices are surging 
      but the stock has yet to move, or "Red Flags" where the stock remains high despite a crash in commodity prices.`,
    },
  ];

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

        {/* --- Header Section --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              Rubber Thai
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Stop trading in the dark
          </p>
        </div>

        {/* --- Dashboard Image (Mac Window Style) --- */}
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
                src="/src/assets/images/Rubber.png"
                alt="Rubber Thai Dashboard"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* --- Features Section --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            4 Main Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="group bg-[#0f172a]/60 border border-slate-700/50 p-6 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- CTA Buttons (Conditional Logic แบบเดียวกัน) --- */}
        <div className="text-center w-full max-w-md mx-auto mt-4">
          {isMember ? (
            <button
              onClick={() => navigate("/member-register")}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">Upgrade Subscription</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ) : (
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
          )}
        </div>

      </div>
    </div>
  );
}
