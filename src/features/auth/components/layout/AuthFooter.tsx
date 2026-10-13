"use client";

import React from "react";
import { Lock, Shield, ArrowRight } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface AuthFooterProps {
  mode: "signin" | "signup";
  isDark: boolean;
  onToggleMode: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  mode,
  isDark,
  onToggleMode,
}) => {
  const router = useRouter();
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  const handleBrowseAsGuest = () => {
    router.push("/?tab=marketplace");
  };
  return (
    <>
      <div
        className={`mt-4 sm:mt-5 pt-3 sm:pt-4 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}
      >
        <p
          className={`text-center text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {mode === "signin"
            ? tAuth("dont_have_account")
            : tAuth("already_have_account")}{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className={`font-semibold py-0.5 px-1 rounded-md cursor-pointer transition-colors ${
              isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
            }`}
          >
            {mode === "signin" ? tAuth("sign_up") : tAuth("sign_in")}
          </button>
        </p>
      </div>

      <div className={`mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3.5 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
        <button
          type="button"
          onClick={handleBrowseAsGuest}
          className={`w-full text-center text-xs sm:text-sm flex items-center justify-center gap-2 py-0.5 transition-colors cursor-pointer ${
            isDark
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>{tAuth("browse_as_guest")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 sm:mt-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Lock
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <span>{tAuth("encryption")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <span>{tCommon("secure")}</span>
          </div>
        </div>
      </div>
    </>
  );
};
