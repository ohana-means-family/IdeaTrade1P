import { useState, useEffect } from "react";

const generateData = (points, base, variance, trend = 0) => {
  const data = [];
  let val = base;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * variance + trend;
    data.push(parseFloat(val.toFixed(2)));
  }
  return data;
};

const priceData = generateData(20, 850, 5, 1.8);
const upStrengthData = generateData(20, 48, 4, 0.05);
const downStrengthData = generateData(20, 43, 5, 0);
const volumeFlowData = generateData(20, 100.5, 0.4, 0.1);
const midTrendData = generateData(20, 1398, 8, -0.5);

// Generate date labels: last 20 trading days going back from today
const generateDateLabels = (count) => {
  const labels = [];
  const now = new Date();
  let d = new Date(now);
  while (labels.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      const mon = d.toLocaleString("en", { month: "short" });
      const dt = d.getDate();
      labels.unshift(`${mon} ${dt}`);
    }
    d.setDate(d.getDate() - 1);
  }
  return labels;
};
const DATE_LABELS = generateDateLabels(20);

const LineChart = ({ data, color, data2, color2, min: minProp, max: maxProp, animated = true, decimals = 0 }) => {
  const [progress, setProgress] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) return;
    let start = null;
    const duration = 1200;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timer);
  }, []);

  const W = 620, H = 200;
  const pad = { top: 8, right: 58, bottom: 28, left: 8 };

  const allVals = data2 ? [...data, ...data2] : data;
  const minV = minProp ?? Math.min(...allVals) * 0.997;
  const maxV = maxProp ?? Math.max(...allVals) * 1.003;

  const xOf = (i, len) => pad.left + (i / (len - 1)) * (W - pad.left - pad.right);
  const yOf = (v) => pad.top + (1 - (v - minV) / (maxV - minV)) * (H - pad.top - pad.bottom);

  const toPath = (arr) => {
    const visibleCount = Math.max(1, Math.round(arr.length * progress));
    return arr.slice(0, visibleCount).map((v, i) =>
      `${i === 0 ? "M" : "L"}${xOf(i, arr.length)},${yOf(v)}`
    ).join(" ");
  };

  const toAreaPath = (arr) => {
    const visibleCount = Math.max(1, Math.round(arr.length * progress));
    const pts = arr.slice(0, visibleCount).map((v, i) => [xOf(i, arr.length), yOf(v)]);
    const bottom = H - pad.bottom;
    return `M${pts[0][0]},${bottom} ` + pts.map(([x, y]) => `L${x},${y}`).join(" ") + ` L${pts[pts.length-1][0]},${bottom} Z`;
  };

  const gradId = `grad-${color.replace("#", "")}`;

  // Y-axis ticks (5 levels)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = minV + (i / 4) * (maxV - minV);
    return { val, y: yOf(val) };
  }).reverse();

  // X-axis ticks: show every ~4 points
  const xTickIndices = [0, 4, 8, 12, 16, 19];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Y grid lines */}
      {yTicks.map(({ y }, i) => (
        <line key={i} x1={pad.left} x2={W - pad.right} y1={y} y2={y}
          stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
      ))}

      {/* Area + Line */}
      {!data2 && <path d={toAreaPath(data)} fill={`url(#${gradId})`} />}
      <path d={toPath(data)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data2 && <path d={toPath(data2)} fill="none" stroke={color2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

      {/* Y-axis labels (right side) */}
      {yTicks.map(({ val, y }, i) => (
        <text key={i} x={W - pad.right + 4} y={y + 4}
          fill="#6b7a90" fontSize="9" fontFamily="'Inter', sans-serif">
          {decimals > 0 ? val.toFixed(decimals) : Math.round(val)}
        </text>
      ))}

      {/* X-axis labels (bottom) */}
      {xTickIndices.map(idx => {
        if (idx >= DATE_LABELS.length) return null;
        const x = xOf(idx, data.length);
        const label = DATE_LABELS[idx];
        return (
          <text key={idx} x={x} y={H - 2}
            fill="#4a5568" fontSize="8" fontFamily="'Inter', sans-serif"
            textAnchor="middle">
            {label}
          </text>
        );
      })}
    </svg>
  );
};

const GridLines = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px"
  }} />
);

