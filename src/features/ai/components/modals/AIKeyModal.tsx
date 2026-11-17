"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { Key, ShieldCheck, CircleNotch, Sparkle, WarningCircle } from "@phosphor-icons/react";
import { AIPoolKey, KeyIdentificationResult } from "../../types";
import { detectApiKeyPrefix, PoolProviderId } from "../../utils/detectApiKeyProvider";

const PROVIDER_VALUES = [
  "auto",
  "gemini",
  "groq",
  "openai",
  "deepseek",
  "anthropic",
  "grok",
  "openrouter",
] as const;

const keySchema = z.object({
  name: z
    .string()
    .trim()
    .refine(
      (val) => val.length === 0 || val.length >= 3,
      "Alias must be at least 3 characters or leave blank to auto-name",
    ),
  provider: z.enum(PROVIDER_VALUES),
  api_key: z.string().optional(),
  rate_limit: z.number().min(1, "Rate limit must be at least 1 RPM").optional(),
});

type KeyFormData = z.infer<typeof keySchema>;

interface AIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: KeyFormData & { verify?: boolean }) => void;
  onIdentifyKey?: (apiKey: string, provider?: string) => Promise<KeyIdentificationResult>;
  isLoading?: boolean;
  initialData?: Partial<AIPoolKey> | null;
}

