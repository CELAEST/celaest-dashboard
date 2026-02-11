
export type CurrencyCode = "USD" | "EUR" | "GBP";

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
}


export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  region: string;
  type: string;
  status: string;
  lastUpdated?: string;

  // Frontend helper aliases for compatibility
  country?: string;
  code?: string;
  isActive?: boolean;
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
  limits?: Record<string, any>;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  
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
  status: string; // active, cancelled, expired, trial, pending
  current_period_start: string;
  current_period_end: string;
  cancelled_at?: string;
  trial_start?: string;
  trial_end?: string;
  quantity: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Expanded fields
  plan?: Plan;
  checkout_url?: string;
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
  status: "draft" | "sent" | "paid" | "overdue" | "void" | "uncollectible";
  currency: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  billing_name?: string;
  billing_email?: string;
  billing_address?: Record<string, any>;
  due_date?: string;
  pdf_url?: string;
  paid_at?: string;
  sent_at?: string;
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
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
