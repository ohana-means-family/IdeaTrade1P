import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";

export default function Welcome() {
  const navigate = useNavigate();
  const [openForgot, setOpenForgot] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-700">
      {/* Card */}
      <div className="w-full max-w-6xl rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">

        {/* Top content */}
        <div className="grid grid-cols-1 md:grid-cols-2 px-16 py-14 gap-16">

          {/* LEFT */}
          <div className="flex flex-col items-center justify-center text-center h-full">
            <h2 className="text-4xl font-semibold text-blue-400 mb-6">
              Welcome to
            </h2>

            <img src={logo} alt="Idea Trade" className="w-72 mb-6" />

            <p className="text-2xl text-blue-400 font-semibold">
              Special Features for our customers
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-center gap-5 text-white">
            {/* Email */}
            <div className="relative w-full">
            <input
              type="email"
              placeholder=" "
              className="
                peer
                w-full
                bg-transparent
                border border-blue-300/40
                rounded-md
                px-4 py-3
                text-white
                focus:border-blue-500
                outline-none
              "
            />

            <label
              className="
                absolute left-4 top-3
                px-2 py-0.5
                rounded-full
                text-sm text-blue-300
                transition-all duration-200
                bg-transparent

                peer-focus:-top-3
                peer-focus:text-xs
                peer-focus:text-sky-400
                peer-focus:bg-slate-800

                peer-not-placeholder-shown:-top-3
                peer-not-placeholder-shown:text-xs
                peer-not-placeholder-shown:text-sky-400
                peer-not-placeholder-shown:bg-slate-800
              "
            >
              EMAIL
            </label>
          </div>

            {/* Options */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <span
                onClick={() => setOpenForgot(true)}
                className="text-white cursor-pointer hover:underline"
              >
                Forgot password
              </span>
            </div>

            {/* Sign in */}
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-2 py-3 rounded-lg bg-sky-600 text-lg font-semibold"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="flex-1 h-px bg-white/20" />
              OR
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Gmail */}
            <button className="py-3 rounded-lg bg-white/10 text-gray-300">
              Sign in with Gmail
            </button>

            <p className="text-sm text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-white cursor-pointer"
              >
                Sign up here
              </span>
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-700/50 px-16 py-10 flex flex-col md:flex-row gap-8 justify-between">
          <button className="flex-1 py-5 rounded-xl bg-emerald-400 text-white text-xl font-semibold">
            🚀 TRY FREE VERSION
          </button>

          <button className="flex-1 py-5 rounded-xl bg-sky-600 text-white text-xl font-semibold">
            ⚪ JOIN MEMBERSHIP
          </button>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      {openForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenForgot(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md rounded-2xl
                          bg-slate-800 text-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-2">
              Forgot Password
            </h3>

            <p className="text-sm text-gray-300 mb-5">
              ระบบกู้คืนรหัสผ่านจะเปิดให้ใช้งานเร็ว ๆ นี้  
              กรุณาติดต่อผู้ดูแลระบบ
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setOpenForgot(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
