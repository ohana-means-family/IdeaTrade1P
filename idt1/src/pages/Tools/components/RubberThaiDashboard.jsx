// src/pages/tools/rubber/RubberDashboard.jsx
import React, { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis
} from 'recharts';
import {
  Search, ChevronLeft, MoreHorizontal, ToggleLeft, ToggleRight
} from 'lucide-react';

// --- Mock Data ---
const dataClose = [
  { name: 'Nov', value: 27.5 }, { name: '2023', value: 28 }, { name: 'Mar', value: 27.2 },
  { name: 'May', value: 27.5 }, { name: 'Jul', value: 30.5 }, { name: 'Sep', value: 30 },
  { name: 'Nov', value: 31.5 }, { name: '2024', value: 33.5 }, { name: 'Mar', value: 31 },
  { name: 'Jun', value: 30.8 }, { name: 'Aug', value: 32.5 }, { name: 'Oct', value: 33.2 },
  { name: '2025', value: 33.8 }, { name: 'Mar', value: 32.5 }, { name: 'May', value: 32.8 },
  { name: 'Jul', value: 33.2 }, { name: 'Sep', value: 33 }, { name: '30', value: 33.8 }
];

const dataRubberThai = [
  { name: 'Nov', value: 70.5 }, { name: '2023', value: 70.2 }, { name: 'Mar', value: 70 },
  { name: 'May', value: 72.5 }, { name: 'Jul', value: 73.8 }, { name: 'Sep', value: 73.5 },
  { name: 'Nov', value: 75.5 }, { name: '2024', value: 72.5 }, { name: 'Mar', value: 71 },
  { name: 'Jun', value: 70.2 }, { name: 'Aug', value: 73.5 }, { name: 'Oct', value: 75.2 },
  { name: '2025', value: 72.5 }, { name: 'Mar', value: 73.5 }, { name: 'May', value: 71.5 },
  { name: 'Jul', value: 73.8 }, { name: 'Sep', value: 70.5 }, { name: '30', value: 70.8 }
];

export default function RubberDashboard() {
  const [isToggled, setIsToggled] = useState(true);

  return (
    // 1. พื้นหลังนอกสุด (Backdrop)
    <div className="w-full min-h-screen bg-[#05070a] p-4 md:p-6 font-sans flex items-center justify-center">

      {/* 2. กรอบนอกของ Dashboard (App Window) */}
      <div className="w-full max-w-[1600px] h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] bg-[#0e1118] border border-slate-700/50 rounded-xl shadow-2xl flex flex-col p-4 md:p-5 overflow-hidden relative">

        {/* --- TOP BAR --- */}
        <div className="flex justify-between items-center mb-3 shrink-0">
          <div className="flex items-center gap-3 bg-[#151a25] border border-slate-700/50 rounded-full h-9 px-3 w-full max-w-[300px] transition-all focus-within:border-blue-500 focus-within:shadow-[0_0_10px_rgba(59,130,246,0.15)] group">
            <ChevronLeft size={18} className="text-slate-400 cursor-pointer hover:text-white" />
            <Search size={16} className="text-slate-400 mr-2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              defaultValue="24CS"
              className="bg-transparent border-none outline-none text-sm text-white w-full font-bold uppercase placeholder:text-slate-600 placeholder:font-normal"
            />
             <MoreHorizontal size={16} className="text-slate-400 cursor-pointer hover:text-white ml-auto" />
          </div>

          <div className="flex items-center gap-4">
             <div
                onClick={() => setIsToggled(!isToggled)}
                className="cursor-pointer text-yellow-500 hover:text-yellow-400 transition-colors"
             >
                {isToggled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
             </div>
          </div>
        </div>

        {/* --- SUMMARY STATS --- */}
        <div className="grid grid-cols-4 gap-3 mb-4 shrink-0">
          <StatCard label="RSS3 (BKK)" value="78.50" change="+1.20" isUp={true} />
          <StatCard label="TSR20 (SGX)" value="162.4" change="-0.5" isUp={false} />
          <StatCard label="CUP LUMP" value="45.20" change="+0.50" isUp={true} />
          <StatCard label="EXCHANGE RATE" value="35.85" change="0.00" isUp={null} />
        </div>

        {/* --- MAIN CHART 1: CLOSE (24CS) --- */}
        <div className="flex-1 min-h-0 w-full mb-3 bg-[#151a25]/50 border border-slate-800/50 rounded-xl relative overflow-hidden">
           <div className="absolute top-3 left-4 z-10">
              <h3 className="text-white font-bold">CLOSE (24CS) <span className="text-slate-500 text-xs font-normal ml-2">High: 2.14 Low: 2.08</span></h3>
           </div>
           {/* Watermark */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.02]">
              <span className="text-8xl font-black text-white uppercase tracking-[0.2em]">CLOSE</span>
           </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataClose} margin={{ top: 40, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} domain={['dataMin - 1', 'dataMax + 1']} />
              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} domain={['dataMin - 1', 'dataMax + 1']} hide={true}/>
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#151a25', stroke: '#22c55e', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* --- MAIN CHART 2: Rubber Thai Price --- */}
        <div className="flex-1 min-h-0 w-full bg-[#151a25]/50 border border-slate-800/50 rounded-xl relative overflow-hidden">
           <div className="absolute top-3 left-4 z-10">
              <h3 className="text-white font-bold">Rubber Thai Price <span className="text-slate-500 text-xs font-normal ml-2">Trend: Bullish</span></h3>
           </div>
           {/* Watermark */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.02]">
              <span className="text-8xl font-black text-white uppercase tracking-[0.2em]">Rubber Thai</span>
           </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataRubberThai} margin={{ top: 40, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRubber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} domain={['dataMin - 2', 'dataMax + 2']} />
              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} domain={['dataMin - 2', 'dataMax + 2']} hide={true}/>
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="right" type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} fill="url(#colorRubber)" activeDot={{ r: 6, fill: '#151a25', stroke: '#eab308', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({ label, value, change, isUp }) {
  return (
    <div className="bg-[#151a25]/70 border border-slate-800/50 rounded-lg p-3 flex flex-col justify-between h-[70px]">
      <div className="flex justify-between items-start">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
        <span className={`text-[10px] font-bold ${isUp === true ? 'text-green-500' : isUp === false ? 'text-red-500' : 'text-slate-400'}`}>
          {change}
        </span>
      </div>
      <span className="text-xl font-bold text-white mt-1">{value}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1118] border border-slate-700 p-2 rounded shadow-xl text-xs flex flex-col gap-1 z-50">
        <p className="text-slate-400 border-b border-slate-800 pb-1 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }}></div>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}