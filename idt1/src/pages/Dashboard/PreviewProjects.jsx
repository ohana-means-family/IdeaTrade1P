import { useNavigate } from "react-router-dom";

export default function PreviewProject() {
  const navigate = useNavigate();

  /* ===== USER ===== */
  const storedUser = localStorage.getItem("userProfile");
  const user = storedUser
    ? JSON.parse(storedUser)
    : { role: "guest", unlockedItems: [] };

  const unlocked = user.unlockedItems || [];

  /* ===== MIT PROJECT ===== */
  const mitProject = {
    id: "mit",
    name: "MIT",
    free: true,
    desc: "Mini Intelligent Trader (Demo Project)",
  };

  const openMIT = () => {
    const isUnlocked = mitProject.free || unlocked.includes("mit");

    if (!isUnlocked) {
      navigate("/member-register");
      return;
    }

    navigate("/tools/mit");
  };

  return (
    <div className="space-y-10">
      {/* Highlight */}
      <div className="w-full h-56 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 border border-sky-500/20" />

      {/* MIT Card */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-lg font-semibold mb-2">Project name</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <button className="w-full py-2 rounded-lg bg-sky-600">
                    Open tool
                  </button>
                </div>
              ))}
            </div>
    </div>
  );
}
