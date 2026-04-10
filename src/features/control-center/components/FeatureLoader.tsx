"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { FEATURE_REGISTRY, ValidTabId, FeatureSkeletonType } from "../config/feature-registry";
import { useAccessControl } from "../hooks/useAccessControl";
import { HardDrives } from "@phosphor-icons/react";
import { useDashboardRouter } from "../hooks/useDashboardRouter";
import { PageSkeleton } from "@/components/ui/skeletons";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FeatureError } from "@/components/ui/feature-error";

// Per-feature skeleton: matches the actual layout of each feature
const FeatureSkeletonView = ({ type }: { type: FeatureSkeletonType }) => {
  if (type === "none") return null;
  return <PageSkeleton type={type} />;
};

// Cache for dynamic components to prevent recreation on render
const featureCache = new Map<string, React.ComponentType>();

const getFeatureComponent = (
  id: string,
  loadFn: () => Promise<{ default: React.ComponentType }>,
  ssr: boolean,
  skeletonType: FeatureSkeletonType,
) => {
  if (!featureCache.has(id)) {
    const Component = dynamic(loadFn, {
      loading: () => <FeatureSkeletonView type={skeletonType} />,
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
  const FeatureComponent = useMemo(
    () =>
      getFeatureComponent(
        featureConfig.id,
        featureConfig.load,
        featureConfig.ssr ?? true,
        featureConfig.skeleton ?? "table",
      ),
    [featureConfig.id, featureConfig.load, featureConfig.ssr, featureConfig.skeleton],
  );

  // Check Permissions
  const { granted, reason } = useAccessControl(featureConfig);

  if (!granted) {
    if (reason === "loading") {
      // Wait for auth to settle — show feature-appropriate skeleton
      return <FeatureSkeletonView type={featureConfig.skeleton ?? "table"} />;
    }

    if (reason === "guest") {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <HardDrives size={48} className="mb-4 opacity-50" />
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
          <HardDrives size={48} className="mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="font-mono text-sm">
            You do not have permission to view this module.
          </p>
        </div>
      );
    }
  }

  // Wrap dynamic content with localized Error Boundary
  return (
    <ErrorBoundary 
      fallback={({ error, resetErrorBoundary }: import("@/components/ui/error-boundary").FallbackProps) => (
        <FeatureError 
          title={`Error cargando módulo: ${featureConfig.label}`}
          error={error} 
          resetError={resetErrorBoundary} 
        />
      )}
    >
      {React.createElement(FeatureComponent)}
    </ErrorBoundary>
  );
};
