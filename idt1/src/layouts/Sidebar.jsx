import logo from "@/assets/images/logo.png";
import ToggleIcon from "@/assets/icons/Vector.svg";
import mitIcon from "@/assets/icons/elements.png";

export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
  projects,
  unlocked,
  openProject,
  menuIcons,
}) {
  if (collapsed) return null;

  return (
    <aside className="fixed top-0 left-0 z-40 w-72 h-screen bg-slate-900/70 border-r border-sky-400/20 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 flex justify-between">
        <img src={logo} alt="Idea Trade" className="w-40" />
        <button onClick={() => setCollapsed(true)}>
          <img src={ToggleIcon} className="w-4 h-4" />
        </button>
      </div>

      {/* Status */}
      <div className="px-6 py-4 flex gap-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-sky-600/20 text-sky-400">
          FREE ACCESS
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
          STATUS: ONLINE
        </span>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <input
          placeholder="Search Something..."
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none text-sm"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4 text-sm space-y-2 overflow-y-auto">
        <button
          onClick={() => setActivePage("whatsnew")}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg
          ${
            activePage === "whatsnew"
              ? "bg-sky-500/20 text-sky-300"
              : "hover:bg-white/5 text-gray-300"
          }`}
        >
          Preview Projects
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <div className="text-gray-400 uppercase text-xs mt-6 mb-2">
          Beta Tools
        </div>

        <button
          onClick={() => setActivePage("dashboard")}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg
          ${
            activePage === "dashboard"
              ? "bg-sky-500/20 text-sky-300"
              : "hover:bg-white/5 text-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <img src={mitIcon} className="w-5 h-5" />
            <span>MIT</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400 text-black">
            FREE
          </span>
        </button>

        <div className="text-gray-400 uppercase text-xs mt-6 mb-2">
          Premium Tools
        </div>

        {projects.filter(p => !p.free).map(project => (
          <button
            key={project.id}
            onClick={() => openProject(project)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-sky-400">
                {menuIcons[project.name]}
              </span>
              <span>{project.name}</span>
            </div>
            {!unlocked.includes(project.id) && <span>👑</span>}
          </button>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-sm text-gray-400">
        Upgrade to Pro
      </div>
    </aside>
  );
}
