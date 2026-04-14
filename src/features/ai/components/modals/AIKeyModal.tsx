"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key, ShieldCheck, CircleNotch } from "@phosphor-icons/react";
import { AIPoolKey } from "../../types";

const keySchema = z.object({
  name: z.string().min(3, "Alias must be at least 3 characters"),
  provider: z.enum(["gemini", "groq", "openai", "deepseek"]),
  api_key: z.string().optional(),
  rate_limit: z.number().min(1, "Rate limit must be at least 1 RPM").optional(),
});

type KeyFormData = z.infer<typeof keySchema>;

interface AIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: KeyFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<AIPoolKey> | null;
}

export const AIKeyModal: React.FC<AIKeyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<KeyFormData>({
    resolver: zodResolver(keySchema),
    defaultValues: {
      provider: "gemini",
      rate_limit: 60,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const providerValue = watch("provider");

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          provider: initialData.provider as KeyFormData["provider"],
          api_key: "", // Don't show existing key for security
          rate_limit: initialData.rate_limit,
        });
      } else {
        reset({
          name: "",
          provider: "gemini",
          api_key: "",
          rate_limit: 60,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data: KeyFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-black/80 backdrop-blur-2xl border-white/10 text-white shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Key className="text-emerald-400" size={20} />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {initialData ? "Reconfigure Neural Key" : "Inject API Key"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            {initialData
              ? `Update settings for ${initialData.name} in the balancing pool.`
              : "Add a new credential to the resilient load-balancing pool."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 py-4"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
              Key Alias
            </label>
            <Input
              {...register("name")}
              placeholder="e.g., Primary Gemini Pro"
              className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-gray-600 h-11"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
                Provider
              </label>
              <Select
                value={providerValue}
                onValueChange={(val: KeyFormData["provider"]) =>
                  setValue("provider", val)
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-emerald-500/50 text-white h-11">
                  <SelectValue placeholder="Gemini" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="groq">Groq LPU</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
                Security
              </label>
              <div className="h-11 flex items-center gap-2 px-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  Vault Encrypted
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
                API Key Secret
              </label>
              <Input
                {...register("api_key")}
                type="password"
                placeholder={
                  initialData ? "••••••••••••" : "sk-••••••••••••••••"
                }
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-gray-600 h-11"
              />
              {errors.api_key && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {errors.api_key.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
                RPM Limit
              </label>
              <Input
                {...register("rate_limit", { valueAsNumber: true })}
                type="number"
                placeholder="60"
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-gray-600 h-11"
              />
              {errors.rate_limit && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {errors.rate_limit.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 mt-2 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white min-w-[140px] font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {isLoading ? (
                <CircleNotch className="animate-spin" size={18} />
              ) : initialData ? (
                "Update Configuration"
              ) : (
                "Authorize Key"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
