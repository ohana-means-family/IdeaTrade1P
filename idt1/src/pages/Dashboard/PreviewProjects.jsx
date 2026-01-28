import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mitIcon from "@/assets/icons/mit.svg";

/* =======================
   Project Data
======================= */
const projects = [
  {
    id: "stock-mover",
    name: "Stock Mover",
    desc: "ดูหุ้นที่มีการเคลื่อนไหวแรงแบบ Real-time",
    external: true,
    url: "https://stockmover.com",
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
    id: "fortune",
    name: "หมอดูหุ้น",
    desc: "Track smart money and institutional order flow.",
    premium: true,
  },
  {
    id: "petroleum",
    name: "Petroleum",
    desc: "Simulate portfolio risk under different market scenarios.",
    premium: true,
  },
  {
    id: "rubber",
    name: "Rubber Thai",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "flow",
    name: "Flow Intraday",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "s50",
    name: "S50",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "gold",
    name: "Gold",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "bidask",
    name: "BidAsk",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "tickmatch",
    name: "TickMatch",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
  {
    id: "dr",
    name: "DR",
    desc: "Build and backtest trading strategies without writing code.",
    premium: true,
  },
];

/* =======================
   Component
======================= */
export default function PreviewProjects() {
  const navigate = useNavigate();

  const [isMember, setIsMember] = useState(false);
  const [unlockedList, setUnlockedList] = useState([]);

  /* ===== Load user profile ===== */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("userProfile");
      if (!saved) return;

      const user = JSON.parse(saved);
      setIsMember(user.role === "member");
      setUnlockedList(user.unlockedItems || []);
    } catch (err) {
      console.error("Invalid userProfile", err);
    }
  }, []);

  /* ===== Permission Logic ===== */
  const canAccess = (project) =>
    !project.premium || isMember || unlockedList.includes(project.id);

  const handleOpenTool = (project) => {
    if (canAccess(project)) {
      alert(`Opening ${project.name}...`);
      // navigate(`/tools/${project.id}`);
    } else {
      navigate("/member-register");
    }
  };

  const handleOpenMIT = () => {
    navigate("/dashboard", {
      state: { goTo: "mit" },
    });
  };

  return (
    <div className="space-y-12">

      {/* ===== MIT SECTION ===== */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-6">
          Accessible Beta Tools
        </h1>

        <div className="bg-[#1f3446] rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <img
                src={mitIcon}
                alt="MIT"
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h2 className="text-xl font-semibold text-white">
                  MIT : Multi-Agent Intelligent Analyst
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl mt-1">
                  Multi-agent AI system that debates, validates risk,
                  and delivers objective trading insights.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenMIT}
              className="bg-sky-600 hover:bg-sky-500 px-5 py-2 rounded-full
                         text-white text-sm transition"
            >
              Open MIT
            </button>
          </div>
        </div>
      </section>

      {/* ===== OTHER PROJECTS ===== */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Other Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isUnlocked = canAccess(project);

            return (
              <div
                key={project.id}
                className="bg-[#3a3a3a] rounded-xl p-6 flex flex-col gap-4
                           border border-transparent hover:border-gray-500
                           transition duration-200"
              >
                {/* ===== Header ===== */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${
                        project.premium
                          ? "bg-[#cca300] border-2 border-[#b38f00] text-white"
                          : "bg-sky-600 text-white"
                      }`}
                  >
                    {project.external ? (
                    <span className="text-2xl font-bold">↗</span>
                  ) : project.premium ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-xl">🚀</span>
                  )}
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {project.name}
                    {project.premium && (
                      <span className="text-[#cca300] text-sm ml-2">
                        Premium
                      </span>
                    )}
                  </h3>
                </div>

                {/* ===== Description ===== */}
                <div className="flex-grow">
                  <p className="text-[#a0a0a0] text-sm leading-relaxed">
                    {project.desc}
                  </p>
                </div>

                {/* ===== Action Button ===== */}
                <button
                  onClick={() => {
                    if (project.external) {
                      window.open(project.url, "_blank");
                    } else {
                      handleOpenTool(project);
                    }
                  }}
                  className={`w-full mt-2 py-2.5 rounded-full font-semibold
                    transition shadow-md
                    ${
                      project.external
                        ? "bg-sky-600 hover:bg-sky-500 text-white"
                        : project.premium
                          ? isUnlocked
                            ? "bg-sky-600 hover:bg-sky-500 text-white"
                            : "bg-[#cca300] hover:bg-[#b38f00] text-white"
                          : "bg-sky-600 hover:bg-sky-500 text-white"
                    }`}
                >
                  {project.external
                    ? "OPEN EXTERNAL ↗"
                    : isUnlocked
                      ? "OPEN TOOL"
                      : "JOIN MEMBERSHIP"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
