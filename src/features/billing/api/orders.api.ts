import { api } from "@/lib/api-client";

export interface BackendOrder {
  id: string;
  order_number: string;
  status: string;
  currency: string;
  total: number;
  billing_name: string;
  created_at: string;
  items?: { name: string; item_type?: string }[];
  user_name?: string;
  user_email?: string;
  payment_method_type?: string;
  payment_provider?: string;
  license_key?: string;
}

export interface OrderListResponse {
  orders: BackendOrder[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderSummary {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
}

export interface CreateOrderInput {
  items: { product_id: string; quantity: number }[];
  currency?: string;
  billing_name?: string;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  type: string;
  description: string;
  created_at: string;
}

export const ordersApi = {
  getOrders: (orgId: string, token: string, page: number = 1, limit: number = 10) =>
    api.get<OrderListResponse>(`/api/v1/org/orders?page=${page}&limit=${limit}`, { orgId, token }),

  getOrder: (orgId: string, token: string, id: string) =>
    api.get<BackendOrder>(`/api/v1/org/orders/${id}`, { orgId, token }),

  getOrderByNumber: (orgId: string, token: string, orderNumber: string) =>
    api.get<BackendOrder>(`/api/v1/org/orders/number/${orderNumber}`, { orgId, token }),

  getOrderSummary: (orgId: string, token: string) =>
    api.get<OrderSummary>("/api/v1/org/orders/summary", { orgId, token }),

  createOrder: (orgId: string, token: string, data: CreateOrderInput) =>
    api.post<BackendOrder>("/api/v1/org/orders", data, { orgId, token }),

  updateOrder: (orgId: string, token: string, id: string, data: Partial<BackendOrder>) =>
    api.put<BackendOrder>(`/api/v1/org/orders/${id}`, data, { orgId, token }),

  deleteOrder: (orgId: string, token: string, id: string) =>
    api.delete<void>(`/api/v1/org/orders/${id}`, { orgId, token }),

  payOrder: (orgId: string, token: string, id: string, data?: { payment_method?: string }) =>
    api.post<BackendOrder>(`/api/v1/org/orders/${id}/pay`, data ?? {}, { orgId, token }),

  cancelOrder: (orgId: string, token: string, id: string, data?: { reason?: string }) =>
    api.post<BackendOrder>(`/api/v1/org/orders/${id}/cancel`, data ?? {}, { orgId, token }),

  refundOrder: (orgId: string, token: string, id: string, data: { reason: string; amount?: number }) =>
    api.post<{ message: string }>(`/api/v1/org/orders/${id}/refund`, data, { orgId, token }),

  getOrderEvents: (orgId: string, token: string, id: string) =>
    api.get<OrderEvent[]>(`/api/v1/org/orders/${id}/events`, { orgId, token }),
};

