import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "../types";
import { toast } from "sonner";
import { useApiAuth } from "@/lib/use-api-auth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { socket } from "@/lib/socket-client";
import { useEffect } from "react";

export const useOrders = () => {
  const { token, orgId, isReady } = useApiAuth();
  const queryClient = useQueryClient();

  // Real-time synchronization for Orders Hub
  useEffect(() => {
    if (!token) return;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
    };

    const unsubscribers = [
      socket.on("order.created", handler),
      socket.on("order.updated", handler),
      socket.on("order.paid", handler),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [token, queryClient]);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.billing.all,
    queryFn: async () => {
      if (!orgId || !token) return [];
      const { ordersService } = await import("../services/orders.service");
      return await ordersService.getOrders(orgId, token);
    },
    enabled: isReady && !!token && !!orgId,
  });

  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    x: number;
    y: number;
    align: "top" | "bottom";
  } | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsMode, setDetailsMode] = useState<"view" | "edit">("view");

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

  const saveMutation = useMutation({
    mutationFn: async (updatedOrder: Order) => {
      if (!token || !orgId) throw new Error("Missing auth");
      const { ordersService } = await import("../services/orders.service");
      await ordersService.updateOrder(orgId, token, updatedOrder.id, updatedOrder);
      return updatedOrder;
    },
    onMutate: async (updatedOrder: Order) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.billing.all });
      const previous = queryClient.getQueryData<Order[]>(QUERY_KEYS.billing.all);
      queryClient.setQueryData<Order[]>(QUERY_KEYS.billing.all, old =>
        (old || []).map(o => o.id === updatedOrder.id ? updatedOrder : o)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.billing.all, context.previous);
      const msg = _err instanceof Error ? _err.message : "Error al actualizar la orden";
      toast.error(msg);
    },
    onSuccess: () => toast.success("Orden actualizada correctamente"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (orderId: string) => {
      if (!token || !orgId) throw new Error("Missing auth");
      const { ordersService } = await import("../services/orders.service");
      await ordersService.deleteOrder(orgId, token, orderId);
      return orderId;
    },
    onMutate: async (orderId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.billing.all });
      const previous = queryClient.getQueryData<Order[]>(QUERY_KEYS.billing.all);
      queryClient.setQueryData<Order[]>(QUERY_KEYS.billing.all, old =>
        (old || []).filter(o => o.id !== orderId)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.billing.all, context.previous);
      const msg = _err instanceof Error ? _err.message : "Error al eliminar la orden";
      toast.error(msg);
    },
    onSuccess: () => {
      setDeleteModalOpen(false);
      toast.success("Orden eliminada correctamente");
    },
  });

  const refundMutation = useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      if (!token || !orgId) throw new Error("Missing auth");
      const { ordersApi } = await import("../api/orders.api");
      await ordersApi.refundOrder(orgId, token, orderId, { reason });
      return orderId;
    },
    onMutate: async ({ orderId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.billing.all });
      const previous = queryClient.getQueryData<Order[]>(QUERY_KEYS.billing.all);
      queryClient.setQueryData<Order[]>(QUERY_KEYS.billing.all, old =>
        (old || []).map(o => o.id === orderId ? { ...o, status: "Processing" as const } : o)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.billing.all, context.previous);
      const msg = _err instanceof Error ? _err.message : "Refund failed";
      toast.error(msg);
    },
    onSuccess: () => {
      setRefundModalOpen(false);
      setDetailsModalOpen(false);
      toast.success("Order refunded successfully");
    },
  });

  const handleSaveOrder = useCallback((updatedOrder: Order) => {
    saveMutation.mutate(updatedOrder);
  }, [saveMutation]);

  const handleDeleteOrder = useCallback(() => {
    if (!selectedOrder) return;
    deleteMutation.mutate(selectedOrder.id);
  }, [selectedOrder, deleteMutation]);

  const handleOpenRefund = useCallback((order: Order) => {
    setSelectedOrder(order);
    setRefundModalOpen(true);
  }, []);

  const handleRefundOrder = useCallback((reason: string) => {
    if (!selectedOrder) return;
    refundMutation.mutate({ orderId: selectedOrder.id, reason });
  }, [selectedOrder, refundMutation]);

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
    refundModalOpen,
    setRefundModalOpen,
    selectedOrder,
    detailsMode,
    handleSaveOrder,
    handleDeleteOrder,
    handleOpenRefund,
    handleRefundOrder,
    isRefunding: refundMutation.isPending,
    loading: isLoading,
    refresh: () => refetch()
  };
};