export const AIKeyModal: React.FC<AIKeyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onIdentifyKey,
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
      provider: "auto",
      rate_limit: 60,
    },
  });

  const [isIdentifying, setIsIdentifying] = useState(false);
  const [probeResult, setProbeResult] = useState<KeyIdentificationResult | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestKeyRef = useRef<string>("");

  const providerValue = watch("provider");
  const apiKeyValue = watch("api_key") ?? "";
  const nameValue = watch("name") ?? "";

  useEffect(() => {
    if (isOpen) {
      setProbeResult(null);
      setIsIdentifying(false);
      if (initialData) {
        const prov = PROVIDER_VALUES.includes(initialData.provider as PoolProviderId)
          ? (initialData.provider as KeyFormData["provider"])
          : "auto";
        reset({
          name: initialData.name ?? "",
          provider: prov,
          api_key: "",
          rate_limit: initialData.rate_limit ?? 60,
        });
      } else {
        reset({
          name: "",
          provider: "auto",
          api_key: "",
          rate_limit: 60,
        });
      }
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [isOpen, initialData, reset]);

  const applyIdentification = (res: KeyIdentificationResult) => {
    setProbeResult(res);
    if (res.provider && PROVIDER_VALUES.includes(res.provider as PoolProviderId)) {
      setValue("provider", res.provider as KeyFormData["provider"], { shouldValidate: true });
    }
    if (!nameValue.trim() && res.suggested_name) {
      setValue("name", res.suggested_name, { shouldValidate: true });
    }
    if (res.recommended_rate_limit > 0) {
      setValue("rate_limit", res.recommended_rate_limit, { shouldValidate: true });
    }
  };

  const runLiveIdentification = async (rawKey: string, currentProvider?: string) => {
    const trimmed = rawKey.trim();
    if (!onIdentifyKey || trimmed.length < 14) return;
    latestKeyRef.current = trimmed;
    setIsIdentifying(true);
    try {
      const hint = currentProvider && currentProvider !== "auto" ? currentProvider : undefined;
      const res = await onIdentifyKey(trimmed, hint);
      if (latestKeyRef.current === trimmed) {
        applyIdentification(res);
      }
    } catch {
      if (latestKeyRef.current === trimmed) {
        setProbeResult(null);
      }
    } finally {
      if (latestKeyRef.current === trimmed) {
        setIsIdentifying(false);
      }
    }
  };

  const handleApiKeyChange = (val: string) => {
    setProbeResult(null);
    const trimmed = val.trim();
    const match = detectApiKeyPrefix(trimmed);
    if (match.confident && match.provider) {
      setValue("provider", match.provider, { shouldValidate: true });
      if (!nameValue.trim() && match.suggestedName) {
        setValue("name", match.suggestedName, { shouldValidate: true });
      }
      if (match.defaultRpm) {
        setValue("rate_limit", match.defaultRpm, { shouldValidate: true });
      }
    }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (onIdentifyKey && trimmed.length >= 16) {
      const hint = match.provider ?? (providerValue !== "auto" ? providerValue : undefined);
      debounceTimerRef.current = setTimeout(() => {
        void runLiveIdentification(trimmed, hint);
      }, 450);
    }
  };

  const apiKeyRegister = register("api_key", {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleApiKeyChange(e.target.value);
    },
  });

  const handleFormSubmit = (data: KeyFormData) => {
    const hasSecret = Boolean(data.api_key && data.api_key.trim().length > 0);
    onSubmit({ ...data, verify: hasSecret });
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-black/80 backdrop-blur-2xl border-white/10 text-white shadow-[0_0_50px_rgba(34,211,238,0.1)]">
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
              : "Paste any AI credential to auto-detect its provider, verify models live, and sync across all services."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 py-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
                API Key Secret
              </label>
              <Input
                {...apiKeyRegister}
                type="password"
                placeholder={initialData ? "••••••••••••" : "gsk_... / AIza... / sk-..."}
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-gray-600 h-11 font-mono"
              />
              {errors.api_key && (
                <p className="text-xs text-red-400 mt-1 ml-1">{errors.api_key.message}</p>
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
                <p className="text-xs text-red-400 mt-1 ml-1">{errors.rate_limit.message}</p>
              )}
            </div>
          </div>

          {(isIdentifying || probeResult) && (
            <div
              className={`rounded-xl border px-3.5 py-2.5 text-xs flex items-start justify-between gap-3 ${
                isIdentifying
                  ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-300"
                  : probeResult?.valid
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                    : "bg-red-500/10 border-red-500/25 text-red-300"
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                {isIdentifying ? (
                  <CircleNotch size={16} className="animate-spin shrink-0 mt-0.5" />
                ) : probeResult?.valid ? (
                  <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <WarningCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                )}
                <div className="space-y-0.5 min-w-0">
                  <p className="font-semibold truncate">
                    {isIdentifying
                      ? "Identificando proveedor y probando en vivo..."
                      : probeResult?.message}
                  </p>
                  {!isIdentifying && probeResult?.sample_models && probeResult.sample_models.length > 0 && (
                    <p className="text-[11px] font-mono text-white/70 truncate">
                      Modelos: {probeResult.sample_models.slice(0, 3).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              {onIdentifyKey && apiKeyValue.trim().length >= 14 && !isIdentifying && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void runLiveIdentification(apiKeyValue, providerValue)}
                  className="h-7 px-2.5 text-[11px] text-cyan-300 hover:text-white hover:bg-white/10 shrink-0"
                >
                  Re-test
                </Button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Sparkle size={12} weight="fill" className="text-cyan-400" />
                Provider
              </label>
              <Select
                value={providerValue}
                onValueChange={(val: KeyFormData["provider"]) =>
                  setValue("provider", val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-emerald-500/50 text-white h-11">
                  <SelectValue placeholder="Auto-Detect" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="auto">Auto-Detect (Recommended)</SelectItem>
                  <SelectItem value="groq">Groq LPU</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="grok">xAI Grok</SelectItem>
                  <SelectItem value="openrouter">OpenRouter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
                Key Alias
              </label>
              <Input
                {...register("name")}
                placeholder="Auto-filled on paste..."
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-gray-600 h-11"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 ml-1">{errors.name.message}</p>
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
            {onIdentifyKey && apiKeyValue.trim().length >= 14 && (
              <Button
                type="button"
                variant="outline"
                disabled={isIdentifying}
                onClick={() => void runLiveIdentification(apiKeyValue, providerValue)}
                className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
              >
                {isIdentifying ? <CircleNotch className="animate-spin" size={16} /> : "Test Key"}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || isIdentifying}
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
