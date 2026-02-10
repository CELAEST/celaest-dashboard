/**
 * Licensing Types - aligned with backend Go model
 * Source: celaest-back/internal/licenses/model.go
 */

// ===== Core Models =====

export interface License {
  id: string;
  organization_id: string;
  plan_id: string;
  license_key: string;
  license_key_hash?: string;
  status: LicenseStatus;
  starts_at: string;
  expires_at?: string;
  trial_ends_at?: string;
  billing_cycle: BillingCycle;
  next_billing_date?: string;
  custom_limits?: Record<string, unknown>;
  current_period_start?: string;
  current_period_end?: string;
  ai_requests_used: number;
  storage_used_bytes: number;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  suspended_at?: string;
  cancelled_at?: string;
  plan?: PlanInfo;
  ip_bindings?: IPBinding[];
}

export type LicenseStatus =
  | "active"
  | "suspended"
  | "expired"
  | "cancelled"
  | "trial"
  | "revoked";

export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "yearly"
  | "lifetime"
  | "usage_based";

export interface PlanInfo {
  id: string;
  code: string;
  name: string;
}

export interface IPBinding {
  id: string;
  license_id: string;
  ip_address: string;
  hostname?: string;
  user_agent?: string;
  is_trusted: boolean;
  first_seen_at: string;
  last_seen_at: string;
  request_count: number;
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  slug?: string;
  description?: string;
  price_monthly?: number;
  price_yearly?: number;
  currency: string;
  features?: string[];
  limits?: Record<string, unknown>;
  is_active: boolean;
  is_public: boolean;
  trial_days?: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  license_id: string;
  period_start: string;
  period_end: string;
  ai_requests_count: number;
  tokens_input: number;
  tokens_output: number;
  storage_peak_bytes: number;
  created_at: string;
}

// ===== Validation =====

export interface ValidationResult {
  valid: boolean;
  license_id?: string;
  status?: string;
  plan_code?: string;
  expires_at?: string;
  trial_ends_at?: string;
  limits?: Record<string, unknown>;
  message?: string;
}

// ===== DTOs =====

export interface CreateLicenseInput {
  organization_id?: string;
  plan_id: string;
  billing_cycle?: BillingCycle;
  starts_at?: string;
  expires_at?: string;
  trial_ends_at?: string;
  custom_limits?: Record<string, unknown>;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateLicenseInput {
  status?: LicenseStatus;
  expires_at?: string;
  custom_limits?: Record<string, unknown>;
  notes?: string;
  metadata?: Record<string, unknown>;
}

// ===== Response DTOs =====

export interface LicenseResponse extends License {
  is_valid: boolean;
  days_remaining?: number;
}

export interface LicenseListResponse {
  licenses: LicenseResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface LicenseStats {
  total: number;
  active: number;
  trial: number;
  expired: number;
  suspended: number;
  revoked: number;
  cancelled: number;
}

export interface LicenseFilter {
  status?: LicenseStatus;
  billing_cycle?: BillingCycle;
  plan_id?: string;
  page?: number;
  limit?: number;
}

export interface LimitsStatus {
  license_id: string;
  is_valid: boolean;
  ai_requests_used: number;
  ai_requests_limit: number;
  ai_requests_remaining: number;
  storage_used_bytes: number;
  storage_used_gb: number;
  storage_limit_gb: number;
}

// ===== Collision (derived from IPBinding for UI) =====

export interface CollisionData {
  collisions: IPBinding[];
  total: number;
  potential_sharing: boolean;
}
