import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

/* ─────────────────────────────────────────────
   🌊 WAVE GENERATOR
   Multi-sine + smooth noise (deterministic)
───────────────────────────────────────────── */
function seededRand(seed, i, salt = 0) {
  const x = Math.sin(seed * 9301 + i * 49297 + salt * 233) * 803.5453;
  return x - Math.floor(x); // 0..1
}

function smoothNoise(seed, i, scale = 4) {
  const i0 = Math.floor(i / scale) * scale;
  const i1 = i0 + scale;
  const t  = (i - i0) / scale;
  const s  = t * t * (3 - 2 * t); // smoothstep
  const a  = (seededRand(seed, i0) - 0.5) * 2;
  const b  = (seededRand(seed, i1) - 0.5) * 2;
  return a * (1 - s) + b * s;
}

function generateWave(cfg, n) {
  const { s, dr, ns, mn, mx, key } = cfg;
  const range  = mx - mn;
  const seed   = key.charCodeAt(0) * 137 + (key.charCodeAt(1) || 0) * 31;

  const data = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);

    // 📈 S-curve drift (ไม่ linear)
    const drift = dr * range * (1 / (1 + Math.exp(-8 * (t - 0.5))) - 0.5);

    // 🌊 Multi-sine harmonics
    const wave =
      Math.sin(t * Math.PI * 2.8  + seed * 0.017)        * range * 0.14
    + Math.sin(t * Math.PI * 5.9  + seed * 0.031) * 0.45 * range * 0.07
    + Math.sin(t * Math.PI * 13.1 + seed * 0.052) * 0.2  * range * 0.03;

    // 🔀 Smooth noise (ไม่กระตุก)
    const noise = smoothNoise(seed, i, 5) * ns;

    const val = Math.max(mn, Math.min(mx, s + drift + wave + noise));
    data.push({ i, v: +val.toFixed(4) });
  }
  return data;
}

/* ─────────────────────────────────────────────
   Gold COMEX wave (longer, uptrend)
───────────────────────────────────────────── */
function makeGold() {
  const n    = 62;
  const mn   = 2002;
  const mx   = 2095;
  const seed = 42;
  const data = [];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);

    // uptrend ชัดเจน
    const drift = (mx - mn) * 0.75 * (t * t * (3 - 2 * t));

    const wave =
      Math.sin(t * Math.PI * 3.1  + 0.9)        * 18
    + Math.sin(t * Math.PI * 7.4  + 1.7) * 0.4  * 9
    + Math.sin(t * Math.PI * 15.2 + 0.3) * 0.15 * 5;

    const noise = smoothNoise(seed, i, 4) * 5;

    const v = Math.max(mn, Math.min(mx, mn + drift + wave + noise));
    data.push({ i, v: +v.toFixed(2) });
  }
  return data;
}

const goldData = makeGold();

