import { api } from "@/lib/api-client";
import { Subscription, SubscriptionUsage, Invoice, Plan, PaymentMethod, TaxRate, GlobalFinancialStats, PaymentGateway, Payment } from "../types";

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
}

export interface PlanListResponse {
  plans: Plan[];
}

export interface PaymentListResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export const billingApi = {
  // Subscriptions
  getSubscriptions: (orgId: string, token: string) =>
    api.get<SubscriptionListResponse>(`/api/v1/org/subscriptions`, { orgId, token }),

  getSubscription: (orgId: string, token: string, id: string) =>
    api.get<Subscription>(`/api/v1/org/subscriptions/${id}`, { orgId, token }),

  createSubscription: (orgId: string, token: string, data: Partial<Subscription>) =>
    api.post("/api/v1/org/subscriptions", data, { orgId, token }),

  updateSubscription: (orgId: string, token: string, subId: string, data: { plan_id?: string; quantity?: number; metadata?: Record<string, unknown> }) =>
    api.put(`/api/v1/org/subscriptions/${subId}`, data, { orgId, token }),

  cancelSubscription: (orgId: string, token: string, subId: string, immediately: boolean = false) =>
    api.post(`/api/v1/org/subscriptions/${subId}/cancel`, { immediately }, { orgId, token }),

  reactivateSubscription: (orgId: string, token: string, subId: string) =>
    api.post(`/api/v1/org/subscriptions/${subId}/reactivate`, {}, { orgId, token }),

  getUsage: (orgId: string, token: string, subId: string, start?: string, end?: string) => {
    let url = `/api/v1/org/subscriptions/${subId}/usage`;
    const params = new URLSearchParams();
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    if (params.toString()) url += `?${params.toString()}`;
    
    return api.get<SubscriptionUsage[]>(url, { orgId, token });
  },

  // Plans
  getPlans: (orgId: string, token: string, activeOnly: boolean = true) =>
    api.get<PlanListResponse>(`/api/v1/org/plans?active_only=${activeOnly}`, { orgId, token }),

  // Invoices
  getInvoices: (orgId: string, token: string) =>
    api.get<InvoiceListResponse>(`/api/v1/org/invoices`, { orgId, token }),
    
  getInvoice: (orgId: string, token: string, id: string) =>
      api.get<Invoice>(`/api/v1/org/invoices/${id}`, { orgId, token }),

  // Payment Methods
  getPaymentMethods: (orgId: string, token: string) =>
    api.get<PaymentMethod[]>(`/api/v1/org/payments/methods`, { orgId, token }),

  createPaymentMethod: (orgId: string, token: string, method: Partial<PaymentMethod>) =>
    api.post<PaymentMethod>(`/api/v1/org/payments/methods`, method, { orgId, token }),

  deletePaymentMethod: (orgId: string, token: string, methodId: string) =>
    api.delete(`/api/v1/org/payments/methods/${methodId}`, { orgId, token }),

  setDefaultPaymentMethod: (orgId: string, token: string, methodId: string) =>
    api.post(`/api/v1/org/payments/methods/${methodId}/default`, {}, { orgId, token }),

  // Administrative
  getAdminStats: (token: string) =>
    api.get<GlobalFinancialStats>(`/api/v1/admin/billing/stats`, { token }),

  getAdminTaxRates: (token: string) =>
    api.get<TaxRate[]>(`/api/v1/admin/billing/tax-rates`, { token }),

  getAdminGateways: (token: string) =>
    api.get<PaymentGateway[]>(`/api/v1/admin/billing/gateways`, { token }),

  updateAdminGatewayStatus: (token: string, gateway: string, active: boolean) =>
    api.post(`/api/v1/admin/billing/gateway-control`, { gateway, active }, { token }),

  updateAdminGatewayConfig: (token: string, gateway: string, config: Partial<PaymentGateway>) =>
    api.post(`/api/v1/admin/billing/gateway-config`, { gateway, ...config }, { token }),

  createAdminTaxRate: (token: string, taxRate: TaxRate) =>
    api.post<TaxRate>(`/api/v1/admin/billing/tax-rates`, taxRate, { token }),

  updateAdminTaxRate: (token: string, id: string, data: Partial<TaxRate>) =>
    api.put(`/api/v1/admin/billing/tax-rates/${id}`, data, { token }),

  deleteAdminTaxRate: (token: string, id: string) =>
    api.delete(`/api/v1/admin/billing/tax-rates/${id}`, { token }),

  getAdminTransactions: (token: string, page: number = 1, limit: number = 50) =>
    api.get<PaymentListResponse>(`/api/v1/admin/billing/transactions`, { token, params: { page: String(page), limit: String(limit) } }),

  getAdminAlerts: (token: string, status: "failed" | "refund_requested") =>
    api.get<Payment[]>(`/api/v1/admin/billing/alerts`, { token, params: { status: String(status) } }),

  resolveAdminRefund: (token: string, id: string, approve: boolean) =>
    api.post(`/api/v1/admin/billing/refunds/${id}/resolve`, { approve }, { token }),
};
