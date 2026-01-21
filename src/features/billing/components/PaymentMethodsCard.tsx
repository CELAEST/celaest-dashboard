"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;
}

export const PaymentMethodsCard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2026",
      isDefault: true,
      holderName: "John Doe",
    },
    {
      id: "2",
      type: "mastercard",
      last4: "8888",
      expiryMonth: "08",
      expiryYear: "2027",
      isDefault: false,
      holderName: "John Doe",
    },
  ]);

  const handleSetDefault = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    const method = methods.find((m) => m.id === id);
    if (method?.isDefault && methods.length > 1) {
      alert(
        "Cannot delete default payment method. Please set another card as default first."
      );
      return;
    }
    if (methods.length === 1) {
      alert(
        "Cannot delete the only payment method associated with an active subscription."
      );
      return;
    }
    setMethods(methods.filter((m) => m.id !== id));
    setActiveMenu(null);
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case "visa":
        return isDark
          ? "from-blue-500/20 to-blue-600/10"
          : "from-blue-500/10 to-blue-600/5";
      case "mastercard":
        return isDark
          ? "from-orange-500/20 to-orange-600/10"
          : "from-orange-500/10 to-orange-600/5";
      case "amex":
        return isDark
          ? "from-purple-500/20 to-purple-600/10"
          : "from-purple-500/10 to-purple-600/5";
      default:
        return isDark
          ? "from-gray-500/20 to-gray-600/10"
          : "from-gray-500/10 to-gray-600/5";
    }
  };

  const getCardIconColor = (type: string) => {
    switch (type) {
      case "visa":
        return "text-blue-500";
      case "mastercard":
        return "text-orange-500";
      case "amex":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      className={`rounded-2xl border p-6 ${
        isDark
          ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10 backdrop-blur-sm"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Payment Methods
          </h3>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}
          >
            Manage your payment information securely
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2.5 rounded-xl transition-all ${
            isDark
              ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
          }`}
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Payment Cards */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {methods.map((method) => (
            <motion.div
              key={method.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative rounded-xl border overflow-hidden bg-linear-to-r ${getCardColor(
                method.type
              )} ${isDark ? "border-white/10" : "border-gray-200"}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Card Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-white/5" : "bg-white"
                      }`}
                    >
                      <CreditCard
                        size={24}
                        className={getCardIconColor(method.type)}
                      />
                    </div>

                    {/* Card Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-bold uppercase ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {method.type}
                        </span>
                        {method.isDefault && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              isDark
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-sm font-mono ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        •••• •••• •••• {method.last4}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          isDark ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === method.id ? null : method.id
                        )
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "hover:bg-white/10 text-gray-400 hover:text-white"
                          : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    <AnimatePresence>
                      {activeMenu === method.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`absolute right-0 top-12 w-52 rounded-xl border shadow-xl z-20 overflow-hidden ${
                            isDark
                              ? "bg-gray-900 border-white/10"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {!method.isDefault && (
                            <button
                              onClick={() => handleSetDefault(method.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                isDark
                                  ? "text-gray-300 hover:bg-white/5"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <Check size={16} />
                              Set as Default
                            </button>
                          )}
                          <button
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                              isDark
                                ? "text-gray-300 hover:bg-white/5"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Edit2 size={16} />
                            Edit Details
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t ${
                              isDark
                                ? "text-red-400 hover:bg-red-500/10 border-white/5"
                                : "text-red-600 hover:bg-red-50 border-gray-200"
                            }`}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Security Notice */}
      <div
        className={`p-4 rounded-xl border ${
          isDark
            ? "bg-blue-500/5 border-blue-500/20"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="flex gap-3">
          <AlertCircle
            size={16}
            className={`mt-0.5 shrink-0 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <div>
            <p
              className={`text-xs font-semibold mb-1 ${
                isDark ? "text-blue-300" : "text-blue-900"
              }`}
            >
              Bank-Level Security
            </p>
            <p
              className={`text-xs ${
                isDark ? "text-blue-400/80" : "text-blue-700/80"
              }`}
            >
              All payment data is encrypted using industry-standard 256-bit
              encryption. We never store your full card number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
