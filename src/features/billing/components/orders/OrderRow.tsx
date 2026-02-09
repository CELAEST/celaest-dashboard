"use client";

import React, { useCallback } from "react";
import { MoreHorizontal, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Order } from "../../types";

interface OrderRowProps {
  order: Order;
  isDark: boolean;
  onOpenMenu: (e: React.MouseEvent, id: string) => void;
}

export const OrderRow = React.memo(
  ({ order, isDark, onOpenMenu }: OrderRowProps) => {
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
          {order.displayId}
        </td>

        <td
          className={`py-4 px-4 font-medium ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {order.product}
        </td>
        <td
          className={`py-4 px-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
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
  },
);

OrderRow.displayName = "OrderRow";
