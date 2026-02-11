/**
 * DEPRECATED: This file now provides backward-compatible type aliases.
 * New code should import from @/features/licensing/types directly.
 */

// Re-export core types with backward-compatible aliases
export type { LicenseResponse as License } from "@/features/licensing/types";
export type { IPBinding as IpBinding } from "@/features/licensing/types";
export type { LicenseStats as Analytics } from "@/features/licensing/types";

// ValidationLog - UI-specific type for the activity log component
export interface ValidationLog {
  licenseId: string;
  ip: string;
  timestamp: string;
  success: boolean;
  reason?: string;
}

// Collision - UI-specific type for the collision detection components
// This wraps the backend data into a UI-friendly shape
export interface Collision {
  licenseId: string;
  ipCount: number;
  ips: string[];
  license: {
    productId: string;
    productType: string;
    maxIpSlots: number;
    status: string;
  };
}
