import React from "react";
import { ArrowCounterClockwise, PencilSimple } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface OrderDetailsFooterProps {
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
  onClose: () => void;
  onSave: () => void;
  onRefund?: () => void;
  canRefund?: boolean;
  lastEditDate: string;
  isSuperAdmin?: boolean;
}

export const OrderDetailsFooter: React.FC<OrderDetailsFooterProps> = ({
  mode,
  setMode,
  onClose,
  onSave,
  onRefund,
  canRefund = false,
  lastEditDate,
  isSuperAdmin = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`px-8 py-5 border-t flex justify-between items-center shrink-0 ${
        isDark ? "border-white/10" : "border-gray-100"
      }`}
    >
      <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        Last edit: {lastEditDate}
      </div>
      <div className="flex gap-3">
        {mode === "view" ? (
          <>
            <button
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Close
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setMode("edit")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? "bg-white/[0.06] border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                <PencilSimple size={16} />
                Edit
              </button>
            )}
            {canRefund && onRefund && (
              <button
                onClick={onRefund}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                    : "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                }`}
              >
                <ArrowCounterClockwise size={16} />
                Refund
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setMode("view")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};
