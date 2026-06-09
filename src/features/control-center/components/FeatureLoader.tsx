"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { FEATURE_REGISTRY, ValidTabId, FeatureSkeletonType } from "../config/feature-registry";
import { useAccessControl } from "../hooks/useAccessControl";
import { HardDrives } from "@phosphor-icons/react";
import { useDashboardRouter } from "../hooks/useDashboardRouter";
import { PageSkeleton } from "@/components/ui/skeletons";
import { ErrorBoundary, FallbackProps } from "@/components/ui/error-boundary";
import { FeatureError } from "@/components/ui/feature-error";
import { useTranslations } from "next-intl";

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
) => {
  if (!featureCache.has(id)) {
    const Component = dynamic(loadFn, {
      loading: () => null,
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
  const tAuth = useTranslations("auth");
  const tErrors = useTranslations("errors");

  const featureConfig =
    FEATURE_REGISTRY[currentTab] || FEATURE_REGISTRY["dashboard"];

  // Retrieve stable component from cache
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
      // Wait for auth to settle — show feature-appropriate skeleton
      return <FeatureSkeletonView type={featureConfig.skeleton ?? "table"} />;
    }

    if (reason === "guest") {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <HardDrives size={48} className="mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">{tAuth("account_required")}</h2>
          <p className="font-mono text-sm">
            {tAuth("sign_in_to_access")}
          </p>
          <button
            onClick={onShowLogin}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {tAuth("sign_in")}
          </button>
        </div>
      );
    }

    if (reason === "forbidden") {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-red-500">
          <HardDrives size={48} className="mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">{tErrors("access_denied")}</h2>
          <p className="font-mono text-sm">
            {tErrors("no_permission")}
          </p>
        </div>
      );
    }
  }

  // Wrap dynamic content with localized Error Boundary
  return (
    <ErrorBoundary 
      fallback={({ error, resetErrorBoundary }: FallbackProps) => (
        <FeatureError 
          title={tErrors("module_load_error", { module: featureConfig.label })}
          error={error} 
          resetError={resetErrorBoundary} 
        />
      )}
    >
      {React.createElement(FeatureComponent)}
    </ErrorBoundary>
  );
};
