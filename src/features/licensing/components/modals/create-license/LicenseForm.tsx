import React from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { LicenseFormData } from "@/features/licensing/hooks/useCreateLicense";
import { UseFormReturn } from "react-hook-form";

interface LicenseFormProps {
  form: UseFormReturn<LicenseFormData>;
  onSubmit: () => void;
  loading: boolean;
}

export const LicenseForm: React.FC<LicenseFormProps> = ({
  form,
  onSubmit,
  loading,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentTier = watch("tier");

  return (
    <div className="space-y-4">
      {/* Tier selection - Custom Input controlled via setValue */}
      <div>
        <label
          className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          License Tier
        </label>
        <div
          className={`flex bg-gray-100 rounded-lg p-1 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
        >
          {(["basic", "pro", "enterprise"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setValue("tier", tier)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                currentTier === tier
                  ? isDark
                    ? "bg-white/10 text-white shadow-xs"
                    : "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
        {errors.tier && (
          <p className="text-red-500 text-xs mt-1">{errors.tier.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            User ID
          </label>
          <input
            {...register("userId")}
            type="text"
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
            placeholder="e.g. user_123"
          />
          {errors.userId && (
            <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>
          )}
        </div>
        <div>
          <label
            className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Max IP Slots
          </label>
          <input
            {...register("maxIpSlots", { valueAsNumber: true })}
            type="number"
            min="1"
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          />
          {errors.maxIpSlots && (
            <p className="text-red-500 text-xs mt-1">
              {errors.maxIpSlots.message}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-transform active:scale-[0.98] ${
          isDark
            ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        ) : (
          <>
            Generate Key <Sparkles size={18} />
          </>
        )}
      </button>
    </div>
  );
};