const MONTHS = ["Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

const CFG = [
  {key:"tr",  title:"Trends",  sub:"",             corr:null,    col:"#3b82f6", s:47,    dr:0.32, ns:1.4,  mn:44,   mx:65,    f:v=>(+v).toFixed(1), yt:[45,50,55,60,65],                yd:[43,67]   },
  {key:"vx",  title:"VIX",     sub:"Volatility",   corr:null,    col:"#eab308", s:15.8,  dr:0.20, ns:0.45, mn:6,    mx:16,    f:v=>(+v).toFixed(2), yt:[6,8,10,12,14,16],               yd:[5,17]    },
  {key:"dx",  title:"DXY",     sub:"Dollar Index", corr:"-0.85", col:"#a855f7", s:103.5, dr:0.22, ns:0.20, mn:100.5,mx:104.5, f:v=>(+v).toFixed(1), yt:[100.5,101.5,102.5,103.5,104.5], yd:[100,105] },
  {key:"us",  title:"US10YY",  sub:"10Y Yield",    corr:"-0.72", col:"#94a3b8", s:4.20,  dr:0.27, ns:0.03, mn:3.75, mx:4.22,  f:v=>(+v).toFixed(2), yt:[3.75,3.90,4.00,4.10,4.20],      yd:[3.7,4.25]},
];
const N = 50;

function monthTickFormatter(i) {
  const idx = Math.floor(i / 10);
  return MONTHS[idx] || "";
}

/* ─────────────────────────────────────────────
   append ใหม่: ต่อคลื่นเดิมอย่าง smooth
───────────────────────────────────────────── */
function appendPoint(arr, c) {
  const lv   = arr[arr.length - 1].v;
  const prev = arr[arr.length - 2]?.v ?? lv;
  const momentum = (lv - prev) * 0.55; // เก็บทิศทางเดิม 55%

  const seed  = c.key.charCodeAt(0) * 137;
  const noise = (seededRand(seed, arr.length, Date.now() % 1000) - 0.5) * c.ns;

  let nv = lv + momentum + noise;
  nv = Math.max(c.mn, Math.min(c.mx, nv));

  const next = [...arr.slice(1), { i: N - 1, v: +nv.toFixed(3) }];
  return next.map((p, idx) => ({ i: idx, v: p.v }));
}

const Tip = ({ active, payload, f }) =>
  active && payload?.length
    ? <div style={{ background:"rgba(8,12,24,0.97)", border:"1px solid rgba(120,150,255,0.15)", borderRadius:5, padding:"3px 9px", fontSize:10, color:"#b0c4de", fontFamily:"monospace" }}>
        {f ? f(payload[0].value) : payload[0].value}
      </div>
    : null;

/* ─ sub chart ─ */
function Sub({ c, data, h, animated }) {
  const gid = `g${c.key}`;
  return (
    <div style={{ flex:1, minWidth:0, background:"linear-gradient(150deg,#0e1522,#0b1019)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"8px 0 0 10px", overflow:"hidden", position:"relative", boxShadow:"0 2px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04)" }}>
      <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:`linear-gradient(90deg,transparent,${c.col}55,transparent)` }}/>
      <div style={{ fontSize:9, fontWeight:700, color:"#445566", letterSpacing:"0.08em", textTransform:"uppercase", paddingRight:10, marginBottom:1 }}>
        {c.title}{c.sub ? ` · ${c.sub}` : ""}{c.corr ? `  corr ${c.corr}` : ""}
      </div>
      <ResponsiveContainer width="100%" height={h}>
        <AreaChart data={data} margin={{ top:2, right:40, left:0, bottom:0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={c.col} stopOpacity="0.22"/>
              <stop offset="100%" stopColor={c.col} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical horizontal stroke="rgba(255,255,255,0.035)" strokeDasharray="0"/>
          <YAxis domain={c.yd} ticks={c.yt} orientation="right" tick={{ fontSize:8, fill:"#344560", fontFamily:"monospace" }} axisLine={false} tickLine={false} width={38} tickFormatter={v => c.f(v)}/>
          <XAxis dataKey="i" tick={{ fontSize:8, fill:"#344560", fontFamily:"monospace" }} axisLine={{ stroke:"rgba(255,255,255,0.04)" }} tickLine={false} height={14} ticks={[0,10,20,30,40,49]} tickFormatter={monthTickFormatter}/>
          <Tooltip content={<Tip f={c.f}/>}/>
          <Area type="monotone" dataKey="v" stroke={c.col} strokeWidth={1.8} fill={`url(#${gid})`} dot={false} isAnimationActive={!animated}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─ main ─ */
export default function App() {
  const [spot,  setSpot]  = useState(2034.50);
  const [flash, setFlash] = useState(false);
  const [animated, setAnimated] = useState(false); // true หลัง animate เข้ามาครั้งแรกแล้ว

  // ใช้ generateWave แทน init เดิม
  const [sd, setSd] = useState(() =>
    Object.fromEntries(CFG.map(c => [c.key, generateWave(c, N)]))
  );

  useEffect(() => {
    // หลัง animate เข้ามาครั้งแรก (recharts default duration ~1000ms) ให้ lock ไว้
    const t0 = setTimeout(() => setAnimated(true), 1200);

    const t = setInterval(() => {
      setSpot(p => {
        const n = +(p + (Math.random() - 0.46) * 1.1).toFixed(2);
        setFlash(true);
        setTimeout(() => setFlash(false), 280);
        return n;
      });
      setSd(prev => {
        const nx = {};
        CFG.forEach(c => { nx[c.key] = appendPoint(prev[c.key], c); });
        return nx;
      });
    }, 1800);
    return () => { clearTimeout(t0); clearInterval(t); };
  }, []);

  const diff    = +(spot - 2022.10).toFixed(2);
  const diffPct = +((diff / 2022.10) * 100).toFixed(1);
  const up      = diff >= 0;

  const tickers = [
    { label:"GOLD SPOT",         val:spot.toFixed(2), chg:`${up?"+":""}${diff} (${up?"+":""}${diffPct}%)`, up, gold:true, flash },
    { label:"GOLD THAI (96.5%)", val:"34,550",         chg:"+150",             up:true  },
    { label:"SILVER",            val:"22.85",          chg:"-0.121 (-0.5%)",   up:false },
    { label:"THB/USD",           val:"35.60",          chg:"-0.10 (Stronger)", up:false },
  ];

  return (
    <div style={{ width:"100%", height:"100vh", background:"#070c14", display:"flex", flexDirection:"column", fontFamily:"-apple-system,sans-serif", overflow:"hidden" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}`}</style>

      {/* NAV */}
      <div style={{ height:38, flexShrink:0, background:"rgba(9,13,24,0.97)", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", padding:"0 12px", gap:10 }}>
        <button style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, color:"#556070", fontSize:14, cursor:"pointer", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:6, padding:"0 10px", height:26 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#445566" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style={{ color:"#c0cfe0", fontSize:11, fontWeight:700, letterSpacing:"0.08em" }}>XAUUSD</span>
          <span style={{ color:"#445566", fontSize:9 }}>▾</span>
        </div>
        <div style={{ flex:1 }}/>
        <button style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.18)", borderRadius:6, color:"#fbbf24", fontSize:10, fontWeight:600, padding:"4px 11px", cursor:"pointer" }}>🔔 Alert</button>
      </div>

      {/* TICKER */}
      <div style={{ height:46, flexShrink:0, display:"flex", background:"rgba(7,11,20,0.99)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        {tickers.map((t, i) => (
          <div key={i} style={{ flex:1, padding:"5px 16px", borderRight:i<3?"1px solid rgba(255,255,255,0.04)":"none", textAlign:"right", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ fontSize:8, color:"#334455", letterSpacing:"0.09em", textTransform:"uppercase", fontWeight:600, marginBottom:2 }}>{t.label}</div>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"flex-end", gap:6 }}>
              <span style={{ fontSize:16, fontWeight:800, fontFamily:"monospace", letterSpacing:"-0.01em", color:t.gold?(t.flash?"#ffe066":"#fbbf24"):"#dde8f0", transition:"color .2s" }}>{t.val}</span>
              <span style={{ fontSize:9, fontFamily:"monospace", fontWeight:600, color:t.up?"#4ade80":"#f87171" }}>{t.chg}</span>
            </div>
          </div>
        ))}
      </div>

      {/* BODY */}
      <div style={{ flex:1, minHeight:0, display:"flex", flexDirection:"column", gap:5, padding:"6px 6px 6px" }}>

        {/* Gold COMEX */}
        <div style={{ flex:"2.2", minHeight:0, background:"linear-gradient(150deg,#0e1522,#0b1019)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"9px 0 0 11px", position:"relative", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.04)" }}>
          <div style={{ position:"absolute", top:0, left:"5%", right:"5%", height:1, background:"linear-gradient(90deg,transparent,rgba(34,197,94,0.45),transparent)" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingRight:11, marginBottom:2 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#dde4f0", letterSpacing:"0.02em" }}>Gold (COMEX)</div>
              <div style={{ fontSize:8, color:"#44536a", marginTop:1, textTransform:"uppercase", letterSpacing:"0.06em" }}>Futures Price Action</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:8, color:"#44536a", textTransform:"uppercase", letterSpacing:"0.07em" }}>Current</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#22c55e", fontFamily:"monospace", marginTop:1 }}>${goldData[goldData.length-1].v.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ position:"absolute", left:"50%", top:"55%", transform:"translate(-50%,-50%)", fontSize:56, fontWeight:900, color:"rgba(251,191,36,0.022)", letterSpacing:"0.3em", pointerEvents:"none", userSelect:"none" }}>GOLD</div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={goldData} margin={{ top:4, right:46, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.035)" vertical horizontal strokeDasharray="0"/>
              <YAxis domain={[1990,2110]} ticks={[2000,2020,2040,2060,2080,2100]} orientation="right" tick={{ fontSize:8, fill:"#344560", fontFamily:"monospace" }} axisLine={false} tickLine={false} width={42}/>
              <XAxis dataKey="i" tick={{ fontSize:8, fill:"#344560", fontFamily:"monospace" }} axisLine={{ stroke:"rgba(255,255,255,0.04)" }} tickLine={false} height={16} ticks={[0,10,20,30,40,50,61]} tickFormatter={i => MONTHS[Math.floor(i/10)] || ""}/>
              <Tooltip content={<Tip f={v => `$${v}`}/>}/>
              <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fill="url(#gg)" dot={false} isAnimationActive={!animated}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Row 2 */}
        <div style={{ flex:1, minHeight:0, display:"flex", gap:5 }}>
          <Sub c={CFG[0]} data={sd.tr} h="82%" animated={animated}/>
          <Sub c={CFG[1]} data={sd.vx} h="82%" animated={animated}/>
        </div>

        {/* Row 3 */}
        <div style={{ flex:1, minHeight:0, display:"flex", gap:5 }}>
          <Sub c={CFG[2]} data={sd.dx} h="82%" animated={animated}/>
          <Sub c={CFG[3]} data={sd.us} h="82%" animated={animated}/>
        </div>

      </div>
    </div>
  );
}