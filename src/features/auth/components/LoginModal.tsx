import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { X, Lock, ArrowRight, GithubLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  message = "Inicia sesion para acceder a esta funcion.",
}) => {
  const { theme } = useTheme();
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const isDark = theme === "dark";
  const [mounted, setMounted] = React.useState(false);

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, isOpen);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
          />

          <div className="relative z-10 flex w-full items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              onClick={(event) => event.stopPropagation()}
              className={`relative pointer-events-auto shrink-0 w-[30rem] min-w-[320px] sm:min-w-[30rem] max-w-[90vw] overflow-hidden rounded-[2rem] border shadow-2xl ${
                isDark
                  ? "bg-[#07090d] border-white/10 shadow-cyan-950/30"
                  : "bg-white border-gray-200 shadow-black/10"
              }`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-px ${
                  isDark
                    ? "bg-linear-to-r from-transparent via-cyan-400/70 to-transparent"
                    : "bg-linear-to-r from-transparent via-blue-500/60 to-transparent"
                }`}
              />
              <div
                className={`absolute -top-20 right-0 h-40 w-40 rounded-full blur-3xl ${
                  isDark ? "bg-cyan-500/15" : "bg-blue-500/10"
                }`}
              />

              <button
                onClick={onClose}
                aria-label="Cerrar modal de inicio de sesión"
                className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isDark
                    ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <X size={18} />
              </button>

              <div className="relative flex min-w-0 flex-col items-stretch gap-6 p-6 text-center sm:p-8">
                <div className="flex flex-col items-stretch gap-4">
                  <span
                    className={`mx-auto inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] ${
                      isDark
                        ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    Cuenta requerida
                  </span>

                  <div
                    className={`mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.5rem] border ${
                      isDark
                        ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.16)]"
                        : "border-blue-200 bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Lock size={34} />
                  </div>

                  <div className="min-w-0 space-y-2">
                    <h3
                      className={`w-full text-2xl font-black tracking-tight sm:text-[2rem] ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Inicia sesion para continuar
                    </h3>
                    <p
                      className={`w-full text-sm leading-6 sm:text-base ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {message}
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <Button
                    onClick={() => {
                      signInWithGoogle();
                      onClose();
                    }}
                    autoFocus
                    size="lg"
                    className={`h-[3.25rem] w-full rounded-2xl border text-sm font-semibold transition-all ${
                      isDark
                        ? "border-white/10 bg-white text-black hover:bg-gray-200"
                        : "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
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
                    Continuar con Google
                  </Button>

                  <Button
                    onClick={() => {
                      signInWithGitHub();
                      onClose();
                    }}
                    size="lg"
                    className={`h-[3.25rem] w-full rounded-2xl border text-sm font-semibold transition-all ${
                      isDark
                        ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <GithubLogo size={20} />
                    Continuar con GitHub
                  </Button>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <span
                        className={`w-full border-t ${isDark ? "border-white/10" : "border-gray-200"}`}
                      />
                    </div>
                    <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-[0.24em]">
                      <span
                        className={`px-3 ${isDark ? "bg-[#07090d] text-gray-500" : "bg-white text-gray-400"}`}
                      >
                        O usa email
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      window.location.href = "/?mode=signin";
                    }}
                    className={`h-12 w-full rounded-2xl text-sm font-semibold ${
                      isDark
                        ? "text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
                        : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    Iniciar con email
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
    ,
    document.body,
  );
};
