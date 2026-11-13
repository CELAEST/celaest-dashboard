"use client";

import React, { useState } from "react";
import { Lock, ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { authService } from "../../services/auth.service";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  isDark: boolean;
  token: string;
  onSuccess: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  isDark,
  token,
  onSuccess,
}) => {
  const tAuth = useTranslations("auth");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cleanToken = token.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !cleanToken) return;
    if (newPassword !== confirmPassword) {
      const msg = tAuth("passwords_dont_match");
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await authService.confirmPasswordReset(cleanToken, newPassword);
      setDone(true);
      toast.success(tAuth("password_updated_title"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : tAuth("unexpected_error");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!cleanToken) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
          <WarningCircle className="w-6 h-6" weight="bold" />
        </div>
        <p role="alert" className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {tAuth("reset_missing_token")}
        </p>
        <Button type="button" onClick={onSuccess} className="w-full h-11 rounded-xl text-sm font-semibold bg-linear-to-r from-violet-600 to-purple-600 text-white cursor-pointer">
          {tAuth("back_to_signin")}
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <CheckCircle className="w-6 h-6" weight="bold" />
        </div>
        <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {tAuth("password_updated_title")}
        </h3>
        <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {tAuth("password_updated_desc")}
        </p>
        <Button type="button" onClick={onSuccess} className="w-full h-11 rounded-xl text-sm font-semibold bg-linear-to-r from-violet-600 to-purple-600 text-white cursor-pointer">
          {tAuth("sign_in")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {errorMsg && (
        <div role="alert" className={`rounded-xl border px-3 py-2.5 text-xs font-medium ${isDark ? "bg-red-500/10 border-red-500/25 text-red-200" : "bg-red-50 border-red-200 text-red-700"}`}>
          {errorMsg}
        </div>
      )}
      <div>
        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tAuth("new_password_label")}</label>
        <div className="relative mt-1">
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <Input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={`pl-10 h-11 text-sm rounded-xl ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-300"}`} />
        </div>
      </div>
      <div>
        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{tAuth("confirm_password_label")}</label>
        <div className="relative mt-1">
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <Input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={`pl-10 h-11 text-sm rounded-xl ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-300"}`} />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-semibold rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white cursor-pointer">
        <span className="flex items-center justify-center gap-2">
          {tAuth("save_new_password")}
          <ArrowRight className="w-4 h-4" />
        </span>
      </Button>
    </form>
  );
};

