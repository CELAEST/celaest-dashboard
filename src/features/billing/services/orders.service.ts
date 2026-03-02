import { logger } from "@/lib/logger";
import { ordersApi } from "../api/orders.api";
import { Order } from "../types";
import { formatCurrency, formatDate } from "@/features/shared/utils/formatters";

export const ordersService = {
  /**
   * Obtiene la lista de órdenes para una organización
   */
  async getOrders(orgId: string, token: string, page: number = 1, limit: number = 10): Promise<Order[]> {
    try {
      const response = await ordersApi.getOrders(orgId, token, page, limit);
      
      // Adaptador: Mapear del backend Order a frontend Order
      return response.orders.map(o => ({
        id: o.id,
        displayId: `#${o.order_number || o.id.substring(0, 8).toUpperCase()}`,
        product: o.items?.[0]?.name || "Product",
        customer: o.billing_name || o.user_name || "Guest",
        date: formatDate(o.created_at),
        status: this.mapStatus(o.status),
        amount: formatCurrency(o.total || 0, o.currency || 'USD'),
        userName: o.user_name,
        userEmail: o.user_email,
        paymentMethod: o.payment_method_type,
        paymentProvider: o.payment_provider,
        rawDate: o.created_at
      }));

    } catch (error: unknown) {
      logger.error("Error fetching orders:", error);
      return [];
    }
  },

  async updateOrder(orgId: string, token: string, id: string, data: Partial<Order>): Promise<boolean> {
    try {
      await ordersApi.updateOrder(orgId, token, id, data);
      return true;
    } catch (error: unknown) {
      logger.error("Error updating order:", error);
      throw error;
    }
  },

  async deleteOrder(orgId: string, token: string, id: string): Promise<boolean> {
    try {
      await ordersApi.deleteOrder(orgId, token, id);
      return true;
    } catch (error: unknown) {
      logger.error("Error deleting order:", error);
      throw error;
    }
  },

  mapStatus(status: string): "Processing" | "Active" | "Completed" | "Pending" | "Cancelled" | "Failed" {

    const s = status.toLowerCase();
    switch (s) {
      case "active": return "Active";
      case "processing": return "Processing";
      case "completed":
      case "delivered":
      case "shipped": return "Completed";
      case "cancelled": return "Cancelled";
      case "failed": return "Failed";
      default: return "Pending";
    }
  }
};
