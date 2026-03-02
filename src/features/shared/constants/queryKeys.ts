/**
 * Feature: Shared - Constants
 * Master Query Key factory for the entire application.
 * Ensures consistent cache invalidation in TanStack Query.
 */

export const QUERY_KEYS = {
  analytics: {
    all: ["analytics"] as const,
    dashboard: (orgId: string, period: string) => ["analytics", "dashboard", orgId, period] as const,
    sales: (orgId: string, period: string) => ["analytics", "sales", orgId, period] as const,
    roi: (orgId: string, period: string) => ["analytics", "roi", orgId, period] as const,
    usage: (orgId: string, period: string) => ["analytics", "usage", orgId, period] as const,
    distribution: (orgId: string) => ["analytics", "distribution", orgId] as const,
    liveFeed: (orgId: string) => ["analytics", "live-feed", orgId] as const,
    roiByProduct: (orgId: string) => ["analytics", "roi-by-product", orgId] as const,
    salesByPeriod: (orgId: string, period: string) => ["analytics", "sales-by-period", orgId, period] as const,
    tasks: (orgId: string, period: string) => ["analytics", "tasks", orgId, period] as const,
    activeUsers: (orgId: string) => ["analytics", "active-users", orgId] as const,
    usersActivity: (orgId: string, period: string) => ["analytics", "users-activity", orgId, period] as const,
  },
  billing: {
    all: ["billing"] as const,
    adminStats: ["billing", "admin-stats"] as const,
    taxRates: ["billing", "tax-rates"] as const,
    gateways: ["billing", "gateways"] as const,
    paymentMethods: (orgId: string) => ["billing", "payment-methods", orgId] as const,
    profile: (orgId: string) => ["billing", "profile", orgId] as const,
    transactions: (page: number, limit: number) => ["billing", "transactions", { page, limit }] as const,
    alerts: (status: string) => ["billing", "alerts", status] as const,
  },
  marketplace: {
    all: ["marketplace"] as const,
    products: (filters: Record<string, unknown>) => ["marketplace", "products", filters] as const,
    detail: (slug: string) => ["marketplace", "detail", slug] as const,
    seller: (id: string) => ["marketplace", "seller", id] as const,
  },
  assets: {
    all: ["assets"] as const,
    myAssets: (token: string) => ["assets", "my", token] as const,
    inventory: (orgId: string) => ["assets", "inventory", orgId] as const,
    categories: (orgId?: string) => ["assets", "categories", orgId || "public"] as const,
  },
  organizations: {
    all: ["organizations"] as const,
    list: ["organizations", "list"] as const,
    detail: (id: string) => ["organizations", "detail", id] as const,
    members: (orgId: string) => ["organizations", "members", orgId] as const,
    subscription: (orgId: string) => ["organizations", "subscription", orgId] as const,
    settings: (orgId: string) => ["organizations", "settings", orgId] as const,
  },
  licensing: {
    all: ["licensing"] as const,
    list: (filters: Record<string, unknown>, orgId?: string) => ["licensing", "list", filters, orgId] as const,
    stats: (orgId?: string) => ["licensing", "stats", orgId] as const,
    detail: (id: string) => ["licensing", "detail", id] as const,
    plans: (orgId?: string) => ["licensing", "plans", orgId] as const,
    usage: (licenseId: string) => ["licensing", "usage", licenseId] as const,
  },
  system: {
    all: ["system"] as const,
    health: ["system", "health"] as const,
    metrics: ["system", "metrics"] as const,
    settings: ["system", "settings"] as const,
  },
  releases: {
    all: ["releases"] as const,
    pipeline: (orgId: string) => ["releases", "pipeline", orgId] as const,
    overview: (orgId: string) => ["releases", "overview", orgId] as const,
    versions: (orgId: string) => ["releases", "versions", orgId] as const,
    assets: (orgId: string) => ["releases", "available-assets", orgId] as const,
    updateCenter: ["releases", "update-center"] as const,
  },
  users: {
    all: ["users"] as const,
    me: ["users", "me"] as const,
    profile: (userId: string) => ["users", "profile", userId] as const,
    team: (orgId: string) => ["users", "team", orgId] as const,
    auditLogs: (orgId: string) => ["users", "audit-logs", orgId] as const,
    security: {
      sessions: ["users", "security", "sessions"] as const,
      logs: ["users", "security", "logs"] as const,
      mfa: ["users", "security", "mfa"] as const,
    },
  },
  errors: {
    all: ["errors"] as const,
    analytics: (orgId: string) => ["errors", "analytics", orgId] as const,
    tasks: (orgId: string) => ["errors", "tasks", orgId] as const,
    events: (orgId: string) => ["errors", "events", orgId] as const,
  },
};
