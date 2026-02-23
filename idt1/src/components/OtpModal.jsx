import { useEffect, useRef, useState } from "react";

export default function OtpModal({ open, onClose, onSuccess }) {
  const OTP_LENGTH = 6;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [timeLeft, setTimeLeft] = useState(300);
  const [resent, setResent] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const inputsRef = useRef([]);

  /* ⏱ Timer */
  useEffect(() => {
    if (!open) return;

    setTimeLeft(300);
    setResent(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setStatus("idle");

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  /* 🕒 Format time MM:SS */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /* 🔢 Handle OTP input */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.every((n) => n !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* ✅ Verify OTP */
  const verifyOtp = (code) => {
    if (code === "123456") {
      setStatus("success");
      setTimeout(onSuccess, 600);
    } else {
      setStatus("error");
    }
  };

  const resendOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setStatus("idle");
    setTimeLeft(300);
    setResent(true);
    inputsRef.current[0]?.focus();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          relative z-10
          w-[95%] sm:w-full
          max-w-sm sm:max-w-md md:max-w-lg
          rounded-2xl
          bg-gradient-to-br from-slate-800 to-slate-900
          text-white
          p-5 sm:p-6 md:p-8
          shadow-2xl

          transform
          scale-95 sm:scale-100
          transition-all duration-300
        "
      >

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 relative">
          <h3 className="text-xl font-semibold">Fill your OTP</h3>

          {/* ❓ Tooltip */}
          <div
            className="relative"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
          >
            <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-xs cursor-pointer">
              ?
            </span>

            {showTip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-3 rounded-lg text-xs text-gray-200 bg-slate-700 shadow-lg z-50">
                OTP (One-Time Password) is a one-time code for authenticating
                online transactions. Delivered through email, it acts as a
                security key to verify your identity. Keep it secret and never
                share it with others.
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="ml-auto text-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* OTP boxes */}
        <div className="
          flex
          justify-center
          gap-2 sm:gap-3 md:gap-4
          mt-4
        ">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              className={`
                w-10 h-12
                sm:w-12 sm:h-14
                md:w-14 md:h-16
                text-center
                rounded-lg
                text-lg sm:text-xl
                ${
                  status === "error"
                    ? "bg-red-800"
                    : status === "success"
                    ? "bg-blue-600"
                    : "bg-gray-500"
                }
              `}
            />
          ))}
        </div>

        {/* Timer */}
        <p
          className={`text-center text-sm mb-1
            ${status === "error" ? "text-red-500" : "text-gray-300"}`}
        >
          Please fill within 5 minutes ({formatTime(timeLeft)} left)
        </p>

        {/* OTP Sent Text */}
        <p
          className={`text-center text-sm
            ${resent ? "text-sky-400" : "text-gray-300"}`}
        >
          {resent
            ? "OTP had sent to your email again already"
            : "OTP had sent to your email"}
        </p>

        {/* Resend */}
        <p
          onClick={resendOtp}
          className="text-center text-sm text-gray-500 mt-2 cursor-pointer hover:text-white"
        >
          Don&apos;t get OTP? <span className="underline">Send again</span>
        </p>
      </div>
    </div>
  );
}
