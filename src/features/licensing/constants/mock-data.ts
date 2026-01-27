export interface License {
  id: string;
  key?: string; // Hashed in DB, only shown on creation
  userId: string;
  productId: string;
  productType: string;
  status: "active" | "expired" | "revoked" | "pending";
  maxIpSlots: number;
  ipBindings?: IpBinding[];
  ipSlotsUsed?: number;
  metadata: {
    expiresAt?: string;
    maxUsageCount?: number;
    currentUsageCount?: number;
    tier?: string;
    notes?: string;
  };
  createdAt: string;
  lastValidatedAt?: string;
}

export interface IpBinding {
  licenseId: string;
  ip: string;
  firstSeenAt: string;
  lastSeenAt: string;
  requestCount: number;
  userAgent?: string;
}

export interface ValidationLog {
  licenseId: string;
  ip: string;
  timestamp: string;
  success: boolean;
  reason?: string;
}

export interface Collision {
  licenseId: string;
  ipCount: number;
  license: { productId: string; maxIpSlots: number };
  ips: string[];
}

export interface Analytics {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  validationSuccessRate: number;
  byProduct: Record<string, number>;
}

export const MOCK_LICENSES: License[] = [
  {
    id: "lic_1",
    userId: "user_demo_001",
    productId: "excel-automation-pro",
    productType: "excel-automation",
    status: "active",
    maxIpSlots: 3,
    ipSlotsUsed: 1,
    ipBindings: [
      {
        licenseId: "lic_1",
        ip: "192.168.1.10",
        firstSeenAt: "2025-01-01",
        lastSeenAt: "2026-01-26",
        requestCount: 150,
      },
    ],
    metadata: { tier: "pro" },
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "lic_2",
    userId: "user_sales_05",
    productId: "data-connector-ent",
    productType: "data-connector",
    status: "active",
    maxIpSlots: 10,
    ipSlotsUsed: 2,
    metadata: { tier: "enterprise" },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "lic_3",
    userId: "dev_team_alpha",
    productId: "nodejs-api-dev",
    productType: "nodejs-api",
    status: "expired",
    maxIpSlots: 5,
    ipSlotsUsed: 5,
    metadata: { tier: "basic", expiresAt: "2025-12-31" },
    createdAt: "2024-06-01T10:00:00Z",
  },
];

export const MOCK_ANALYTICS: Analytics = {
  total: 150,
  active: 120,
  expired: 20,
  revoked: 10,
  validationSuccessRate: 98.5,
  byProduct: {
    "excel-automation": 50,
    "python-script": 30,
    "nodejs-api": 40,
    "data-connector": 30,
  },
};

export const MOCK_COLLISIONS: Collision[] = [
  {
    licenseId: "lic_55",
    ipCount: 4,
    license: { productId: "macro-suite-basic", maxIpSlots: 1 },
    ips: ["10.0.0.1", "10.0.0.2", "192.168.1.5", "172.16.0.1"],
  },
];
