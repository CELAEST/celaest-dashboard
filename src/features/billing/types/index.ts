
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
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;
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
  country: string;
  rate: string;
  code: string;
  vatType: string;
  isActive: boolean;
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

export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  color: "blue" | "purple" | "emerald";
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
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
