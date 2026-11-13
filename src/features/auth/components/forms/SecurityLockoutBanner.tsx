"use client";

import React, { useEffect, useState } from "react";
import { ShieldWarning, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../stores/useAuthStore";

interface SecurityLockoutBannerProps {
  isDark: boolean;
  token: string;
  onContinue: () => void;
}

export const SecurityLockoutBanner: React.FC<SecurityLockoutBannerProps> = ({
  isDark,
  token,
  onContinue,
}) => {
  const tAuth = useTranslations("auth");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await authService.emergencyLockout(token);
        useAuthStore.getState().reset();
        if (active) setStatus("success");
      } catch {
        if (active) setStatus("error");
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="space-y-4 text-center py-2">
      <div
        className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center border ${
          status === "success"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
        }`}
      >
        {status === "success" ? (
          <CheckCircle className="w-6 h-6" weight="bold" />
        ) : (
          <ShieldWarning className="w-6 h-6" weight="bold" />
        )}
      </div>
      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {status === "loading"
          ? tAuth("security_lockout_desc")
          : status === "success"
            ? tAuth("security_lockout_success")
            : tAuth("security_lockout_error")}
      </p>
      {status !== "loading" && (
        <Button type="button" onClick={onContinue} className="w-full h-11 rounded-xl text-sm font-semibold bg-linear-to-r from-violet-600 to-purple-600 text-white">
          <span className="flex items-center justify-center gap-2">
            {tAuth("forgot_password_title")}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      )}
    </div>
  );
};

