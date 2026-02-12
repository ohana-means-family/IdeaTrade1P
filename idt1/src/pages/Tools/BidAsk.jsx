import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BidAsk() {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);

  // --- Logic เช็คสถานะ Member ---
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);
        if (user.unlockedItems && user.unlockedItems.includes("bidask")) {
          setIsMember(true);
        }
      }
    } catch (error) {
      console.error("Error checking member status:", error);
    }
  }, []);

  const features = [
    {
      title: "Historical Market Replay",
      desc: `A tick-by-tick playback system that recreates market events. 
      Study exactly how massive orders impacted price action during critical 
      moments to master high-stakes trading.`,
    },
    {
      title: "Supply & Demand Profiling",
      desc: `Analyzes order density at every price level. This reveals the 
      "true" areas of interest where real transactions are occurring, 
      moving beyond superficial Bid/Ask numbers.`,
    },
    {
      title: "Comparative Liquidity View",
      desc: `Side-by-side Order Book comparisons for two different assets. 
      Visualize capital shifting between stocks or entire industry sectors 
      in real-time.`,
    },
    {
      title: "Momentum Visualization",
      desc: `Dynamic color-coded bars that aggregate Bid and Ask volume 
      over time. Instantly reflect net buying/selling pressure and 
      overall market sentiment.`,
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
              BidAsk
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Deciphering "Big Money" through Order Flow Intelligence
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
                src="/src/assets/images/BidAsk.png"
                alt="Bid Ask Dashboard Preview"
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
