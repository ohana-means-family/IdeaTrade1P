import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";

export default function Welcome() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-700">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800">

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">

          {/* LEFT */}
          <div className="flex flex-col justify-center items-start">
            <img src={logo} alt="Idea Trade" className="w-56 mb-6" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Special Features for our customers
            </h2>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-center text-white">
            {/* ✅ Gradient title */}
            <h2 className="text-3xl mb-8 font-semibold">
              <span className="gradient-text-primary">Welcome to Idea Trade</span>
            </h2>

            {/* Inputs */}
            <div className="space-y-6">
              {/* Email */}
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder=" "
                  className="peer w-full bg-transparent border border-gray-400 rounded-md px-4 py-3 text-white focus:border-purple-500 outline-none"
                />
                <label
                  className="
                    absolute left-4 top-3
                    px-2 py-0.5
                    rounded-full
                    text-xs text-purple-400
                    bg-slate-800
                    transition-all duration-200

                    peer-placeholder-shown:bg-transparent
                    peer-placeholder-shown:px-0
                    peer-placeholder-shown:text-sm
                    peer-placeholder-shown:text-gray-400

                    peer-focus:-top-3
                    peer-focus:px-2
                    peer-focus:bg-slate-800
                  "
                >
                  EMAIL
                </label>

              </div>

              {/* Password */}
              <div className="relative w-full">
                <input
                  type="password"
                  placeholder=" "
                  className="peer w-full bg-transparent border border-gray-400 rounded-md px-4 py-3 text-white focus:border-purple-500 outline-none"
                />
                  <label   
                    className="
                    absolute left-4 top-3
                    px-2 py-0.5
                    rounded-full
                    text-xs text-purple-400
                    bg-slate-800
                    transition-all duration-200

                    peer-placeholder-shown:bg-transparent
                    peer-placeholder-shown:px-0
                    peer-placeholder-shown:text-sm
                    peer-placeholder-shown:text-gray-400

                    peer-focus:-top-3
                    peer-focus:px-2
                    peer-focus:bg-slate-800
                  "
                  >
                    PASSWORD
                    </label>
                  </div>
                 </div>

            {/* Options */}
            <div className="flex justify-between items-center text-sm mt-6">
              <label className="flex items-center gap-2 text-gray-300">
                <input type="checkbox" />
                Remember me
              </label>

              {/* ✅ Gradient forgot link */}
              <button className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent hover:opacity-80 transition">
                Forgot your ID or password?
              </button>
            </div>

            {/* Sign in */}
            <button
              className="mt-10 mx-auto w-44 py-2.5 rounded-full
                bg-gradient-to-r from-purple-500 to-blue-500
                text-white hover:opacity-90 transition"
            >
              Sign in
            </button>

            <p className="text-center text-sm mt-4 text-gray-300">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-orange-400 cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-gray-100 py-6 flex flex-col items-center gap-4">
          <span className="text-sm text-gray-700 bg-gray-200 px-4 py-1 rounded-full">
            Disclaimer
          </span>

          <div className="flex gap-6">
            <button
              onClick={() => navigate("/dashboard?role=free")}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg"
            >
              TRY FREE VERSION
            </button>
            <button
              onClick={() => navigate("/membership")}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg"
            >
              MEMBERSHIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
