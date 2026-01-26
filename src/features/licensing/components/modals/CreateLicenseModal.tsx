import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Layers,
  CheckCircle2,
  Copy,
  Sparkles,
  Zap,
  Server,
  Code,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface CreateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (licenseData: {
    userId: string;
    productId?: string;
    productType: string;
    maxIpSlots: number;
    tier: string;
    expiresAt?: string;
  }) => Promise<string>;
}

const PRODUCT_TYPES = [
  {
    value: "excel-automation",
    label: "Excel Automation",
    icon: Zap,
    color: "text-green-500",
    desc: "Automate complex spreadsheets",
  },
  {
    value: "python-script",
    label: "Python Script",
    icon: Code,
    color: "text-blue-500",
    desc: "Execute Python workflows",
  },
  {
    value: "nodejs-api",
    label: "Node.js API",
    icon: Server,
    color: "text-yellow-500",
    desc: "Backend API integration",
  },
  {
    value: "macro-suite",
    label: "Macro Suite",
    icon: Layers,
    color: "text-purple-500",
    desc: "Advanced macro controls",
  },
];

export const CreateLicenseModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateLicenseModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState("");

  const [formData, setFormData] = useState({
    userId: "user_demo_001",
    productId: "",
    productType: "excel-automation",
    maxIpSlots: 1,
    expiresAt: "",
    tier: "basic",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const key = await onCreate(formData);
      setCreatedKey(key);
      setStep(3); // Success step
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdKey);
  };

  const handleClose = () => {
    setStep(1);
    setCreatedKey("");
    setFormData({
      userId: "user_demo_001",
      productId: "",
      productType: "excel-automation",
      maxIpSlots: 1,
      expiresAt: "",
      tier: "basic",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col ${
                isDark
                  ? "bg-[#0a0a0a] border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="p-6 border-b relative overflow-hidden">
                <div
                  className={`absolute inset-0 opacity-10 ${
                    isDark
                      ? "bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500"
                      : "bg-linear-to-r from-cyan-200 via-purple-200 to-pink-200"
                  }`}
                />
                <div className="relative flex justify-between items-center">
                  <h2
                    className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    <Sparkles className="text-cyan-500" size={20} />
                    Generate License
                  </h2>
                  <button
                    onClick={handleClose}
                    className={`p-2 rounded-full transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Product Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {PRODUCT_TYPES.map((type) => (
                          <div
                            key={type.value}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                productType: type.value,
                              })
                            }
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                              formData.productType === type.value
                                ? isDark
                                  ? "bg-cyan-500/10 border-cyan-500/50"
                                  : "bg-blue-50 border-blue-500"
                                : isDark
                                  ? "bg-white/5 border-white/5 hover:bg-white/10"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <type.icon size={20} className={type.color} />
                            <div>
                              <div
                                className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                              >
                                {type.label}
                              </div>
                              <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                                {type.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        License Tier
                      </label>
                      <div
                        className={`flex bg-gray-100 rounded-lg p-1 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                      >
                        {["basic", "pro", "enterprise"].map((tier) => (
                          <button
                            key={tier}
                            onClick={() => setFormData({ ...formData, tier })}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                              formData.tier === tier
                                ? isDark
                                  ? "bg-white/10 text-white shadow-xs"
                                  : "bg-white text-gray-900 shadow-xs"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          User ID
                        </label>
                        <input
                          type="text"
                          value={formData.userId}
                          onChange={(e) =>
                            setFormData({ ...formData, userId: e.target.value })
                          }
                          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                          }`}
                          placeholder="e.g. user_123"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Max IP Slots
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.maxIpSlots}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxIpSlots: parseInt(e.target.value) || 1,
                            })
                          }
                          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-transform active:scale-[0.98] ${
                        isDark
                          ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      }`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          Generate Key <Sparkles size={18} />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                    <h3
                      className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      License Generated!
                    </h3>
                    <p
                      className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      This key will only be shown once. Please save it securely.
                    </p>

                    <div
                      className={`p-4 rounded-xl border mb-6 relative group ${
                        isDark
                          ? "bg-black/40 border-white/10"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <code
                        className={`font-mono text-lg break-all ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                      >
                        {createdKey}
                      </code>
                      <button
                        onClick={copyToClipboard}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDark
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                        }`}
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    <button
                      onClick={handleClose}
                      className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        isDark
                          ? "bg-white/10 hover:bg-white/15 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
