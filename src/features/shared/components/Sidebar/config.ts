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
  Tag,
  Bot,
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
    label: "Orders",
    scope: null,
  },
  {
    id: "ai",
    icon: Bot,
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
  { id: "coupons", icon: Tag, label: "Coupons", scope: "billing:write" },
  {
    id: "analytics",
    icon: Activity,
    label: "Analytics",
    scope: "analytics:read",
  },
  {
    id: "operations",
    icon: Activity,
    label: "Operations & DevOps",
    scope: null, // Depending on permissions, "operations:read" could be added later
  },
  {
    id: "users",
    icon: UserCog,
    label: "User Management",
    scope: null,
  },
  {
    id: "admin_portal",
    icon: Shield,
    label: "Super Admin",
    scope: "users:manage",
  },
  { id: "settings", icon: Settings, label: "Settings", scope: null },
];
