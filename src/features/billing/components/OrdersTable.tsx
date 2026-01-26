"use client";

import React, { useMemo, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Archive,
  Trash2,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { OrderDetailsModal } from "./modals/OrderDetailsModal";
import { ConfirmDeleteOrderModal } from "./modals/ConfirmDeleteOrderModal";

interface ActionMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  align?: "top" | "bottom";
  onClose: () => void;
  onAction: (action: string) => void;
  isDark: boolean;
}

const ActionMenu = ({
  isOpen,
  position,
  align = "top",
  onClose,
  onAction,
  isDark,
}: ActionMenuProps) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-99999" onClick={onClose} />
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: align === "top" ? -10 : 10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: align === "top" ? -10 : 10,
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              left: position.x - 180,
              ...(align === "top"
                ? { top: position.y }
                : { bottom: position.y }),
            }}
            className={`z-100000 w-48 rounded-xl shadow-2xl border overflow-hidden ${
              isDark
                ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-white/10"
                : "bg-white/90 backdrop-blur-xl border-white/20"
            }`}
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {[
                {
                  icon: Eye,
                  label: "View Details",
                  action: "view",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Download,
                  label: "Download Invoice",
                  action: "download",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Edit,
                  label: "Edit Order",
                  action: "edit",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Archive,
                  label: "Archive",
                  action: "archive",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Trash2,
                  label: "Delete",
                  action: "delete",
                  color: "text-red-500",
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onAction(item.action);
                    onClose();
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isDark
                      ? `hover:bg-white/10 ${item.color}`
                      : `hover:bg-gray-100 ${item.color}`
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

interface Order {
  id: string;
  product: string;
  customer: string;
  date: string;
  status: "Processing" | "Shipped" | "Pending" | "Delivered";
  amount: string;
}

const initialOrders: Order[] = [
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

// Memoized row component for better performance
const OrderRow = React.memo(function OrderRow({
  order,
  isDark,
  getStatusColor,
  getStatusIcon,
  onOpenMenu,
}: {
  order: Order;
  isDark: boolean;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onOpenMenu: (e: React.MouseEvent, id: string) => void;
}) {
  return (
    <tr
      className={`group border-b transition-colors ${
        isDark
          ? "border-white/5 hover:bg-white/5"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      <td
        className={`py-4 px-4 font-mono transition-colors ${
          isDark
            ? "text-cyan-400/80 group-hover:text-cyan-400"
            : "text-blue-600/80 group-hover:text-blue-600"
        }`}
      >
        {order.id}
      </td>
      <td
        className={`py-4 px-4 font-medium ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {order.product}
      </td>
      <td className={`py-4 px-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {order.customer}
        <div className="text-[10px] opacity-60">{order.date}</div>
      </td>
      <td className="py-4 px-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            order.status,
          )}`}
        >
          {getStatusIcon(order.status)}
          {order.status}
        </span>
      </td>
      <td
        className={`py-4 px-4 text-right font-mono ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {order.amount}
      </td>
      <td className="py-4 px-4 text-right">
        <button
          onClick={(e) => onOpenMenu(e, order.id)}
          className={`p-1.5 transition-all duration-300 rounded-lg ${
            isDark
              ? "text-gray-500 hover:text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
});

export const OrdersTable = React.memo(function OrdersTable() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    x: number;
    y: number;
    align: "top" | "bottom";
  } | null>(null);

  // Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsMode, setDetailsMode] = useState<"view" | "edit">("view");

  const handleOpenMenu = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const menuHeight = 220; // safe estimate
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
    },
    [activeMenu, orders],
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

  const getStatusColor = useCallback(
    (status: string) => {
      if (isDark) {
        switch (status) {
          case "Shipped":
            return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
          case "Delivered":
            return "text-green-400 bg-green-400/10 border-green-400/20";
          case "Processing":
            return "text-blue-400 bg-blue-400/10 border-blue-400/20";
          default:
            return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        }
      } else {
        switch (status) {
          case "Shipped":
            return "text-cyan-700 bg-cyan-50 border-cyan-200";
          case "Delivered":
            return "text-green-700 bg-green-50 border-green-200";
          case "Processing":
            return "text-blue-700 bg-blue-50 border-blue-200";
          default:
            return "text-yellow-700 bg-yellow-50 border-yellow-200";
        }
      }
    },
    [isDark],
  );

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "Shipped":
        return <CheckCircle size={12} className="mr-1.5" />;
      case "Delivered":
        return <CheckCircle size={12} className="mr-1.5" />;
      case "Processing":
        return (
          <Clock
            size={12}
            className="mr-1.5 animate-[spin_3s_linear_infinite] will-change-transform"
          />
        );
      default:
        return <AlertCircle size={12} className="mr-1.5" />;
    }
  }, []);

  // Memoize header class
  const headerClassName = useMemo(
    () =>
      `border-b text-xs uppercase tracking-wider font-mono ${
        isDark
          ? "border-white/5 text-gray-500"
          : "border-gray-200 text-gray-500"
      }`,
    [isDark],
  );

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Recent Orders
        </h3>
        <button
          className={`text-xs transition-colors ${
            isDark
              ? "text-cyan-400 hover:text-cyan-300"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={headerClassName}>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                isDark={isDark}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                onOpenMenu={handleOpenMenu}
              />
            ))}
          </tbody>
        </table>
      </div>

      {activeMenu && (
        <ActionMenu
          isOpen={true}
          position={{ x: activeMenu.x, y: activeMenu.y }}
          align={activeMenu.align}
          onClose={handleCloseMenu}
          onAction={handleMenuAction}
          isDark={isDark}
        />
      )}

      {/* Modals */}
      <OrderDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        order={selectedOrder}
        initialMode={detailsMode}
        onSave={handleSaveOrder}
      />

      <ConfirmDeleteOrderModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteOrder}
        orderId={selectedOrder?.id || ""}
      />
    </div>
  );
});
