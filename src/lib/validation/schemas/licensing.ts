/**
 * Licensing Validation Schemas
 */

import { z } from "zod";

// =============================================================================
// Create License
// =============================================================================

export const createLicenseSchema = z.object({
  productType: z.enum(["software", "api", "plugin"]),

  tier: z.enum(["basic", "pro", "enterprise"]),

  userId: z
    .string()
    .min(1, "User ID is required")
    .max(100, "User ID too long"),

  maxIpSlots: z
    .number()
    .int("Must be a whole number")
    .min(1, "At least 1 IP slot required")
    .max(100, "Maximum 100 IP slots"),
});

export type CreateLicenseFormData = z.infer<typeof createLicenseSchema>;

// =============================================================================
// IP Binding
// =============================================================================

export const ipBindingSchema = z.object({
  ipAddress: z
    .string()
    .regex(
      /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      "Invalid IP address format"
    ),

  label: z.string().max(50, "Label too long").optional(),
});

export type IpBindingFormData = z.infer<typeof ipBindingSchema>;
