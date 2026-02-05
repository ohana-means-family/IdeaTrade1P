// src/pages/MemberRegister/MemberRegister.jsx
import { useState, useEffect } from "react";
import KbankIcon from "@/assets/icons/Kbank.png";
import CloseIcon from "@/assets/icons/Close_Circle.png";
import CopyIcon from "@/assets/icons/copy.png";
import PromptPayQR from "@/assets/icons/Promptpay.png";
import TickIcon from "@/assets/icons/tick-01.png";
import CancelIcon from "@/assets/icons/cancel-01.png";
import VisaIcon from "@/assets/icons/Visa.png";
import MastercardIcon from "@/assets/icons/Mastercard.png";
import BankGray from "@/assets/icons/blbanktrasfer.png";
import BankBlue from "@/assets/icons/bbanktransfer.png";
import CardGray from "@/assets/icons/blcredit-card.png";
import CardBlue from "@/assets/icons/bcredit-card.png";
import QrGray from "@/assets/icons/blqr.png";
import QrBlue from "@/assets/icons/bqr.png";

// รายละเอียดเครื่องมือและราคา
const TOOLS = [
  { id: "fortune", name: "หมอดูหุ้น", monthly: 2500, yearly: 25000 },
  { id: "petroleum", name: "Petroleum", monthly: 2500, yearly: 25000 },
  { id: "rubber", name: "Rubber Thai", monthly: 2500, yearly: 25000 },
  { id: "flow", name: "Flow Intraday", monthly: 2500, yearly: 25000 },
  { id: "s50", name: "S50", monthly: 2500, yearly: 25000 },
  { id: "gold", name: "Gold", monthly: 2500, yearly: 25000 },
  { id: "bidask", name: "BidAsk", monthly: 2500, yearly: 25000 },
  { id: "tickmatch", name: "TickMatch", monthly: 2500, yearly: 25000 },
  { id: "dr", name: "DR", monthly: 2500, yearly: 25000 },
];

const paymentMethods = [
  { id: "bank", label: "Bank Transfer", icon: BankBlue, activeIcon: BankGray },
  { id: "card", label: "Credit Card", icon: CardBlue, activeIcon: CardGray },
  { id: "promptpay", label: "PromptPay", icon: QrBlue, activeIcon: QrGray },
];

export default function MemberRegister() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("idle"); 

  // 🔹 Credit / Debit Card
  const [cardType, setCardType] = useState("visa");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  // 🔹 Bank Account only
  const [slipImage, setSlipImage] = useState(null);
  const [copied, setCopied] = useState(false);

  /* ================= FUNCTIONS ================= */
  const closeModal = () => {
    setShowModal(false);
    setStatus("idle");
    setSlipImage(null);
  };

  const toggleTool = (id) => {
  setSelectedTools((prev) => {
    const exists = prev.find(
      (t) => t.id === id && t.billing === billingCycle
    );

    if (exists) {
      // ลบเฉพาะ tool + billing นั้น
      return prev.filter(
        (t) => !(t.id === id && t.billing === billingCycle)
      );
    }

    // เพิ่มใหม่ตาม billing ปัจจุบัน
    return [...prev, { id, billing: billingCycle }];
  });
};

  const handleCopyAccount = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleUploadSlip = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSlipImage(URL.createObjectURL(file));
  };

