import { ordersApi } from "../api/orders.api";
import { Order } from "../types";

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
        customer: o.billing_name || "Guest",
        date: new Date(o.created_at).toLocaleDateString(),
        status: this.mapStatus(o.status),
        amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: o.currency || 'USD' }).format(o.total || 0)
      }));

    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async updateOrder(orgId: string, token: string, id: string, data: Partial<Order>): Promise<boolean> {
    try {
      await ordersApi.updateOrder(orgId, token, id, data);
      return true;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  async deleteOrder(orgId: string, token: string, id: string): Promise<boolean> {
    try {
      await ordersApi.deleteOrder(orgId, token, id);
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
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
