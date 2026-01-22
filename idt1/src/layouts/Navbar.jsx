export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = ["Shortcuts", "MIT", "Stock Mover", "Project Name"];

  return (
    <div className="mb-10">
      <div className="flex gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm transition
                ${
                  isActive
                    ? "bg-sky-600/30 text-sky-300"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
