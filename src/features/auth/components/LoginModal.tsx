import React from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { X, Lock, ArrowRight, GithubLogo } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const { isDark } = useTheme();
  const { signInWithGoogle, signInWithGitHub } = useAuth();
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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-120 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-modal-backdrop"
      />

      <div className="relative z-10 flex w-full items-center justify-center pointer-events-none">
        <div
          onClick={(event) => event.stopPropagation()}
          className={`relative pointer-events-auto shrink-0 w-full max-w-[440px] overflow-hidden rounded-3xl border shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300 animate-modal-content ${
            isDark
              ? "bg-[#09090b] border-white/[0.08]"
              : "bg-white border-zinc-200 shadow-2xl"
          }`}
        >
          {/* Tokyo Corner Accents (Dark Mode) */}
          {isDark && (
            <>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none z-30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none z-30" />
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={tCommon("close")}
            className={`absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl transition-colors cursor-pointer ${
              isDark
                ? "text-white/40 hover:text-white hover:bg-white/5"
                : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative flex min-w-0 flex-col items-stretch gap-6 p-6 sm:p-8">
            <div className="flex flex-col items-stretch gap-4 text-center">
              <div className="mx-auto flex justify-center">
                <div
                  className={`h-15 w-15 rounded-2xl flex items-center justify-center border shadow-inner transition-colors ${
                    isDark
                      ? "bg-white/[0.04] border-white/10 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "bg-zinc-100 border-zinc-200 text-zinc-800"
                  }`}
                >
                  <Lock className="w-7 h-7" weight="bold" />
                </div>
              </div>

              <div className="min-w-0 space-y-2">
                <h3
                  className={`w-full text-xl sm:text-2xl font-bold text-center tracking-tight ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {tAuth("sign_in_to_continue")}
                </h3>
                <p
                  className={`w-full text-center text-xs sm:text-sm leading-relaxed max-w-sm mx-auto ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {message || tAuth("sign_in_to_access")}
                </p>
              </div>
            </div>

            <div className="w-full space-y-3 pt-1">
              <button
                type="button"
                onClick={async () => {
                  const res = await signInWithGoogle();
                  if (!res.success && res.error) {
                    toast.error(res.error.message);
                  }
                }}
                autoFocus
                className="h-11 w-full rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center gap-2.5"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
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
                <span>{tAuth("continue_with_google")}</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  const res = await signInWithGitHub();
                  if (!res.success && res.error) {
                    toast.error(res.error.message);
                  }
                }}
                className={`h-11 w-full rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2.5 border ${
                  isDark
                    ? "bg-[#141418] hover:bg-[#1C1C22] text-white/90 border-white/[0.08]"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
                }`}
              >
                <GithubLogo className="w-4 h-4 shrink-0" weight="bold" />
                <span>{tAuth("continue_with_github")}</span>
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span
                    className={`w-full border-t ${isDark ? "border-white/[0.06]" : "border-zinc-200"}`}
                  />
                </div>
                <div className="relative flex justify-center">
                  <span
                    className={`px-3 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold ${
                      isDark ? "bg-[#09090b] text-white/40" : "bg-white text-zinc-400"
                    }`}
                  >
                    {tAuth("or_use_email")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/?mode=signin";
                }}
                className={`h-10 w-full rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  isDark
                    ? "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                    : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <span>{tAuth("sign_in_with_email")}</span>
                <ArrowRight className="w-3.5 h-3.5" weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
