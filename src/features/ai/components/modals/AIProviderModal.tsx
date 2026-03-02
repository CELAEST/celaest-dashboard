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
import { Globe, ShieldCheck, Loader2 } from "lucide-react";

const providerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.string().min(1, "Type is required"),
  api_key: z.string().optional(),
  base_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProviderFormData = z.infer<typeof providerSchema>;

interface AIProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProviderFormData) => void;
  isLoading?: boolean;
}

export const AIProviderModal: React.FC<AIProviderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      type: "openai",
    },
  });

  const handleFormSubmit = (data: ProviderFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-black/80 backdrop-blur-2xl border-white/10 text-white shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Globe className="text-blue-400" size={20} />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Register AI Provider
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Configure a new upstream provider for the neural infrastructure.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-blue-400/80 uppercase tracking-widest ml-1">
                Provider Name
              </label>
              <Input
                {...register("name")}
                placeholder="e.g., Enterprise OpenAI"
                className="bg-white/5 border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600 h-11"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-blue-400/80 uppercase tracking-widest ml-1">
                Engine Type
              </label>
              <Select
                onValueChange={(val: string) => setValue("type", val)}
                defaultValue="openai"
              >
                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-blue-500/50 text-white h-11">
                  <SelectValue placeholder="OpenAI" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google Vertex</SelectItem>
                  <SelectItem value="custom">Custom (Self-Hosted)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-400/80 uppercase tracking-widest ml-1">
              API Key (Optional if IP Whitelisted)
            </label>
            <Input
              {...register("api_key")}
              type="password"
              placeholder="sk-••••••••••••••••"
              className="bg-white/5 border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600 h-11"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-blue-400/80 uppercase tracking-widest ml-1">
                Base URL Override
              </label>
              <span className="text-[9px] text-gray-500 font-mono tracking-tighter">
                LEAVE EMPTY FOR DEFAULT
              </span>
            </div>
            <Input
              {...register("base_url")}
              placeholder="https://api.openai.com/v1"
              className="bg-white/5 border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600 h-11"
            />
            {errors.base_url && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {errors.base_url.message}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4 transition-all hover:bg-blue-500/10">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ShieldCheck size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-tight">
                Vault Encryption Active
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                Credentials are encrypted at rest using AES-256 neural
                rotations.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4 mt-2 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white min-w-[140px] font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Authorize Provider"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
