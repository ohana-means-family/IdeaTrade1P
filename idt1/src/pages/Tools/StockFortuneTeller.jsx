import React from 'react';
import { useNavigate } from 'react-router-dom';

const StockFortuneTeller = () => {
  const navigate = useNavigate();

  // ข้อมูลฟีเจอร์ต่างๆ
  const features = [
    {
      title: "Last",
      description: "Stay updated with intuitive, real-time daily price action charts."
    },
    {
      title: "PredictTrend",
      description: "Visualizes the pulse of the market by tracking real-time capital inflows and outflows."
    },
    {
      title: "Volume Analysis",
      description: "Deep dive into volume patterns to confirm trend strength and reversals."
    },
    {
      title: "Smart Signals",
      description: "AI-driven entry and exit points to maximize your profit potential."
    },
    {
      title: "Sector Rotation",
      description: "Identify which sectors are leading the market in real-time."
    },
    {
      title: "Risk Management",
      description: "Calculated risk metrics to help you protect your capital."
    }
  ];

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* --- Header Section --- */}
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

        {/* --- Main Dashboard Image (Mac Window Style) --- */}
        <div className="relative group w-full max-w-5xl mb-20">
          {/* Neon Glow Behind */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            {/* Window Controls */}
            <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="w-10"></div> {/* Spacer for balance */}
            </div>
            
            {/* Image Placeholder */}
            <div className="aspect-[16/9] w-full bg-[#0B1221] relative overflow-hidden">
               {/* TODO: เปลี่ยน src ด้านล่างนี้เป็นรูปจริงของคุณ 
                  เช่น src="/assets/stock-dashboard-real.png"
               */}
              <img 
                src="https://placehold.co/1200x675/0f172a/1e293b?text=Stock+Fortune+Dashboard" 
                alt="Stock Fortune Teller Dashboard" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out" 
              />
            </div>
          </div>
        </div>

        {/* --- Features Section --- */}
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            6 Main Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((item, index) => (
              <div key={index} className="group bg-[#0f172a]/60 border border-slate-700/50 p-6 rounded-xl hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- CTA Button --- */}
        <div className="text-center">
          <button 
            // ✅ แก้ไข Path ให้ตรงกับ AppRoutes ("/member-register")
            onClick={() => navigate("/member-register")} 
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer"
          >
            <span className="mr-2">Upgrade Subscription</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default StockFortuneTeller;