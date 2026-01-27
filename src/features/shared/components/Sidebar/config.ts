import {
  LayoutDashboard,
  ShoppingCart,
  FolderOpen,
  GitBranch,
  Shield,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Activity,
  UserCog,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  scope: string | null;
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Control Center",
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
    icon: TrendingUp,
    label: "ROI Dashboard",
    scope: "analytics:read",
  },
  {
    id: "errors",
    icon: AlertTriangle,
    label: "Error Monitor",
    scope: "analytics:read",
  },
  { id: "billing", icon: CreditCard, label: "Billing", scope: "billing:read" },
  {
    id: "analytics",
    icon: Activity,
    label: "Analytics",
    scope: "analytics:read",
  },
  {
    id: "users",
    icon: UserCog,
    label: "User Management",
    scope: "users:manage",
  },
  { id: "settings", icon: Settings, label: "Settings", scope: null },
];
