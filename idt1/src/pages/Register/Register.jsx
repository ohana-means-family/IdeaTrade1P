import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import googleIcon from "@/assets/icons/google.png"; // เปิดใช้บรรทัดนี้ถ้ามีรูป google

export default function Register() {
  const navigate = useNavigate();
  
  // 1. สร้าง Component ไอคอน Google เก็บไว้ตรงนี้
  const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.611 20.083H42V20H24V28H35.303C33.654 32.657 29.204 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24C4 35.045 12.955 44 24 44C35.045 44 44 35.045 44 24C44 22.659 43.862 21.35 43.611 20.083Z" fill="#FFC107"/>
    <path d="M6.306 14.691L12.877 19.511C14.655 15.108 18.961 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691Z" fill="#FF3D00"/>
    <path d="M24 44C29.166 44 33.86 42.023 37.409 38.808L31.225 33.529C29.229 34.912 26.742 36 24 36C18.868 36 14.475 32.748 12.793 28.217L6.216 33.325C9.539 39.73 16.273 44 24 44Z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24V28H35.303C34.505 30.298 33.024 32.22 31.225 33.529L37.409 38.808C41.488 35.064 44 29.846 44 24C44 22.659 43.862 21.35 43.611 20.083Z" fill="#1976D2"/>
  </svg>
  );

  // State สำหรับเก็บค่าในฟอร์ม
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", formData);
    // TODO: ส่งข้อมูลไป Firebase หรือ API ตรงนี้
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
      
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDE: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          
          <h2 className="text-3xl font-bold text-blue-500 mb-8 text-center">
            Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Firstname & Lastname */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition placeholder-gray-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition placeholder-gray-500"
              />
            </div>

            {/* Row 2: Email */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition placeholder-gray-500"
            />

            {/* Row 3: Phone */}
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition placeholder-gray-500"
            />

            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <label htmlFor="agree" className="text-sm text-gray-400 cursor-pointer select-none">
                I accept all <span className="underline hover:text-white">Terms Service and Privacy Policy</span> <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Buttons Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/")} // กลับไปหน้า Login
                className="py-3 rounded-lg bg-gray-600 text-gray-200 font-medium hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-500 transition shadow-lg shadow-sky-900/50"
              >
                Create an account
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-gray-600 flex-1"></div>
              <span className="text-xs text-gray-500 uppercase">OR</span>
              <div className="h-px bg-gray-600 flex-1"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full py-3 rounded-lg bg-white text-slate-800 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition border border-gray-200" // เพิ่ม border นิดนึงเพื่อให้ตัดกับพื้นหลัง
            >
              {/* เรียกใช้ Component ไอคอนตรงนี้ */}
              <GoogleIcon />
              
              <span>Sign up with Google</span>
            </button>

          </form>
        </div>

        {/* RIGHT SIDE: Image / Placeholder */}
        <div className="hidden md:flex w-1/2 bg-gray-300 items-center justify-center relative overflow-hidden">
            {/* จำลองเส้นกากบาทตามรูป Wireframe */}
            <div className="absolute inset-0 border-2 border-gray-400 m-8">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-400 origin-top-left rotate-[32deg] translate-y-[50%]"></div>
                 {/* หมายเหตุ: ส่วนนี้ผมทำเป็นกล่องเทาตามรูปต้นฉบับ 
                     ของจริงคุณสามารถเปลี่ยนเป็น <img src="..." /> ได้เลยครับ */}
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-500 opacity-50">Rocket</span>
                </div>
            </div>
            
             {/* ถ้าจะใส่รูปจริงให้ใช้โค้ดนี้แทนครับ: */}
             {/* <img src="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop" 
                  alt="Rocket" 
                  className="w-full h-full object-cover" 
             /> */}
        </div>

      </div>
    </div>
  );
}