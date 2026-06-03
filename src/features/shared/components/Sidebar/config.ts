import React from "react";

// Platform Icons
import { OrdersIcon } from "../../../../components/icons/custom/OrdersIcon";
import { AIConsoleIcon } from "../../../../components/icons/custom/AIConsoleIcon";
import { MarketplaceIcon } from "../../../../components/icons/custom/MarketplaceIcon";
import { AssetManagerIcon } from "../../../../components/icons/custom/AssetManagerIcon";
import { ReleasesIcon } from "../../../../components/icons/custom/ReleasesIcon";

// Insights & Ops Icons
import { AnalyticsIcon } from "../../../../components/icons/custom/AnalyticsIcon";
import { ROIIcon } from "../../../../components/icons/custom/ROIIcon";
import { ErrorMonitorIcon } from "../../../../components/icons/custom/ErrorMonitorIcon";
import { DevOpsIcon } from "../../../../components/icons/custom/DevOpsIcon";

// Settings & Admin Icons
import { UsersIcon } from "../../../../components/icons/custom/UsersIcon";
import { BillingIcon } from "../../../../components/icons/custom/BillingIcon";
import { CouponsIcon } from "../../../../components/icons/custom/CouponsIcon";
import { LicensingIcon } from "../../../../components/icons/custom/LicensingIcon";
import { SuperAdminIcon } from "../../../../components/icons/custom/SuperAdminIcon";
import { SettingsIcon } from "../../../../components/icons/custom/SettingsIcon";

export interface MenuItem {
  id: string;
  icon: React.ElementType;
  labelKey: string;
  scope: string | null;
  superAdminOnly?: boolean;
}

export interface MenuSection {
  titleKey: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    titleKey: "platform",
    items: [
      { id: "dashboard", icon: OrdersIcon, labelKey: "orders", scope: null },
      { id: "marketplace", icon: MarketplaceIcon, labelKey: "marketplace", scope: "marketplace:purchase" },
      { id: "licensing", icon: LicensingIcon, labelKey: "licensing", scope: null },
      { id: "billing", icon: BillingIcon, labelKey: "billing", scope: "billing:read" },
      { id: "ai", icon: AIConsoleIcon, labelKey: "ai_console", scope: null, superAdminOnly: true },
      { id: "catalog", icon: AssetManagerIcon, labelKey: "asset_manager", scope: null },
      { id: "releases", icon: ReleasesIcon, labelKey: "releases", scope: "releases:read" },
    ],
  },
  {
    titleKey: "insights_ops",
    items: [
      { id: "analytics", icon: AnalyticsIcon, labelKey: "analytics", scope: "analytics:read", superAdminOnly: true },
      { id: "roi", icon: ROIIcon, labelKey: "roi_dashboard", scope: "analytics:read", superAdminOnly: true },
      { id: "errors", icon: ErrorMonitorIcon, labelKey: "error_monitor", scope: "analytics:read" },
      { id: "operations", icon: DevOpsIcon, labelKey: "devops", scope: null, superAdminOnly: true },
    ],
  },
  {
    titleKey: "settings_admin",
    items: [
      { id: "users", icon: UsersIcon, labelKey: "users_roles", scope: null, superAdminOnly: true },
      { id: "coupons", icon: CouponsIcon, labelKey: "coupons", scope: "billing:write" },
      { id: "admin_portal", icon: SuperAdminIcon, labelKey: "super_admin", scope: "users:manage" },
      { id: "settings", icon: SettingsIcon, labelKey: "workspace_settings", scope: null },
    ],
  },
];

export const menuItems: MenuItem[] = menuSections.flatMap(
  (section) => section.items,
);
