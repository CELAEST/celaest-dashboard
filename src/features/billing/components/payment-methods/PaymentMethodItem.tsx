"use client";

import React from "react";
import { motion } from "motion/react";
import { CreditCard, DotsThreeVertical, Check, PencilSimple, Trash } from "@phosphor-icons/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { PaymentMethod } from "../../types";

interface PaymentMethodItemProps {
  method: PaymentMethod;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  onSetDefault: (id: string) => void;
  onEdit: (method: PaymentMethod) => void;
  onDelete: (id: string) => void;
}

export const PaymentMethodItem = React.memo(
  ({
    method,
    activeMenu,
    setActiveMenu,
    onSetDefault,
    onEdit,
    onDelete,
  }: PaymentMethodItemProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`group relative rounded-xl p-3.5 border transition-colors duration-150 payment-method-row ${
          activeMenu === method.id
            ? "z-30 overflow-visible"
            : "z-10 overflow-hidden"
        } ${
          isDark
            ? "bg-white/[0.02] border-white/6 hover:border-white/12 hover:bg-white/[0.035]"
            : "bg-white border-gray-200/80 hover:border-gray-300 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                isDark
                  ? "bg-white/[0.04] border-white/8 text-white/70"
                  : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                    isDark ? "text-zinc-100" : "text-gray-900"
                  }`}
                >
                  {method.type}
                </span>
                {method.isDefault && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest font-bold ${
                      isDark
                        ? "bg-white/[0.08] text-white border border-white/10 shadow-xs"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    Default
                  </span>
                )}
              </div>
              <div
                className={`text-xs font-mono mt-0.5 tracking-wider ${
                  isDark ? "text-zinc-300" : "text-gray-700"
                }`}
              >
                •••• •••• •••• {method.last4}
              </div>
              <div
                className={`text-[10px] font-mono mt-0.5 ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                Exp: {method.expiryMonth}/{method.expiryYear}
              </div>
            </div>
          </div>

          {/* Actions Menu (Radix UI) */}
          <div className="relative shrink-0">
            <DropdownMenu.Root
              onOpenChange={(open) => setActiveMenu(open ? method.id : null)}
            >
              <DropdownMenu.Trigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg outline-none cursor-pointer ${
                    isDark
                      ? "text-white/40 hover:text-white hover:bg-white/10"
                      : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <DotsThreeVertical className="w-4 h-4" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={6}
                  className={`w-44 rounded-xl border p-1 z-99999 animate-in fade-in zoom-in-95 duration-150 ${
                    isDark
                      ? "bg-[#09090b] border-white/10 text-zinc-200 shadow-2xl"
                      : "bg-white border-gray-200 text-gray-800 shadow-xl"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!method.isDefault && (
                    <DropdownMenu.Item
                      onClick={() => onSetDefault(method.id)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer outline-none ${
                        isDark
                          ? "text-zinc-200 hover:bg-white/10 focus:bg-white/10"
                          : "text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                      }`}
                    >
                      <Check size={13} />
                      Set as Default
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Item
                    onClick={() => onEdit(method)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer outline-none ${
                      isDark
                        ? "text-zinc-200 hover:bg-white/10 focus:bg-white/10"
                        : "text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                    }`}
                  >
                    <PencilSimple size={13} />
                    Edit Details
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator
                    className={`my-1 h-px ${isDark ? "bg-white/6" : "bg-gray-100"}`}
                  />
                  <DropdownMenu.Item
                    onClick={() => onDelete(method.id)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer outline-none font-medium ${
                      isDark
                        ? "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                        : "text-red-600 hover:bg-red-50 focus:bg-red-50"
                    }`}
                  >
                    <Trash size={13} />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </motion.div>
    );
  },
);

PaymentMethodItem.displayName = "PaymentMethodItem";
