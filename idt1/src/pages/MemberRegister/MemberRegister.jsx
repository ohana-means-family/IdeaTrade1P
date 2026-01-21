import { useState } from "react";

const TOOLS = [
  { id: 1, name: "Project name A", monthly: 2500, yearly: 25000 },
  { id: 2, name: "Project name B", monthly: 2500, yearly: 25000 },
  { id: 3, name: "Project name C", monthly: 2500, yearly: 25000 },
  { id: 4, name: "Project name D", monthly: 2500, yearly: 25000 },
  { id: 5, name: "Project name E", monthly: 2500, yearly: 25000 },
];

export default function MemberRegister() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const totalPrice = selectedTools.reduce((sum, id) => {
    const tool = TOOLS.find((t) => t.id === id);
    if (!tool) return sum;
    return sum + (billingCycle === "monthly" ? tool.monthly : tool.yearly);
  }, 0);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleTool = (id) => {
    setSelectedTools((prev) =>
      prev.includes(id)
        ? prev.filter((toolId) => toolId !== id)
        : [...prev, id]
    );
  };

  const paymentMethods = [
    { id: "bank", label: "Bank Account" },
    { id: "promptpay", label: "PromptPay (พร้อมเพย์)" },
    { id: "card", label: "Mastercard / Visa / Credit Card" },
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-b from-[#0A1224] to-[#060B18] text-white">
      <div className="h-full grid grid-cols-12 gap-6 p-8">

        {/* LEFT */}
        <div className="col-span-8 flex flex-col gap-6">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold">Subscription & Checkout</h1>
            <p className="text-sm text-[#9FB3C8]">อธิบาย</p>
          </div>

          {/* Billing */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Billing Cycle</h2>
            <div className="flex bg-[#0F1B2D] rounded-xl p-1 w-[420px]">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`flex-1 py-2 rounded-lg transition
                  ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-[#0E6BA8] to-[#0B5C90]"
                      : "text-[#9FB3C8]"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`flex-1 py-2 rounded-lg transition
                  ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-[#0E6BA8] to-[#0B5C90]"
                      : "text-[#9FB3C8]"
                  }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">Select Your Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              {TOOLS.map((tool) => {
                const selected = selectedTools.includes(tool.id);
                const price =
                  billingCycle === "monthly"
                    ? `${tool.monthly}฿/mo`
                    : `${tool.yearly}฿/yr`;

                return (
                  <div
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`cursor-pointer flex items-center justify-between px-5 py-4 rounded-xl border transition
                      ${
                        selected
                          ? "border-[#0E6BA8] bg-gradient-to-r from-[#0F2C4D] to-[#0B1F36]"
                          : "border-[#1F3354] bg-[#13233A]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center
                          ${
                            selected
                              ? "border-[#0E6BA8]"
                              : "border-[#1F3354]"
                          }`}
                      >
                        {selected && (
                          <div className="w-2.5 h-2.5 bg-[#0E6BA8] rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{tool.name}</span>
                    </div>
                    <span className="text-sm text-[#9FB3C8]">{price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Payment method</h2>

            <div className="grid grid-cols-3 gap-4">
              {paymentMethods.map((method) => {
                const selected = selectedPayment === method.id;

                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`cursor-pointer h-20 rounded-xl border flex items-center justify-between px-4 transition
                      ${
                        selected
                          ? "border-[#0E6BA8] bg-gradient-to-r from-[#0F2C4D] to-[#0B1F36]"
                          : "border-[#1F3354] bg-[#13233A]"
                      }`}
                  >
                    <span className="font-medium text-sm">
                      {method.label}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          selected
                            ? "border-[#0E6BA8]"
                            : "border-[#1F3354]"
                        }`}
                    >
                      {selected && (
                        <div className="w-2.5 h-2.5 bg-[#0E6BA8] rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bank Detail */}
            {selectedPayment === "bank" && (
              <div className="mt-4 bg-[#0F1B2D] rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#39D98A] rounded-lg flex items-center justify-center font-bold text-[#042F2E]">
                  K+
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">Bank Account Detail</p>
                  <p className="text-sm text-[#9FB3C8] mt-1">
                    ชื่อบัญชี: พี่เดีย ใจดี
                  </p>
                  <p className="text-sm text-[#9FB3C8]">
                    เลขบัญชี: 123-4-56789-0
                  </p>
                </div>

                <button
                  onClick={() => handleCopy("1234567890")}
                  className="w-9 h-9 rounded-md bg-[#1F3354] hover:bg-[#2B4A78]
                             flex items-center justify-center"
                  title="Copy account number"
                >
                  📋
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-4 bg-[#0F1B2D] rounded-2xl p-6 flex flex-col border border-[#1F3354]">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          <div className="flex-1 space-y-3">
            {selectedTools.length === 0 && (
              <p className="text-sm text-[#9FB3C8]">
                ยังไม่ได้เลือก Project
              </p>
            )}

            {selectedTools.map((id) => {
              const tool = TOOLS.find((t) => t.id === id);
              const price =
                billingCycle === "monthly"
                  ? tool.monthly
                  : tool.yearly;

              return (
                <div key={id} className="flex justify-between text-sm">
                  <span>{tool.name}</span>
                  <span>{price}฿</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#1F3354] my-4" />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Price</span>
            <span>
              {totalPrice.toLocaleString()} ฿
              <span className="text-sm text-[#9FB3C8] ml-1">
                {billingCycle === "monthly" ? "/month" : "/year"}
              </span>
            </span>
          </div>

          <button
            disabled={selectedTools.length === 0 || !selectedPayment}
            className="mt-6 h-12 rounded-lg font-semibold
              bg-[#0E6BA8] hover:bg-[#0B5C90]
              disabled:bg-[#1F3354] disabled:cursor-not-allowed"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
