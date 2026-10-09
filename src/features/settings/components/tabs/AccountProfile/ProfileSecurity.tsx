import React, { memo } from "react";
import { Envelope, GithubLogo, Warning } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface ProfileSecurityProps {
  email: string;
  identities: Array<{
    id: string;
    provider: string;
    email: string;
    last_login_at?: string;
  }>;
  connectedAccounts: Record<"google" | "github", boolean>;
  isAuthLoading: boolean;
  onToggleAccount: (provider: "google" | "github") => void;
  onChangeEmail: () => void;
}

export const ProfileSecurity: React.FC<ProfileSecurityProps> = memo(
  ({
    email,
    identities,
    connectedAccounts,
    isAuthLoading,
    onToggleAccount,
    onChangeEmail,
  }) => {
    const { isDark } = useTheme();
    const t = useTranslations("settings");
    const tCommon = useTranslations("common");

    const getIdentityEmail = (provider: string) => {
      const identity = identities.find((id) => id.provider === provider);
      return identity?.email || t("not_connected");
    };

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-base font-bold font-jakarta mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Envelope className={`w-5 h-5 ${isDark ? "text-white/70" : "text-gray-700"}`} />
          {t("email_auth")}
        </h3>

        <div className="space-y-6">
          {/* Primary Email */}
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold font-mono ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("primary_email")}
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <input
                type="email"
                value={email}
                disabled
                className="settings-input w-full sm:flex-1 rounded-xl px-4 py-2.5 opacity-60 text-xs font-mono"
              />
              <button
                type="button"
                onClick={onChangeEmail}
                disabled={isAuthLoading}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {isAuthLoading ? tCommon("processing") : t("change_email")}
              </button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div>
            <label
              className={`text-[10px] uppercase tracking-wider mb-3 block font-mono font-bold ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("connected_accounts")}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Google */}
              <div
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                      isDark ? "bg-white/90" : "bg-white border border-gray-100"
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        isDark ? "text-zinc-100" : "text-gray-900"
                      }`}
                    >
                      Google
                    </p>
                    <p
                      className={`text-xs font-mono ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    >
                      {getIdentityEmail("google")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleAccount("google")}
                  disabled={isAuthLoading}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed ${
                    connectedAccounts.google
                      ? "text-red-400 hover:bg-red-500/20 bg-red-500/10 border-red-500/20"
                      : isDark
                        ? "text-white/80 border-white/8 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white"
                        : "text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {isAuthLoading
                    ? "..."
                    : connectedAccounts.google
                      ? tCommon("disconnect")
                      : tCommon("connect")}
                </button>
              </div>

              {/* GitHub */}
              <div
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                      isDark ? "bg-white/10" : "bg-gray-900"
                    }`}
                  >
                    <GithubLogo className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        isDark ? "text-zinc-100" : "text-gray-900"
                      }`}
                    >
                      GitHub
                    </p>
                    <p
                      className={`text-xs font-mono ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    >
                      {getIdentityEmail("github")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleAccount("github")}
                  disabled={isAuthLoading}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed ${
                    connectedAccounts.github
                      ? "text-red-400 hover:bg-red-500/20 bg-red-500/10 border-red-500/20"
                      : isDark
                        ? "text-white/80 border-white/8 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white"
                        : "text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {isAuthLoading
                    ? "..."
                    : connectedAccounts.github
                      ? tCommon("disconnect")
                      : tCommon("connect")}
                </button>
              </div>
            </div>
          </div>

          {/* OAuth Info */}
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              isDark
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Warning
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                isDark ? "text-white/60" : "text-gray-600"
              }`}
            />
            <div>
              <p
                className={`text-xs font-bold mb-1 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("sign_in_oauth")}
              </p>
              <p
                className={`text-xs ${
                  isDark ? "text-white/50" : "text-gray-500"
                }`}
              >
                {t("oauth_description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProfileSecurity.displayName = "ProfileSecurity";
