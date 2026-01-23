import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import googleIcon from "@/assets/icons/google.png";
import Rocket from "@/assets/icons/rocket-lunch 1.svg";
import Crown from "@/assets/icons/crown 1.svg";

export default function Welcome() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
    const [popupType, setPopupType] = useState(""); 
    const [openError, setOpenError] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

   const setFreeAccess = () => {
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        role: "free",
        unlockedItems: [],
      })
    );
    navigate("/dashboard");
  };

  const setMembership = () => {
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        role: "member",
        unlockedItems: [],
      })
    );
    navigate("/member-register");
  };

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;
    console.log("Google User:", user);

    // 👉 ล็อกอินสำเร็จ พาไป dashboard
    navigate("/dashboard");
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Google Sign-In failed");
  }
};

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="peer w-full bg-transparent border border-blue-300/40
                      rounded-md px-4 py-3 text-white
                      focus:border-blue-500 outline-none"
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
                <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
                Remember me
              </label>
            </div>

            {/* Sign in */}
            <button
              onClick={() => {
                if (!email) {
                  setPopupType("emailRequired");
                  setOpenForgot(true);
                  return;
                }

                onClick={setFreeAccess}
              }}
              className="mt-2 py-3 rounded-lg bg-sky-600 text-lg font-semibold"
            >
              Sign in
            </button>

            {/* Divider */}
            {/* <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="flex-1 h-px bg-white/20" />
              OR
              <div className="flex-1 h-px bg-white/20" />
            </div> */}

            {/* Google */}
            {/* <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3
                        py-3 rounded-lg
                        bg-white text-gray-800
                        hover:bg-gray-100
                        transition font-medium"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button> */}

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
  <button
    onClick={setFreeAccess}
    className="flex-1 py-5 rounded-xl bg-emerald-400 text-white text-xl font-semibold
               flex items-center justify-center gap-3"
  >
    <img src={Rocket} alt="rocket" className="w-6 h-6" />
    TRY FREE VERSION
  </button>

  <button
    onClick={setMembership}
    className="flex-1 py-5 rounded-xl bg-sky-600 text-white text-xl font-semibold
               flex items-center justify-center gap-3"
  >
    <img src={Crown} alt="crown" className="w-6 h-6" />
    JOIN MEMBERSHIP
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

      {popupType === "forgot" && (
        <>
          <h3 className="text-xl font-semibold mb-2">
            Forget your ID or password?
          </h3>

          {/* <p className="text-sm text-gray-300 mb-5">
            <br />
            Your ID is:{" "}
            <span className="font-semibold text-sky-600">
              your Email address.
            </span>
            <br />
            Your Password is:{" "}
            <span className="font-semibold text-sky-600">
              your Phone number.
            </span>
          </p> */}
        </>
      )}

      {popupType === "emailRequired" && (
        <>
          <h3 className="text-xl font-semibold mb-2 text-red-400">
            กรุณาใส่อีเมลก่อน
          </h3>

          <p className="text-sm text-gray-300 mb-5">
            โปรดกรอกอีเมลของคุณก่อนทำการ Sign in
          </p>
        </>
      )}

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
