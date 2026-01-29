"use client";

// Login and Registration page for CELAEST with split screen transition
import React, { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useNotifications } from "@/features/shared/contexts/NotificationContext";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import {
  LoginFormValues,
  SignupFormValues,
} from "@/lib/validation/schemas/auth";

import { AuthBackground } from "./layout/AuthBackground";
import { FloatingThemeToggle } from "./layout/FloatingThemeToggle";
import { AuthHeader } from "./layout/AuthHeader";
import { AuthFooter } from "./layout/AuthFooter";
import { AuthFormContainer } from "./layout/AuthFormContainer";

export const AuthPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { signIn, signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotifications();
  const isDark = theme === "dark";

  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const result = await signIn(data.email, data.password);
    if (!result.success) {
      addNotification({
        type: "error",
        title: "Error de Inicia Sesión",
        message:
          result.error?.message ||
          "No se pudo iniciar sesión. Verifique sus credenciales.",
        timestamp: new Date(),
      });
    } else {
      addNotification({
        type: "success",
        title: "¡Bienvenido de nuevo!",
        message: "Has iniciado sesión exitosamente.",
        timestamp: new Date(),
      });
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    const result = await signUp(data.email, data.password, data.name);
    if (!result.success) {
      addNotification({
        type: "error",
        title: "Error de Registro",
        message: result.error?.message || "No se pudo crear la cuenta.",
        timestamp: new Date(),
      });
    } else {
      addNotification({
        type: "success",
        title: "Cuenta Creada",
        message: "Tu cuenta ha sido creada exitosamente. ¡Bienvenido!",
        timestamp: new Date(),
      });
    }
    setLoading(false);
  };

  const toggleMode = () => setMode(mode === "signin" ? "signup" : "signin");

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden font-sans relative">
      <AuthBackground mode={mode} isDark={isDark} />
      <FloatingThemeToggle isDark={isDark} toggleTheme={toggleTheme} />

      <div className="w-full h-screen flex items-center justify-center px-4 lg:px-8 relative z-10">
        <motion.div
          className={`w-full max-w-md lg:max-w-lg ${mode === "signin" ? "lg:mr-auto lg:ml-24" : "lg:ml-auto lg:mr-24"}`}
          initial={false}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <motion.div
            className={`backdrop-blur-2xl rounded-3xl p-8 lg:p-12 shadow-2xl border ${isDark ? "bg-black/40 border-white/10" : "bg-white/90 border-white/20"}`}
            layout
          >
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
                    {mode === "signin" ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {mode === "signin"
                      ? "Enter your credentials to access your dashboard"
                      : "Start your journey with CELAEST today"}
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
