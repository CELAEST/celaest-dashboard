"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Envelope, Key, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "sonner";

interface OtpLoginFormProps {
  isDark: boolean;
  initialEmail?: string;
  initialToken?: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const OtpLoginForm: React.FC<OtpLoginFormProps> = ({
  isDark,
  initialEmail = "",
  initialToken = "",
  onSuccess,
  onBack,
}) => {
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">(initialEmail ? "code" : "email");
  const [loading, setLoading] = useState(false);

  const handleVerify = useCallback(async (otpCode?: string, magicToken?: string) => {
    setLoading(true);
    try {
      const res = await authService.verifyOTP({ email, code: otpCode ?? code, magicToken, locale });
      if (res.access_token) {
        const userObj = {
          id: res.user?.id || "user",
          email: res.user?.email || email,
          name: res.user?.name || email.split("@")[0],
          role: "client" as const,
          permissions: [],
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        useAuthStore.getState().setAuth({
          user: userObj,
          session: { user: userObj, accessToken: res.access_token, refreshToken: res.refresh_token, expiresAt: Math.floor(Date.now() / 1000) + (res.expires_in || 86400) },
        });
        toast.success(tAuth("welcome_back_toast"), { description: tAuth("login_success") });
        onSuccess();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tAuth("otp_invalid_error"));
    } finally {
      setLoading(false);
    }
  }, [email, code, locale, onSuccess, tAuth]);

  useEffect(() => {
    if (initialToken) {
      void handleVerify(undefined, initialToken);
    }
  }, [initialToken, handleVerify]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authService.requestOTP(email, locale);
      setStep("code");
      toast.success(tAuth("otp_code_sent"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tAuth("unexpected_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={step === "email" ? handleRequestCode : (e) => { e.preventDefault(); void handleVerify(); }} className="space-y-3.5">
      {step === "email" ? (
        <div className="relative">
          <Envelope className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tAuth("email_placeholder")} className={`pl-10 h-11 text-sm rounded-xl ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-300"}`} />
        </div>
      ) : (
        <div className="space-y-2">
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tAuth("otp_enter_code_desc", { email })}</p>
          <div className="relative">
            <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
            <Input type="text" inputMode="numeric" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" className={`pl-10 h-11 text-center font-mono text-lg tracking-[0.35em] font-bold rounded-xl ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-300"}`} />
          </div>
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-semibold rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white cursor-pointer">
        <span className="flex items-center justify-center gap-2">
          {step === "email" ? tAuth("send_otp_code") : tAuth("verify_otp_button")}
          <ArrowRight className="w-4 h-4" />
        </span>
      </Button>
      <button type="button" onClick={onBack} className={`w-full text-xs font-medium py-1.5 flex items-center justify-center gap-1.5 cursor-pointer ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
        <ArrowLeft className="w-3.5 h-3.5" />
        {tAuth("use_password_instead")}
      </button>
    </form>
  );
};

