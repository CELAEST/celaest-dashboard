import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { LicenseFormData } from "@/features/licensing/hooks/useCreateLicense";
import { UseFormReturn } from "react-hook-form";
import { FormInput, FormSelect } from "@/components/forms";
import { licensingService } from "@/features/licensing/services/licensing.service";
import { SubscriptionPlan } from "@/features/licensing/types";

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
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentCycle = watch("billing_cycle");
  const currentPlanId = watch("plan_id");

  // Fetch plans
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (licensingService.isServiceReady()) {
          const { plans } = await licensingService.getPlans();
          setPlans(plans);
          // Auto-select first plan if none selected
          if (plans.length > 0 && !currentPlanId) {
            setValue("plan_id", plans[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setFetchingPlans(false);
      }
    };
    fetchPlans();
  }, [setValue, currentPlanId]);

  const planOptions = plans.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.price_monthly ? `$${p.price_monthly}/mo` : "Free"})`,
  }));

  return (
    <div className="space-y-4">
      {/* Billing Cycle selection */}
      <div>
        <label
          className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          Billing Cycle
        </label>
        <div
          className={`flex bg-gray-100 rounded-lg p-1 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
        >
          {(["monthly", "quarterly", "yearly"] as const).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setValue("billing_cycle", cycle)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                currentCycle === cycle
                  ? isDark
                    ? "bg-white/10 text-white shadow-xs"
                    : "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cycle}
            </button>
          ))}
        </div>
        {errors.billing_cycle && (
          <p className="text-red-500 text-xs mt-1">
            {errors.billing_cycle.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plan Selector */}
        {fetchingPlans ? (
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Subscription Plan
            </label>
            <div
              className={`w-full h-[42px] rounded-xl animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`}
            />
          </div>
        ) : (
          <FormSelect
            control={form.control}
            name="plan_id"
            label="Subscription Plan"
            options={planOptions}
            placeholder={
              plans.length === 0 ? "No plans available" : "Select a plan..."
            }
            disabled={plans.length === 0}
          />
        )}

        <FormInput
          control={form.control}
          name="notes"
          label="Notes (optional)"
          placeholder="Internal notes..."
        />
      </div>

      {plans.length === 0 && !fetchingPlans && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm">
          ⚠️ No active plans found. Please run the seed script to populate
          plans.
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || plans.length === 0}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-transform active:scale-[0.98] ${
          isDark
            ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
