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
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
              isDark ? "bg-cyan-500/10" : "bg-cyan-50"
            }`}
          >
            <Code
              className={`w-6 h-6 ${
                isDark ? "text-cyan-400" : "text-cyan-600"
              }`}
            />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("developer_api_keys")}
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t("developer_api_keys_desc")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all hover:border-cyan-500/30 ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p
                    className={`font-bold text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {key.name}
                  </p>
                  <p
                    className={`text-[11px] mt-1 font-medium ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <span className="hidden sm:inline">{t("created_label", { date: key.created })} • {t("last_used_label", { date: key.lastUsed })}</span>
                    <span className="sm:hidden block">{t("created_label", { date: key.created })}</span>
                    <span className="sm:hidden block">{t("last_used_label", { date: key.lastUsed })}</span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onRevoke(key.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "text-red-500/70 hover:text-red-400 hover:bg-red-500/10"
                        : "text-red-400 hover:text-red-600 hover:bg-red-50"
                    }`}
                    title={t("revoke_key")}
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3.5 rounded-xl border font-mono text-xs transition-colors ${
                  isDark
                    ? "bg-black border-white/10 text-cyan-400/90"
                    : "bg-white border-gray-200 text-cyan-600 shadow-sm"
                }`}
              >
                <Key size={14} className="shrink-0 opacity-40" />
                <span className="flex-1 truncate tracking-wider">
                  {key.key.substring(0, 12)}...
                  {key.key.substring(key.key.length - 4)}
                </span>
                <button
                  onClick={() => onCopy(key.key)}
                  className={`p-1.5 rounded-md transition-all ${
                    isDark
                      ? "hover:bg-cyan-500/10 text-cyan-500"
                      : "hover:bg-cyan-50 text-cyan-600"
                  }`}
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onGenerate}
          className={`w-full mt-6 py-3.5 rounded-xl border-dashed border-2 font-black transition-all text-[11px] flex items-center justify-center gap-2 tracking-widest ${
            isDark
              ? "border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/5 hover:border-cyan-500/40"
              : "border-cyan-200 text-cyan-600 bg-cyan-50/30 hover:bg-cyan-50 hover:border-cyan-300"
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
