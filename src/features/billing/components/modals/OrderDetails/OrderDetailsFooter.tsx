import React from "react";
import { Save, Edit2 } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface OrderDetailsFooterProps {
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
  onClose: () => void;
  onSave: () => void;
  lastEditDate: string;
}

export const OrderDetailsFooter: React.FC<OrderDetailsFooterProps> = ({
  mode,
  setMode,
  onClose,
  onSave,
  lastEditDate,
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
            <button
              onClick={() => setMode("edit")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 ${
                isDark
                  ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                  : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
              }`}
            >
              <Edit2 size={16} />
              Edit Details
            </button>
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
            <button
              onClick={onSave}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 ${
                isDark
                  ? "bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 shadow-green-500/20"
                  : "bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-green-500/20"
              }`}
            >
              <Save size={16} />
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};
