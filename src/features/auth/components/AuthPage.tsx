"use client";

// Login and Registration page for CELAEST with split screen transition
import React, { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Mail,
  User,
  Shield,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/icons/Logo";

export const AuthPage: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, signInWithGitHub } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signin") {
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error || "Sign in failed");
      } else {
        setSuccess("Successfully signed in!");
      }
    } else {
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, name);
      if (!result.success) {
        setError(result.error || "Sign up failed");
      } else {
        setSuccess("Account created successfully!");
      }
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden font-sans relative">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={
              isDark
                ? mode === "signin"
                  ? "/images/auth/loguin30.jpg"
                  : "/images/auth/loguin40.jpg"
                : mode === "signin"
                ? "/images/auth/loguin3.jpg"
                : "/images/auth/loguin4.jpg"
            }
            alt="Background"
            className="w-full h-full object-cover"
            animate={{
              objectPosition: mode === "signin" ? "70% center" : "30% center",
            }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-linear-to-br from-black/60 via-black/50 to-black/70"
                : "bg-linear-to-br from-black/40 via-black/30 to-black/50"
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${
          isDark
            ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
            : "bg-white/95 border-gray-300 hover:bg-white text-gray-900 shadow-xl"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Floating Form Container */}
      <div className="w-full h-screen flex items-center justify-center px-4 lg:px-8 relative z-10">
        <motion.div
          className={`w-full max-w-md lg:max-w-lg ${
            mode === "signin" ? "lg:mr-auto lg:ml-24" : "lg:ml-auto lg:mr-24"
          }`}
          initial={false}
          animate={{
            x: mode === "signin" ? 0 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <motion.div
            className={`backdrop-blur-2xl rounded-3xl p-8 lg:p-12 shadow-2xl border ${
              isDark
                ? "bg-black/40 border-white/10"
                : "bg-white/90 border-white/20"
            }`}
            layout
          >
            <div className="w-full">
              {/* Logo */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12">
                  <Logo color={isDark ? "#22d3ee" : "#2563eb"} />
                </div>
                <div className="flex flex-col leading-none">
                  <span
                    className={`text-2xl font-bold ${
                      isDark
                        ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                    }`}
                  >
                    CELAEST
                  </span>
                  <span
                    className={`text-xs tracking-widest mt-1 ${
                      isDark ? "text-cyan-400/60" : "text-blue-500/60"
                    }`}
                  >
                    DASHBOARD
                  </span>
                </div>
              </motion.div>

              {/* Header */}
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
                    className={`text-3xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
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

              {/* Alerts */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4"
                  >
                    <Alert
                      className={`border ${
                        isDark
                          ? "border-red-500/30 bg-red-500/10"
                          : "border-red-300 bg-red-50"
                      }`}
                    >
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <AlertDescription
                        className={isDark ? "text-red-400" : "text-red-700"}
                      >
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4"
                  >
                    <Alert
                      className={`border ${
                        isDark
                          ? "border-green-500/30 bg-green-500/10"
                          : "border-green-300 bg-green-50"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription
                        className={isDark ? "text-green-400" : "text-green-700"}
                      >
                        {success}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, x: mode === "signin" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "signin" ? 20 : -20 }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {mode === "signup" && (
                    <div>
                      <Label
                        htmlFor="name"
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        Full Name
                      </Label>
                      <div className="relative mt-1.5">
                        <User
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setName(e.target.value)
                          }
                          className={`pl-11 h-12 ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:border-cyan-500"
                              : "bg-gray-50 border-gray-300 focus:border-blue-500"
                          }`}
                          placeholder="John Doe"
                          required={mode === "signup"}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label
                      htmlFor="email"
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Email Address
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEmail(e.target.value)
                        }
                        className={`pl-11 h-12 ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-cyan-500"
                            : "bg-gray-50 border-gray-300 focus:border-blue-500"
                        }`}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Password
                    </Label>
                    <div className="relative mt-1.5">
                      <Lock
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        className={`pl-11 pr-11 h-12 ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-cyan-500"
                            : "bg-gray-50 border-gray-300 focus:border-blue-500"
                        }`}
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          isDark
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 text-base font-medium ${
                      isDark
                        ? "bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {mode === "signin" ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className={`absolute inset-0 flex items-center`}>
                      <div
                        className={`w-full border-t ${
                          isDark ? "border-white/10" : "border-gray-300"
                        }`}
                      ></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span
                        className={`px-2 ${
                          isDark
                            ? "bg-black/40 text-gray-400"
                            : "bg-white/90 text-gray-500"
                        }`}
                      >
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        setError("");
                        try {
                          const result = await signInWithGoogle();
                          if (!result.success) {
                            setError(result.error || "Google sign in failed");
                          }
                        } catch (error) {
                          console.error("Google sign in error", error);
                          setError("An unexpected error occurred.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className={`h-12 ${
                        isDark
                          ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          : "bg-white/60 border-gray-300 hover:bg-white text-gray-700"
                      }`}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#4285F4"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        setError("");
                        try {
                          const result = await signInWithGitHub();
                          if (!result.success) {
                            setError(result.error || "GitHub sign in failed");
                          }
                        } catch (error) {
                          console.error("GitHub sign in error", error);
                          setError("An unexpected error occurred.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className={`h-12 ${
                        isDark
                          ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          : "bg-white/60 border-gray-300 hover:bg-white text-gray-700"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </Button>
                  </div>
                </motion.form>
              </AnimatePresence>

              {/* Toggle Mode */}
              <div
                className={`mt-8 pt-6 border-t ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p
                  className={`text-center text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {mode === "signin"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className={`font-semibold ${
                      isDark
                        ? "text-cyan-400 hover:text-cyan-300"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-8">
                <div className="flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Lock
                      className={`w-4 h-4 ${
                        isDark ? "text-cyan-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-500" : "text-gray-600"}
                    >
                      256-bit Encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield
                      className={`w-4 h-4 ${
                        isDark ? "text-cyan-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-500" : "text-gray-600"}
                    >
                      Secure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
