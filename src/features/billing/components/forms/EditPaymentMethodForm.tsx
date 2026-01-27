import React from "react";
import { User, Calendar, Check } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface EditPaymentMethodFormProps {
  formState: {
    cardName: string;
    expiryMonth: string;
    expiryYear: string;
  };
  setters: {
    setCardName: (value: string) => void;
    setExpiryMonth: (value: string) => void;
    setExpiryYear: (value: string) => void;
  };
  errors: Record<string, string>;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  handleSave: () => void;
  onClose: () => void;
}

export const EditPaymentMethodForm: React.FC<EditPaymentMethodFormProps> = ({
  formState,
  setters,
  errors,
  focusedField,
  setFocusedField,
  handleSave,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="p-6 md:w-1/2 overflow-y-auto space-y-6"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSave();
        }
      }}
    >
      <div>
        <label
          className={`block text-xs font-black uppercase tracking-widest mb-3 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Account Details
        </label>
        <div className="space-y-4">
          <div>
            <div className="relative">
              <User
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  focusedField === "cardName"
                    ? isDark
                      ? "text-cyan-400"
                      : "text-blue-600"
                    : "text-gray-500"
                }`}
              />
              <input
                type="text"
                autoFocus
                value={formState.cardName}
                onChange={(e) =>
                  setters.setCardName(e.target.value.toUpperCase())
                }
                onFocus={() => setFocusedField("cardName")}
                onBlur={() => setFocusedField(null)}
                placeholder="CARDHOLDER NAME"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isDark
                    ? "bg-black/40 border border-white/10 text-white focus:border-cyan-500"
                    : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.cardName && (
              <div className="text-[10px] text-red-500 mt-1 font-bold">
                {errors.cardName}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <Calendar
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    focusedField === "expiryMonth"
                      ? isDark
                        ? "text-cyan-400"
                        : "text-blue-600"
                      : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  value={formState.expiryMonth}
                  onChange={(e) =>
                    setters.setExpiryMonth(
                      e.target.value.replace(/\D/g, "").substring(0, 2),
                    )
                  }
                  onFocus={() => setFocusedField("expiryMonth")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="MM"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold text-center transition-all duration-300 ${
                    isDark
                      ? "bg-black/40 border border-white/10 text-white"
                      : "bg-white border border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>
            <div>
              <input
                type="text"
                value={formState.expiryYear}
                onChange={(e) =>
                  setters.setExpiryYear(
                    e.target.value.replace(/\D/g, "").substring(0, 2),
                  )
                }
                onFocus={() => setFocusedField("expiryYear")}
                onBlur={() => setFocusedField(null)}
                placeholder="YY"
                className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-center transition-all duration-300 ${
                  isDark
                    ? "bg-black/40 border border-white/10 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
            isDark
              ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 hover:scale-[1.02]"
              : "bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/20 hover:scale-[1.02]"
          }`}
        >
          <Check className="w-5 h-5" /> Save Changes
        </button>
        <button
          onClick={onClose}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
            isDark
              ? "bg-white/5 text-gray-400 hover:bg-white/10"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Discard Changes
        </button>
      </div>
    </div>
  );
};
