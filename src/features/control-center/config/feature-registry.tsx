import { ComponentType } from "react";
import {
  SquaresFour,
  CreditCard,
  Users,
  Files,
  ChartBar,
  Key,
  Gear,
  Pulse,
  Warning,
  Icon,
  Tag,
} from "@phosphor-icons/react";

export type FeatureAccessLevel = "public" | "user" | "admin";

export interface FeatureConfig {
  id: string;
  label: string;
  icon?: Icon;
  load: () => Promise<{ default: ComponentType }>;
  access: FeatureAccessLevel;
  ssr?: boolean;
}

export const FEATURE_REGISTRY: Record<string, FeatureConfig> = {
  dashboard: {
    id: "dashboard",
    label: "My Orders",
    icon: SquaresFour,
    load: () =>
      import("@/features/control-center/components/DashboardContent").then(
        (m) => ({
          default: m.DashboardContent,
        }),
      ),
    access: "user",
    ssr: false,
  },
  marketplace: {
    id: "marketplace",
    label: "Marketplace",
    icon: Files,
    load: () =>
      import("@/features/marketplace/components/MarketplaceRouter").then(
        (m) => ({
          default: m.MarketplaceRouter,
        }),
      ),
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
    icon: ChartBar,
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
  coupons: {
    id: "coupons",
    label: "Coupons",
    icon: Tag,
    load: () =>
      import("@/features/coupons/components/CouponsDashboardView").then(
        (m) => ({
          default: m.CouponsDashboardView,
        }),
      ),
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
    icon: Pulse,
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
    icon: Pulse,
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
    icon: Warning,
    load: () => import("@/features/errors/components/ErrorMonitoring"),
    access: "user",
    ssr: false,
  },
  settings: {
    id: "settings",
    label: "Gear",
    icon: Gear,
    load: () =>
      import("@/features/settings").then((m) => ({ default: m.SettingsView })),
    access: "user",
    ssr: true,
  },
  ai: {
    id: "ai",
    label: "AI Console",
    icon: Pulse,
    load: () =>
      import("@/features/ai/components/AIConsole").then((m) => ({
        default: m.AIConsole,
      })),
    access: "user",
    ssr: false,
  },
  admin_portal: {
    id: "admin_portal",
    label: "Super Admin",
    icon: Pulse,
    load: () =>
      import("@/features/control-center/components/SuperAdminView").then(
        (m) => ({
          default: m.SuperAdminView,
        }),
      ),
    access: "admin",
    ssr: false,
  },
  operations: {
    id: "operations",
    label: "Operations & DevOps",
    icon: Pulse,
    load: () =>
      import("@/features/operations/components/OperationsDashboardView").then(
        (m) => ({
          default: m.OperationsDashboardView,
        }),
      ),
    access: "user",
    ssr: false,
  },
};

export type ValidTabId = keyof typeof FEATURE_REGISTRY;
