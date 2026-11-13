"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Envelope, Key, ArrowRight, ArrowLeft, ArrowsClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../stores/useAuthStore";
import { AuthUser } from "../../lib/types";
import { toast } from "sonner";

interface OtpLoginFormProps {
  isDark: boolean;
  initialEmail?: string;
  initialToken?: string;
  onSuccess: () => void;
  onBack: () => void;
}

type OtpVerifyResponse = Awaited<ReturnType<typeof authService.verifyOTP>>;
const inFlightMagicVerifications = new Map<string, Promise<OtpVerifyResponse>>();

function verifyMagicTokenOnce(token: string, email: string, locale: string): Promise<OtpVerifyResponse> {
  const existing = inFlightMagicVerifications.get(token);
  if (existing) return existing;

  const promise = authService.verifyOTP({ email, magicToken: token, locale }).finally(() => {
    // Keep brief dedupe window across StrictMode/re-render remounts so consumed tokens are never re-sent immediately
    setTimeout(() => {
      if (inFlightMagicVerifications.get(token) === promise) {
        inFlightMagicVerifications.delete(token);
      }
    }, 5000);
  });
  inFlightMagicVerifications.set(token, promise);
  return promise;
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
  const [resending, setResending] = useState(false);
  const [verifyingLink, setVerifyingLink] = useState(Boolean(initialToken));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const emailRef = useRef(email);
  emailRef.current = email;
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const tAuthRef = useRef(tAuth);
  tAuthRef.current = tAuth;
  const prevInitialEmailRef = useRef(initialEmail);

  useEffect(() => {
    if (initialEmail && initialEmail !== prevInitialEmailRef.current) {
      prevInitialEmailRef.current = initialEmail;
      setEmail(initialEmail);
      setStep("code");
    }
  }, [initialEmail]);

  const applyVerifiedSession = useCallback((res: OtpVerifyResponse, targetEmail: string) => {
    if (!res.access_token) return false;
    const resUser = res.user as { id?: string; email?: string; name?: string; role?: AuthUser["role"] } | undefined;
    const resolvedEmail = resUser?.email || targetEmail;
    const userObj: AuthUser = {
      id: resUser?.id || "user",
      email: resolvedEmail,
      name: resUser?.name || resolvedEmail.split("@")[0],
      role: resUser?.role || "client",
      permissions: [],
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    useAuthStore.getState().setAuth({
      user: userObj,
      session: {
        user: userObj,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + (res.expires_in || 86400),
      },
    });
    toast.success(tAuthRef.current("welcome_back_toast"), {
      description: tAuthRef.current("login_success"),
    });
    onSuccessRef.current();
    return true;
  }, []);

  useEffect(() => {
    const token = initialToken.trim();
    if (!token) {
      setVerifyingLink(false);
      return;
    }

    let active = true;
    setVerifyingLink(true);
    setErrorMsg(null);

    verifyMagicTokenOnce(token, emailRef.current, localeRef.current)
      .then((res) => {
        if (!active) return;
        applyVerifiedSession(res, emailRef.current);
      })
      .catch((err) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : tAuthRef.current("otp_invalid_error");
        setErrorMsg(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (!active) return;
        setVerifyingLink(false);
        if (typeof window !== "undefined") {
          const currentUrl = new URL(window.location.href);
          if (currentUrl.searchParams.has("token")) {
            currentUrl.searchParams.delete("token");
            window.history.replaceState({}, "", currentUrl.toString());
          }
        }
      });

    return () => {
      active = false;
    };
  }, [initialToken, applyVerifiedSession]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || verifyingLink) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authService.verifyOTP({ email: email.trim(), code, locale });
      applyVerifiedSession(res, email.trim());
    } catch (err) {
      const msg = err instanceof Error ? err.message : tAuth("otp_invalid_error");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || loading) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await authService.requestOTP(cleanEmail, locale);
      setCode("");
      setStep("code");
      toast.success(tAuth("otp_code_sent"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : tAuth("unexpected_error");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStep("email");
      return;
    }
    if (resending || loading || verifyingLink) return;
    setResending(true);
    setErrorMsg(null);
    try {
      await authService.requestOTP(cleanEmail, locale);
      setCode("");
      toast.success(tAuth("otp_code_sent"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : tAuth("unexpected_error");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={step === "email" ? handleRequestCode : handleVerifyCode} className="space-y-3.5">
      {verifyingLink && (
        <div className={`rounded-xl border px-3 py-2.5 text-xs font-medium ${isDark ? "bg-violet-500/10 border-violet-500/25 text-violet-200" : "bg-violet-50 border-violet-200 text-violet-800"}`}>
          {tAuth("otp_verifying_link")}
        </div>
      )}

      {errorMsg && (
        <div role="alert" className={`rounded-xl border px-3 py-2.5 text-xs font-medium ${isDark ? "bg-red-500/10 border-red-500/25 text-red-200" : "bg-red-50 border-red-200 text-red-700"}`}>
          {errorMsg}
        </div>
      )}

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
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button type="button" onClick={handleResendCode} disabled={resending || loading || verifyingLink} className={`text-xs font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 ${isDark ? "text-violet-300 hover:text-violet-200" : "text-violet-700 hover:text-violet-800"}`}>
              <ArrowsClockwise className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
              {tAuth("resend_otp")}
            </button>
            <button type="button" onClick={() => { setErrorMsg(null); setStep("email"); }} className={`text-xs font-medium cursor-pointer ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              {tAuth("otp_change_email")}
            </button>
          </div>
        </div>
      )}
      <Button type="submit" disabled={loading || verifyingLink} className="w-full h-11 text-sm font-semibold rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white cursor-pointer">
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

