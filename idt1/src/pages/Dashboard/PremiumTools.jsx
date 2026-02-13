// src/pages/dashboard/premiuntools.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToolsCard from "@/components/ToolsCard";

/* =======================
   Data Configuration
======================= */
const projects = [
  {
    id: "stock-mover",
    name: "Stock Mover",
    desc: "Real-time screener for stocks with high volatility and momentum.",
    external: true,
    url: "https://stockmover.com",
  },
  {
    id: "Project-Name",
    name: "Stock Screener", 
    desc: "Filter stocks utilizing advanced technical and fundamental indicators.",
    premium: false,
  },
  {
    id: "Project-Name-2",
    name: "Trend Hunter", 
    desc: "Identify emerging market trends before they become obvious to the crowd.",
    premium: false,
  },
  {
    id: "fortune",
    name: "Stock Fortune", // หรือ Market Oracle
    desc: "Probabilistic market forecasting based on sentiment and historical data.",
    premium: true,
  },
  {
    id: "petroleum",
    name: "Petroleum",
    desc: "Global crude oil insights, supply chain analysis, and energy sector trends.",
    premium: true,
  },
  {
    id: "rubber",
    name: "Rubber Thai",
    desc: "Comprehensive data on Thai rubber exports, futures, and agricultural indices.",
    premium: true,
  },
  {
    id: "flow",
    name: "Flow Intraday",
    desc: "Monitor real-time institutional fund flow and sector rotation throughout the day.",
    premium: true,
  },
  {
    id: "s50",
    name: "S50",
    desc: "In-depth analytics for SET50 Index Futures, basis, and volatility monitoring.",
    premium: true,
  },
  {
    id: "gold",
    name: "Gold",
    desc: "Live spot gold tracking correlated with currency exchange rates and macro data.",
    premium: true,
  },
  {
    id: "bidask",
    name: "BidAsk Analysis",
    desc: "Visualize buy/sell pressure and detect hidden liquidity walls in the order book.",
    premium: true,
  },
  {
    id: "tickmatch",
    name: "TickMatch",
    desc: "Analyze trade-by-trade execution to spot aggressive large-volume transactions.",
    premium: true,
  },
  {
    id: "dr",
    name: "DR (Global)",
    desc: "Track Depositary Receipts movements to access global markets via local exchange.",
    premium: true,
  },
];

export default function PremiumTools() {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [unlockedList, setUnlockedList] = useState([]);
  const premiumTools = projects.filter((tool) => tool.premium);

  /* ===== Load user profile ===== */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("userProfile");
      if (!savedUser) return;

      const user = JSON.parse(savedUser);
      setIsMember(user.role === "member");
      setUnlockedList(user.unlockedItems || []);
    } catch (err) {
      console.error("Error loading user profile", err);
    }
  }, []);

  return (
    <div className="w-full">
      {/* ===== Header Section ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Membership Tools
          </h1>
          <p className="text-gray-400 text-sm max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <button
          onClick={() => navigate("/member-register")}
          className="bg-[#0099ff] hover:bg-[#007acc] text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg whitespace-nowrap"
        >
          Upgrade subscription
        </button>
      </div>

      {/* ===== Grid Section (ใช้ ToolsCard) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumTools.map((tool) => (
          <ToolsCard
            key={tool.id}
            project={tool}
            isMember={isMember}
            unlockedList={unlockedList}
          />
        ))}
      </div>
    </div>
  );
}
