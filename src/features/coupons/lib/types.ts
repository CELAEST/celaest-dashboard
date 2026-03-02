export interface Coupon {
  id: string;
  code: string;
  organization_id: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  max_redemptions: { Int64: number; Valid: boolean } | number | null;
  current_redemptions: number;
  expires_at: { Time: string; Valid: boolean } | string | null;
  is_active: boolean;
  currency?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  reason?: string;
  coupon?: Coupon;
}
