import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { Plan } from "@/features/billing/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "@/features/billing/api/billing.api";
import { toast } from "sonner";

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
      isActive: true, // Only for updates, but good to track
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-[#0a0a0a]/80 dark:backdrop-blur-2xl border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-white/5">
          <DialogTitle className="text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white">
            {isEditing ? "Edit Subscription Plan" : "Create New Plan"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? "Modify the details of the active plan."
              : "Add a new plan to the system catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="name"
              >
                Plan Name
              </Label>
              <Input
                id="name"
                className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl"
                placeholder="e.g. Pro Tier"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="code"
              >
                Unique Code
              </Label>
              <Input
                id="code"
                className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl font-mono text-xs"
                placeholder="e.g. plan_pro_m"
                {...register("code", { required: "Code is required" })}
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="priceMonthly"
              >
                Monthly Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="priceMonthly"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-7 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl font-mono"
                  {...register("priceMonthly", { required: "Required" })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="priceYearly"
              >
                Yearly Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="priceYearly"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-7 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl font-mono"
                  {...register("priceYearly", { required: "Required" })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="sortOrder"
              >
                Sort Order
              </Label>
              <Input
                id="sortOrder"
                type="number"
                className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl"
                {...register("sortOrder")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="currency"
              >
                Currency
              </Label>
              <Input
                id="currency"
                className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl uppercase font-mono"
                {...register("currency")}
                placeholder="usd"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 p-4 border rounded-2xl bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/5">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold text-gray-900 dark:text-white">
                Public Visibility
              </Label>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                Can users see this plan?
              </p>
            </div>
            <Controller
              control={control}
              name="isPublic"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {isEditing && (
            <div className="flex items-center justify-between mt-2 p-4 border rounded-2xl bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/5">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-gray-900 dark:text-white">
                  Active Status
                </Label>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                  Is this plan accepting subs?
                </p>
              </div>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          )}

          <DialogFooter className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
            <Button
              variant="outline"
              type="button"
              className="rounded-xl border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 dark:hover:bg-white/5 font-bold"
              onClick={onClose}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-6 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 font-bold"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
