import React, { memo } from "react";
import { Code, Key, Copy, SquaresFour, Trash } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

interface ApiKeysProps {
  apiKeys: ApiKey[];
  onGenerate: () => void;
  onCopy: (text: string) => void;
  onRevoke: (id: string) => void;
}

export const ApiKeys: React.FC<ApiKeysProps> = memo(
  ({ apiKeys, onGenerate, onCopy, onRevoke }) => {
    const { isDark } = useTheme();
    const t = useTranslations("settings");

    return (
      <div className="settings-glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
              isDark ? "bg-white/[0.04] border-white/10 text-white/70" : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={`text-base font-bold font-jakarta tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("developer_api_keys")}
            </h3>
            <p
              className={`text-xs ${
                isDark ? "text-white/50" : "text-gray-500"
              }`}
            >
              {t("developer_api_keys_desc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p
                    className={`font-bold text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {key.name}
                  </p>
                  <p
                    className={`text-[11px] mt-1 font-mono ${
                      isDark ? "text-white/40" : "text-gray-400"
                    }`}
                  >
                    <span className="hidden sm:inline">{t("created_label", { date: key.created })} • {t("last_used_label", { date: key.lastUsed })}</span>
                    <span className="sm:hidden block">{t("created_label", { date: key.created })}</span>
                    <span className="sm:hidden block">{t("last_used_label", { date: key.lastUsed })}</span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onRevoke(key.id)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isDark
                        ? "text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                    title={t("revoke_key")}
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-xl border font-mono text-xs transition-colors ${
                  isDark
                    ? "bg-white/[0.03] border-white/8 text-white/90"
                    : "bg-white border-gray-200 text-gray-900 shadow-xs"
                }`}
              >
                <Key size={14} className="shrink-0 text-white/40" />
                <span className="flex-1 truncate tracking-wider font-mono">
                  {key.key.substring(0, 12)}...
                  {key.key.substring(key.key.length - 4)}
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(key.key)}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    isDark
                      ? "hover:bg-white/10 text-white/60 hover:text-white"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className={`w-full mt-4 py-3 rounded-xl border border-dashed font-mono font-bold transition-all text-xs flex items-center justify-center gap-2 tracking-wider cursor-pointer ${
            isDark
              ? "border-white/10 text-white/70 hover:bg-white/[0.03] hover:border-white/20 hover:text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <SquaresFour size={14} />
          {t("generate_new_key")}
        </button>
      </div>
    );
  },
);

ApiKeys.displayName = "ApiKeys";
