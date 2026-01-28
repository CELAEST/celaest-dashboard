"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { FEATURE_REGISTRY, ValidTabId } from "../config/feature-registry";
import { useAccessControl } from "../hooks/useAccessControl";
import { Server } from "lucide-react";
import { useDashboardRouter } from "../hooks/useDashboardRouter";

// Standard Skeleton used for all features
const ViewSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="h-8 w-48 animate-pulse bg-gray-200/10 dark:bg-white/5 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse bg-gray-200/10 dark:bg-white/5 rounded-lg"
        />
      ))}
    </div>
  </div>
);

// Cache for dynamic components to prevent recreation on render
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const featureCache = new Map<string, React.ComponentType<any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFeatureComponent = (id: string, loadFn: any, ssr: boolean) => {
  if (!featureCache.has(id)) {
    const Component = dynamic(loadFn, {
      loading: () => <ViewSkeleton />,
      ssr: ssr !== false,
    });
    featureCache.set(id, Component);
  }
  return featureCache.get(id)!;
};

type FeatureLoaderProps = {
  // Optional override, otherwise uses hook
  tab?: ValidTabId;
  onShowLogin?: () => void;
};

export const FeatureLoader: React.FC<FeatureLoaderProps> = ({
  tab,
  onShowLogin,
}) => {
  const { activeTab } = useDashboardRouter();
  const currentTab = tab || activeTab;

  const featureConfig =
    FEATURE_REGISTRY[currentTab] || FEATURE_REGISTRY["dashboard"];

  // Retrieve stable component from cache
  // We use useMemo to ensure referential stability in the eyes of React
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const FeatureComponent = useMemo(
    () =>
      getFeatureComponent(
        featureConfig.id,
        featureConfig.load,
        featureConfig.ssr ?? true,
      ),
    [featureConfig.id, featureConfig.load, featureConfig.ssr],
  );

  // Check Permissions
  const { granted, reason } = useAccessControl(featureConfig);

  if (!granted) {
    if (reason === "loading") {
      // Wait for auth to settle
      return <ViewSkeleton />;
    }

    if (reason === "guest") {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <Server size={48} className="mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="font-mono text-sm">
            Please sign in to access this module.
          </p>
          <button
            onClick={onShowLogin}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      );
    }

    if (reason === "forbidden") {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-red-500">
          <Server size={48} className="mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="font-mono text-sm">
            You do not have permission to view this module.
          </p>
        </div>
      );
    }
  }

  return <FeatureComponent />;
};
