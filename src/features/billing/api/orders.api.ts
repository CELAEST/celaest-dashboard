import { api } from "@/lib/api-client";

export interface BackendOrder {
  id: string;
  order_number: string;
  status: string;
  currency: string;
  total: number;
  billing_name: string;
  created_at: string;
  items?: { name: string }[];
}

export interface OrderListResponse {
  orders: BackendOrder[];
  total: number;
  page: number;
  limit: number;
}

export const ordersApi = {
  getOrders: (orgId: string, token: string, page: number = 1, limit: number = 10) =>
    api.get<OrderListResponse>(`/api/v1/org/orders?page=${page}&limit=${limit}`, { orgId, token }),

  getOrder: (orgId: string, token: string, id: string) =>
    api.get<BackendOrder>(`/api/v1/org/orders/${id}`, { orgId, token }),

  updateOrder: (orgId: string, token: string, id: string, data: Partial<BackendOrder>) =>
    api.put<BackendOrder>(`/api/v1/org/orders/${id}`, data, { orgId, token }),

  deleteOrder: (orgId: string, token: string, id: string) =>
    api.delete<void>(`/api/v1/org/orders/${id}`, { orgId, token }),
};

