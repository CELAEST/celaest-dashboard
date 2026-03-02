"use client";

import React, { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIPrompt } from "../../types";
import { Terminal, Sparkles, Loader2 } from "lucide-react";

const promptSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().optional(),
});

type PromptFormData = z.infer<typeof promptSchema>;

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromptFormData) => void;
  initialData?: AIPrompt | null;
  isLoading?: boolean;
}

export const AIPromptModal: React.FC<AIPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        content: initialData.content,
        category: initialData.category || "General",
      });
    } else {
      reset({
        name: "",
        content: "",
        category: "General",
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-black/80 backdrop-blur-2xl border-white/10 text-white shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
              <Terminal className="text-cyan-400" size={20} />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {initialData ? "Edit Template" : "Neural Blueprint"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Design high-performance system instructions for your neural nodes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-cyan-400/80 uppercase tracking-widest ml-1">
              Template Identity
            </Label>
            <Input
              {...register("name")}
              placeholder="e.g., Code Architect v2"
              className="bg-white/5 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-gray-600 h-11"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <Label className="text-xs font-bold text-cyan-400/80 uppercase tracking-widest">
                System Instructions
              </Label>
              <span className="text-[10px] text-gray-500 font-mono">
                MD SUPPORTED
              </span>
            </div>
            <Textarea
              {...register("content")}
              placeholder="You are an expert software architect..."
              className="bg-white/5 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-gray-600 min-h-[180px] resize-none leading-relaxed"
            />
            {errors.content && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-cyan-400/80 uppercase tracking-widest ml-1">
              Neural Category
            </Label>
            <Input
              {...register("category")}
              placeholder="General, Coding, Creative..."
              className="bg-white/5 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-gray-600 h-11"
            />
          </div>

          <DialogFooter className="pt-4 mt-2 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              Abord mission
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white min-w-[140px] font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  {initialData ? "Commit Changes" : "Deploy Blueprint"}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
