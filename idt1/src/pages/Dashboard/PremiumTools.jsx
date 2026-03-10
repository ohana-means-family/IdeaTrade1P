import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToolsCard from "@/components/toolscard.jsx"; // ตรวจสอบชื่อไฟล์ให้ตรงกับ components ของคุณ

import { auth, db } from "@/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/* =======================
   Data Configuration
======================= */
const projects = [
  { id: "stock-mover", name: "Stock Mover", desc: "Real-time screener for stocks with high volatility and momentum.", external: true, url: "https://stockmover.com" },
  { id: "Project-Name", name: "Stock Screener", desc: "Filter stocks utilizing advanced technical and fundamental indicators.", premium: false },
  { id: "Project-Name-2", name: "Trend Hunter", desc: "Identify emerging market trends before they become obvious to the crowd.", premium: false },
  { id: "fortune", name: "Stock Fortune", desc: "Probabilistic market forecasting based on sentiment and historical data.", premium: true },
  { id: "petroleum", name: "Petroleum", desc: "Global crude oil insights, supply chain analysis, and energy sector trends.", premium: true },
  { id: "rubber", name: "Rubber Thai", desc: "Comprehensive data on Thai rubber exports, futures, and agricultural indices.", premium: true },
  { id: "flow", name: "Flow Intraday", desc: "Monitor real-time institutional fund flow and sector rotation throughout the day.", premium: true },
  { id: "s50", name: "S50", desc: "In-depth analytics for SET50 Index Futures, basis, and volatility monitoring.", premium: true },
  { id: "gold", name: "Gold", desc: "Live spot gold tracking correlated with currency exchange rates and macro data.", premium: true },
  { id: "bidask", name: "BidAsk Analysis", desc: "Visualize buy/sell pressure and detect hidden liquidity walls in the order book.", premium: true },
  { id: "tickmatch", name: "TickMatch", desc: "Analyze trade-by-trade execution to spot aggressive large-volume transactions.", premium: true },
  { id: "dr", name: "DR (Global)", desc: "Track Depositary Receipts movements to access global markets via local exchange.", premium: true },
];

export default function PremiumTools() {
  const navigate = useNavigate();
  const [unlockedList, setUnlockedList] = useState([]);
  
  // กรองเฉพาะเครื่องมือที่เป็น Premium เพื่อแสดงในหน้านี้
  const premiumTools = projects.filter((tool) => tool.premium);

  /* ===== Load user profile & Check Subscriptions ===== */
  useEffect(() => {
    /**
     * 🔥 ลอจิกสำคัญ: กรอง ID ของเครื่องมือที่ "ยังไม่หมดอายุ" เท่านั้น
     */
    const getActiveToolIds = (userData) => {
      const now = new Date();
      const activeIds = [];

      // 1. ตรวจสอบจาก Object "subscriptions" (โครงสร้าง: { toolId: timestamp })
      if (userData.subscriptions) {
        Object.entries(userData.subscriptions).forEach(([toolId, expTimestamp]) => {
          // รองรับทั้ง Firestore Timestamp (.toDate()) และ ISO String
          const expDate = expTimestamp?.toDate ? expTimestamp.toDate() : new Date(expTimestamp);
          
          // ถ้าเวลาปัจจุบันยังไม่ถึงเวลาหมดอายุ (ยังมีสิทธิ์ใช้งาน)
          if (expDate > now) {
            activeIds.push(toolId);
          }
        });
      }

      // 2. ตรวจสอบจาก "unlockedItems" (กรณีแอดมินปลดล็อกให้ถาวร)
      if (Array.isArray(userData.unlockedItems)) {
        userData.unlockedItems.forEach(id => activeIds.push(id));
      }
      
      return [...new Set(activeIds)]; // คืนค่าเฉพาะ ID ที่ไม่ซ้ำกัน
    };

    const processUserData = (userData) => {
      const validUnlocked = getActiveToolIds(userData);
      setUnlockedList(validUnlocked);
    };

    const loadDemoProfile = () => {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        processUserData(JSON.parse(saved));
      } else {
        setUnlockedList([]);
      }
    };

    // ติดตามสถานะ Login และดึงข้อมูลจริงจาก Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            processUserData(data);
            // อัปเดต LocalStorage สำรองไว้เพื่อให้ Sidebar Tab อื่นๆ เห็นด้วย
            localStorage.setItem("userProfile", JSON.stringify(data));
          }
        } catch (err) {
          console.error("Error fetching Firestore:", err);
          loadDemoProfile();
        }
      } else {
        loadDemoProfile();
      }
    });

    // ดักจับการเปลี่ยนแปลงจากหน้าอื่นๆ
    window.addEventListener("storage", loadDemoProfile);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", loadDemoProfile);
    };
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
            Exclusive premium analytics tools for professional traders. Access real-time data, 
            institutional flows, and advanced market insights tailored to your subscription.
          </p>
        </div>

        <button
          onClick={() => navigate("/member-register")}
          className="bg-[#0099ff] hover:bg-[#007acc] text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg whitespace-nowrap"
        >
          Upgrade subscription
        </button>
      </div>

      {/* ===== Grid Section ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumTools.map((tool) => {
          // 🔥 ตรวจสอบว่า ID ของ Tool นี้อยู่ในรายการที่ "ยังไม่หมดอายุ" หรือไม่
          const hasAccess = unlockedList.includes(tool.id);

          return (
            <ToolsCard
              key={tool.id}
              project={tool}
              // ✅ ส่งสถานะ "เข้าถึงได้จริง" ไปที่ Card เพื่อเปลี่ยนสีการ์ด (ทอง/เทา)
              isMember={hasAccess} 
              unlockedList={unlockedList}
            />
          );
        })}
      </div>
    </div>
  );
}