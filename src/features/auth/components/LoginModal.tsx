import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { X, Lock, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  message = "Please sign in to access this feature.",
}) => {
  const { theme } = useTheme();
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const isDark = theme === "dark";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border ${
            isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-200"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isDark
                ? "text-gray-400 hover:bg-white/10 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <X size={20} />
          </button>

          <div className="p-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <Lock size={32} />
            </div>

            <h3
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Access Restricted
            </h3>
            <p className={`mb-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {message}
            </p>

            <div className="w-full space-y-3">
              <Button
                onClick={() => {
                  signInWithGoogle();
                  onClose();
                }}
                className={`w-full h-12 flex items-center justify-center gap-3 font-medium transition-all ${
                  isDark
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853" // Google Green (Corrected from custom blue/red handling)
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
                Continue with Google
              </Button>

              <Button
                onClick={() => {
                  signInWithGitHub();
                  onClose();
                }}
                className={`w-full h-12 flex items-center justify-center gap-3 font-medium border transition-all ${
                  isDark
                    ? "bg-transparent border-white/20 hover:bg-white/10 text-white"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Github size={20} />
                Continue with GitHub
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span
                    className={`w-full border-t ${isDark ? "border-white/10" : "border-gray-200"}`}
                  />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    className={`px-2 ${isDark ? "bg-[#0a0a0a] text-gray-500" : "bg-white text-gray-500"}`}
                  >
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = "/?mode=signin";
                }}
                className={`w-full flex items-center justify-center gap-2 ${
                  isDark
                    ? "text-cyan-400 hover:text-cyan-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Sign in with Email
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
