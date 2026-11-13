"use client";

import React, { useState } from "react";
import { Envelope, ArrowRight, ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { authService } from "../../services/auth.service";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  isDark: boolean;
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  isDark,
  onBack,
}) => {
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authService.requestPasswordReset(email, locale);
      setSent(true);
      toast.success(tAuth("recovery_sent_title"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tAuth("unexpected_error"));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <CheckCircle className="w-6 h-6" weight="bold" />
        </div>
        <div className="space-y-1.5">
          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {tAuth("recovery_sent_title")}
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {tAuth("recovery_sent_desc")}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onBack} className="w-full h-10 rounded-xl text-xs font-semibold">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          {tAuth("back_to_signin")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {tAuth("email_address")}
        </label>
        <div className="relative mt-1">
          <Envelope className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={tAuth("email_placeholder")}
            className={`pl-10 h-11 text-sm rounded-xl ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-300"}`}
          />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-semibold rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white cursor-pointer">
        <span className="flex items-center justify-center gap-2">
          {tAuth("send_recovery_link")}
          <ArrowRight className="w-4 h-4" />
        </span>
      </Button>
      <button type="button" onClick={onBack} className={`w-full text-xs font-medium py-1.5 flex items-center justify-center gap-1.5 cursor-pointer ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
        <ArrowLeft className="w-3.5 h-3.5" />
        {tAuth("back_to_signin")}
      </button>
    </form>
  );
};

