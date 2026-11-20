"use client";

// Login and Registration page for CELAEST with split screen transition
import React, { useState, useCallback, useRef } from "react";
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
import {
  AuthPortalLeftFlank,
  AuthPortalRightFlank,
  type AuthActiveField,
} from "./layout/AuthPortalFlanks";
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
  const [activeField, setActiveField] = useState<AuthActiveField>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const authSubmitInFlightRef = useRef(false);
  const tAuth = useTranslations("auth");
  const bgMode: "signin" | "signup" = mode === "signup" ? "signup" : "signin";

  const getPostAuthRedirect = useCallback(() => {
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
  }, [searchParams]);

  const handleAuthComplete = useCallback(() => {
    router.push(getPostAuthRedirect());
  }, [router, getPostAuthRedirect]);

  const handleModeChange = useCallback(
    (nextMode: AuthViewMode) => {
      setActiveField(null);
      setMode(nextMode);
      if (defaultMode === "reset" && nextMode === "signin") {
        router.replace("/auth");
      }
    },
    [defaultMode, router],
  );

  // Handlers
  const handleLoginSubmit = async (data: LoginFormValues) => {
    if (authSubmitInFlightRef.current) return;
    authSubmitInFlightRef.current = true;
    setLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      if (!result.success) {
        if (result.error?.code === "EMAIL_NOT_VERIFIED") {
          setPendingVerificationEmail(data.email.trim().toLowerCase());
          setMode("otp");
        }
        toast.error(tAuth("login_error_title"), {
          description: result.error?.message || tAuth("login_error_message")
        });
      } else {
        toast.success(tAuth("welcome_back_toast"), {
          description: tAuth("login_success")
        });
        router.push(getPostAuthRedirect());
      }
    } finally {
      authSubmitInFlightRef.current = false;
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (data: SignupFormValues) => {
    if (authSubmitInFlightRef.current) return;
    authSubmitInFlightRef.current = true;
    setLoading(true);
    try {
      const result = await signUp(data.email, data.password, data.name);
      if (!result.success) {
        toast.error(tAuth("signup_error_title"), {
          description: result.error?.message || tAuth("signup_error_message")
        });
      } else if (result.data?.requiresVerification) {
        const targetEmail = result.data.email || data.email.trim().toLowerCase();
        setPendingVerificationEmail(targetEmail);
        setMode("otp");
        toast.success(tAuth("otp_code_sent"));
      } else {
        toast.success(tAuth("account_created"), {
          description: tAuth("account_created_message")
        });
        router.push(getPostAuthRedirect());
      }
    } finally {
      authSubmitInFlightRef.current = false;
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setActiveField(null);
    setMode(mode === "signin" ? "signup" : "signin");
  };

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
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col font-sans relative">
      <AuthBackground mode={bgMode} isDark={isDark} />

      {/* Centered Portal Tri-Eje Grid anchored around Viewport Meridian (x = 50%) */}
      <main className="flex-1 min-h-0 w-full overflow-x-hidden overflow-y-auto flex justify-center relative z-10 py-3 sm:py-4 px-3.5 sm:px-6 xl:px-9">
        <div className="w-full max-w-[1360px] my-auto grid grid-cols-1 xl:grid-cols-[1fr_minmax(420px,450px)_1fr] items-center gap-6 xl:gap-11">
          <AuthPortalLeftFlank mode={bgMode} isDark={isDark} />

          <motion.div
            className="w-full max-w-[430px] lg:max-w-[450px] mx-auto"
            initial={false}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <motion.div
              className={`relative backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4.5 sm:p-5.5 lg:p-6 shadow-2xl border ${
                isDark
                  ? "bg-black/65 md:bg-black/52 border-white/12"
                  : "bg-white/95 md:bg-white/90 border-slate-900/10"
              }`}
              layout="size"
            >
              <div className="absolute right-4.5 top-4.5 sm:right-5.5 sm:top-5.5 z-20">
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
                    className="mb-3 sm:mb-3.5"
                  >
                    <h1
                      className={`text-xl sm:text-2xl font-bold mb-0.5 ${
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
                  onChangeMode={handleModeChange}
                  isDark={isDark}
                  loading={loading}
                  setLoading={setLoading}
                  onLoginSubmit={handleLoginSubmit}
                  onSignupSubmit={handleSignupSubmit}
                  initialEmail={pendingVerificationEmail || searchParams.get("email") || ""}
                  initialToken={searchParams.get("token") || ""}
                  onAuthComplete={handleAuthComplete}
                  onActiveFieldChange={setActiveField}
                />

                <AuthFooter
                  mode={bgMode}
                  isDark={isDark}
                  onToggleMode={toggleMode}
                />
              </div>
            </motion.div>
          </motion.div>

          <AuthPortalRightFlank
            mode={bgMode}
            isDark={isDark}
            activeField={activeField}
          />
        </div>
      </main>
    </div>
  );
};
