"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoginForm } from "../forms/LoginForm";
import { SignupForm } from "../forms/SignupForm";
import { SocialAuth } from "../forms/SocialAuth";
import { LoginFormValues, SignupFormValues } from "../../hooks/useAuthForm";

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
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: mode === "signin" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: mode === "signin" ? 20 : -20 }}
        transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="space-y-5"
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

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${isDark ? "border-white/10" : "border-gray-300"}`}
            />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className={`px-2 ${isDark ? "bg-black/40 text-gray-400" : "bg-white/90 text-gray-500"}`}
            >
              Or continue with
            </span>
          </div>
        </div>

        <SocialAuth isDark={isDark} loading={loading} setLoading={setLoading} />
      </motion.div>
    </AnimatePresence>
  );
};
