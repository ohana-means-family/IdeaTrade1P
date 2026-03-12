import React from "react";
import { useNavigate } from "react-router-dom";
import mit from "@/assets/images/mit.png";

const CHART_IMAGE_URL = "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1964&auto=format&fit=crop";

export default function MITLanding() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-5xl mx-auto text-center py-10 animate-fade-in">
      
      {/* Background Blur Effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight whitespace-nowrap">
          MIT : <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Multi-Agent Intelligent Analyst</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto tracking-tight whitespace-nowrap">
          Multi-agent AI system that debates, validates risk, and delivers objective trading insights.
        </p>
        
        {/* Mockup Window */}
        <div className="relative group mx-auto max-w-4xl mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 px-4 py-2 flex items-center gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="aspect-video w-full bg-slate-900 relative group">
              <img 
                src={mit} 
                alt="MIT Preview" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700 ease-in-out" 
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => window.open('https://ideatrade1.com/mit', '_blank')}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          Start Using Tool
        </button>
      </div>
    </div>
  );
}