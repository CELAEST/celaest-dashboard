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
import { AuthFormContainer } from "./layout/AuthFormContainer";
import { LocaleSwitcher } from "@/features/shared/components/Header/LocaleSwitcher";

export const AuthPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);
  const tAuth = useTranslations("auth");

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

  return (
    <div className="min-h-screen w-full overflow-hidden font-sans relative">
      <AuthBackground mode={mode} isDark={isDark} />

      <div className="w-full h-screen flex items-center justify-center md:justify-start relative z-10">
        <motion.div
          className={
            mode === "signin"
              ? "mx-auto md:mx-0 md:ml-20 xl:ml-32"
              : "mx-auto md:mx-0 md:mr-20 xl:mr-32 md:ml-auto"
          }
          style={{ width: "min(460px, calc(100vw - 3rem))" }}
          initial={false}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <motion.div
            className={`relative backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-2xl border ${isDark ? "bg-black/40 border-white/10" : "bg-white/90 border-white/20"}`}
            layout="size"
          >
            <div className="absolute right-8 top-[46px] z-20 lg:right-10 lg:top-[54px]">
              <LocaleSwitcher align="right" />
            </div>

            <div className="w-full">
              <AuthHeader isDark={isDark} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "signin" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "signin" ? 20 : -20 }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="mb-8"
                >
                  <h1
                    className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {mode === "signin" ? tAuth("welcome_back") : tAuth("create_account")}
                  </h1>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {mode === "signin"
                      ? tAuth("enter_credentials")
                      : tAuth("start_journey")}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AuthFormContainer
                mode={mode}
                isDark={isDark}
                loading={loading}
                setLoading={setLoading}
                onLoginSubmit={handleLoginSubmit}
                onSignupSubmit={handleSignupSubmit}
              />

              <AuthFooter
                mode={mode}
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
