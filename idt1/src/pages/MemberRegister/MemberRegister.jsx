import { useState } from "react";

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

  const toggleTool = (id) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedTools.reduce((sum, id) => {
    const tool = TOOLS.find((t) => t.id === id);
    if (!tool) return sum;
    return sum + (billingCycle === "monthly" ? tool.monthly : tool.yearly);
  }, 0);

  const handleConfirmPayment = () => {
    // ✅ FIX: set membership + unlocked เฉพาะที่ซื้อ
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        role: "membership",
        billingCycle,
        unlockedItems: selectedTools,
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
                    {billingCycle === "monthly" ? t.monthly : t.yearly}฿
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0F1B2D] p-6 rounded-xl w-[420px] space-y-4">

            <h3 className="text-xl font-semibold">
              Payment :{" "}
              {selectedPayment === "bank"
                ? "Bank Account"
                : selectedPayment === "promptpay"
                ? "PromptPay"
                : "Credit / Debit Card"}
            </h3>

            {selectedPayment === "bank" && (
              <div className="space-y-2">
                <p className="font-medium">Mr.Chalearmpol Neamsri</p>
                <div className="flex items-center justify-between bg-[#13233A] px-4 py-3 rounded-lg">
                  <span className="text-[#9FB3C8]">047-2-27169-7</span>
                  <button
                    onClick={() => handleCopy("047-2-27169-7")}
                    className="px-3 py-1 text-sm bg-[#1F3354] rounded"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            )}

            {selectedPayment === "promptpay" && (
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-lg w-full aspect-[4/3] flex justify-center">
                  <img
                    src="/qr-promptpay.png"
                    alt="QR"
                    className="max-h-full"
                  />
                </div>
                <p className="text-sm text-[#9FB3C8]">
                  Mr.Chalearmpol Neamsri
                </p>
              </div>
            )}

            {selectedPayment === "card" && (
              <div className="space-y-3">
                <input className="w-full h-10 bg-[#13233A] px-3 rounded" placeholder="Card Number" />
                <input className="w-full h-10 bg-[#13233A] px-3 rounded" placeholder="Cardholder Name" />
                <div className="flex gap-3">
                  <input className="flex-1 h-10 bg-[#13233A] px-3 rounded" placeholder="MM / YY" />
                  <input className="flex-1 w-full h-10 bg-[#13233A] px-3 rounded" placeholder="CVV / CVC" />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 bg-[#1F3354] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 h-11 bg-[#0E6BA8] rounded font-semibold"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
