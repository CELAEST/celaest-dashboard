import React from "react";
import { motion } from "motion/react";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Crown,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useBilling } from "../hooks/useBilling";
import type { Subscription } from "../types";

const tierColor = (tier: number, isDark: boolean) => {
  if (tier >= 3)
    return isDark
      ? "from-amber-500/20 to-yellow-500/10 border-amber-500/30"
      : "from-amber-50 to-yellow-50 border-amber-300";
  if (tier === 2)
    return isDark
      ? "from-violet-500/20 to-purple-500/10 border-violet-500/30"
      : "from-violet-50 to-purple-50 border-violet-300";
  return isDark
    ? "from-slate-500/20 to-gray-500/10 border-slate-500/30"
    : "from-slate-50 to-gray-50 border-slate-300";
};

export const LicensesList: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { allSubscriptions, subscription, isLoading, error } = useBilling();

  if (isLoading) {
    return (
      <div
        className={`w-full h-full rounded-3xl animate-pulse ${isDark ? "bg-slate-800/50" : "bg-slate-100"}`}
      />
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        Error al cargar licencias
      </div>
    );
  }

  if (!allSubscriptions || allSubscriptions.length === 0) {
    return (
      <div
        className={`w-full rounded-3xl p-6 flex flex-col items-center justify-center h-full ${
          isDark
            ? "bg-slate-800/30 border border-slate-700/50"
            : "bg-slate-50 border border-slate-200"
        }`}
      >
        <Shield
          className={`w-12 h-12 mb-3 ${isDark ? "text-slate-600" : "text-slate-300"}`}
        />
        <p
          className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          No hay licencias registradas
        </p>
      </div>
    );
  }

  const effectiveId = subscription?.id;

  return (
    <div
      className={`relative w-full rounded-3xl transition-all duration-500 flex flex-col h-full overflow-hidden xl:max-h-[560px] ${
        isDark
          ? "bg-linear-to-br from-slate-900/60 via-gray-900/40 to-slate-900/60 backdrop-blur-2xl border border-slate-700/30"
          : "bg-white border border-slate-200 shadow-xl"
      }`}
    >
      <div className="relative p-4 flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3
            className={`text-lg font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Licencias
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isDark
                ? "bg-slate-700/50 text-slate-300"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {allSubscriptions.length}{" "}
            {allSubscriptions.length === 1 ? "licencia" : "licencias"}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {allSubscriptions.map((sub, index) => (
            <LicenseItem
              key={sub.id}
              sub={sub}
              isEffective={sub.id === effectiveId}
              isDark={isDark}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface LicenseItemProps {
  sub: Subscription;
  isEffective: boolean;
  isDark: boolean;
  index: number;
}

const LicenseItem: React.FC<LicenseItemProps> = ({
  sub,
  isEffective,
  isDark,
  index,
}) => {
  const tier = sub.plan?.tier || 0;
  const planName = sub.plan?.name || "Plan desconocido";
  const isSuperseded = sub.status === "superseded";
  const isActive = sub.status === "active" || sub.status === "trial";

  const StatusIcon = isEffective
    ? Crown
    : isActive
      ? ShieldCheck
      : ShieldOff;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`relative rounded-2xl p-4 border transition-all duration-300 bg-linear-to-r ${
        isEffective
          ? isDark
            ? "from-cyan-500/15 to-blue-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
            : "from-blue-50 to-indigo-50 border-blue-300 shadow-md shadow-blue-200/50"
          : tierColor(tier, isDark)
      } ${isSuperseded ? "opacity-60" : ""}`}
    >
      {/* Effective badge */}
      {isEffective && (
        <div
          className={`absolute -top-2 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider ${
            isDark
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
              : "bg-blue-600 text-white shadow-md shadow-blue-400/30"
          }`}
        >
          EN USO
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isEffective
              ? isDark
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-blue-100 text-blue-600"
              : isSuperseded
                ? isDark
                  ? "bg-slate-700/50 text-slate-500"
                  : "bg-slate-100 text-slate-400"
                : isDark
                  ? "bg-slate-700/50 text-slate-300"
                  : "bg-slate-100 text-slate-600"
          }`}
        >
          <StatusIcon className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold truncate ${
                isEffective
                  ? isDark
                    ? "text-cyan-200"
                    : "text-blue-800"
                  : isDark
                    ? "text-slate-200"
                    : "text-slate-800"
              }`}
            >
              {planName}
            </span>
            {tier > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isDark
                    ? "bg-slate-700/60 text-slate-400"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                Tier {tier}
              </span>
            )}
          </div>
          <div
            className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {sub.plan?.price_monthly
              ? `$${sub.plan.price_monthly}/mo`
              : "Gratis"}
            {sub.plan?.currency && sub.plan.currency !== "USD"
              ? ` (${sub.plan.currency})`
              : ""}
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide shrink-0 ${
            isEffective
              ? isDark
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : isSuperseded
                ? isDark
                  ? "bg-slate-700/40 text-slate-500 border border-slate-600/20"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
                : isActive
                  ? isDark
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    : "bg-blue-50 text-blue-600 border border-blue-200"
                  : isDark
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {isSuperseded
            ? "REEMPLAZADA"
            : isActive
              ? sub.status.toUpperCase()
              : sub.status.toUpperCase()}
        </div>
      </div>
    </motion.div>
  );
};
