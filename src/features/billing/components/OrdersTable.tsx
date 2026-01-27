"use client";

import React, { useMemo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { OrderDetailsModal } from "./modals/OrderDetailsModal";
import { ConfirmDeleteOrderModal } from "./modals/ConfirmDeleteOrderModal";
import { useOrders } from "../hooks/useOrders";
import { ActionMenu } from "./orders/ActionMenu";
import { OrderRow } from "./orders/OrderRow";

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
    selectedOrder,
    detailsMode,
    handleSaveOrder,
    handleDeleteOrder,
  } = useOrders();

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
