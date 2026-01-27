import { useState, useCallback } from "react";
import { Order } from "../types";
import { toast } from "sonner";

const INITIAL_ORDERS: Order[] = [
  {
    id: "#CL-8832",
    product: "Quantum Processor Unit",
    customer: "Nexus Corp",
    date: "2 min ago",
    status: "Processing",
    amount: "$1,299.00",
  },
  {
    id: "#CL-8831",
    product: "Holographic Display Module",
    customer: "AeroSystems",
    date: "15 min ago",
    status: "Shipped",
    amount: "$850.00",
  },
  {
    id: "#CL-8830",
    product: "Neural Interface Kit",
    customer: "Dr. S. Vance",
    date: "1 hour ago",
    status: "Pending",
    amount: "$2,499.00",
  },
  {
    id: "#CL-8829",
    product: "Bio-Metric Sensors",
    customer: "Global Med",
    date: "3 hours ago",
    status: "Delivered",
    amount: "$540.00",
  },
];

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
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
          toast.success(`Downloading invoice for ${activeMenu.id}`, {
            description: "Your download will start shortly.",
          });
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

  const handleSaveOrder = (updatedOrder: Order) => {
    setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    toast.success("Order updated successfully");
  };

  const handleDeleteOrder = () => {
    if (selectedOrder) {
      setOrders(orders.filter((o) => o.id !== selectedOrder.id));
      setDeleteModalOpen(false);
      toast.success("Order deleted successfully");
    }
  };

  return {
    orders,
    activeMenu,
    handleOpenMenu,
    handleCloseMenu,
    handleMenuAction,
    // Modal states
    detailsModalOpen,
    setDetailsModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    selectedOrder,
    detailsMode,
    handleSaveOrder,
    handleDeleteOrder,
  };
};
