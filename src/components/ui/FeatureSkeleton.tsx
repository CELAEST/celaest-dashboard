"use client";

import React from "react";

interface FeatureSkeletonProps {
  /** Number of skeleton card rows to render. Default: 3 */
  rows?: number;
  isDark?: boolean;
}

/**
 * Unified loading skeleton for feature panels.
 * Renders a consistent shimmer layout matching the Jewel Box design system.
 * Use this instead of ad-hoc CircleNotch spinners in feature loading states.
 */
export const FeatureSkeleton: React.FC<FeatureSkeletonProps> = ({
  rows = 3,
  isDark = true,
}) => {
  const baseColor = isDark ? "bg-white/[0.04]" : "bg-gray-100";
  const shimmer = isDark ? "bg-white/[0.06]" : "bg-gray-200/70";

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 p-2">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${shimmer} animate-pulse`} />
          <div className="space-y-2">
            <div className={`h-5 w-48 rounded-lg ${shimmer} animate-pulse`} />
            <div className={`h-3 w-32 rounded-lg ${baseColor} animate-pulse`} />
          </div>
        </div>
        <div className={`h-9 w-28 rounded-xl ${baseColor} animate-pulse`} />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-24 rounded-2xl ${baseColor} animate-pulse`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Content rows skeleton */}
      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-xl ${baseColor} animate-pulse`}
            style={{ animationDelay: `${(i + 4) * 80}ms` }}
          >
            <div className={`w-10 h-10 rounded-lg ${shimmer} shrink-0`} />
            <div className="flex-1 space-y-2">
              <div className={`h-4 rounded-lg ${shimmer}`} style={{ width: `${70 - i * 10}%` }} />
              <div className={`h-3 rounded-lg ${baseColor}`} style={{ width: `${50 - i * 5}%` }} />
            </div>
            <div className={`w-16 h-8 rounded-lg ${shimmer}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
