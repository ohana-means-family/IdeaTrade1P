import React from "react";
import { useNavigate } from "react-router-dom";

export default function RubberThai() {
  const navigate = useNavigate();

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
    <div className="relative w-full min-h-screen text-white overflow-hidden py-16 px-4">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ===== Header ===== */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Rubber Thai
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Stop trading in the dark
          </p>
        </div>

        {/* ===== Dashboard Preview (Glow Frame) ===== */}
        <div className="relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
          
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/src/assets/images/Rubber.png"
              alt="Rubber Thai Dashboard"
              className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500"
            />
          </div>
        </div>

        {/* ===== Features Section ===== */}
        <div>
          <h2 className="text-3xl font-bold mb-10">4 Main Feature</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="group bg-[#0f172a]/70 border border-blue-500/30 p-8 rounded-xl 
                           hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] 
                           transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="flex justify-center gap-6 mt-16">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-full bg-slate-700 hover:bg-slate-600 transition"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/member-register")}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 
                       font-semibold shadow-lg hover:brightness-110 transition"
          >
            Join Membership
          </button>
        </div>

      </div>
    </div>
  );
}
