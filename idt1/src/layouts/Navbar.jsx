export default function Navbar({ activePage, setActivePage }) {
  const tabs = [
    { label: "Shortcuts", id: "whatsnew" },
    { label: "หมอดูหุ้น", id: "fortune" },
    { label: "Petroleum", id: "petroleum" },
    { label: "Rubber Thai", id: "rubber" },
    { label: "Flow Intraday", id: "flow" },
    { label: "S50", id: "s50" },
    { label: "Gold", id: "gold" },
    { label: "BidAsk", id: "bidask" },
    { label: "DR", id: "dr" },
  ];

  return (
    <div className="mb-10">
      <div className="flex gap-3 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activePage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium
                transition-colors duration-200
                ${
                  isActive
                    ? "bg-[#3B341B] text-[#FFCC00] border border-[#B6A700]/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
