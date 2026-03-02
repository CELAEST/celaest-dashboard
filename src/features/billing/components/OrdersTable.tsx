"use client";

import React, { useMemo, useCallback } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { OrderDetailsModal } from "./modals/OrderDetailsModal";
import { ConfirmDeleteOrderModal } from "./modals/ConfirmDeleteOrderModal";
import { RefundConfirmModal } from "./modals/RefundConfirmModal";
import { useOrders } from "../hooks/useOrders";
import { ActionMenu } from "./orders/ActionMenu";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Order } from "../types";
import {
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Banknote,
} from "lucide-react";

export const OrdersTable = React.memo(function OrdersTable() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
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
    isRefunding,
  } = useOrders();
  const { isSuperAdmin } = useRole();

  const getStatusColor = useCallback(
    (status: string) => {
      const s = status.toLowerCase();
      if (isDark) {
        switch (s) {
          case "completed":
          case "active":
            return "text-green-400 bg-green-400/10 border-green-400/20";
          case "processing":
            return "text-blue-400 bg-blue-400/10 border-blue-400/20";
          case "cancelled":
          case "failed":
            return "text-red-400 bg-red-400/10 border-red-400/20";
          default: // pending
            return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        }
      } else {
        switch (s) {
          case "completed":
          case "active":
            return "text-green-700 bg-green-50 border-green-200";
          case "processing":
            return "text-blue-700 bg-blue-50 border-blue-200";
          case "cancelled":
          case "failed":
            return "text-red-700 bg-red-50 border-red-200";
          default: // pending
            return "text-yellow-700 bg-yellow-50 border-yellow-200";
        }
      }
    },
    [isDark],
  );

  const getStatusIcon = useCallback((status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "completed":
      case "active":
        return <CheckCircle size={12} className="mr-1.5" />;
      case "processing":
        return (
          <Clock
            size={12}
            className="mr-1.5 animate-[spin_3s_linear_infinite] will-change-transform"
          />
        );
      case "cancelled":
      case "failed":
        return <AlertCircle size={12} className="mr-1.5" />;
      default:
        return <Clock size={12} className="mr-1.5" />;
    }
  }, []);

  const allColumns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        id: "displayId",
        header: "Order ID",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <span
              className={`font-mono transition-colors ${
                isDark ? "text-cyan-400/80" : "text-blue-600/80"
              }`}
            >
              {order.displayId}
            </span>
          );
        },
      },
      {
        id: "product",
        header: "Product",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <span
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {order.product}
            </span>
          );
        },
      },
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className={isDark ? "text-gray-400" : "text-gray-600"}>
              {order.userName || "N/A"}
              <div className="text-[10px] opacity-60">{order.date}</div>
            </div>
          );
        },
      },
      {
        id: "email",
        header: "Email",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <span
              className={`font-mono text-xs ${
                isDark ? "text-cyan-400/70" : "text-blue-500/70"
              }`}
            >
              {order.userEmail}
            </span>
          );
        },
      },
      {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className={isDark ? "text-gray-400" : "text-gray-600"}>
              {order.customer}
              <div className="text-[10px] opacity-60">{order.date}</div>
            </div>
          );
        },
      },
      {
        id: "payment",
        header: "Payment",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div
              className={`flex items-center gap-2 text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {order.paymentMethod === "card" ? (
                <CreditCard size={14} />
              ) : (
                <Banknote size={14} />
              )}
              <span className="capitalize">
                {order.paymentMethod || "Stripe"}
              </span>
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                order.status,
              )}`}
            >
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          );
        },
      },
      {
        id: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div
              className={`text-right font-mono ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {order.amount}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMenu(e, order.id);
                }}
                className={`p-1.5 transition-all duration-300 rounded-lg ${
                  isDark
                    ? "text-gray-500 hover:text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [isDark, getStatusColor, getStatusIcon, handleOpenMenu],
  );

  const columns = useMemo(() => {
    return allColumns.filter((col) => {
      if (isSuperAdmin) {
        return col.id !== "customer" && col.id !== "payment";
      } else {
        return col.id !== "user" && col.id !== "email";
      }
    });
  }, [allColumns, isSuperAdmin]);

  return (
    <div className="w-full relative">
      <DataTable
        columns={columns}
        data={orders}
        isLoading={false}
        emptyMessage="No orders found."
        emptySubmessage="You haven't received any orders yet."
      />

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
        onRefund={() => selectedOrder && handleOpenRefund(selectedOrder)}
        canRefund={
          selectedOrder?.status === "Completed" ||
          selectedOrder?.status === "Active"
        }
      />

      <ConfirmDeleteOrderModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteOrder}
        orderId={selectedOrder?.id || ""}
      />

      <RefundConfirmModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        onConfirm={handleRefundOrder}
        orderDisplayId={selectedOrder?.displayId || ""}
        orderAmount={selectedOrder?.amount || "$0.00"}
        isLoading={isRefunding}
      />
    </div>
  );
});
