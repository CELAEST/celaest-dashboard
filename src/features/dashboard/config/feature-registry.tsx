import { ComponentType } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Files,
  BarChart2,
  Key,
  Settings,
  Activity,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";

export type FeatureAccessLevel = "public" | "user" | "admin";

export interface FeatureConfig {
  id: string;
  label: string;
  icon?: LucideIcon;
  load: () => Promise<{ default: ComponentType }>;
  access: FeatureAccessLevel;
  ssr?: boolean;
}

export const FEATURE_REGISTRY: Record<string, FeatureConfig> = {
  dashboard: {
    id: "dashboard",
    label: "Command Center",
    icon: LayoutDashboard,
    load: () =>
      import("../components/DashboardContent").then((m) => ({
        default: m.DashboardContent,
      })),
    access: "user",
    ssr: false,
  },
  marketplace: {
    id: "marketplace",
    label: "Marketplace",
    icon: Files,
    load: () =>
      import("@/features/marketplace/components/MarketplaceView").then((m) => ({
        default: m.MarketplaceView,
      })),
    access: "public",
    ssr: true,
  },
  licensing: {
    id: "licensing",
    label: "Licensing Hub",
    icon: Key,
    load: () =>
      import("@/features/licensing/components/LicensingHub").then((m) => ({
        default: m.LicensingHub,
      })),
    access: "user",
    ssr: true,
  },
  analytics: {
    id: "analytics",
    label: "Analytics Console",
    icon: BarChart2,
    load: () =>
      import("@/features/analytics/components/AnalyticsConsole").then((m) => ({
        default: m.AnalyticsConsole,
      })),
    access: "user",
    ssr: false,
  },
  billing: {
    id: "billing",
    label: "Billing Portal",
    icon: CreditCard,
    load: () =>
      import("@/features/billing/components/BillingPortal").then((m) => ({
        default: m.BillingPortal,
      })),
    access: "user",
    ssr: true,
  },
  catalog: {
    id: "catalog",
    label: "Asset Manager",
    icon: Files,
    load: () =>
      import("@/features/assets/components/AssetManager").then((m) => ({
        default: m.AssetManager,
      })),
    access: "user",
    ssr: true,
  },
  releases: {
    id: "releases",
    label: "Release Manager",
    icon: Activity,
    load: () =>
      import("@/features/releases/components/ReleaseManager").then((m) => ({
        default: m.ReleaseManager,
      })),
    access: "user",
    ssr: true,
  },
  users: {
    id: "users",
    label: "User Management",
    icon: Users,
    load: () =>
      import("@/features/users/components/UserManagement").then((m) => ({
        default: m.UserManagement,
      })),
    access: "user",
    ssr: true,
  },
  roi: {
    id: "roi",
    label: "ROI Metrics",
    icon: Activity,
    load: () =>
      import("@/features/roi/components/ROIMetrics").then((m) => ({
        default: m.ROIMetrics,
      })),
    access: "user",
    ssr: false,
  },
  errors: {
    id: "errors",
    label: "Error Monitoring",
    icon: AlertTriangle,
    load: () => import("@/features/errors/components/ErrorMonitoring"),
    access: "user",
    ssr: false,
  },
  settings: {
    id: "settings",
    label: "Settings",
    icon: Settings,
    load: () =>
      import("@/features/settings").then((m) => ({ default: m.SettingsView })),
    access: "user",
    ssr: true,
  },
};

export type ValidTabId = keyof typeof FEATURE_REGISTRY;
