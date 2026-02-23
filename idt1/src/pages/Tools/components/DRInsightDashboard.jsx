import { useState, useEffect, useMemo } from "react";
// อัปเดต Import: เปลี่ยนจาก LineChart, Line เป็น AreaChart, Area
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

/* ── Wave Generator ── */
function seededRand(seed, i) {
  const x = Math.sin(seed * 9301 + i * 49297) * 803.5453;
  return x - Math.floor(x);
}
function smoothNoise(seed, i, scale = 4) {
  const i0 = Math.floor(i / scale) * scale;
  const t  = (i - i0) / scale;
  const s  = t * t * (3 - 2 * t);
  return (seededRand(seed, i0) - 0.5) * 2 * (1 - s) + (seededRand(seed, i0 + scale) - 0.5) * 2 * s;
}
function genWave({ seed, start, end, ns = 0.4, n = 40 }) {
  const range = Math.abs(end - start);
  const data = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const drift = (end - start) * (t * t * (3 - 2 * t));
    const wave  = Math.sin(t * Math.PI * 3.2 + seed * 0.02) * range * 0.12
                + Math.sin(t * Math.PI * 7.1 + seed * 0.04) * range * 0.06;
    const noise = smoothNoise(seed, i, 4) * ns * range;
    data.push({ i, v: +(start + drift + wave + noise).toFixed(2) });
  }
  return data;
}

/* ── Stock Configs ── */
const STOCKS = {
  USA: [
    { id: "AAPLBOX",  name: "Apple Inc.",  tv: "NASDAQ:AAPL", color: "#3b82f6", seed: 11,  start: 184.5, end: 189.5, ns: 0.3 },
    { id: "AMZNBOX",  name: "Amazon",      tv: "NASDAQ:AMZN", color: "#f59e0b", seed: 22,  start: 178,   end: 192,   ns: 0.5 },
    { id: "GOOGBOX",  name: "Alphabet",    tv: "NASDAQ:GOOG", color: "#10b981", seed: 33,  start: 140,   end: 155,   ns: 0.4 },
    { id: "TSLABOX",  name: "Tesla",       tv: "NASDAQ:TSLA", color: "#ef4444", seed: 44,  start: 220,   end: 195,   ns: 0.8 },
    { id: "MSFTBOX",  name: "Microsoft",   tv: "NASDAQ:MSFT", color: "#8b5cf6", seed: 55,  start: 375,   end: 395,   ns: 0.3 },
    { id: "NVDABOX",  name: "NVIDIA",      tv: "NASDAQ:NVDA", color: "#06b6d4", seed: 66,  start: 480,   end: 620,   ns: 0.9 },
    { id: "METABOX",  name: "Meta",        tv: "NASDAQ:META", color: "#f97316", seed: 77,  start: 350,   end: 490,   ns: 0.6 },
  ],
  Europe: [
    { id: "ASML01",   name: "ASML Holding",tv: "EURONEXT:ASML",color: "#3b82f6", seed: 156, start: 680, end: 720, ns: 0.4 },
    { id: "LVMH01",   name: "LVMH",        tv: "EURONEXT:MC",  color: "#f59e0b", seed: 167, start: 740, end: 695, ns: 0.5 },
  ],
  Asia: [
    { id: "BABA80",    name: "Alibaba Group",     tv: "HKEX:9988",    color: "#f59e0b", seed: 88,  start: 75,  end: 78,  ns: 0.4 },
    { id: "TENCENT80", name: "Tencent",           tv: "HKEX:700",     color: "#3b82f6", seed: 99,  start: 340, end: 370, ns: 0.3 },
    { id: "BYDCOMBO",  name: "BYD",               tv: "HKEX:1211",    color: "#10b981", seed: 101, start: 245, end: 230, ns: 0.5 },
    { id: "XIAOMIBO",  name: "Xiaomi",            tv: "HKEX:1810",    color: "#a855f7", seed: 112, start: 16,  end: 19,  ns: 0.35 },
    { id: "ETVFVND001",name: "Vietnam ETF (E1VF)",tv: "HOSE:E1VFVN30",color: "#06b6d4", seed: 123, start: 18,  end: 20,  ns: 0.3 },
    { id: "FUEVFVND01",name: "Vietnam ETF (FUEV)",tv: "HOSE:FUEVFVND",color: "#22c55e", seed: 134, start: 24,  end: 19,  ns: 0.4 },
    { id: "JAPAN13",   name: "Japan ETF",         tv: "HKEX:3160",    color: "#f43f5e", seed: 145, start: 8.5, end: 9.2, ns: 0.2 },
  ],
};

