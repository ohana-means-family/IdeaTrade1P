import React from "react";
import { useNavigate } from "react-router-dom";

export default function DRInsight() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Global Symbol Mapping",
      desc: `Instantly connects every DR on the Thai board to its 
      underlying international parent stock. No more confusion 
      over tickers — access a unified global asset view in seconds.`,
    },
    {
      title: "Arbitrage Tracking",
      desc: `Compare the parent stock’s price against the Thai DR 
      on a dual-pane screen. Instantly detect Premium or Discount 
      spreads to execute trades at the most favorable valuation.`,
    },
    {
      title: "Real-Time Valuation",
      desc: `Monitor live P/E ratios and key fundamental metrics 
      of the underlying global stocks. Instantly verify whether 
      a DR is undervalued or overpriced based on true performance.`,
    },
    {
      title: "Multi-Market Correlation",
      desc: `View a comprehensive heat map of global markets 
      within a single dashboard. Diversify intelligently and 
      rotate capital toward regions and sectors with strong growth momentum.`,
    },
  ];

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden py-20 px-4">
      
      {/* ===== Background Glow ===== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ===== Header ===== */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              DRInsight
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl">
            Your Gateway to Global Equity
          </p>
          <p className="text-slate-500 mt-2">
            Connecting Thai DRs to the World’s Markets
          </p>
        </div>

        {/* ===== Dashboard Preview ===== */}
        <div className="relative group mb-20">
          
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
          
          {/* Card */}
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/src/assets/images/DRInsight.png"
              alt="DRInsight Dashboard Preview"
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
                className="group bg-[#0f172a]/70 border border-cyan-500/30 
                           p-8 rounded-2xl 
                           hover:border-blue-400 
                           hover:shadow-[0_0_30px_rgba(56,189,248,0.35)]
                           transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4 
                               group-hover:text-cyan-400 transition">
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
                       bg-gradient-to-r from-cyan-500 to-indigo-500 
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
