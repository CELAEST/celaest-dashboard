import React, { memo } from "react";
import { SignOut, X } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface SignOutCardProps {
  isDemo?: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutCard: React.FC<SignOutCardProps> = memo(
  ({ isDemo, isLoading, onClose, onConfirm }) => {
    const { isDark } = useTheme();
    const t = useTranslations("auth");
    const tCommon = useTranslations("common");

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full overflow-hidden rounded-3xl border shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300 ${
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

        <div className="relative flex min-w-0 flex-col items-stretch gap-6 p-6 sm:p-8">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl transition-colors cursor-pointer ${
              isDark
                ? "text-white/40 hover:text-white hover:bg-white/5"
                : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-stretch gap-4 text-center">
            <div className="mx-auto flex justify-center">
              <div
                className={`h-15 w-15 rounded-2xl flex items-center justify-center border shadow-inner transition-colors ${
                  isDark
                    ? "bg-white/[0.04] border-white/10 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "bg-zinc-100 border-zinc-200 text-zinc-800"
                }`}
              >
                <SignOut className="w-7 h-7" weight="bold" />
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <h2
                className={`w-full text-xl sm:text-2xl font-bold text-center tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                {isDemo ? t("reset_demo") : t("sign_out")}
              </h2>

              <p
                className={`w-full text-center text-xs sm:text-sm leading-relaxed max-w-sm mx-auto ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {isDemo ? t("reset_demo_desc") : t("sign_out_desc")}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row pt-1">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`min-w-0 flex-1 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-[#141418] hover:bg-[#1C1C22] text-white/80 border border-white/[0.08]"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
              }`}
            >
              {tCommon("cancel")}
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              autoFocus
              className={`min-w-0 flex-1 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-white hover:bg-neutral-200 text-black"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{isDemo ? t("resetting") : t("signing_out")}</span>
                </>
              ) : (
                <span>{isDemo ? t("reset_demo") : t("sign_out")}</span>
              )}
            </button>
          </div>

          <div
            className={`mt-2 pt-4 border-t ${
              isDark ? "border-white/[0.06]" : "border-zinc-200/60"
            }`}
          >
            <p
              className={`w-full text-[11px] font-mono text-center leading-relaxed ${
                isDark ? "text-white/40" : "text-zinc-500"
              }`}
            >
              {isDemo ? t("demo_session_desc") : t("secure_session_desc")}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

SignOutCard.displayName = "SignOutCard";