const totalPrice = selectedTools.reduce((sum, t) => {
  const tool = TOOLS.find(x => x.id === t.id);
  if (!tool) return sum;

  return sum + (t.billing === "monthly" ? tool.monthly : tool.yearly);
}, 0);

  useEffect(() => {
    if (selectedPayment === "promptpay" && status === "success") {
      const timer = setTimeout(() => {
        handleConfirmPayment();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, selectedPayment]);

const handleConfirmPayment = () => {
    // 1. ดึงข้อมูล User Profile เดิมจาก LocalStorage (ถ้ามี)
    const storedProfile = localStorage.getItem("userProfile");
    let oldUnlockedItems = [];

    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        if (parsedProfile.unlockedItems && Array.isArray(parsedProfile.unlockedItems)) {
          oldUnlockedItems = parsedProfile.unlockedItems;
        }
      } catch (error) {
        console.error("Error parsing old profile:", error);
      }
    }

    // 🔥 จุดที่แก้: ดึงเฉพาะ ID ออกมาจากรายการที่เลือกซื้อ (selectedTools)
    // เพราะ selectedTools เก็บเป็น Object {id, billing} แต่ระบบตรวจสอบต้องการแค่ "ชื่อ ID"
    const newToolIds = selectedTools.map((t) => t.id);

    // 2. รวมรายการเดิม + รายการใหม่ (ใช้ Set เพื่อกำจัดตัวซ้ำ)
    const mergedItems = [...new Set([...oldUnlockedItems, ...newToolIds])];

    // 3. บันทึกกลับลงไป
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        role: "membership",
        billingCycle,
        unlockedItems: mergedItems, // ตอนนี้เป็นรายการ ID ล้วนๆ แล้ว (เช่น ['gold', 'flow'])
      })
    );

    alert("Payment Successful 🎉");
    setShowModal(false);
    window.location.href = "/dashboard";
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const years = Array.from({ length: 10 }, (_, i) =>
    new Date().getFullYear() + i
  );

  const hasMonthly = selectedTools.some(t => t.billing === "monthly");
  const hasYearly = selectedTools.some(t => t.billing === "yearly");

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1224] to-[#060B18] text-white flex items-center justify-center">
      <div className="w-full max-w-[1200px] px-6 mx-auto">
        <div className="grid grid-cols-12 gap-x-10 gap-y-6">

        {/* LEFT */}
        <div className="col-span-7 space-y-6">
          <h1 className="text-4xl font-bold">Subscription & Checkout</h1>

          {/* Billing */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Billing Cycle</h2>
            <div className="flex bg-[#0F1B2D] rounded-xl p-1 w-[360px]">
              {["monthly", "yearly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setBillingCycle(t)}
                  className={`flex-1 py-2 rounded-lg ${
                    billingCycle === t
                      ? "bg-[#0E6BA8]"
                      : "text-[#9FB3C8]"
                  }`}
                >
                  {t === "monthly" ? "Monthly" : "Yearly"}
                </button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="bg-[#0F1B2D] p-5 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Select Your Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              {TOOLS.map((tool) => {
                const active = selectedTools.some(
                (t) => t.id === tool.id && t.billing === billingCycle
              );
                return (
                  <div
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`cursor-pointer px-5 py-4 rounded-xl border flex items-center gap-2
                      ${
                        active
                          ? "border-[#0E6BA8] bg-[#102B46]"
                          : "border-[#1F3354] bg-[#13233A]"
                      }`}
                  >
                    <span>{tool.name}</span>

                    <span className="ml-auto text-sm text-[#9FB3C8]">
                      {billingCycle === "monthly"
                        ? `${tool.monthly}฿/m`
                        : `${tool.yearly}฿/y`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-5 space-y-4">

          {/* Payment Method */}
          <div className="bg-[#0F1B2D] p-5 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Payment Method</h2>

          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((m) => {
              const active = selectedPayment === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedPayment(m.id)}
                  className={`
                    h-20 rounded-xl border flex flex-col items-center justify-center gap-1
                    transition-all duration-200
                    ${
                      active
                        ? "bg-[#0B2A4E] border-[#0E6BA8]"
                        : "bg-[#E5E7EB] border-transparent"
                    }
                  `}
                >
                  <img
                    src={active ? m.activeIcon : m.icon}
                    alt={m.label}
                    className="w-12 h-12"
                  />
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-white" : "text-black"
                    }`}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#0F1B2D] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {/* MONTHLY */}
          {hasMonthly && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#9FB3C8] mb-2">Monthly</p>

            {/* ✅ Scroll container */}
            <div className="h-[120px] overflow-y-auto pr-2 space-y-1">
              {selectedTools
                .filter(t => t.billing === "monthly")
                .map((t) => {
                  const tool = TOOLS.find(x => x.id === t.id);
                  return (
                    <div
                      key={`${t.id}-m`}
                      className="flex justify-between text-sm text-white"
                    >
                      <span>
                        {tool.name}
                        <span className="text-xs text-[#9FB3C8] ml-2">(Monthly)</span>
                      </span>
                      <span>{tool.monthly.toLocaleString()} ฿</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {hasMonthly && hasYearly && (
          <div className="border-t border-[#1F3354] my-4" />
        )}
        
          {/* YEARLY */}
          {hasYearly && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#9FB3C8] mb-2">Yearly</p>

            {/* ✅ Scroll container */}
            <div className="h-[120px] overflow-y-auto pr-2 space-y-1">
              {selectedTools
                .filter(t => t.billing === "yearly")
                .map((t) => {
                  const tool = TOOLS.find(x => x.id === t.id);
                  return (
                    <div
                      key={`${t.id}-y`}
                      className="flex justify-between text-sm text-white"
                    >
                      <span>
                        {tool.name}
                        <span className="text-xs text-[#9FB3C8] ml-2">(Yearly)</span>
                      </span>
                      <span>{tool.yearly.toLocaleString()} ฿</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

          <div className="border-t border-[#1F3354] my-4" />

          {/* TOTAL AMOUNT */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#9FB3C8] mb-2">
              TOTAL AMOUNT
            </p>

            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-[#0EA5E9]">
                {totalPrice.toLocaleString()}฿
              </span>

              <div className="text-xs text-[#9FB3C8] text-right leading-tight">
                <p>Charged annually</p>
                <p>Cancel anytime</p>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <button
            disabled={!selectedPayment || selectedTools.length === 0}
            onClick={() => setShowModal(true)}
            className="w-full h-12 rounded-lg bg-[#0EA5E9] text-black font-semibold disabled:bg-[#1F3354]"
          >
            Complete Purchase
          </button>

          {/* Cancel */}
          <button
            onClick={() => {
              setSelectedTools([]);
              setSelectedPayment(null);
            }}
            className="mt-3 w-full text-sm text-[#9FB3C8] hover:text-white transition"
          >
            Cancel
          </button>
        </div>

        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0F1B2D] p-6 rounded-xl w-[420px] space-y-4">

            {/* ================= BANK ACCOUNT ================= */}
            {selectedPayment === "bank" && (
              <div className="relative bg-[#0B1629] rounded-2xl p-5 space-y-4">

                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3"
                >
                  <img src={CloseIcon} alt="close" className="w-6 h-6" />
                </button>

                <p className="text-sm text-[#9FB3C8] font-medium">
                  Bank Account Detail
                </p>

                <div className="flex items-center gap-4 bg-[#2A2A2A] rounded-2xl p-4">
                  <img src={KbankIcon} alt="kbank" className="w-12 h-12" />

                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      Kbank <span className="text-[#9FB3C8]">(Kasikorn Bank)</span>
                    </p>
                    <p className="text-sm text-[#E5E7EB]">
                      Mr.Chalearmpol Neamsri
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#9FB3C8]">
                        047-2-27169-7
                      </span>
                      <button onClick={() => handleCopyAccount("047-2-27169-7")}>
                        <img src={CopyIcon} alt="copy" className="w-4 h-4" />
                      </button>
                      {copied && (
                        <span className="text-xs text-green-400 ml-2">
                          Copied!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <label className="w-full h-12 rounded-xl bg-[#E5E7EB] text-black font-semibold flex items-center justify-center cursor-pointer">
                  Upload Slip
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUploadSlip}
                  />
                </label>

                {slipImage && (
                  <div className="bg-[#13233A] rounded-xl p-3">
                    <p className="text-xs text-[#9FB3C8] mb-2">Uploaded Slip</p>

                    {/* Image Frame */}
                    <div className="w-full h-[220px] rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
                      <img
                        src={slipImage}
                        alt="slip"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                 {/* ACTION */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-11 bg-[#1F3354] rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={!slipImage}
                    className={`flex-1 h-11 rounded font-semibold transition
                      ${
                        slipImage
                          ? "bg-[#0E6BA8] text-black"
                          : "bg-[#3A3A3A] text-[#9CA3AF] cursor-not-allowed"
                      }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* ================= PROMPTPAY ================= */}
            {selectedPayment === "promptpay" && status === "idle" && (
              <div className="relative bg-gradient-to-b from-[#0A2442] to-[#071C34] rounded-2xl p-6 flex flex-col items-center text-white">

                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3"
                >
                  <img src={CloseIcon} alt="close" className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-semibold mb-6">
                  Scan QR Code
                </h2>

                {/* QR Frame */}
                <div className="relative w-[260px] h-[260px] bg-white rounded-xl flex items-center justify-center mb-6">
                  <img
                    src={PromptPayQR}
                    alt="promptpay"
                    className="w-[220px] h-[220px] object-contain"
                  />

                  {/* Corner */}
                  <span className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-white" />
                  <span className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-white" />
                  <span className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-white" />
                  <span className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-white" />
                </div>

                {/* Info */}
                <div className="text-center text-sm space-y-1">
                  <p className="font-semibold">Kbank (Kasikorn Bank)</p>
                  <p>Mr.Chalearmpol Neamsri</p>
                  <p className="opacity-70">xxx-x-x7169-x</p>
                  <p className="opacity-70">0000000000000</p>
                </div>

                {/* Demo */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStatus("success")}
                    className="px-4 py-2 rounded bg-[#0E6BA8]"
                  >
                    Simulate Success
                  </button>
                  <button
                    onClick={() => setStatus("failed")}
                    className="px-4 py-2 rounded bg-[#7A1C1C]"
                  >
                    Simulate Failed
                  </button>
                </div>

              </div>
            )}

            {/* SUCCESS */}
            {selectedPayment === "promptpay" && status === "success" && (
              <div className="relative bg-[#071C34] rounded-2xl p-10 flex flex-col items-center gap-6">

                {/* Close */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3"
                >
                  <img src={CloseIcon} alt="close" className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-semibold">
                  Payment received
                </h2>

                <img
                  src={TickIcon}
                  alt="success"
                  className="w-32 h-32"
                />
              </div>
            )}

            {/* FAILED */}
            {selectedPayment === "promptpay" && status === "failed" && (
              <div className="relative bg-[#071C34] rounded-2xl p-10 flex flex-col items-center gap-6">

                {/* Close */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3"
                >
                  <img src={CloseIcon} alt="close" className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-semibold">
                  Payment denied
                </h2>

                <img
                  src={CancelIcon}
                  alt="failed"
                  className="w-32 h-32"
                />
              </div>
            )}


            {/* ================= Credit / Debit Card ================= */}
            {selectedPayment === "card" && (
              <div className="relative bg-[#0B1629] rounded-2xl p-5 space-y-4">
                
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 z-10"
                >
                  <img src={CloseIcon} alt="close" className="w-6 h-6" />
                </button>

                {/* Header: Card Type Selection */}
                <div className="bg-[#2A2A2A] rounded-xl p-4 mb-2">
                  <p className="text-white font-semibold mb-3">Credit Card Detail</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCardType("mastercard")}
                      className={`h-10 w-14 flex items-center justify-center rounded transition-all ${cardType === 'mastercard' ? 'bg-white ring-2 ring-[#0E6BA8]' : 'bg-white/50 opacity-50'}`}
                    >
                       <img src={MastercardIcon} alt="mastercard" className="h-6 object-contain" />
                    </button>
                    <button 
                      onClick={() => setCardType("visa")}
                      className={`h-10 w-14 flex items-center justify-center rounded transition-all ${cardType === 'visa' ? 'bg-white ring-2 ring-[#0E6BA8]' : 'bg-white/50 opacity-50'}`}
                    >
                       <img src={VisaIcon} alt="visa" className="h-4 object-contain" />
                    </button>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-white font-semibold text-sm mb-1">
                      Cardholder's name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full h-10 rounded-lg bg-[#D1D5DB] text-black px-3 focus:outline-none focus:ring-2 focus:ring-[#0E6BA8]"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-white font-semibold text-sm mb-1">
                      Card number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      maxLength={19}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full h-10 rounded-lg bg-[#D1D5DB] text-black px-3 focus:outline-none focus:ring-2 focus:ring-[#0E6BA8]"
                    />
                  </div>

                  {/* Expiry Date & CVV */}
                  <div className="flex gap-3">
                    {/* Month */}
                    <div className="flex-1">
                      <label className="block text-white font-semibold text-sm mb-1">
                        Exp. Month
                      </label>
                      <select 
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        className="w-full h-10 rounded-lg bg-[#D1D5DB] text-black px-2 focus:outline-none focus:ring-2 focus:ring-[#0E6BA8]"
                      >
                        <option value="" disabled>MM</option>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>

                    {/* Year */}
                    <div className="flex-1">
                      <label className="block text-white font-semibold text-sm mb-1">
                        Exp. Year
                      </label>
                      <select 
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value)}
                        className="w-full h-10 rounded-lg bg-[#D1D5DB] text-black px-2 focus:outline-none focus:ring-2 focus:ring-[#0E6BA8]"
                      >
                         <option value="" disabled>YYYY</option>
                         {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    {/* CVV */}
                    <div className="flex-1">
                      <label className="block text-white font-semibold text-sm mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="w-full h-10 rounded-lg bg-[#D1D5DB] text-black px-3 focus:outline-none focus:ring-2 focus:ring-[#0E6BA8] text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-11 bg-[#1F3354] rounded text-white hover:bg-[#2a456e] transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmPayment}
                    // เช็คว่ากรอกครบหรือยัง ถ้ายังให้ disable ปุ่ม
                    disabled={!cardName || !cardNumber || !expMonth || !expYear || !cvv}
                    className={`flex-1 h-11 rounded font-semibold transition
                      ${
                        cardName && cardNumber && expMonth && expYear && cvv
                          ? "bg-[#0E6BA8] text-black hover:bg-[#0c5a8d]"
                          : "bg-[#3A3A3A] text-[#9CA3AF] cursor-not-allowed"
                      }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
