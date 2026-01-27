"use client";

import React from "react";
import { motion } from "motion/react";
import { CreditCard, MoreVertical, Check, Edit2, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { PaymentMethod } from "../../types";
import {
  getCardGradient,
  getCardIconBg,
  getCardIconColor,
} from "../../utils/styles";

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`group relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer border payment-method-row ${
          activeMenu === method.id
            ? "z-30 overflow-visible"
            : "z-10 overflow-hidden"
        } ${getCardGradient(method.type, isDark)}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCardIconBg(
                method.type,
                isDark,
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
            <DropdownMenu.Root
              onOpenChange={(open) => setActiveMenu(open ? method.id : null)}
            >
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
                  className={`w-52 rounded-xl border shadow-2xl overflow-hidden z-99999 animate-in fade-in zoom-in duration-200 ${
                    isDark
                      ? "bg-gray-900 border-white/10"
                      : "bg-white border-gray-200"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!method.isDefault && (
                    <DropdownMenu.Item
                      onClick={() => onSetDefault(method.id)}
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
                    onClick={() => onEdit(method)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer outline-none ${
                      isDark
                        ? "text-gray-300 hover:bg-white/5 focus:bg-white/5"
                        : "text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                    }`}
                  >
                    <Edit2 size={16} />
                    Edit Details
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator
                    className={`h-px ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                  />
                  <DropdownMenu.Item
                    onClick={() => onDelete(method.id)}
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
    );
  },
);

PaymentMethodItem.displayName = "PaymentMethodItem";
