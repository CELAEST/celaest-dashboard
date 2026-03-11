
export type CurrencyCode = "USD" | "EUR" | "GBP";

// --- Tipos para JSONB Estrictos ---

export interface PlanLimits {
  users?: number;
  storage_gb?: number;
  api_requests_per_month?: number;
  api_calls_monthly?: number;
  custom_domains?: number;
  support_level?: "standard" | "priority" | "dedicated";
  [key: string]: number | string | boolean | undefined; // Fallback for dynamic limits
}

export interface SubscriptionMetadata {
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  source_campaign?: string;
  auto_renew?: boolean;
  active_users?: number;
  [key: string]: number | string | boolean | undefined;
}

export interface BillingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface PaymentMetadata {
  stripe_charge_id?: string;
  payment_intent_id?: string;
  receipt_url?: string;
  failure_code?: string;
  failure_message?: string;
}

// ------------------------------------

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface FinancialMetric {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  color: "blue" | "yellow" | "purple";
  icon?: React.ElementType; // Better type for Lucide icons
}

export interface PaymentMethod {
  id: string;
  type: string;
  brand?: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;

  // Backend compatibility
  provider?: string;
  provider_id?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default?: boolean;
}

export interface Order {
  id: string; // The UUID
  displayId: string; // The #XXXXX ID
  product: string;
  customer: string;
  date: string;
  status: "Processing" | "Active" | "Completed" | "Pending" | "Cancelled" | "Failed";
  amount: string;
  
  // New fields for enhanced views
  userName?: string;
  userEmail?: string;
  paymentMethod?: string;
  paymentProvider?: string;
  rawDate: string; // ISO date for precise formatting
  licenseKey?: string;
  events?: OrderActivityEvent[];
  itemType?: string;
}

export interface OrderActivityEvent {
  id: string;
  type: string;
  data?: Record<string, unknown>;
  createdAt: string;
}


export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  region: string;
  type: string;
  status: string;
  lastUpdated?: string;

  country?: string;
  code?: string;
  isActive?: boolean;
  vatType?: string;
}

export interface GatewayStatus {
  name: string;
  status: "ACTIVE" | "STANDBY" | "INACTIVE";
  details: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  status: "active" | "standby" | "disabled";
  apiKey: string;
  webhookUrl: string;
  testMode: boolean;
}

// Backend-aligned Plan
export interface Plan {
  id: string;
  code: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly?: number;
  price_yearly?: number;
  currency: string;
  features: string[];
  limits?: PlanLimits;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
  tier: number; // 1=starter, 2=pro, 3=enterprise
  created_at: string;
  updated_at: string;
  product_id?: string;
  productId?: string; // Add both for compatibility
  
  // Frontend helpers
  popular?: boolean;
  color?: "blue" | "purple" | "emerald";
}

// Backend-aligned Subscription
export interface Subscription {
  id: string;
  organization_id: string;
  product_id: string;
  plan_id: string;
  status: string; // active, cancelled, expired, trial, pending, superseded
  current_period_start: string;
  current_period_end: string;
  cancelled_at?: string;
  trial_start?: string;
  trial_end?: string;
  quantity: number;
  metadata?: SubscriptionMetadata;
  created_at: string;
  updated_at: string;
  user_id?: string;
  userId?: string;
  
  // Expanded fields
  plan?: Plan;
  checkout_url?: string;

  // Supersede hierarchy
  superseded_by?: string;
  superseded_at?: string;
}

// Backend-aligned Usage
export interface SubscriptionUsage {
  id: string;
  subscription_id: string;
  metric_name: string;
  quantity: number;
  period_start: string;
  period_end: string;
  recorded_at: string;
}

// Backend-aligned Invoice
export interface Invoice {
  id: string;
  organization_id: string;
  order_id?: string;
  license_id?: string;
  invoice_number: string;
  /** All statuses emitted by the backend (invoice_status DB enum) */
  status: "draft" | "issued" | "sent" | "paid" | "overdue" | "void" | "cancelled" | "uncollectible";
  currency: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  amount_paid?: number;
  amount_due?: number;
  /** Go backend returns customer_name (model field) */
  customer_name?: string;
  /** Go backend returns customer_email (model field) */
  customer_email?: string;
  /** Legacy DB columns — kept for compatibility with older records */
  billing_name?: string;
  billing_email?: string;
  billing_address?: BillingAddress;
  due_date?: string;
  issued_at?: string;
  pdf_url?: string;
  paid_at?: string;
  sent_at?: string;
  notes?: string;
  item_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentFormState {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingEmail: string;
  billingAddress: string;
  billingCity: string;
  billingZip: string;
  setAsDefault: boolean;
}

export interface PaymentFormSetters {
  setCardNumber: (value: string) => void;
  setCardName: (value: string) => void;
  setExpiryMonth: (value: string) => void;
  setExpiryYear: (value: string) => void;
  setCvv: (value: string) => void;
  setBillingEmail: (value: string) => void;
  setBillingAddress: (value: string) => void;
  setBillingCity: (value: string) => void;
  setBillingZip: (value: string) => void;
  setSetAsDefault: (value: boolean) => void;
}

export interface GlobalFinancialStats {
  totalRevenue: number;
  paidInvoices: number;
  refundedFunds: number;
  mrr: number;
  mrrGrowth: number;
  pendingRefunds: number;
  failedPayments: number;
  stripeGatewayActive: boolean;
}

export interface Payment {
  id: string;
  organization_id: string;
  order_id?: string;
  amount: number;
  currency: string;
  status: string; // pending, completed, failed, refunded, refund_requested
  payment_method_id?: string;
  provider_id?: string;
  external_payment_id?: string;
  provider?: string;
  description?: string;
  metadata?: PaymentMetadata;
  created_at: string;
  updated_at: string;
}
