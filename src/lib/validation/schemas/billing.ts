/**
 * Billing Validation Schemas
 *
 * Zod schemas for payment methods, tax rates, and billing forms.
 * Types are inferred from schemas for type-safety.
 */

import { z } from "zod";

// =============================================================================
// Payment Method
// =============================================================================

export const paymentMethodSchema = z.object({
  cardNumber: z
    .string()
    .min(13, "Card number too short")
    .max(19, "Card number too long")
    .regex(/^[\d\s]+$/, "Only numbers allowed"),

  cardName: z
    .string()
    .min(1, "Cardholder name is required")
    .max(100, "Name too long"),

  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Invalid month (01-12)"),

  expiryYear: z
    .string()
    .length(2, "Use 2-digit year (e.g., 26)")
    .regex(/^\d{2}$/, "Invalid year"),

  cvv: z
    .string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^\d+$/, "Only numbers allowed"),

  // Optional billing address
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),

  // Default payment toggle
  isDefault: z.boolean().default(false),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

// =============================================================================
// Edit Payment Method (partial - some fields readonly)
// =============================================================================

export const editPaymentMethodSchema = z.object({
  cardName: z
    .string()
    .min(1, "Cardholder name is required")
    .max(100, "Name too long"),

  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),

  expiryYear: z
    .string()
    .length(2, "Use 2-digit year")
    .regex(/^\d{2}$/, "Invalid year"),

  isDefault: z.boolean().default(false),
});

export type EditPaymentMethodFormData = z.infer<typeof editPaymentMethodSchema>;

// =============================================================================
// Tax Rate
// =============================================================================

export const taxRateSchema = z.object({
  name: z
    .string()
    .min(1, "Tax name is required")
    .max(50, "Name too long"),

  rate: z
    .number()
    .min(0, "Rate cannot be negative")
    .max(100, "Rate cannot exceed 100%"),

  region: z
    .string()
    .min(1, "Region is required"),
});

export type TaxRateFormData = z.infer<typeof taxRateSchema>;

// =============================================================================
// Order Details (editable fields)
// =============================================================================

export const orderDetailsSchema = z.object({
  customerEmail: z
    .string()
    .email("Invalid email address"),

  status: z.enum(["pending", "processing", "completed", "cancelled"]),

  notes: z.string().max(500, "Notes too long").optional(),
});

export type OrderDetailsFormData = z.infer<typeof orderDetailsSchema>;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Format card number with spaces (1234 5678 9012 3456)
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/**
 * Get card type from number prefix
 */
export function getCardType(
  cardNumber: string
): "visa" | "mastercard" | "amex" | "unknown" {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "unknown";
}
