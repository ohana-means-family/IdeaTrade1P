import React from "react";
import { useNavigate } from "react-router-dom";

export default function Gold() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Gold (Smart Signal)",
      desc: `Track global gold prices with an intelligent filtering system designed 
      to eliminate "market noise" and pinpoint where "Smart Money" is actually reversing course.`,
    },
    {
      title: "VIX Index (The Fear Gauge)",
      desc: `Monitor market volatility in real-time. When the VIX spikes, gold often 
      transitions into its role as a "Safe Haven," allowing you to capitalize on sudden surges in demand.`,
    },
    {
      title: "DXY Correlation",
      desc: `Stay ahead of the U.S. Dollar—the primary driver that typically moves 
      inversely to gold. Use this to time your entries perfectly when the Dollar shows signs of weakness.`,
    },
    {
      title: "US10YY (Yield Monitor)",
      desc: `Track the U.S. 10-Year Treasury Yield to assess interest rate directions. 
      Since yields represent the "opportunity cost" of holding gold, this feature helps 
      you anticipate capital shifts between bonds and bullion.`,
    },
  ];

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden py-20 px-4">
      
      {/* ===== Background Glow ===== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ===== Header ===== */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              GOLD
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl">
            Look beyond the price tag
          </p>
        </div>

        {/* ===== Dashboard Preview (Glow Frame) ===== */}
        <div className="relative group mb-20">
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
          
          {/* Card */}
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/src/assets/images/Gold.png"
              alt="Gold Dashboard Preview"
              className="w-full h-auto object-cover opacity-95 
                         group-hover:scale-[1.01] group-hover:opacity-100 
                         transition duration-500"
            />
          </div>
        </div>

        {/* ===== Features Section ===== */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            4 Main Feature
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="group bg-[#0f172a]/70 border border-yellow-500/30 
                           p-8 rounded-2xl 
                           hover:border-amber-400 
                           hover:shadow-[0_0_30px_rgba(250,204,21,0.35)]
                           transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4 
                               group-hover:text-amber-400 transition">
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
                       bg-gradient-to-r from-yellow-500 to-orange-500 
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
