"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoginForm } from "../forms/LoginForm";
import { SignupForm } from "../forms/SignupForm";
import { SocialAuth } from "../forms/SocialAuth";
import {
  LoginFormValues,
  SignupFormValues,
} from "@/lib/validation/schemas/auth";
import { useTranslations } from "next-intl";

interface AuthFormContainerProps {
  mode: "signin" | "signup";
  isDark: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onLoginSubmit: (data: LoginFormValues) => Promise<void>;
  onSignupSubmit: (data: SignupFormValues) => Promise<void>;
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  mode,
  isDark,
  loading,
  setLoading,
  onLoginSubmit,
  onSignupSubmit,
}) => {
  const tAuth = useTranslations("auth");
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: mode === "signin" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: mode === "signin" ? 20 : -20 }}
        transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="space-y-4 sm:space-y-5"
      >
        {mode === "signin" ? (
          <LoginForm
            isDark={isDark}
            onSubmit={onLoginSubmit}
            loading={loading}
          />
        ) : (
          <SignupForm
            isDark={isDark}
            onSubmit={onSignupSubmit}
            loading={loading}
          />
        )}

        <div className="relative pt-3 pb-2 sm:pt-4 sm:pb-3">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${isDark ? "border-white/10" : "border-gray-200"}`}
            />
          </div>
          <div className="relative flex justify-center text-[10px] sm:text-xs uppercase font-mono tracking-[0.16em]">
            <span
              className={`px-3 py-1 rounded-full border text-[10px] font-mono font-medium ${
                isDark
                  ? "bg-[#09090b] text-white/45 border-white/10 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 shadow-xs"
              }`}
            >
              {tAuth("or_continue_with")}
            </span>
          </div>
        </div>

        <SocialAuth isDark={isDark} loading={loading} setLoading={setLoading} />
      </motion.div>
    </AnimatePresence>
  );
};
