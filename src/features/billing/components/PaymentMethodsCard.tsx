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
  Shield,
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
        "Cannot delete default payment method. Please set another card as default first.",
      );
      return;
    }
    if (methods.length === 1) {
      alert(
        "Cannot delete the only payment method associated with an active subscription.",
      );
      return;
    }
    setMethods(methods.filter((m) => m.id !== id));
    setActiveMenu(null);
  };

  const getCardGradient = (type: string) => {
    switch (type) {
      case "visa":
        return isDark
          ? "bg-linear-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20"
          : "bg-linear-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20";
      case "mastercard":
        return isDark
          ? "bg-linear-to-br from-orange-500/10 to-red-500/10 border-orange-500/20"
          : "bg-linear-to-br from-orange-500/5 to-red-500/5 border-orange-500/20";
      case "amex":
        return isDark
          ? "bg-linear-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20"
          : "bg-linear-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20";
      default:
        return isDark
          ? "bg-linear-to-br from-gray-500/10 to-gray-600/10 border-gray-500/20"
          : "bg-linear-to-br from-gray-500/5 to-gray-600/5 border-gray-500/20";
    }
  };

  const getCardIconBg = (type: string) => {
    switch (type) {
      case "visa":
        return isDark ? "bg-blue-500/20" : "bg-blue-500/10";
      case "mastercard":
        return isDark ? "bg-orange-500/20" : "bg-orange-500/10";
      case "amex":
        return isDark ? "bg-purple-500/20" : "bg-purple-500/10";
      default:
        return isDark ? "bg-gray-500/20" : "bg-gray-500/10";
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
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Payment Methods
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
            }`}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>

        <p
          className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Manage your payment information securely
        </p>

        {/* Payment Cards */}
        <div className="space-y-3">
          <AnimatePresence>
            {methods.map((method) => (
              <motion.div
                key={method.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer border ${getCardGradient(
                  method.type,
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCardIconBg(
                        method.type,
                      )}`}
                    >
                      <CreditCard
                        className={`w-6 h-6 ${getCardIconColor(method.type)}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {method.type.toUpperCase()}
                        </span>
                        {method.isDefault && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              isDark
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-emerald-500/10 text-emerald-600"
                            }`}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-sm font-mono ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        •••• •••• •••• {method.last4}
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(
                          activeMenu === method.id ? null : method.id,
                        );
                      }}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg ${
                        isDark
                          ? "hover:bg-white/10 text-gray-400"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <MoreVertical className="w-5 h-5" />
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Security Notice */}
        <div
          className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
            isDark
              ? "bg-blue-500/5 border border-blue-500/20"
              : "bg-blue-500/5 border border-blue-500/20"
          }`}
        >
          <Shield className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <div
              className={`text-xs font-semibold mb-1 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Bank Level Security
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              All payment data is encrypted using industry standard 256-bit
              encryption. We never store your full card number.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
