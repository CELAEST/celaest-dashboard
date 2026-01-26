"use client";

import {
  X,
  CreditCard,
  Lock,
  User,
  Mail,
  MapPin,
  Building,
  Sparkles,
  Check,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;
}

interface EditPaymentMethodModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: PaymentMethod) => void;
  method: PaymentMethod | null;
}

export function EditPaymentMethodModal({
  darkMode,
  isOpen,
  onClose,
  onSave,
  method,
}: EditPaymentMethodModalProps) {
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [billingEmail, setBillingEmail] = useState("john@example.com"); // Mock initial value
  const [billingAddress, setBillingAddress] = useState("123 Main Street"); // Mock initial value
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (method && isOpen) {
      setCardName(method.holderName);
      setExpiryMonth(method.expiryMonth);
      setExpiryYear(method.expiryYear);
      setErrors({});
    }
  }, [method, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!cardName || cardName.length < 3) newErrors.cardName = "Name is required";
    if (!expiryMonth || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      newErrors.expiryMonth = "Invalid month";
    }
    if (!expiryYear || parseInt(expiryYear) < 26) newErrors.expiryYear = "Invalid year";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm() && method) {
      onSave({
        ...method,
        holderName: cardName,
        expiryMonth,
        expiryYear,
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div
              className={`relative w-full max-w-4xl max-h-[85vh] rounded-3xl transition-all duration-300 flex flex-col ${
                darkMode ? "bg-gray-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-cyan-500/5" : "bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6 border-b border-white/10 shrink-0">
                <button onClick={onClose} className={`absolute right-4 top-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 ${darkMode ? "bg-white/5 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}>
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${darkMode ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20" : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20"}`}>
                    <CreditCard className={`w-8 h-8 ${darkMode ? "text-cyan-400" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Edit Payment Method</h2>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Update details for your {method?.type.toUpperCase()} card</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="p-6 md:w-1/2 flex flex-col justify-center">
                  <motion.div
                    className={`relative rounded-2xl p-6 mb-6 aspect-[1.586] overflow-hidden ${darkMode ? "bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20" : "bg-linear-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 shadow-2xl"}`}
                  >
                    <div className="relative h-full flex flex-col justify-between z-10">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-9 rounded-lg ${darkMode ? "bg-linear-to-br from-yellow-400/40 to-yellow-600/40" : "bg-linear-to-br from-yellow-400/60 to-yellow-600/60"}`} />
                        <div className={`text-xs font-black tracking-widest ${darkMode ? "text-cyan-300" : "text-blue-700"}`}>{method?.type.toUpperCase()}</div>
                      </div>
                      <div className={`text-xl font-mono tracking-widest ${darkMode ? "text-white" : "text-gray-900"}`}>•••• •••• •••• {method?.last4}</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className={`text-[10px] uppercase font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Card Holder</div>
                          <div className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{cardName || "YOUR NAME"}</div>
                        </div>
                        <div>
                          <div className={`text-[10px] uppercase font-bold mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Expires</div>
                          <div className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : "MM/YY"}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <div className={`p-4 rounded-xl flex items-start gap-3 ${darkMode ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-emerald-500/5 border border-emerald-500/20"}`}>
                    <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className={`text-xs font-bold mb-1 flex items-center gap-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}><Sparkles className="w-3 h-3" /> Secure Configuration</div>
                      <div className={`text-[10px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Full card numbers are never stored on our servers. All updates are processed via secure encrypted tokens.</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:w-1/2 overflow-y-auto space-y-6">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Account Details</label>
                    <div className="space-y-4">
                      <div>
                        <div className="relative">
                          <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${focusedField === "cardName" ? (darkMode ? "text-cyan-400" : "text-blue-600") : "text-gray-500"}`} />
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            onFocus={() => setFocusedField("cardName")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="CARDHOLDER NAME"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${darkMode ? "bg-black/40 border border-white/10 text-white focus:border-cyan-500" : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"}`}
                          />
                        </div>
                        {errors.cardName && <div className="text-[10px] text-red-500 mt-1 font-bold">{errors.cardName}</div>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="relative">
                            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${focusedField === "expiryMonth" ? (darkMode ? "text-cyan-400" : "text-blue-600") : "text-gray-500"}`} />
                            <input
                              type="text"
                              value={expiryMonth}
                              onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, "").substring(0, 2))}
                              onFocus={() => setFocusedField("expiryMonth")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="MM"
                              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold text-center transition-all duration-300 ${darkMode ? "bg-black/40 border border-white/10 text-white" : "bg-white border border-gray-300 text-gray-900"}`}
                            />
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={expiryYear}
                            onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, "").substring(0, 2))}
                            onFocus={() => setFocusedField("expiryYear")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="YY"
                            className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-center transition-all duration-300 ${darkMode ? "bg-black/40 border border-white/10 text-white" : "bg-white border border-gray-300 text-gray-900"}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button onClick={handleSave} className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${darkMode ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 hover:scale-[1.02]" : "bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/20 hover:scale-[1.02]"}`}>
                      <Check className="w-5 h-5" /> Save Changes
                    </button>
                    <button onClick={onClose} className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${darkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      Discard Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
