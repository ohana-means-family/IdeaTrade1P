import React from "react";
import { useNavigate } from "react-router-dom";

export default function BidAsk() {
  const navigate = useNavigate();

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
    <div className="relative w-full min-h-screen text-white overflow-hidden py-20 px-4">
      
      {/* ===== Background Glow ===== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ===== Header ===== */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              BidAsk
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl">
            Deciphering "Big Money" through Order Flow Intelligence
          </p>
          <p className="text-slate-500 mt-2">
            Move beyond static screens
          </p>
        </div>

        {/* ===== Dashboard Preview (Glow Frame) ===== */}
        <div className="relative group mb-20">
          
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
          
          {/* Card */}
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/src/assets/images/BidAsk.png"
              alt="Bid Ask Dashboard Preview"
              className="w-full h-auto object-cover opacity-95 
                         group-hover:scale-[1.01] group-hover:opacity-100 
                         transition duration-500"
            />
          </div>
        </div>

        {/* ===== Features Section ===== */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            4 Main Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="group bg-[#0f172a]/70 border border-blue-500/30 
                           p-8 rounded-2xl 
                           hover:border-indigo-400 
                           hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]
                           transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4 
                               group-hover:text-indigo-400 transition">
                  {item.title}
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA Section ===== */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-20">
          
          <button
            onClick={() => navigate("/login")}
            className="w-full md:w-auto px-10 py-4 rounded-full 
                       bg-slate-700 hover:bg-slate-600 
                       transition text-lg"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/member-register")}
            className="w-full md:w-auto px-10 py-4 rounded-full 
                       bg-gradient-to-r from-blue-500 to-purple-500 
                       font-semibold text-lg 
                       shadow-lg hover:brightness-110 transition"
          >
            Join Membership
          </button>

        </div>

      </div>
    </div>
  );
}
