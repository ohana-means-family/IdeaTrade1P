import { useState, useEffect, useRef } from "react";

const initialOrderBook = {
  bids: [
    { price: 72.00, vol: 382581 },
    { price: 71.75, vol: 436930 },
    { price: 71.50, vol: 304457 },
    { price: 71.25, vol: 249877 },
    { price: 71.00, vol: 328003 },
    { price: 70.75, vol: 194639 },
    { price: 70.50, vol: 398519 },
    { price: 70.25, vol: 224291 },
    { price: 70.00, vol: 425270 },
    { price: 69.75, vol: 277400 },
  ],
  asks: [
    { price: 72.25, vol: 256749 },
    { price: 72.00, vol: 404759 },
    { price: 71.75, vol: 494763 },
    { price: 71.50, vol: 178279 },
    { price: 71.25, vol: 497474 },
    { price: 71.00, vol: 304515 },
    { price: 70.75, vol: 6120 },
    { price: 70.50, vol: 439536 },
    { price: 70.25, vol: 202477 },
    { price: 70.00, vol: 314814 },
  ],
};

const initialOrderBook2 = {
  bids: [
    { price: 34.00, vol: 382581 },
    { price: 34.00, vol: 436930 },
    { price: 71.50, vol: 304457 },
    { price: 71.25, vol: 249877 },
    { price: 71.00, vol: 328003 },
    { price: 70.75, vol: 194639 },
    { price: 70.50, vol: 398519 },
    { price: 70.25, vol: 224291 },
    { price: 70.00, vol: 425270 },
    { price: 69.75, vol: 277400 },
  ],
  asks: [
    { price: 34.25, vol: 256749 },
    { price: 34.00, vol: 404759 },
    { price: 71.75, vol: 494763 },
    { price: 71.50, vol: 178279 },
    { price: 71.25, vol: 497474 },
    { price: 71.00, vol: 304515 },
    { price: 70.75, vol: 6120 },
    { price: 70.50, vol: 439536 },
    { price: 70.25, vol: 202477 },
    { price: 70.00, vol: 314814 },
  ],
};

const formatVol = (v) => v.toLocaleString();

const BAR_MAX = 500000;

