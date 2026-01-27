"use client";

import React from "react";
import { Shield, CheckCircle2, Clock, Activity } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Analytics } from "@/features/licensing/constants/mock-data";

interface LicensingStatsProps {
  analytics: Analytics | null;
}

export const LicensingStats: React.FC<LicensingStatsProps> = ({
  analytics,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 text-gray-500 mb-2">
          <Shield size={18} /> Total Licenses
        </div>
        <div
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {analytics.total}
        </div>
      </div>
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 text-green-500 mb-2">
          <CheckCircle2 size={18} /> Active
        </div>
        <div
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {analytics.active}
        </div>
      </div>
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 text-yellow-500 mb-2">
          <Clock size={18} /> Expired
        </div>
        <div
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {analytics.expired}
        </div>
      </div>
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 text-purple-500 mb-2">
          <Activity size={18} /> Validation Rate
        </div>
        <div
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {analytics.validationSuccessRate}%
        </div>
      </div>
    </div>
  );
};
