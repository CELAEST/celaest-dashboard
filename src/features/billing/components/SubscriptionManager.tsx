import React from "react";
import { useSearchParams } from "next/navigation";
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
  Check,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { ManageSubscriptionModal } from "./modals/ManageSubscriptionModal";
import { UpgradePlanModal } from "./modals/UpgradePlanModal";
import { useBilling } from "../hooks/useBilling";
import { useLocalPlanPrice } from "../hooks/useLocalPlanPrice";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useTranslations } from "next-intl";

/* ── Radial gauge with Obsidian Luxury styling ─────────────── */
interface GaugeRingProps {
  percent: number;
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  isDark: boolean;
  delay?: number;
}
const GaugeRing: React.FC<GaugeRingProps> = ({
  percent,
  label,
  value,
  sub,
  icon,
  isDark,
  delay = 0,
}) => {
  const size = 64;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePct = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            strokeWidth={stroke}
          />
        </svg>
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.85)"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * safePct) / 100 }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon}
          <span
            className={`font-mono font-bold leading-none mt-0.5 ${
              value.length > 5 ? "text-[10px]" : "text-xs"
            } ${isDark ? "text-zinc-100" : "text-gray-900"}`}
          >
            {value}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div
          className={`text-[10px] font-mono uppercase tracking-wider ${
            isDark ? "text-white/60" : "text-gray-600"
          }`}
        >
          {label}
        </div>
        <div className={`text-[9px] font-mono ${isDark ? "text-white/40" : "text-gray-400"}`}>
          {sub}
        </div>
      </div>
    </div>
  );
};

export const SubscriptionManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false);

  // Use real billing data
  const { subscription, plan, usage, isLoading, error } = useBilling();
  const { currentOrg } = useOrgStore();
  const t = useTranslations("billing");
  const planPrice = useLocalPlanPrice(plan);

  React.useEffect(() => {
    if (requestedPlan) {
      setIsUpgradeModalOpen(true);
    }
  }, [requestedPlan]);

  // Allow billing management if the user is an owner/admin in their org, OR if they
  // are viewing their personal Celaest workspace (slug = "celaest" or "celaest-official").
  const isCelaestPersonal =
    currentOrg?.slug === "celaest-official" ||
    currentOrg?.slug === "celaest";

  const canBilling =
    currentOrg?.role === "owner" ||
    currentOrg?.role === "super_admin" ||
    isCelaestPersonal;

  // Build plan feature highlights from limits
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
        className={`w-full h-full min-h-[160px] rounded-2xl animate-pulse ${
          isDark ? "bg-white/[0.02] border border-white/6" : "bg-gray-100 border border-gray-200"
        }`}
      />
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-400 font-mono text-xs">
        <Warning className="w-4 h-4 mr-2" />
        {t("load_error")}
      </div>
    );
  }

  const isYearly = (subscription?.billing_cycle ?? "monthly") === "yearly";
  const selectedPrice = isYearly && planPrice.yearly.value > 0
    ? planPrice.yearly
    : planPrice.monthly;
  const priceDisplay = selectedPrice.isFree ? t("free") : selectedPrice.formatted;
  const periodLabel = isYearly ? "/yr" : t("per_month");

  return (
    <>
      <div
        className={`relative w-full rounded-2xl transition-all duration-200 border p-4 sm:p-5 ${
          isDark
            ? "bg-[#09090b]/80 border-white/6 backdrop-blur-xl hover:border-white/10"
            : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* ── LEFT: Plan info ── */}
          <div className="flex flex-col gap-1 min-w-0">
            {/* Badges inline */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border ${
                  isDark
                    ? "bg-white/[0.04] border-white/8 text-white/70"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }`}
              >
                <Lightning size={11} className={isDark ? "text-white/60" : "text-gray-500"} />
                {plan?.name ? plan.name.toUpperCase() : t("no_plan")}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border ${
                  subscription?.status === "active" || subscription?.status === "trial"
                    ? isDark
                      ? "bg-white/[0.08] text-white border-white/10 shadow-xs font-semibold"
                      : "bg-gray-900 text-white font-semibold"
                    : isDark
                      ? "bg-white/[0.03] text-white/50 border-white/[0.05]"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                <Check size={10} strokeWidth={3} className="mr-1 text-white/80" />
                {subscription?.status?.toUpperCase() || "INACTIVE"}
              </span>
            </div>

            <h2
              className={`text-base sm:text-lg font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {plan?.name || "Plan Nexus"}
            </h2>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold font-mono tracking-tight ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {priceDisplay}
              </span>
              {!selectedPrice.isFree && (
                <span
                  className={`text-[11px] font-mono ${
                    isDark ? "text-white/40" : "text-gray-500"
                  }`}
                >
                  {periodLabel}
                </span>
              )}
            </div>

            {/* Plan features row */}
            {planFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {planFeatures.map((feat) => (
                  <div
                    key={feat.label}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                      isDark
                        ? "bg-white/[0.03] text-white/60 border-white/6"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <feat.icon className={`w-3 h-3 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                    <span>{feat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Vertical divider (lg+) ── */}
          <div
            className={`hidden lg:block w-px self-stretch ${
              isDark ? "bg-white/6" : "bg-gray-200"
            }`}
          />

          {/* ── CENTER: Gauges ── */}
          <div className="flex items-center justify-center gap-6 shrink-0 py-1">
            <GaugeRing
              percent={usage.licenses.percent}
              label={t("licenses")}
              value={`${usage.licenses.used}/${usage.licenses.total}`}
              sub={t("available", { count: usage.licenses.total - usage.licenses.used })}
              icon={
                <CheckCircle
                  className={`w-3.5 h-3.5 ${isDark ? "text-white/70" : "text-gray-600"}`}
                />
              }
              isDark={isDark}
            />
            <GaugeRing
              percent={usage.apiCalls.percent}
              label={t("api_calls")}
              value={usage.apiCalls.used.toLocaleString()}
              sub={t("cap", { count: usage.apiCalls.total.toLocaleString() })}
              icon={
                <TrendUp
                  className={`w-3.5 h-3.5 ${isDark ? "text-white/70" : "text-gray-600"}`}
                />
              }
              isDark={isDark}
              delay={0.2}
            />
          </div>

          {/* ── Vertical divider (lg+) ── */}
          <div
            className={`hidden lg:block w-px self-stretch ${
              isDark ? "bg-white/6" : "bg-gray-200"
            }`}
          />

          {/* ── RIGHT: Actions ── */}
          <div className="flex flex-row gap-2 lg:flex-col shrink-0">
            <button
              onClick={canBilling ? () => setIsUpgradeModalOpen(true) : undefined}
              disabled={!canBilling}
              title={!canBilling ? t("owners_only") : undefined}
              className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                !canBilling
                  ? "bg-white/[0.02] text-white/30 border border-white/5 cursor-not-allowed"
                  : isDark
                    ? "bg-white text-black hover:bg-zinc-200 shadow-sm"
                    : "bg-gray-900 text-white hover:bg-black shadow-sm"
              }`}
            >
              <Sparkle className="w-3.5 h-3.5" weight="fill" />
              <span>{t("upgrade")}</span>
            </button>
            <button
              onClick={canBilling ? () => setIsManageModalOpen(true) : undefined}
              disabled={!canBilling}
              title={!canBilling ? t("owners_only") : undefined}
              className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-mono font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                !canBilling
                  ? "bg-white/[0.01] text-white/30 border border-white/5 cursor-not-allowed"
                  : isDark
                    ? "bg-white/[0.03] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span>{t("manage")}</span>
            </button>
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
