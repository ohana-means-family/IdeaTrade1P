import React from "react";
import { useNavigate } from "react-router-dom";

/* =======================
   Data Configuration
======================= */
const premiumTools = [
  { id: "fortune", name: "หมอดูหุ้น", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "petroleum", name: "Petroleum", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "rubber", name: "Rubber Thai", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "flow", name: "Flow Intraday", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "s50", name: "S50", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "gold", name: "Gold", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "bidask", name: "BidAsk", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "tickmatch", name: "TickMatch", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "dr", name: "DR", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
];

export default function Shortcuts() {
  const navigate = useNavigate();

  // ฟังก์ชันสลับหน้า (ถ้าเป็นสมาชิกให้เข้า tool ถ้าไม่ให้ไปหน้าสมัคร)
  const handleOpenTool = (toolId) => {
    // ใส่ Logic เช็คสิทธิ์ตรงนี้ได้ หรือจะให้กดแล้วไปหน้า Tool เลย
    navigate(`/tools/${toolId}`);
  };

  return (
    <div className="w-full">
      
      {/* ===== Header Section ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">Premium Tools</h1>
          <p className="text-gray-400 text-sm max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/member-register")}
          className="bg-[#0099ff] hover:bg-[#007acc] text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg whitespace-nowrap"
        >
          Get more subscription
        </button>
      </div>

      {/* ===== Grid Section ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumTools.map((tool) => (
          <div 
            key={tool.id} 
            className="bg-[#3a3a3a] rounded-xl p-6 flex flex-col gap-4 border border-transparent hover:border-gray-500 transition duration-200"
          >
            {/* Header: Icon & Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#cca300] flex items-center justify-center text-white shadow-sm border-2 border-[#b38f00]">
                {/* Icon ดาว (SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">{tool.name}</h3>
            </div>

            {/* Description */}
            <div className="flex-grow">
               <p className="text-[#a0a0a0] text-sm leading-relaxed">
                 {tool.desc}
               </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleOpenTool(tool.id)}
              className="w-full mt-2 py-2.5 rounded-full bg-[#cca300] hover:bg-[#b38f00] text-white font-semibold transition shadow-md"
            >
              JOIN MEMBERSHIP
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
