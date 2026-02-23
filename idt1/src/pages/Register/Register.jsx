// src/pages/Register/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Rocket from "./Rocket";

export default function Register() {
  const navigate = useNavigate();

  // ======================
  // Form State (ไม่มี password แล้ว)
  // ======================
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agree: false,
  });

  // ======================
  // Error State (input only)
  // ======================
  const [errorField, setErrorField] = useState("");

  // ======================
  // Privacy Popup State
  // ======================
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  // ======================
  // Handle Change
  // ======================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // clear error
    setErrorField("");

    // close privacy popup when checked
    if (name === "agree") {
      setShowPrivacyPopup(false);
    }
  };

  // ======================
  // Submit (เรียก API ไปที่ Backend)
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- ตรวจสอบข้อมูลเบื้องต้น ---
    if (!formData.firstName.trim()) return setErrorField("firstName");
    if (!formData.lastName.trim()) return setErrorField("lastName");
    if (!formData.email.trim()) return setErrorField("email");
    if (!formData.phone.trim()) return setErrorField("phone");

    if (!formData.agree) {
      setShowPrivacyPopup(true);
      return;
    }

    try {
      // --- ยิง API ส่งข้อมูลไปให้ Backend (เส้น /api/register) ---
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("สมัครสมาชิกสำเร็จ ข้อมูลเข้าฐานข้อมูลแล้ว!"); // แจ้งเตือนเมื่อสำเร็จ
        console.log("Register Data:", data);
        navigate("/dashboard"); 
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }

    } catch (error) {
      console.error("Error Registration:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ลองเช็คว่ารัน Backend หรือยัง");
    }
  };

  // ======================
  // Error Popup (Input)
  // ======================
  const ErrorPopup = () => (
    <div className="absolute left-0 -bottom-9 z-20 w-full flex items-center gap-2 bg-white text-gray-800 text-sm px-3 py-2 border border-orange-400 shadow-sm">
      <span className="bg-orange-500 text-white w-4 h-4 flex items-center justify-center text-xs font-bold">
        !
      </span>
      Please fill out this field.
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
      <div className="w-full max-w-5xl
        bg-slate-800
        rounded-2xl md:rounded-[2rem]
        shadow-2xl
        overflow-hidden
        flex flex-col lg:flex-row">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-blue-500 mb-8 text-center">
            Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* First & Last Name */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full bg-slate-700/50 text-white border px-4 py-3 rounded-lg
                    ${errorField === "firstName" ? "border-orange-400" : "border-slate-600"}
                  `}
                />
                {errorField === "firstName" && <ErrorPopup />}
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full bg-slate-700/50 text-white border px-4 py-3 rounded-lg
                    ${errorField === "lastName" ? "border-orange-400" : "border-slate-600"}
                  `}
                />
                {errorField === "lastName" && <ErrorPopup />}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-slate-700/50 text-white border px-4 py-3 rounded-lg
                  ${errorField === "email" ? "border-orange-400" : "border-slate-600"}
                `}
              />
              {errorField === "email" && <ErrorPopup />}
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full bg-slate-700/50 text-white border px-4 py-3 rounded-lg
                  ${errorField === "phone" ? "border-orange-400" : "border-slate-600"}
                `}
              />
              {errorField === "phone" && <ErrorPopup />}
            </div>

            {/* Privacy Policy */}
            <div className="relative flex items-center gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="w-4 h-4"
              />

              <span className="text-sm text-gray-400">
                I accept all{" "}
                <span className="underline hover:text-white">
                  Terms Service and Privacy Policy
                </span>{" "}
                <span className="text-red-500">*</span>
              </span>

              {showPrivacyPopup && (
                <div className="
                  absolute left-0 -bottom-10
                  w-full
                  bg-white
                  border border-orange-400
                  text-gray-800 text-sm
                  px-3 py-2
                  shadow-sm
                  z-20
                ">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white w-4 h-4 flex items-center justify-center text-xs font-bold">
                      !
                    </span>
                    Please accept the Terms of Service and Privacy Policy.
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="py-3 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-500 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="py-3 rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition"
              >
                Create an account
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full
          h-72 sm:h-80 md:h-96
          lg:w-1/2 lg:h-auto
          relative
          flex">
          <Rocket />
        </div>
      </div>
    </div>
  );
}