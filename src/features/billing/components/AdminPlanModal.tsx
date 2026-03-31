import React, { useEffect } from "react";
import { CreditCard, X, FloppyDisk } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { Plan } from "@/features/billing/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "@/features/billing/api/billing.api";
import { toast } from "sonner";
import { BillingModal } from "./modals/shared/BillingModal";

interface AdminPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
  token: string;
}

interface PlanFormData {
  name: string;
  code: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  sortOrder: number;
  isPublic: boolean;
  isActive: boolean;
}

export const AdminPlanModal: React.FC<AdminPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  token,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!plan;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      code: "",
      priceMonthly: 0,
      priceYearly: 0,
      currency: "usd",
      sortOrder: 0,
      isPublic: true,
      isActive: true,
    },
  });

  useEffect(() => {
    if (plan && isOpen) {
      reset({
        name: plan.name,
        code: plan.code,
        priceMonthly: plan.price_monthly || 0,
        priceYearly: plan.price_yearly || 0,
        currency: plan.currency || "usd",
        sortOrder: plan.sort_order || 0,
        isPublic: plan.is_public ?? true,
        isActive: plan.is_active ?? true,
      });
    } else if (!plan && isOpen) {
      reset({
        name: "",
        code: "",
        priceMonthly: 0,
        priceYearly: 0,
        currency: "usd",
        sortOrder: 0,
        isPublic: true,
        isActive: true,
      });
    }
  }, [plan, isOpen, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      const payload = {
        name: data.name,
        code: data.code,
        price_monthly: Number(data.priceMonthly),
        price_yearly: Number(data.priceYearly),
        currency: data.currency,
        sort_order: Number(data.sortOrder),
        is_public: data.isPublic,
        is_active: data.isActive,
      };

      if (isEditing) {
        return billingApi.updatePlan("system", token, plan.id, payload);
      } else {
        return billingApi.createPlan("system", token, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      toast.success(`Plan ${isEditing ? "updated" : "created"} successfully!`);
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to save plan");
    },
  });

  const onSubmit = (data: PlanFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <BillingModal isOpen={isOpen} onClose={onClose} className="max-w-xl w-full" showCloseButton={false}>
      <div className="relative w-full flex flex-col" style={{ minWidth: '36rem' }}>
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-teal-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(20,184,166,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div className="relative w-full px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-teal-600/8 to-transparent" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
        <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-teal-500/50 to-transparent" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-teal-400 border border-white/10 shadow-lg shadow-teal-500/10">
            <CreditCard size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
              {isEditing ? "Edit Plan" : "Create Plan"}
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              {isEditing ? "Modify active plan details" : "Add to system catalog"}
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col flex-1 min-h-0">
        <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Plan Name</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20"
                placeholder="e.g. Pro Tier"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Unique Code</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm font-mono focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20"
                placeholder="e.g. plan_pro_m"
                {...register("code", { required: "Code is required" })}
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Monthly Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-8 pr-5 py-3 text-white text-sm font-mono focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20"
                  {...register("priceMonthly", { required: "Required" })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Yearly Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-8 pr-5 py-3 text-white text-sm font-mono focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20"
                  {...register("priceYearly", { required: "Required" })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Sort Order</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20"
                {...register("sortOrder")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Currency</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm font-mono uppercase focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20"
                placeholder="usd"
                {...register("currency")}
              />
            </div>
          </div>

          {/* Toggle: Public */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
            <div>
              <p className="text-sm font-bold text-white">Public Visibility</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/30">Can users see this plan?</p>
            </div>
            <Controller
              control={control}
              name="isPublic"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          {/* Toggle: Active (edit only) */}
          {isEditing && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
              <div>
                <p className="text-sm font-bold text-white">Active Status</p>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/30">Is this plan accepting subs?</p>
              </div>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative w-full shrink-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-500/50 to-transparent" />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "18rem",
              height: "8rem",
              background: "radial-gradient(circle at bottom left, rgba(20,184,166,0.07), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div className="relative px-8 py-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saveMutation.isPending}
              className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 py-3 rounded-2xl bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <FloppyDisk size={16} />
              {saveMutation.isPending ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </div>
      </form>
      </div>
    </BillingModal>
  );
};
