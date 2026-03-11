import {
  SquaresFour,
  ShoppingCart,
  FolderOpen,
  GitBranch,
  Shield,
  TrendUp,
  Warning,
  CreditCard,
  Pulse,
  UserGear,
  Gear,
  Icon,
  Tag,
  Robot,
} from "@phosphor-icons/react";

export interface MenuItem {
  id: string;
  icon: Icon;
  label: string;
  scope: string | null;
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    icon: SquaresFour,
    label: "Orders",
    scope: null,
  },
  {
    id: "ai",
    icon: Robot,
    label: "AI Console",
    scope: null,
  },
  {
    id: "marketplace",
    icon: ShoppingCart,
    label: "Marketplace",
    scope: "marketplace:purchase",
  },
  {
    id: "catalog",
    icon: FolderOpen,
    label: "Asset Manager",
    scope: "templates:write",
  },
  {
    id: "releases",
    icon: GitBranch,
    label: "Releases",
    scope: "releases:read",
  },
  { id: "licensing", icon: Shield, label: "Licensing", scope: null },
  {
    id: "roi",
    icon: TrendUp,
    label: "ROI Dashboard",
    scope: "analytics:read",
  },
  {
    id: "errors",
    icon: Warning,
    label: "Error Monitor",
    scope: "analytics:read",
  },
  { id: "billing", icon: CreditCard, label: "Billing", scope: "billing:read" },
  { id: "coupons", icon: Tag, label: "Coupons", scope: "billing:write" },
  {
    id: "analytics",
    icon: Pulse,
    label: "Analytics",
    scope: "analytics:read",
  },
  {
    id: "operations",
    icon: Pulse,
    label: "Operations & DevOps",
    scope: null, // Depending on permissions, "operations:read" could be added later
  },
  {
    id: "users",
    icon: UserGear,
    label: "User Management",
    scope: null,
  },
  {
    id: "admin_portal",
    icon: Shield,
    label: "Super Admin",
    scope: "users:manage",
  },
  { id: "settings", icon: Gear, label: "Gear", scope: null },
];
