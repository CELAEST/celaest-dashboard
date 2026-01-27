"use client";

import React from "react";
import { Lock, Shield } from "lucide-react";

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
  return (
    <>
      <div
        className={`mt-8 pt-6 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}
      >
        <p
          className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {mode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className={`font-semibold ${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"}`}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Lock
              className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield
              className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </>
  );
};
