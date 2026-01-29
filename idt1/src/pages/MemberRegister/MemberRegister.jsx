import { useState, useEffect } from "react";
import KbankIcon from "@/assets/icons/Kbank.png";
import CloseIcon from "@/assets/icons/Close_Circle.png";
import CopyIcon from "@/assets/icons/copy.png";
import PromptPayQR from "@/assets/icons/Promptpay.png";
import TickIcon from "@/assets/icons/tick-01.png";
import CancelIcon from "@/assets/icons/cancel-01.png";
import VisaIcon from "@/assets/icons/Visa.png";
import MastercardIcon from "@/assets/icons/Mastercard.png";

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
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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

  const totalPrice = selectedTools.reduce((sum, id) => {
    const tool = TOOLS.find((t) => t.id === id);
    if (!tool) return sum;
    return sum + (billingCycle === "monthly" ? tool.monthly : tool.yearly);
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

    // 2. รวมรายการเดิม + รายการใหม่ (ใช้ Set เพื่อกำจัดตัวซ้ำ)
    // เช่น ของเดิมมี [A, B] ของใหม่ซื้อ [B, C] -> ผลลัพธ์จะเป็น [A, B, C]
    const mergedItems = [...new Set([...oldUnlockedItems, ...selectedTools])];

    // 3. บันทึกกลับลงไป
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        role: "membership",
        billingCycle,
        unlockedItems: mergedItems, // ใช้รายการที่รวมเสร็จแล้ว
      })
    );

    alert("Payment Successful 🎉");
    setShowModal(false);
    window.location.href = "/dashboard";
  };

  const paymentMethods = [
    { id: "bank", label: "Bank Account" },
    { id: "promptpay", label: "PromptPay" },
    { id: "card", label: "Credit / Debit Card" },
  ];

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const years = Array.from({ length: 10 }, (_, i) =>
    new Date().getFullYear() + i
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1224] to-[#060B18] text-white p-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="col-span-8 space-y-6">
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
                const active = selectedTools.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`cursor-pointer px-5 py-4 rounded-xl border flex justify-between
                      ${
                        active
                          ? "border-[#0E6BA8] bg-[#102B46]"
                          : "border-[#1F3354] bg-[#13233A]"
                      }`}
                  >
                    <span>{tool.name}</span>
                    <span className="text-sm text-[#9FB3C8]">
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
        <div className="col-span-4 space-y-4">

          {/* Payment Method */}
          <div className="bg-[#0F1B2D] p-5 rounded-xl">
            <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedPayment(m.id)}
                  className={`cursor-pointer h-16 rounded-xl border flex items-center justify-center text-sm
                    ${
                      selectedPayment === m.id
                        ? "border-[#0E6BA8] bg-[#102B46]"
                        : "border-[#1F3354]"
                    }`}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#0F1B2D] p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {selectedTools.map((id) => {
              const t = TOOLS.find((x) => x.id === id);
              return (
                <div key={id} className="flex justify-between text-sm mb-2">
                  <span>{t.name}</span>
                  <span>
                    {billingCycle === "monthly" ?
                      t.monthly : t.yearly}฿
                  </span>
                </div>
              );
            })}

            <div className="border-t border-[#1F3354] my-4" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{totalPrice.toLocaleString()} ฿</span>
            </div>

            <button
              disabled={!selectedPayment || selectedTools.length === 0}
              onClick={() => setShowModal(true)}
              className="mt-5 w-full h-12 rounded-lg bg-[#0E6BA8] disabled:bg-[#1F3354]"
            >
              Confirm Payment
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
  );
}
