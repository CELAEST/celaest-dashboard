"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Plus, Shield, CreditCard } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { AddPaymentMethodModal } from "./modals/AddPaymentMethodModal";
import { EditPaymentMethodModal } from "./modals/EditPaymentMethodModal";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { PaymentMethodItem } from "./payment-methods/PaymentMethodItem";
import { PaymentMethod } from "../types";
import { useTranslations } from "next-intl";

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
    refresh,
  } = usePaymentMethods();
  const t = useTranslations("billing");

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

  const onUpdate = () => {
    refresh();
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
        className={`relative w-full rounded-2xl transition-all duration-200 border p-4 sm:p-5 flex flex-col h-full min-h-0 overflow-hidden ${
          isDark
            ? "bg-[#09090b]/80 border-white/6 backdrop-blur-xl hover:border-white/10"
            : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
        }`}
      >
        <div className="relative flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                  isDark
                    ? "bg-white/[0.04] border-white/8 text-white/60"
                    : "bg-gray-100 border-gray-200 text-gray-600"
                }`}
              >
                <CreditCard size={14} />
              </div>
              <div>
                <h3
                  className={`text-sm sm:text-base font-semibold tracking-tight ${
                    isDark ? "text-zinc-100" : "text-gray-900"
                  }`}
                >
                  {t("payment_methods")}
                </h3>
                <p
                  className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  {t("secure_billing_management")}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddCardOpen(true)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? "border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              title={t("add_payment_method")}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Payment Cards - Scrollable Section */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 mb-3 custom-scrollbar min-h-0">
            {isLoading ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-20 rounded-xl animate-pulse ${
                      isDark ? "bg-white/[0.02] border border-white/6" : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            ) : methods.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p
                  className={`text-xs font-mono ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  {t("no_payment_methods")}
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
            className={`mt-auto pt-3 border-t flex items-center gap-2.5 ${
              isDark ? "border-white/6 text-white/40" : "border-gray-200 text-gray-500"
            }`}
          >
            <Shield size={14} className={isDark ? "text-white/50" : "text-gray-400"} />
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-mono uppercase tracking-wider block font-semibold ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                {t("bank_level_security")}
              </span>
              <span className="text-[10px] font-mono text-white/40 block truncate">
                {t("bank_level_security_desc")}
              </span>
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
