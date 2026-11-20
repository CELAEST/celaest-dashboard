"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

export type AuthActiveField = "name" | "email" | "password" | null;

interface AuthPortalFlankProps {
  mode: "signin" | "signup";
  isDark: boolean;
}

interface AuthPortalRightFlankProps extends AuthPortalFlankProps {
  activeField: AuthActiveField;
}

const NODE_Y_POSITIONS = [14, 84, 154] as const;

/**
 * Left editorial flank of the Tri-Axis Portal, right-aligned inward toward
 * the central authentication monolith (`x = 50%`).
 */
export const AuthPortalLeftFlank: React.FC<AuthPortalFlankProps> = ({
  mode,
  isDark,
}) => {
  const tAuth = useTranslations("auth");
  const isSignup = mode === "signup";

  return (
    <aside
      aria-label={tAuth("tri_axis.left_landmark_label")}
      className="hidden xl:flex flex-col items-end text-right pr-3 select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`left-${mode}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-end gap-2.5"
        >
          <span
            className={`font-jetbrains text-[10px] font-semibold tracking-[0.2em] ${
              isDark ? "text-white/60" : "text-slate-900/75"
            }`}
          >
            {isSignup ? tAuth("tri_axis.signup_kicker") : tAuth("tri_axis.signin_kicker")}
          </span>

          <h2
            className={`text-[clamp(22px,2vw,30px)] font-semibold tracking-[-0.03em] leading-[1.15] max-w-[340px] ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            {isSignup ? tAuth("tri_axis.signup_headline") : tAuth("tri_axis.signin_headline")}
          </h2>

          <p
            className={`text-[13.5px] leading-[1.55] max-w-[330px] ${
              isDark ? "text-white/65" : "text-slate-900/80"
            }`}
          >
            {isSignup ? tAuth("tri_axis.signup_sub") : tAuth("tri_axis.signin_sub")}
          </p>

          {/* Inward architectural axis line + pin pointing directly at Center Monolith */}
          <div className="w-[180px] flex items-center my-1.5" aria-hidden="true">
            <span
              className={`flex-1 h-px bg-linear-to-r from-transparent ${
                isDark ? "to-white/35" : "to-slate-900/35"
              }`}
            />
            <span
              className={`w-[5px] h-[5px] rounded-[1px] border ${
                isDark ? "border-white/65" : "border-slate-900/65"
              }`}
            />
          </div>

          <div
            className={`flex items-center gap-2.5 font-jetbrains text-[10px] tracking-[0.14em] ${
              isDark ? "text-white/50" : "text-slate-900/75"
            }`}
          >
            <span>{tAuth("tri_axis.module_01")}</span>
            <span aria-hidden="true">·</span>
            <span>{tAuth("tri_axis.module_02")}</span>
            <span aria-hidden="true">·</span>
            <span>{tAuth("tri_axis.module_03")}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
};

/**
 * Right mirrored SVG telemetry rail of the Tri-Axis Portal.
 * Nodes illuminate live when the user focuses `name` / `email` / `password`.
 */
export const AuthPortalRightFlank: React.FC<AuthPortalRightFlankProps> = ({
  mode,
  isDark,
  activeField,
}) => {
  const tAuth = useTranslations("auth");
  const isSignup = mode === "signup";
  const prefix = isSignup ? "signup" : "signin";

  const nodes = [
    {
      code: tAuth(`tri_axis.${prefix}_node_1_code`),
      title: tAuth(`tri_axis.${prefix}_node_1_title`),
      sub: tAuth(`tri_axis.${prefix}_node_1_sub`),
    },
    {
      code: tAuth(`tri_axis.${prefix}_node_2_code`),
      title: tAuth(`tri_axis.${prefix}_node_2_title`),
      sub: tAuth(`tri_axis.${prefix}_node_2_sub`),
    },
    {
      code: tAuth(`tri_axis.${prefix}_node_3_code`),
      title: tAuth(`tri_axis.${prefix}_node_3_title`),
      sub: tAuth(`tri_axis.${prefix}_node_3_sub`),
    },
  ];

  const activeIdx =
    activeField === "name" || activeField === "email"
      ? 0
      : activeField === "password"
        ? 1
        : 2;

  return (
    <aside
      aria-label={tAuth("tri_axis.right_landmark_label")}
      className="hidden xl:flex flex-col items-start text-left pl-3 select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`right-${mode}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3.5"
        >
          <span
            className={`font-jetbrains text-[10px] font-semibold tracking-[0.2em] ${
              isDark ? "text-white/60" : "text-slate-900/75"
            }`}
          >
            {isSignup
              ? tAuth("tri_axis.telemetry_signup_kicker")
              : tAuth("tri_axis.telemetry_signin_kicker")}
          </span>

          <div className="flex items-stretch gap-3.5">
            <svg
              className="w-[18px] h-[168px] shrink-0"
              viewBox="0 0 18 168"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="9"
                y1="12"
                x2="9"
                y2="156"
                stroke={isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(15, 23, 42, 0.16)"}
                strokeWidth="1"
              />
              <line
                x1="9"
                y1="12"
                x2="9"
                y2="156"
                className="auth-tri-bus-photon"
                stroke={
                  isSignup
                    ? isDark
                      ? "#c4b5fd"
                      : "#6d28d9"
                    : isDark
                      ? "rgba(255, 255, 255, 0.85)"
                      : "#09090b"
                }
                strokeWidth="1.5"
              />
              {NODE_Y_POSITIONS.map((cy, idx) => {
                const isFocused = activeIdx === idx;
                return (
                  <rect
                    key={cy}
                    x="5"
                    y={cy - 4}
                    width="8"
                    height="8"
                    rx="1"
                    strokeWidth="1"
                    className="transition-colors duration-200"
                    fill={
                      isFocused
                        ? isDark
                          ? "#a78bfa"
                          : "#7c3aed"
                        : isDark
                          ? "#06070a"
                          : "#f5f6f8"
                    }
                    stroke={
                      isFocused
                        ? isDark
                          ? "#ffffff"
                          : "#09090b"
                        : isDark
                          ? "rgba(255, 255, 255, 0.52)"
                          : "rgba(15, 23, 42, 0.58)"
                    }
                  />
                );
              })}
            </svg>

            <div className="flex flex-col justify-between gap-4">
              {nodes.map((node, idx) => {
                const isHot = activeIdx === idx;
                return (
                  <div
                    key={node.code}
                    data-tri-node={idx}
                    data-hot={isHot ? "true" : "false"}
                    className={`transition-all duration-200 ${
                      isHot
                        ? "opacity-100 translate-x-[3px]"
                        : isDark
                          ? "opacity-60"
                          : "opacity-80"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 font-jetbrains text-[11px] font-semibold tracking-[0.1em] ${
                        isDark ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      <span className="opacity-50">{node.code}</span>
                      <span>{node.title}</span>
                    </div>
                    <div
                      className={`mt-0.5 text-[12px] ${
                        isDark ? "text-white/75" : "text-slate-800/80"
                      }`}
                    >
                      {node.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
};