function OrderBookPanel({
  symbol,
  date,
  speed,
  start,
  end,
  book,
  time,
  sliderVal,
  onSliderChange,
  sliderClass,
  inRange,
  actual,
}) {
  const maxBidVol = Math.max(...book.bids.map((b) => b.vol));
  const maxAskVol = Math.max(...book.asks.map((a) => a.vol));
  const totalBid = book.bids.reduce((s, b) => s + b.vol, 0);
  const totalAsk = book.asks.reduce((s, a) => s + a.vol, 0);

  return (
    <div style={styles.panel}>
      {/* Header Controls */}
      <div style={styles.controlRow}>
        <div style={styles.field}>
          <label style={styles.label}>Symbol *</label>
          <input style={styles.input} defaultValue={symbol} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Date</label>
          <input style={styles.input} defaultValue={date} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Speed</label>
          <input style={styles.input} defaultValue={speed} />
        </div>
      </div>
      <div style={styles.controlRow2}>
        <div style={styles.field}>
          <label style={styles.label}>Start</label>
          <input style={styles.input} defaultValue={start} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>End</label>
          <input style={styles.input} defaultValue={end} />
        </div>
        <button style={styles.searchBtn}>SEARCH</button>
      </div>

      {/* Time Display */}
      <div style={styles.timeDisplay}>{time}</div>

      {/* Order Book Table */}
      <div style={styles.tableWrap}>
        <div style={styles.tableHeader}>
          <span style={{ flex: 1, textAlign: "right" }}>Vol BID</span>
          <span style={{ width: 70, textAlign: "center" }}>BID</span>
          <span style={{ width: 70, textAlign: "center" }}>ASK</span>
          <span style={{ flex: 1, textAlign: "left" }}>Vol ASK</span>
        </div>

        {book.bids.map((bid, i) => {
          const ask = book.asks[i];
          const bidPct = (bid.vol / BAR_MAX) * 100;
          const askPct = (ask.vol / BAR_MAX) * 100;
          const isTopBid = i === 0;
          const isTopAsk = i === 0;

          return (
            <div key={i} style={styles.row}>
              {/* BID side */}
              <div style={styles.bidCell}>
                <div
                  style={{
                    ...styles.bidBar,
                    width: `${Math.min(bidPct, 100)}%`,
                    background: i % 2 === 0 ? "#1a3a5c" : "#14304d",
                  }}
                />
                <span style={styles.volText}>{formatVol(bid.vol)}</span>
              </div>
              <span style={{ ...styles.priceText, color: "#4caf78", width: 70, textAlign: "center" }}>
                {bid.price.toFixed(2)}
              </span>
              <span style={{ ...styles.priceText, color: "#e05a3a", width: 70, textAlign: "center" }}>
                {ask.price.toFixed(2)}
              </span>
              {/* ASK side */}
              <div style={styles.askCell}>
                <span style={styles.volText}>{formatVol(ask.vol)}</span>
                <div
                  style={{
                    ...styles.askBar,
                    width: `${Math.min(askPct, 100)}%`,
                    background: i % 2 === 0 ? "#4a1a0e" : "#3d1509",
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Totals */}
        <div style={styles.totalsRow}>
          <span style={{ flex: 1, textAlign: "right", color: "#ccc", fontSize: 12 }}>
            Total: {(totalBid / 1000000).toFixed(1)}M
          </span>
          <span style={{ width: 140 }} />
          <span style={{ flex: 1, textAlign: "left", color: "#ccc", fontSize: 12 }}>
            Total: {(totalAsk / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>

      {/* Chart area placeholder */}
      <div style={styles.chartArea} />

      {/* Slider */}
      <div style={styles.sliderWrap}>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderVal}
          onChange={(e) => onSliderChange(Number(e.target.value))}
          className={sliderClass}
        />
      </div>

      {/* Footer Stats */}
      <div style={styles.footerRow}>
        <div style={styles.footerGroup}>
          <span style={styles.footerLabel}>In Range</span>
          <div style={styles.footerStats}>
            {["OPEN", "HIGH", "LOW", "CLOSE"].map((k, i) => (
              <div key={k} style={styles.footerStat}>
                <span style={styles.footerKey}>{k}</span>
                <span style={styles.footerVal}>{inRange[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.footerGroup}>
          <span style={styles.footerLabel}>Actual</span>
          <div style={styles.footerStats}>
            {["OPEN", "HIGH", "LOW", "CLOSE"].map((k, i) => (
              <div key={k} style={styles.footerStat}>
                <span style={styles.footerKey}>{k}</span>
                <span style={styles.footerVal}>{actual[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BidAskReplay() {
  const [time, setTime] = useState("10:15:32");
  const [slider1, setSlider1] = useState(20);
  const [slider2, setSlider2] = useState(20);

  // Animate time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        const [h, m, s] = prev.split(":").map(Number);
        let ns = s + 1, nm = m, nh = h;
        if (ns >= 60) { ns = 0; nm++; }
        if (nm >= 60) { nm = 0; nh++; }
        return `${String(nh).padStart(2,"0")}:${String(nm).padStart(2,"0")}:${String(ns).padStart(2,"0")}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.root}>
      <style>{`
        html, body { margin: 0; padding: 0; background: #1a1d23; }
        * { box-sizing: border-box; }
        .bid-ask-inner {
          zoom: 0.72;
        }
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        input[type=range].slider1 {
          background: linear-gradient(to right, #f0c040 0%, #f0c040 ${slider1}%, #444 ${slider1}%, #444 100%);
        }
        input[type=range].slider2 {
          background: linear-gradient(to right, #f0c040 0%, #f0c040 ${slider2}%, #444 ${slider2}%, #444 100%);
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f0c040;
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f0c040;
          border: none;
        }
      `}</style>
      <div className="bid-ask-inner">

      {/* Title Bar */}
      <div style={styles.titleBar}>
        <div style={styles.titleLeft}>
          <span style={styles.titleIcon}>≡</span>
          <span style={styles.titleText}>BidAsk Replay</span>
        </div>
        <button style={styles.syncBtn}>⟳ Sync Panels</button>
      </div>

      {/* Two Panels */}
      <div style={styles.panels}>
        <OrderBookPanel
          symbol="DELTA"
          date="21/01/2026"
          speed="1"
          start="10:00"
          end="16:30"
          book={initialOrderBook}
          time={time}
          sliderVal={slider1}
          onSliderChange={setSlider1}
          sliderClass="slider1"
          inRange={["71.00", "73.50", "70.75", "72.25"]}
          actual={["71.00", "73.50", "70.75", "--"]}
        />
        <OrderBookPanel
          symbol="PTT"
          date="25/01/2026"
          speed="1"
          start="10:00"
          end="16:30"
          book={initialOrderBook2}
          time={time}
          sliderVal={slider2}
          onSliderChange={setSlider2}
          sliderClass="slider2"
          inRange={["34.50", "35.00", "34.25", "34.75"]}
          actual={["34.50", "35.00", "34.25", "--"]}
        />
      </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    background: "#1a1d23",
    minHeight: "100vh",
    fontFamily: "'Consolas', 'Courier New', monospace",
    color: "#ccc",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  titleBar: {
    background: "#13161b",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    borderBottom: "1px solid #2a2e36",
  },
  titleLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  titleIcon: {
    fontSize: 18,
    color: "#888",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e0e0e0",
    letterSpacing: 0.5,
  },
  syncBtn: {
    background: "#2a2e38",
    border: "1px solid #3a3e48",
    color: "#aaa",
    padding: "4px 12px",
    borderRadius: 4,
    fontSize: 12,
    cursor: "pointer",
  },
  panels: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    flex: 1,
    padding: 8,
  },
  panel: {
    background: "#1e2128",
    border: "1px solid #2a2e36",
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    padding: 10,
    gap: 6,
  },
  controlRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 6,
    alignItems: "flex-end",
  },
  controlRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 6,
    alignItems: "flex-end",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  label: {
    fontSize: 10,
    color: "#888",
    letterSpacing: 0.5,
  },
  input: {
    background: "#13161b",
    border: "1px solid #2e3240",
    borderRadius: 3,
    color: "#e0e0e0",
    padding: "4px 8px",
    fontSize: 12,
    outline: "none",
    width: "100%",
  },
  searchBtn: {
    background: "#4a6cf7",
    color: "#fff",
    border: "none",
    borderRadius: 3,
    padding: "6px 8px",
    fontSize: 12,
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: 1,
    alignSelf: "flex-end",
    width: "100%",
  },
  timeDisplay: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#f0c040",
    padding: "6px 0",
    letterSpacing: 2,
    fontFamily: "'Consolas', monospace",
  },
  tableWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    fontSize: 11,
    color: "#888",
    padding: "2px 0",
    borderBottom: "1px solid #2a2e36",
    marginBottom: 2,
  },
  row: {
    display: "flex",
    alignItems: "center",
    height: 22,
    position: "relative",
  },
  bidCell: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
    height: "100%",
    overflow: "hidden",
  },
  bidBar: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    opacity: 0.9,
    transition: "width 0.3s",
  },
  askCell: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    height: "100%",
    overflow: "hidden",
  },
  askBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    opacity: 0.9,
    transition: "width 0.3s",
  },
  volText: {
    fontSize: 11,
    color: "#c0c4cc",
    position: "relative",
    zIndex: 1,
    padding: "0 4px",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
    position: "relative",
    zIndex: 1,
  },
  totalsRow: {
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    padding: "4px 0",
    borderTop: "1px solid #2a2e36",
    marginTop: 2,
    color: "#888",
  },
  chartArea: {
    height: 80,
    background: "#13161b",
    borderRadius: 3,
    border: "1px solid #2a2e36",
  },
  sliderWrap: {
    padding: "4px 2px",
  },
  slider: {
    width: "100%",
  },
  footerRow: {
    display: "flex",
    gap: 8,
  },
  footerGroup: {
    flex: 1,
    background: "#13161b",
    border: "1px solid #2a2e36",
    borderRadius: 3,
    padding: "4px 8px",
  },
  footerLabel: {
    fontSize: 10,
    color: "#666",
    display: "block",
    marginBottom: 4,
  },
  footerStats: {
    display: "flex",
    justifyContent: "space-between",
  },
  footerStat: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  footerKey: {
    fontSize: 9,
    color: "#666",
    letterSpacing: 0.5,
  },
  footerVal: {
    fontSize: 12,
    color: "#e0e0e0",
    fontWeight: "bold",
  },
};