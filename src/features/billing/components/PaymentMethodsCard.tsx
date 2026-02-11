"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Shield } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AddPaymentMethodModal } from "./modals/AddPaymentMethodModal";
import { EditPaymentMethodModal } from "./modals/EditPaymentMethodModal";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { PaymentMethodItem } from "./payment-methods/PaymentMethodItem";
import { PaymentMethod } from "../types";

export const PaymentMethodsCard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    methods,
    isLoading,
    error,
    activeMenu,
    setActiveMenu,
    handleSetDefault,
    handleDelete,
    handleUpdateMethod,
  } = usePaymentMethods();

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );

  const handleEditClick = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsEditCardOpen(true);
    setActiveMenu(null);
  };

  const onUpdate = (updatedMethod: PaymentMethod) => {
    handleUpdateMethod(updatedMethod);
    setIsEditCardOpen(false);
    setEditingMethod(null);
  };

  // Click outside to close menu
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
  }, [activeMenu, setActiveMenu]);

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
            className={`absolute inset-0 ${
              isDark ? "bg-cyan-500/10" : "bg-blue-400/5"
            }`}
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${
                isDark ? "rgba(6,182,212,0.15)" : "rgba(59,130,246,0.15)"
              } 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3
                className={`text-xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Payment Methods
              </h3>
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-cyan-200/50" : "text-blue-600/70"
                }`}
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
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 mb-4 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-24 rounded-2xl animate-pulse ${isDark ? "bg-white/5" : "bg-slate-200/50"}`}
                  />
                ))}
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            ) : methods.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  No payment methods saved.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {methods.map((method) => (
                  <PaymentMethodItem
                    key={method.id}
                    method={method}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    onSetDefault={handleSetDefault}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            )}
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
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                All payment data is encrypted using industry standard 256-bit
                encryption. We never store your full card number.
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddPaymentMethodModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
      />

      <EditPaymentMethodModal
        isOpen={isEditCardOpen}
        onClose={() => setIsEditCardOpen(false)}
        onSave={onUpdate}
        method={editingMethod}
      />
    </>
  );
};
