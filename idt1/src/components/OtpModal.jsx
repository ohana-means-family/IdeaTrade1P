import { useEffect, useRef, useState } from "react";

export default function OtpModal({ open, onClose, onSuccess }) {
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState("idle"); 
  // idle | error | success
  const [timeLeft, setTimeLeft] = useState(300); // 5 นาที

  const inputsRef = useRef([]);

  /* ⏱ Timer */
  useEffect(() => {
    if (!open) return;
    setTimeLeft(300);

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

  /* 🔢 Handle OTP input */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Auto submit เมื่อครบ
    if (newOtp.every((n) => n !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* ✅ Fake Verify OTP */
  const verifyOtp = (code) => {
    if (code === "123456") {
      setStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 800);
    } else {
      setStatus("error");
    }
  };

  const resendOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setStatus("idle");
    setTimeLeft(300);
    inputsRef.current[0].focus();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl
                      bg-slate-900 text-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Fill your OTP
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            ✕
          </button>
        </div>

        {/* OTP boxes */}
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              className={`
                w-12 h-12 text-center text-xl font-bold rounded-md
                outline-none
                ${
                  status === "error"
                    ? "bg-red-800 text-white"
                    : status === "success"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-500 text-white"
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
          {status === "error"
            ? `Please fill again within 5 minutes (${(timeLeft / 60).toFixed(2)} min left)`
            : `Please fill within 5 minutes (${(timeLeft / 60).toFixed(2)} min left)`}
        </p>

        <p className="text-center text-sm text-gray-400">
          OTP had sent to your email
        </p>

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
