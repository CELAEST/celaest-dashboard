import React from "react";
import { motion } from "motion/react";
import {
  Shield,
  ShieldCheck,
  ShieldSlash,
  Crown,
  Warning,
  Check,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useBilling } from "../hooks/useBilling";
import { useLocalPlanPrice } from "../hooks/useLocalPlanPrice";
import type { Subscription } from "../types";

export const LicensesList: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { allSubscriptions, subscription, isLoading, error } = useBilling();

  if (isLoading) {
    return (
      <div
        className={`w-full h-full rounded-2xl animate-pulse ${
          isDark ? "bg-white/[0.02] border border-white/6" : "bg-gray-100 border border-gray-200"
        }`}
      />
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-400 font-mono text-xs">
        <Warning className="w-4 h-4 mr-2" />
        Error al cargar licencias
      </div>
    );
  }

  if (!allSubscriptions || allSubscriptions.length === 0) {
    return (
      <div
        className={`w-full rounded-2xl p-6 flex flex-col items-center justify-center h-full border ${
          isDark
            ? "bg-[#09090b]/80 border-white/6 backdrop-blur-xl"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <Shield
          className={`w-10 h-10 mb-2 ${isDark ? "text-white/20" : "text-gray-300"}`}
        />
        <p
          className={`text-xs font-mono uppercase tracking-wider ${
            isDark ? "text-white/40" : "text-gray-500"
          }`}
        >
          No hay licencias registradas
        </p>
      </div>
    );
  }

  const effectiveId = subscription?.id;

  return (
    <div
      className={`relative w-full rounded-2xl transition-all duration-200 border p-4 sm:p-5 flex flex-col h-full min-h-0 overflow-hidden ${
        isDark
          ? "bg-[#09090b]/80 border-white/6 backdrop-blur-xl hover:border-white/10"
          : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
      }`}
    >
      <div className="relative flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                isDark
                  ? "bg-white/[0.04] border-white/8 text-white/60"
                  : "bg-gray-100 border-gray-200 text-gray-600"
              }`}
            >
              <Shield size={14} />
            </div>
            <div>
              <h3
                className={`text-sm sm:text-base font-semibold tracking-tight ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                Licencias
              </h3>
              <p
                className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                Inventario activo de licencias
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/60"
                : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            {allSubscriptions.length}{" "}
            {allSubscriptions.length === 1 ? "licencia" : "licencias"}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
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
  const planName = sub.plan?.name 
    || (sub.metadata?.product_name as string) 
    || "Plan desconocido";
  const isMarketplace = sub.metadata?.source === "marketplace_purchase";
  const isSuperseded = sub.status === "superseded";
  const isActive = sub.status === "active" || sub.status === "trial";
  const planPrice = useLocalPlanPrice(sub.plan);
  const isYearly = (sub.billing_cycle ?? "monthly") === "yearly";
  const selectedPrice = isYearly && planPrice.yearly.value > 0
    ? planPrice.yearly
    : planPrice.monthly;
  const periodSuffix = isMarketplace ? "" : isYearly ? "/yr" : "/mo";
  const priceLabel = selectedPrice.isFree
    ? isMarketplace ? "Producto" : "Gratis"
    : `${selectedPrice.formatted}${periodSuffix}`;

  const StatusIcon = isEffective
    ? Crown
    : isActive
      ? ShieldCheck
      : ShieldSlash;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative rounded-xl p-3 border transition-colors duration-150 ${
        isEffective
          ? isDark
            ? "bg-white/[0.04] border-white/15 shadow-sm"
            : "bg-gray-50 border-gray-300 shadow-xs"
          : isDark
            ? "bg-white/[0.02] border-white/6 hover:border-white/10"
            : "bg-white border-gray-200 hover:border-gray-300"
      } ${isSuperseded ? "opacity-40" : ""}`}
    >
      {/* Effective badge */}
      {isEffective && (
        <div
          className={`absolute -top-2 right-3 px-2 py-0.2 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase ${
            isDark
              ? "bg-white text-black shadow-xs"
              : "bg-gray-900 text-white shadow-xs"
          }`}
        >
          EN USO
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
            isEffective
              ? isDark
                ? "bg-white/[0.08] border-white/12 text-white"
                : "bg-gray-900 text-white"
              : isDark
                ? "bg-white/[0.04] border-white/8 text-white/60"
                : "bg-gray-100 border-gray-200 text-gray-600"
          }`}
        >
          <StatusIcon className="w-4 h-4" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold truncate ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {planName}
            </span>
            {tier > 0 && (
              <span
                className={`text-[9px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                  isDark
                    ? "bg-white/[0.04] border-white/8 text-white/50"
                    : "bg-gray-100 border-gray-200 text-gray-500"
                }`}
              >
                Tier {tier}
              </span>
            )}
          </div>
          <div
            className={`text-[11px] font-mono mt-0.5 ${
              isDark ? "text-white/50" : "text-gray-500"
            }`}
          >
            {priceLabel}
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider shrink-0 border ${
            isEffective || isActive
              ? isDark
                ? "bg-white/[0.08] text-white border-white/10 font-semibold shadow-xs"
                : "bg-gray-900 text-white font-semibold"
              : isSuperseded
                ? isDark
                  ? "bg-white/[0.02] text-white/30 border-white/5"
                  : "bg-gray-100 text-gray-400 border-gray-200"
                : isDark
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {isEffective || isActive ? (
            <span className="flex items-center gap-1">
              <Check size={10} strokeWidth={3} className="text-white/80" />
              <span>{sub.status.toUpperCase()}</span>
            </span>
          ) : isSuperseded ? (
            "REEMPLAZADA"
          ) : (
            sub.status.toUpperCase()
          )}
        </div>
      </div>
    </motion.div>
  );
};
