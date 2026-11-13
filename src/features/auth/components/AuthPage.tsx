"use client";

// Login and Registration page for CELAEST with split screen transition
import React, { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LoginFormValues,
  SignupFormValues,
} from "@/lib/validation/schemas/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { AuthBackground } from "./layout/AuthBackground";
import { AuthHeader } from "./layout/AuthHeader";
import { AuthFooter } from "./layout/AuthFooter";
import { AuthFormContainer, AuthViewMode } from "./layout/AuthFormContainer";
import { LocaleSwitcher } from "@/features/shared/components/Header/LocaleSwitcher";

interface AuthPageProps {
  defaultMode?: AuthViewMode;
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const paramMode = searchParams.get("mode") as AuthViewMode | null;
  const resolvedInitialMode: AuthViewMode =
    defaultMode ||
    (paramMode && ["signin", "signup", "forgot", "otp", "reset", "lockout"].includes(paramMode)
      ? paramMode
      : "signin");

  const [mode, setMode] = useState<AuthViewMode>(resolvedInitialMode);
  const [loading, setLoading] = useState(false);
  const tAuth = useTranslations("auth");
  const bgMode: "signin" | "signup" = mode === "signup" ? "signup" : "signin";

  const getPostAuthRedirect = () => {
    const explicitRedirect = searchParams.get("redirect");
    if (explicitRedirect) return explicitRedirect;

    const plan = searchParams.get("plan");
    const billingCycle = searchParams.get("billing_cycle");
    if (plan) {
      const params = new URLSearchParams({ tab: "billing", plan });
      if (billingCycle) params.set("billing_cycle", billingCycle);
      return `/?${params.toString()}`;
    }

    return "/?tab=marketplace";
  };

  // Handlers
  const handleLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const result = await signIn(data.email, data.password);
    if (!result.success) {
      toast.error(tAuth("login_error_title"), {
        description: result.error?.message || tAuth("login_error_message")
      });
    } else {
      toast.success(tAuth("welcome_back_toast"), {
        description: tAuth("login_success")
      });
      router.push(getPostAuthRedirect());
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    const result = await signUp(data.email, data.password, data.name);
    if (!result.success) {
      toast.error(tAuth("signup_error_title"), {
        description: result.error?.message || tAuth("signup_error_message")
      });
    } else {
      toast.success(tAuth("account_created"), {
        description: tAuth("account_created_message")
      });
      router.push(getPostAuthRedirect());
    }
    setLoading(false);
  };

  const toggleMode = () => setMode(mode === "signin" ? "signup" : "signin");

  const titleByMode: Record<AuthViewMode, string> = {
    signin: tAuth("welcome_back"),
    signup: tAuth("create_account"),
    forgot: tAuth("forgot_password_title"),
    otp: tAuth("otp_title"),
    reset: tAuth("reset_password_title"),
    lockout: tAuth("security_lockout_title"),
  };

  const descByMode: Record<AuthViewMode, string> = {
    signin: tAuth("enter_credentials"),
    signup: tAuth("start_journey"),
    forgot: tAuth("forgot_password_desc"),
    otp: tAuth("otp_desc"),
    reset: tAuth("reset_password_desc"),
    lockout: tAuth("security_lockout_desc"),
  };

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto font-sans relative">
      <AuthBackground mode={bgMode} isDark={isDark} />

      <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center md:items-start relative z-10 py-6 sm:py-8 lg:py-10 px-3.5 sm:px-6 md:px-0">
        <motion.div
          className={`w-full max-w-[430px] lg:max-w-[450px] my-auto ${
            bgMode === "signin"
              ? "mx-auto md:mx-0 md:ml-10 lg:ml-20 xl:ml-32"
              : "mx-auto md:mx-0 md:mr-10 lg:mr-20 xl:mr-32 md:ml-auto"
          }`}
          initial={false}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <motion.div
            className={`relative backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 xl:p-8 shadow-2xl border ${
              isDark
                ? "bg-black/60 md:bg-black/45 border-white/10"
                : "bg-white/95 md:bg-white/90 border-white/20"
            }`}
            layout="size"
          >
            <div className="absolute right-4.5 top-4.5 sm:right-6 sm:top-6 lg:right-7 lg:top-7 z-20">
              <LocaleSwitcher align="right" />
            </div>

            <div className="w-full">
              <AuthHeader isDark={isDark} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: bgMode === "signin" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: bgMode === "signin" ? 20 : -20 }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="mb-4 sm:mb-5 lg:mb-6"
                >
                  <h1
                    className={`text-2xl sm:text-[26px] font-bold mb-1 sm:mb-1.5 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {titleByMode[mode]}
                  </h1>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {descByMode[mode]}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AuthFormContainer
                mode={mode}
                onChangeMode={setMode}
                isDark={isDark}
                loading={loading}
                setLoading={setLoading}
                onLoginSubmit={handleLoginSubmit}
                onSignupSubmit={handleSignupSubmit}
                initialEmail={searchParams.get("email") || ""}
                initialToken={searchParams.get("token") || ""}
                onAuthComplete={() => router.push(getPostAuthRedirect())}
              />

              <AuthFooter
                mode={bgMode}
                isDark={isDark}
                onToggleMode={toggleMode}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
