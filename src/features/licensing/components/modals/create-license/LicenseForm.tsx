import { logger } from "@/lib/logger";
import React, { useEffect, useState } from "react";
import { LicenseFormData } from "@/features/licensing/hooks/useCreateLicense";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { licensingService } from "@/features/licensing/services/licensing.service";
import { SubscriptionPlan } from "@/features/licensing/types";

interface LicenseFormProps {
  form: UseFormReturn<LicenseFormData>;
  loading: boolean;
}

export const LicenseForm: React.FC<LicenseFormProps> = ({ form, loading: _loading }) => {
  const { watch, setValue, formState: { errors } } = form;
  const currentCycle = watch("billing_cycle");
  const currentPlanId = watch("plan_id");

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (licensingService.isServiceReady()) {
          const { plans } = await licensingService.getPlans();
          setPlans(plans);
          if (plans.length > 0 && !currentPlanId) {
            setValue("plan_id", plans[0].id);
          }
        }
      } catch (err: unknown) {
        logger.error("Failed to fetch plans", err);
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

  const CYCLES = ["monthly", "quarterly", "yearly"] as const;

  return (
    <div className="space-y-5">
      {/* Billing Cycle */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
          Billing Cycle
        </label>
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
          {CYCLES.map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setValue("billing_cycle", cycle)}
              className={`flex-1 py-2 text-xs font-black rounded-xl capitalize tracking-wider transition-all ${
                currentCycle === cycle
                  ? "bg-amber-500/20 text-amber-400 shadow-sm border border-amber-500/30"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {cycle}
            </button>
          ))}
        </div>
        {errors.billing_cycle && (
          <p className="text-red-400 text-xs mt-1">{errors.billing_cycle.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Plan Selector */}
        {fetchingPlans ? (
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
              Subscription Plan
            </label>
            <div className="w-full h-12 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="plan_id"
            render={({ field }) => (
              <FormItem>
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                  Subscription Plan
                </label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={plans.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-2xl bg-white/5 border-white/10 text-white text-sm px-5 mt-2">
                      <SelectValue
                        placeholder={plans.length === 0 ? "No plans available" : "Select a plan..."}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {planOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                Notes (optional)
              </label>
              <FormControl>
                <input
                  {...field}
                  placeholder="Internal notes..."
                  className="w-full mt-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {plans.length === 0 && !fetchingPlans && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
          No active plans found. Please seed the plans first.
        </div>
      )}
    </div>
  );
};