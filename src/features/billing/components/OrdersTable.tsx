"use client";

import React, { useMemo, useCallback } from "react";
import { MoreHorizontal, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Order {
  id: string;
  product: string;
  customer: string;
  date: string;
  status: "Processing" | "Shipped" | "Pending" | "Delivered";
  amount: string;
}

const orders: Order[] = [
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
}: {
  order: Order;
  isDark: boolean;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
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
          className={`p-1 transition-colors rounded ${
            isDark
              ? "text-gray-500 hover:text-white hover:bg-white/10"
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
    <div className="w-full">
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

      <div className="overflow-x-auto">
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
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
