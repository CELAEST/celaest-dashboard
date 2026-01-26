"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  Shield,
  CreditCard as CardIcon,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AddPaymentMethodModal } from "./modals/AddPaymentMethodModal";
import { EditPaymentMethodModal } from "./modals/EditPaymentMethodModal";

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
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
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
    {
      id: "3",
      type: "amex",
      last4: "1001",
      expiryMonth: "11",
      expiryYear: "2028",
      isDefault: false,
      holderName: "John Doe",
    },
    {
      id: "4",
      type: "visa",
      last4: "5555",
      expiryMonth: "03",
      expiryYear: "2029",
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

  const handleEditClick = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsEditCardOpen(true);
    setActiveMenu(null);
  };

  const handleUpdateMethod = (updatedMethod: PaymentMethod) => {
    setMethods(methods.map((m) => (m.id === updatedMethod.id ? updatedMethod : m)));
    setIsEditCardOpen(false);
    setEditingMethod(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".payment-method-row")) {
          setActiveMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

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
    <>
      <div
        className={`relative w-full rounded-3xl transition-all duration-500 hover:shadow-2xl flex flex-col h-full overflow-hidden lg:max-h-[560px] ${
          isDark
            ? "bg-linear-to-br from-cyan-900/40 via-blue-900/20 to-indigo-900/40 backdrop-blur-2xl border border-cyan-500/20"
            : "bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-xl"
        }`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className={`absolute inset-0 ${isDark ? "bg-cyan-500/10" : "bg-blue-400/5"}`}
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "rgba(6,182,212,0.15)" : "rgba(59,130,246,0.15)"} 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative p-6 sm:p-8 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h3
                className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Payment Methods
              </h3>
              <p
                className={`text-xs mt-1 ${isDark ? "text-cyan-200/50" : "text-blue-600/70"}`}
              >
                Secure billing management
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddCardOpen(true)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                isDark
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 shadow-cyan-900/20"
                  : "bg-blue-100 border border-blue-200 text-blue-600 hover:bg-blue-200"
              }`}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Payment Cards - Scrollable Section */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 mb-6 custom-scrollbar">
            <AnimatePresence>
              {methods.map((method) => (
                <motion.div
                  key={method.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer border payment-method-row ${
                    activeMenu === method.id ? "z-30 overflow-visible" : "z-10 overflow-hidden"
                  } ${getCardGradient(method.type)}`}
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

                    {/* Actions Menu (Radix UI) */}
                    <div className="relative">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg outline-none ${
                              isDark
                                ? "hover:bg-white/10 text-gray-400"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            align="end"
                            sideOffset={8}
                            className={`w-52 rounded-xl border shadow-2xl overflow-hidden z-[99999] animate-in fade-in zoom-in duration-200 ${
                              isDark
                                ? "bg-gray-900 border-white/10"
                                : "bg-white border-gray-200"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!method.isDefault && (
                              <DropdownMenu.Item
                                onClick={() => handleSetDefault(method.id)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer outline-none ${
                                  isDark
                                    ? "text-gray-300 hover:bg-white/5 focus:bg-white/5"
                                    : "text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                                }`}
                              >
                                <Check size={16} />
                                Set as Default
                              </DropdownMenu.Item>
                            )}
                            <DropdownMenu.Item
                              onClick={() => handleEditClick(method)}
                              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer outline-none ${
                                isDark
                                  ? "text-gray-300 hover:bg-white/5 focus:bg-white/5"
                                  : "text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                              }`}
                            >
                              <Edit2 size={16} />
                              Edit Details
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className={`h-px ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
                            <DropdownMenu.Item
                              onClick={() => handleDelete(method.id)}
                              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer outline-none font-medium ${
                                isDark
                                  ? "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                                  : "text-red-600 hover:bg-red-50 focus:bg-red-50"
                              }`}
                            >
                              <Trash2 size={16} />
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
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

      <AddPaymentMethodModal
        darkMode={isDark}
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
      />

      <EditPaymentMethodModal
        darkMode={isDark}
        isOpen={isEditCardOpen}
        onClose={() => setIsEditCardOpen(false)}
        onSave={handleUpdateMethod}
        method={editingMethod}
      />
    </>
  );
};