const Panel = ({ number, title, subtitle, children, badge }) => (
  <div style={{
    background: "linear-gradient(135deg, #0d1117 0%, #0a0e17 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
    padding: "12px 14px",
    position: "relative",
    overflow: "hidden",
    display: "flex", flexDirection: "column", gap: 6,
    height: "100%", boxSizing: "border-box"
  }}>
    <GridLines />
    <div style={{ display: "flex", alignItems: "center", gap: 8, zIndex: 1 }}>
      <span style={{ color: "#8892a4", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>{number}.</span>
      <span style={{ color: "#c9d1d9", fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{title}</span>
      {badge}
    </div>
    {subtitle && <div style={{ color: "#4a5568", fontSize: 10, fontFamily: "'Inter', sans-serif", zIndex: 1 }}>{subtitle}</div>}
    <div style={{ flex: 1, minHeight: 100, zIndex: 1, position: "relative" }}>{children}</div>
  </div>
);

const Pill = ({ label, value, color }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33`,
    borderRadius: 6, padding: "4px 12px", gap: 1
  }}>
    <span style={{ color: "#4a5568", fontSize: 9, fontFamily: "'Inter', sans-serif", letterSpacing: 1 }}>{label}</span>
    <span style={{ color, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{value}</span>
  </div>
);

export default function TradingDashboard() {
  const [activeTab, setActiveTab] = useState("Day");
  const tabs = ["15m", "1H", "Day", "Week"];

  return (
    <div style={{
      background: "#060a10",
      minHeight: "100vh",
      padding: 0,
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e2530; border-radius: 2px; }
        .tab-btn:hover { background: rgba(255,255,255,0.06) !important; }
        .close-btn:hover { background: rgba(255,255,255,0.05) !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .panel-anim { animation: fadeIn 0.6s ease forwards; height: 100%; }
        .panel-anim:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
        .panel-anim:nth-child(2) { animation-delay: 0.2s; opacity: 0; }
        .panel-anim:nth-child(3) { animation-delay: 0.3s; opacity: 0; }
        .panel-anim:nth-child(4) { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 1200,
        background: "#0a0e17",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
      }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px",
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          {/* Left: back + search */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="close-btn" style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, color: "#8892a4", width: 28, height: 28,
              cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center"
            }}>‹</button>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, padding: "5px 12px", minWidth: 180
            }}>
              <span style={{ color: "#4a5568", fontSize: 13 }}>🔍</span>
              <span style={{ color: "#e6edf3", fontSize: 13, fontWeight: 700 }}>S50H26</span>
              <span style={{ color: "#4a5568", fontSize: 11, marginLeft: 8 }}>▼</span>
            </div>
          </div>

          {/* Center: signal pills */}
          <div style={{ display: "flex", gap: 8 }}>
            <Pill label="SIGNAL" value="LONG ↑" color="#00d084" />
            <Pill label="TREND SCORE" value="8/10" color="#f0b429" />
            <Pill label="STATUS" value="CONFIRM" color="#00b4d8" />
          </div>

          {/* Right: tabs */}
          <div style={{
            display: "flex", gap: 2,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 6, padding: 3
          }}>
            {tabs.map(t => (
              <button key={t} className="tab-btn" onClick={() => setActiveTab(t)} style={{
                background: activeTab === t ? "rgba(255,255,255,0.1)" : "transparent",
                border: activeTab === t ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                borderRadius: 4, color: activeTab === t ? "#e6edf3" : "#4a5568",
                padding: "3px 10px", fontSize: 11, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                fontWeight: activeTab === t ? 700 : 400,
                transition: "all 0.15s"
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
          gap: 16, padding: "16px 16px 0 16px", height: 480
        }}>
          <div className="panel-anim">
            <Panel number="1" title="Last (SET50 Daily)" subtitle="Price Action & Moving Average">
              <LineChart data={priceData} color="#4c8ef7" />
            </Panel>
          </div>

          <div className="panel-anim">
            <Panel
              number="2" title="Confirm Up/Down S50"
              badge={
                <div style={{ fontSize: 9, color: "#4a5568", marginLeft: 4 }}>
                  <span style={{ color: "#00d084" }}>Green = Up Strength</span>
                  <span style={{ color: "#4a5568", margin: "0 4px" }}>vs</span>
                  <span style={{ color: "#e05c5c" }}>Red = Down Strength</span>
                </div>
              }
            >
              <LineChart data={upStrengthData} color="#00d084" data2={downStrengthData} color2="#e05c5c" />
            </Panel>
          </div>

          <div className="panel-anim">
            <Panel number="3" title="Trend (Volume Flow)" subtitle="Accumulation / Distribution">
              <LineChart data={volumeFlowData} color="#f0c040" decimals={1} />
            </Panel>
          </div>

          <div className="panel-anim">
            <Panel number="4" title="Mid-Trend (SET Context)" subtitle="Correlation with SET Index">
              <LineChart data={midTrendData} color="#d855f7" />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}