/* ── Tooltip ── */
const Tip = ({ active, payload }) =>
  active && payload?.length
    ? <div style={{ background:"rgba(8,12,22,0.96)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"3px 8px", fontSize:10, color:"#94a3b8", fontFamily:"monospace" }}>
        {(+payload[0].value).toFixed(2)}
      </div>
    : null;

/* ── Mini Chart ── */
function MiniChart({ stock, h = 140 }) {
  const [animated, setAnimated] = useState(false);
  const data = useMemo(() => genWave(stock), [stock.id]);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 1100);
    return () => clearTimeout(t);
  }, []);

  // สร้าง ID สำหรับสี Gradient ไม่ให้ซ้ำกัน
  const gradId = `color-${stock.id}`;

  return (
    <div style={{ background:"#0f1623", border:"1px solid rgba(255,255,255,0.07)", borderRadius:6, padding:"10px 0 0 10px", position:"relative", overflow:"hidden", flex:1, minHeight:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingRight:10, marginBottom:4 }}>
        <div>
          <span style={{ fontSize:11, fontWeight:700, color:"#dde4f0" }}>{stock.id}</span>
          <span style={{ fontSize:9, color:"#445566", marginLeft:6 }}>({stock.name})</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <button style={{ background:"none", border:"none", color:"#334455", cursor:"pointer", fontSize:13 }}>⛶</button>
          <button style={{ background:"none", border:"none", color:"#334455", cursor:"pointer", fontSize:13 }}>⚙</button>
        </div>
      </div>
      
      {/* ส่วนที่ปรับปรุง: ใช้ AreaChart และเพิ่ม <defs> */}
      <ResponsiveContainer width="100%" height={h}>
        <AreaChart data={data} margin={{ top:2, right:44, left:0, bottom:0 }}>
          
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              {/* ดึงสีมาจาก stock.color ของแต่ละกราฟ */}
              <stop offset="5%" stopColor={stock.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={stock.color} stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0"/>
          <YAxis domain={["auto","auto"]} orientation="right"
            tick={{ fontSize:8, fill:"#344560", fontFamily:"monospace" }}
            axisLine={false} tickLine={false} width={40}
            tickFormatter={v => v.toFixed(1)}/>
          <XAxis hide/>
          <Tooltip content={<Tip/>}/>
          
          {/* ใช้ Area แทน Line และเติมสี fill ด้วย url() อ้างอิง ID ของ Gradient */}
          <Area 
            type="monotone" 
            dataKey="v" 
            stroke={stock.color} 
            fill={`url(#${gradId})`} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={!animated}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Sidebar Panel ── */
function SidePanel({ title, stocks, selected, onSelect }) {
  const [filter, setFilter] = useState("");
  const filtered = stocks.filter(s =>
    s.id.toLowerCase().includes(filter.toLowerCase()) ||
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ background:"#0d1420", border:"1px solid rgba(255,255,255,0.07)", borderRadius:6, overflow:"hidden", display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 10px", background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#dde4f0", letterSpacing:"0.04em" }}>{title}</span>
        <button style={{ background:"none", border:"none", color:"#445566", cursor:"pointer", fontSize:12 }}>🌐</button>
      </div>
      <div style={{ padding:"5px 8px", borderBottom:"1px solid rgba(255,255,255,0.05)", flexShrink:0 }}>
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter..."
          style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:4, padding:"3px 8px", fontSize:9, color:"#8899aa", outline:"none", fontFamily:"monospace" }}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"4px 10px", borderBottom:"1px solid rgba(255,255,255,0.05)", flexShrink:0 }}>
        <span style={{ fontSize:8, color:"#334455", letterSpacing:"0.06em" }}>DR/DRx</span>
        <span style={{ fontSize:8, color:"#334455", letterSpacing:"0.06em" }}>TradingView</span>
      </div>
      <div style={{ overflowY:"auto", flex:1 }}>
        {filtered.map(s => (
          <div key={s.id} onClick={() => onSelect(s)}
            style={{
              display:"grid", gridTemplateColumns:"1fr 1fr",
              padding:"5px 10px", cursor:"pointer",
              background: selected?.id === s.id ? "rgba(255,255,255,0.06)" : "transparent",
              borderLeft: selected?.id === s.id ? `2px solid ${s.color}` : "2px solid transparent",
              transition:"background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = selected?.id === s.id ? "rgba(255,255,255,0.06)" : "transparent"}
          >
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:s.color, flexShrink:0 }}/>
              <span style={{ fontSize:9, color:"#9ab", fontFamily:"monospace", fontWeight:600 }}>{s.id}</span>
            </div>
            <span style={{ fontSize:9, color:"#445566", fontFamily:"monospace" }}>{s.tv}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Legend pill ── */
function LegendPill({ label, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"4px 14px" }}>
      <span style={{ fontSize:10, color:"#8899aa" }}>{label}</span>
      <div style={{ width:28, height:2, background:`linear-gradient(90deg, ${color}, ${color}88)`, borderRadius:2 }}/>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function StockDashboard() {
  // แต่ละ chart มี state แยกกัน
  const [chart1, setChart1] = useState(STOCKS.USA[0]);
  const [chart2, setChart2] = useState(STOCKS.Europe[0]);     // Europe แยก state
  const [chart3, setChart3] = useState(STOCKS.Asia[0]);

  return (
    <div style={{ width:"100%", height:"100%", background:"#080d18", display:"flex", flexDirection:"column", fontFamily:"'IBM Plex Mono', monospace", overflow:"hidden", color:"#c0cfe0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }
        input::placeholder { color:#334455; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ height:40, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"rgba(8,13,24,0.98)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 16px" }}>
        <LegendPill label="ราคาน้ำมัน" color="#3b82f6"/>
        <LegendPill label="PE Ratio"   color="#ef4444"/>
        <LegendPill label="Last"       color="#22c55e"/>
      </div>

      {/* BODY — 3 คอลัมน์ */}
      <div style={{ flex:1, minHeight:0, display:"grid", gridTemplateColumns:"200px 1fr 200px", gap:5, padding:"5px" }}>

        {/* COL 1: USA → chart1 | Europe → chart2 (แยกกัน) */}
        <div style={{ display:"flex", flexDirection:"column", gap:5, minHeight:0, overflow:"hidden" }}>
          <SidePanel title="USA"    stocks={STOCKS.USA}    selected={chart1} onSelect={setChart1}/>
          <SidePanel title="Europe" stocks={STOCKS.Europe} selected={chart2} onSelect={setChart2}/>
        </div>

        {/* COL 2: กราฟกลาง 3 ช่อง */}
        <div style={{ display:"flex", flexDirection:"column", gap:5, minHeight:0 }}>
          <MiniChart stock={chart1} h={130}/>
          <MiniChart stock={chart2} h={130}/>
          <MiniChart stock={chart3} h={130}/>
        </div>

        {/* COL 3: Asia บน → chart3 | Asia ล่าง → chart4 */}
        <div style={{ display:"flex", flexDirection:"column", gap:5, minHeight:0, overflow:"hidden" }}>
          <SidePanel title="Asia (CN/JP/SG/VN)" stocks={STOCKS.Asia} selected={chart3} onSelect={setChart3}/>
        </div>

      </div>
    </div>
  );
}