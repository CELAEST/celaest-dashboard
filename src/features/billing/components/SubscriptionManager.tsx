import React from "react";
import { motion } from "motion/react";
import {
  Lightning,
  TrendUp,
  CheckCircle,
  Sparkle,
  Warning,
  HardDrives,
  Globe,
  Headset,
  Users,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { ManageSubscriptionModal } from "./modals/ManageSubscriptionModal";
import { UpgradePlanModal } from "./modals/UpgradePlanModal";
import { useBilling } from "../hooks/useBilling";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";

/* ── Radial gauge with inline bar ─────────────── */
interface GaugeRingProps {
  percent: number;
  label: string;
  value: string;
  sub: string;
  colorFrom: string;
  colorTo: string;
  glowColor: string;
  icon: React.ReactNode;
  isDark: boolean;
  delay?: number;
}
const GaugeRing: React.FC<GaugeRingProps> = ({
  percent, label, value, sub, colorFrom, colorTo, glowColor, icon, isDark, delay = 0,
}) => {
  const size = 72;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePct = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            strokeWidth={stroke} />
        </svg>
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <defs>
            <linearGradient id={`gauge-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
          </defs>
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={`url(#gauge-${label})`}
            strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * safePct) / 100 }}
            transition={{ duration: 1.4, delay, ease: "easeOut" }}
            style={{ filter: isDark ? `drop-shadow(0 0 4px ${glowColor})` : "none" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon}
          <span className={`text-sm font-black leading-none mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
            {value}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {label}
        </div>
        <div className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          {sub}
        </div>
      </div>
    </div>
  );
};

export const SubscriptionManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false);

  // Use real billing data
  const { subscription, plan, usage, isLoading, error } = useBilling();
  const { currentOrg } = useOrgStore();

  // Allow billing management if the user is an owner/admin in their org, OR if they
  // are viewing their personal Celaest workspace (slug = "celaest" or "celaest-official").
  // The backend SQL exposes both slugs for the system org, so we check both.
  // In their personal Celaest space every user should be able to upgrade/manage.
  const isCelaestPersonal =
    currentOrg?.slug === "celaest-official" ||
    currentOrg?.slug === "celaest";

  const canBilling =
    currentOrg?.role === "owner" ||
    currentOrg?.role === "super_admin" ||
    isCelaestPersonal;

  // Build plan feature highlights from limits (must be before early returns)
  const limits = plan?.limits;
  const planFeatures = React.useMemo(() => {
    const items: { icon: React.FC<{ className?: string }>; label: string }[] = [];
    if (limits?.users) items.push({ icon: Users, label: `${limits.users} Users` });
    if (limits?.storage_gb) items.push({ icon: HardDrives, label: `${limits.storage_gb} GB` });
    if (limits?.custom_domains) items.push({ icon: Globe, label: `${limits.custom_domains} Domains` });
    if (limits?.support_level) items.push({ icon: Headset, label: limits.support_level });
    return items;
  }, [limits]);

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
        <Warning className="w-6 h-6 mr-2" />
        Failed to load subscription info
      </div>
    );
  }

  // Format price
  const rawPrice = Number(plan?.price_monthly) || 0;
  const currencySymbol = plan?.currency === "EUR" ? "\u20AC" : "$";
  const priceDisplay = rawPrice === 0 ? "Gratis" : `${currencySymbol}${rawPrice}`;

  return (
    <>
      <div
        className={`relative w-full rounded-2xl transition-all duration-500 overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-cyan-900/40 via-blue-900/20 to-indigo-900/40 backdrop-blur-2xl border border-cyan-500/20"
            : "bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-xl"
        }`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className={`absolute inset-0 ${isDark ? "bg-cyan-500/10" : "bg-blue-400/5"}`}
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "rgba(6,182,212,0.15)" : "rgba(59,130,246,0.15)"} 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          {/* ── LEFT: Plan info ── */}
          <div className="flex flex-col gap-0.5 shrink-0">
            {/* Badges inline */}
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide ${
                  isDark
                    ? "bg-cyan-500/10 border border-cyan-400/20 text-cyan-300"
                    : "bg-blue-100 border border-blue-200 text-blue-700"
                }`}
              >
                <Lightning className="w-3 h-3" />
                {plan?.name ? plan.name.toUpperCase() : "SIN PLAN"}
              </div>
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide ${
                  isDark
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-emerald-100 border border-emerald-200 text-emerald-700"
                }`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                {subscription?.status?.toUpperCase() || "INACTIVE"}
              </div>
            </div>

            <h2
              className={`text-lg font-black tracking-tight leading-tight ${
                isDark
                  ? "text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-blue-200"
                  : "text-slate-900"
              }`}
            >
              {plan?.name || "Plan Nexus"}
            </h2>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-black ${
                  isDark
                    ? "text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                    : "text-blue-600"
                }`}
              >
                {priceDisplay}
              </span>
              {rawPrice > 0 && (
                <span className={`text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  /mo
                </span>
              )}
            </div>

            {/* Plan features row */}
            {planFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {planFeatures.map((feat) => (
                  <div
                    key={feat.label}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold ${
                      isDark
                        ? "bg-white/5 text-slate-400 border border-white/5"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    <feat.icon className="w-3 h-3" />
                    {feat.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Vertical divider (lg+) ── */}
          <div className={`hidden lg:block w-px self-stretch ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

          {/* ── CENTER: Gauges ── */}
          <div className="flex items-center justify-center gap-5 shrink-0">
            <GaugeRing
              percent={usage.licenses.percent}
              label="Licenses"
              value={`${usage.licenses.used}/${usage.licenses.total}`}
              sub={`${usage.licenses.total - usage.licenses.used} available`}
              colorFrom="#06b6d4" colorTo="#3b82f6"
              glowColor="rgba(6,182,212,0.5)"
              icon={<CheckCircle className={`w-3.5 h-3.5 ${isDark ? "text-cyan-400" : "text-blue-500"}`} />}
              isDark={isDark}
            />
            <GaugeRing
              percent={usage.apiCalls.percent}
              label="API Calls"
              value={usage.apiCalls.used.toLocaleString()}
              sub={`Cap: ${usage.apiCalls.total.toLocaleString()}`}
              colorFrom="#34d399" colorTo="#14b8a6"
              glowColor="rgba(52,211,153,0.5)"
              icon={<TrendUp className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />}
              isDark={isDark}
              delay={0.2}
            />
          </div>

          {/* ── Vertical divider (lg+) ── */}
          <div className={`hidden lg:block w-px self-stretch ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

          {/* ── RIGHT: Actions ── */}
          <div className="flex flex-row gap-2 lg:flex-col shrink-0">
            <motion.button
              whileHover={canBilling ? { scale: 1.02 } : {}}
              whileTap={canBilling ? { scale: 0.98 } : {}}
              onClick={canBilling ? () => setIsUpgradeModalOpen(true) : undefined}
              title={!canBilling ? "Solo Propietarios" : undefined}
              className={`relative overflow-hidden flex-1 lg:flex-initial py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all duration-300 group ${
                !canBilling
                  ? "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-500 dark:border-zinc-700"
                  : isDark
                    ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.3)] hover:shadow-[0_0_24px_rgba(6,182,212,0.5)] border border-cyan-400/20"
                    : "bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl shadow-blue-500/30"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5" />
                UPGRADE
              </span>
              {canBilling && (
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </motion.button>
            <motion.button
              whileHover={canBilling ? { scale: 1.02 } : {}}
              whileTap={canBilling ? { scale: 0.98 } : {}}
              onClick={canBilling ? () => setIsManageModalOpen(true) : undefined}
              title={!canBilling ? "Solo Propietarios" : undefined}
              className={`flex-1 lg:flex-initial py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all duration-300 ${
                !canBilling
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-zinc-800/50 dark:text-gray-600 dark:border-zinc-800"
                  : isDark
                    ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              Manage
            </motion.button>
          </div>
        </div>
      </div>

      <ManageSubscriptionModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
};
