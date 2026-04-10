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

export interface ComponentIconProps {
  size?: number | string;
  weight?: string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export interface MenuItem {
  id: string;
  icon: React.ElementType<ComponentIconProps>;
  label: string;
  scope: string | null;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    title: "Platform",
    items: [
      { id: "dashboard", icon: OrdersIcon, label: "Orders", scope: null },
      { id: "licensing", icon: LicensingIcon, label: "Licensing", scope: null },
      { id: "billing", icon: BillingIcon, label: "Billing", scope: "billing:read" },
      { id: "ai", icon: AIConsoleIcon, label: "AI Console", scope: null },
      { id: "marketplace", icon: MarketplaceIcon, label: "Marketplace", scope: "marketplace:purchase" },
      { id: "catalog", icon: AssetManagerIcon, label: "Asset Manager", scope: null },
      { id: "releases", icon: ReleasesIcon, label: "Releases", scope: "releases:read" },
    ],
  },
  {
    title: "Insights & Ops",
    items: [
      { id: "analytics", icon: AnalyticsIcon, label: "Analytics", scope: "analytics:read" },
      { id: "roi", icon: ROIIcon, label: "ROI Dashboard", scope: "analytics:read" },
      { id: "errors", icon: ErrorMonitorIcon, label: "Error Monitor", scope: "analytics:read" },
      { id: "operations", icon: DevOpsIcon, label: "DevOps", scope: null },
    ],
  },
  {
    title: "Settings & Admin",
    items: [
      { id: "users", icon: UsersIcon, label: "Users & Roles", scope: null },
      { id: "coupons", icon: CouponsIcon, label: "Coupons", scope: "billing:write" },
      { id: "admin_portal", icon: SuperAdminIcon, label: "Super Admin", scope: "users:manage" },
      { id: "settings", icon: SettingsIcon, label: "Workspace Settings", scope: null },
    ],
  },
];

export const menuItems: MenuItem[] = menuSections.flatMap(
  (section) => section.items,
);
