import { useState, useCallback, useEffect } from "react";
import { useShallow } from 'zustand/react/shallow';
import { Order } from "../types";
import { toast } from "sonner";
import { useApiAuth } from "@/lib/use-api-auth";
import { useOrdersStore } from "../stores/useOrdersStore";

export const useOrders = () => {
  const { token, orgId, isReady } = useApiAuth();
  
  const { 
    orders, 
    isLoading, 
    lastFetched,
    setOrders,
    setLoading,
    setError,
    updateOrder: updateOrderInStore,
    removeOrder: removeOrderFromStore 
  } = useOrdersStore(useShallow((state) => ({
    orders: state.orders,
    isLoading: state.isLoading,
    lastFetched: state.lastFetched,
    setOrders: state.setOrders,
    setLoading: state.setLoading,
    setError: state.setError,
    updateOrder: state.updateOrder,
    removeOrder: state.removeOrder,
  })));

  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    x: number;
    y: number;
    align: "top" | "bottom";
  } | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsMode, setDetailsMode] = useState<"view" | "edit">("view");

  const fetchOrders = useCallback(async (isRefresh = false) => {
    const CACHE_TTL = 60000; // 1 minuto
    if (!isReady || !token || !orgId) return;
    if (!isRefresh && lastFetched && (Date.now() - lastFetched < CACHE_TTL)) return;
    if (isLoading) return;
    
    setLoading(true);
    try {
      const { ordersService } = await import("../services/orders.service");
      const data = await ordersService.getOrders(orgId, token);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error al cargar órdenes");
      toast.error("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  }, [token, orgId, isReady, lastFetched, isLoading, setOrders, setLoading, setError]);

  useEffect(() => {
    fetchOrders();

    if (!token) return;

    // Connect socket for real-time updates
    import("@/lib/socket-client").then(({ socket }) => {
      socket.connect(token);

      const handleRefresh = () => {
        fetchOrders(true);
      };

      const offs = [
        socket.on("order.created", handleRefresh),
        socket.on("order.updated", handleRefresh),
        socket.on("order.deleted", handleRefresh),
      ];

      return () => {
        offs.forEach(off => off());
      };
    });
  }, [fetchOrders, token]);

  const handleOpenMenu = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const menuHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < menuHeight;

    setActiveMenu({
      id,
      x: rect.right - 12,
      y: showAbove ? window.innerHeight - rect.top + 8 : rect.bottom + 8,
      align: showAbove ? "bottom" : "top",
    });
  }, []);

  const handleCloseMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const handleMenuAction = useCallback(
    (action: string) => {
      if (!activeMenu) return;
      const order = orders.find((o) => o.id === activeMenu.id);
      if (!order) return;

      switch (action) {
        case "view":
          setSelectedOrder(order);
          setDetailsMode("view");
          setDetailsModalOpen(true);
          break;
        case "edit":
          setSelectedOrder(order);
          setDetailsMode("edit");
          setDetailsModalOpen(true);
          break;
        case "delete":
          setSelectedOrder(order);
          setDeleteModalOpen(true);
          break;
        case "download":
          toast.success(`Downloading invoice for ${activeMenu.id}`);
          break;
        case "archive":
          toast("Order archived", {
            description: `${activeMenu.id} has been moved to archive.`,
          });
          break;
      }
      handleCloseMenu();
    },
    [activeMenu, orders, handleCloseMenu]
  );

  const handleSaveOrder = useCallback(async (updatedOrder: Order) => {
    if (!token || !orgId) {
      toast.error("Sesión no válida o expirada");
      return;
    }
    
    try {
      const { ordersService } = await import("../services/orders.service");
      await ordersService.updateOrder(orgId, token, updatedOrder.id, updatedOrder);
      
      updateOrderInStore(updatedOrder);
      toast.success("Orden actualizada correctamente");
    } catch (error) {
      console.error("Error updating order:", error);
      const msg = error instanceof Error ? error.message : "Error al actualizar la orden";
      toast.error(msg);
    }
  }, [token, orgId, updateOrderInStore]);

  const handleDeleteOrder = useCallback(async () => {
    if (!selectedOrder) return;
    if (!token || !orgId) {
      toast.error("Sesión no válida o expirada");
      return;
    }
    
    try {
      const { ordersService } = await import("../services/orders.service");
      await ordersService.deleteOrder(orgId, token, selectedOrder.id);
      
      removeOrderFromStore(selectedOrder.id);
      setDeleteModalOpen(false);
      toast.success("Orden eliminada correctamente");
    } catch (error) {
      console.error("Error deleting order:", error);
      const msg = error instanceof Error ? error.message : "Error al eliminar la orden";
      toast.error(msg);
    }
  }, [selectedOrder, token, orgId, removeOrderFromStore]);



  return {
    orders,
    activeMenu,
    handleOpenMenu,
    handleCloseMenu,
    handleMenuAction,
    detailsModalOpen,
    setDetailsModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    selectedOrder,
    detailsMode,
    handleSaveOrder,
    handleDeleteOrder,
    loading: isLoading,
    refresh: () => fetchOrders(true)
  };
};

