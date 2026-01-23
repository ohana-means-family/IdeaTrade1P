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
  {
    id: "external-ai",
    name: "External AI Tool",
    desc: "Open external AI analytics platform.",
    premium: false,
    external: true,
    url: "https://external-site.com",
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
    if (isMember) {
      alert("Opening MIT...");
    } else {
      navigate("/member-register");
    }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isUnlocked = canAccess(project);

            return (
              <div
                key={project.id}
                className="bg-[#3f3f3f] rounded-2xl p-6
                           flex flex-col gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      project.premium
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-slate-600 text-white"
                    }`}
                >
                  {project.external ? "↗" : project.premium ? "⭐" : "🚀"}
                </div>

                <h3 className="text-white font-semibold">
                  {project.name}
                  {project.premium && (
                    <span className="text-yellow-400 text-sm">
                      {" "}
                      (Premium)
                    </span>
                  )}
                </h3>

                <p className="text-sm text-slate-300">
                  {project.desc}
                </p>

                <button
                  onClick={() => {
                    if (project.external) {
                      window.open(project.url, "_blank");
                    } else {
                      handleOpenTool(project);
                    }
                  }}
                  className={`mt-auto rounded-full py-2 text-sm font-medium
                              flex items-center justify-center gap-2 transition
                    ${
                      project.external
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : project.premium
                          ? isUnlocked
                            ? "bg-sky-600 hover:bg-sky-500 text-white"
                            : "bg-yellow-500/80 hover:bg-yellow-400 text-black"
                          : "bg-sky-600 hover:bg-sky-500 text-white"
                    }`}
                >
                  {project.external
                    ? "Open External"
                    : isUnlocked
                      ? "Open tool"
                      : "Unlock Premium"}
                  {project.external && <span className="text-xs">↗</span>}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
