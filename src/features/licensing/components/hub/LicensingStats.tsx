import React from "react";
import { Shield, CheckCircle2, Clock, Activity } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion } from "motion/react";
import { Analytics } from "@/features/licensing/constants/mock-data";

interface LicensingStatsProps {
  analytics: Analytics | null;
}

export const LicensingStats: React.FC<LicensingStatsProps> = ({
  analytics,
}) => {
  const { isDark } = useTheme();

  if (!analytics) return null;

  const stats = [
    {
      label: "Total Licenses",
      value: analytics.total,
      icon: Shield,
      color: "cyan",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      label: "Active Keys",
      value: analytics.active,
      icon: CheckCircle2,
      color: "emerald",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      label: "Expired Keys",
      value: analytics.expired,
      icon: Clock,
      color: "orange",
      gradient: "from-orange-500/20 to-amber-500/20",
    },
    {
      label: "Validation Rate",
      value: `${analytics.validationSuccessRate}%`,
      icon: Activity,
      color: "purple",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`group relative p-6 rounded-3xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
            isDark
              ? "bg-black/40 border-white/5 hover:border-white/10"
              : "bg-white border-gray-100 shadow-sm hover:shadow-md"
          }`}
        >
          {/* Background Gradient Glow */}
          <div
            className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-2xl ${
                  isDark ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === "cyan"
                      ? "text-cyan-400"
                      : stat.color === "emerald"
                        ? "text-emerald-400"
                        : stat.color === "orange"
                          ? "text-orange-400"
                          : "text-purple-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <p
                className={`text-xs font-black uppercase tracking-widest ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {stat.label}
              </p>
              <h3
                className={`text-3xl font-black mt-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
