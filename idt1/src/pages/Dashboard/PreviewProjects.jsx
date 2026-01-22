import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mitIcon from "@/assets/icons/mit.svg"; 

const projects = [
  {
    id: "stock-mover",
    name: "Stock Mover",
    desc: "Detect unusual price movements and volume spikes in real time.",
    premium: false,
  },
  {
    id: "Project-Name",
    name: "Project Name",
    desc: "Filter stocks by technical and fundamental conditions instantly.",
    premium: false,
  },
  {
    id: "Project-Name-2",
    name: "Project Name 2",
    desc: "Identify emerging trends before they become obvious.",
    premium: false,
  },
  {
    id: "fortune", // แก้ ID ให้ตรงกับ Sidebar
    name: "หมอดูหุ้น",
    desc: "Track smart money and institutional order flow.",
    premium: true,
  },
  {
    id: "petroleum", // แก้ ID ให้ตรงกับ Sidebar
    name: "Petroleum",
    desc: "Simulate portfolio risk under different market scenarios.",
    premium: true,
  },
  {
    id: "rubber", // แก้ ID ให้ตรงกับ Sidebar
    name: "Rubber Thai",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "flow", // แก้ ID ให้ตรงกับ Sidebar
    name: "Flow Intraday",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "s50", // แก้ ID ให้ตรงกับ Sidebar
    name: "S50",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "gold", // แก้ ID ให้ตรงกับ Sidebar
    name: "Gold",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "bidask", // แก้ ID ให้ตรงกับ Sidebar
    name: "BidAsk",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "tickmatch", // แก้ ID ให้ตรงกับ Sidebar
    name: "TickMatch",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "dr", // แก้ ID ให้ตรงกับ Sidebar
    name: "DR",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
];

export default function PreviewProjects() {
  const navigate = useNavigate();
  
  // --- Logic เช็คสิทธิ์การเข้าถึง (เหมือน Sidebar) ---
  const [isMember, setIsMember] = useState(false);
  const [unlockedList, setUnlockedList] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // 1. เช็ค Member เหมาจ่าย
      if (user.role === "member") setIsMember(true);
      // 2. เช็คซื้อแยก
      if (user.unlockedItems) setUnlockedList(user.unlockedItems);
    }
  }, []);

  // ฟังก์ชันกดปุ่ม
  const handleOpenTool = (project) => {
    // เงื่อนไข: เข้าได้ถ้า (ฟรี) หรือ (เป็น Member) หรือ (ซื้อแยกชิ้นนี้แล้ว)
    const isUnlocked = !project.premium || isMember || unlockedList.includes(project.id);

    if (isUnlocked) {
      alert(`Opening ${project.name}... (Ready to use)`);
      // navigate(`/tools/${project.id}`); // ใส่ path จริงในอนาคต
    } else {
      // ถ้ายังไม่ปลดล็อค ให้ไปหน้าจ่ายเงิน
      navigate("/member-register");
    }
  };

  return (
    <div className="space-y-10">

      {/* ===== Accessible Beta Tools ===== */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-6">
          Accessible Beta Tools
        </h1>

        {/* MIT CARD */}
        <div className="bg-[#1f3446] rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {/* ใช้ตัวแปร mitIcon ที่ import มา */}
              <img src={mitIcon} className="w-12 h-12 rounded-lg" alt="icon" /> 
              <div>
                <h2 className="text-xl font-semibold text-white">
                  MIT : Multi-Agent Intelligent Analyst
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl mt-1">
                  Experience the next level of trading with our Multi-Agent LLM system that simulates a professional institutional research team. By assigning specific roles to multiple AI agents, the system engages in rigorous data debates to eliminate bias, providing you with the most objective and high-probability trading insights available.
                </p>
              </div>
            </div>

            <button 
              onClick={() => alert("Opening MIT...")}
              className="bg-sky-600 hover:bg-sky-500 px-5 py-2 rounded-full text-white text-sm transition"
            >
              Open MIT
            </button>
          </div>

          {/* Feature boxes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "Role-Based AI Analysis",
                desc: "Strategic collaboration between 4 specialized AI teams: Analyst, Research, Risk Management, and Trader. This ensures every market move is vetted from every professional angle."
              },
              {
                title: "Bull vs. Bear Debate",
                desc: "Our proprietary debate engine pits \"Bullish\" vs. \"Bearish\" AI agents against each other to challenge assumptions and deliver a balanced, bias-free market conclusion."
              },
              {
                title: "Smart Execution & Risk Guard",
                desc: "Receive clear Buy/Sell/Hold signals with logical justifications. The system includes an automated \"Risk Vet\" that can veto recommendations if market volatility exceeds safety limits."
              },
              {
                title: "Real-time Intel & Backtesting",
                desc: "Access live market reports and verify strategies with our integrated Backtesting engine. See how AI-driven decisions would have performed in historical cycles before you commit."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#223b52] rounded-xl p-4"
              >
                <h3 className="text-sm font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Other Project ===== */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Other Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isPremium = project.premium;
            // เช็คสถานะเพื่อเปลี่ยนข้อความปุ่ม
            const isUnlocked = !isPremium || isMember || unlockedList.includes(project.id);

            return (
              <div
                key={project.id}
                className="bg-[#3f3f3f] rounded-2xl p-6 flex flex-col gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${isPremium ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-600 text-white"}`}
                >
                  {isPremium ? "⭐" : "🚀"}
                </div>

                <h3 className="text-white font-semibold">
                  {project.name} {isPremium && <span className="text-yellow-400 text-sm"> (Premium) </span>}
                </h3>

                <p className="text-sm text-slate-300">
                  {project.desc}
                </p>

                <button
                  onClick={() => handleOpenTool(project)}
                  className={`mt-auto rounded-full py-2 text-sm font-medium transition
                    ${
                      isPremium
                        ? isUnlocked 
                            ? "bg-sky-600 hover:bg-sky-500 text-white" // ซื้อแล้ว -> ปุ่มฟ้า
                            : "bg-yellow-500/80 hover:bg-yellow-400 text-black" // ยังไม่ซื้อ -> ปุ่มทอง
                        : "bg-sky-600 hover:bg-sky-500 text-white" // ของฟรี -> ปุ่มฟ้า
                    }`}
                >
                  {/* เปลี่ยนข้อความตามสถานะ */}
                  {isUnlocked ? "Open tool" : "Unlock Premium"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}