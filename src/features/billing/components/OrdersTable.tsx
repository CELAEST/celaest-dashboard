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
import { Order, Invoice } from "../types";
import { AestheticInvoiceTemplate } from "./InvoiceHistory/AestheticInvoiceTemplate";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { ordersApi } from "../api/orders.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/components/ui/use-mobile";
import {
  DotsThree,
  Warning,
  CheckCircle,
  Check,
  X,
  ArrowCounterClockwise,
  Clock,
  CreditCard,
  Money,
  Package,
  Eye,
  DownloadSimple,
  PencilSimple,
  Archive,
  Trash,
} from "@phosphor-icons/react";

interface OrdersTableProps {
  hideFooter?: boolean;
}

export const OrdersTable = React.memo(function OrdersTable({ hideFooter = true }: OrdersTableProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useIsMobile();
  const {
    orders,
    totalOrders,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loading,
    activeMenu,
    handleOpenMenu,
    handleCloseMenu,
    handleMenuAction,
    handleAction,
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
    downloadingOrderId,
    setDownloadingOrderId,
  } = useOrders();
  const { isSuperAdmin } = useRole();
  const { token, orgId } = useApiAuth();
  const { currentOrg } = useOrgStore();
  const t = useTranslations("common");
  const tBilling = useTranslations("billing");
  
  const [invoiceToPrint, setInvoiceToPrint] = React.useState<Invoice | null>(null);
  const printRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!downloadingOrderId || !token || !orgId) return;

    const downloadInvoice = async () => {
      try {
        const orderData = await ordersApi.getOrder(orgId, token, downloadingOrderId);
        
        // Map BackendOrder to Invoice for the template
        const mappedInvoice: Invoice = {
          id: orderData.id,
          organization_id: orgId,
          order_id: orderData.id,
          invoice_number: orderData.order_number,
          status: (orderData.status as Invoice["status"]) || "issued",
          currency: orderData.currency || "USD",
          subtotal: orderData.subtotal || orderData.total,
          discount_amount: orderData.discount_amount || 0,
          tax_amount: orderData.tax_amount || 0,
          total: orderData.total,
          customer_name: orderData.user_name || orderData.billing_name,
          customer_email: orderData.user_email || orderData.billing_email,
          item_name: orderData.items?.[0]?.name,
          created_at: orderData.created_at,
          updated_at: orderData.created_at,
        };

        setInvoiceToPrint(mappedInvoice);
        
        // Wait for React to render the hidden component
        await new Promise(resolve => setTimeout(resolve, 100)); 
        
        if (printRef.current) {
          const dataUrl = await htmlToImage.toPng(printRef.current, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
          });
          
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = 210;
          const pdfHeight = (1131 * pdfWidth) / 800;
          
          pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Invoice_${mappedInvoice.invoice_number || mappedInvoice.id.slice(0,8)}.pdf`);
          toast.success(tBilling("invoice_downloaded"));
        }
      } catch (error) {
        console.error("PDF generation failed:", error);
        toast.error(tBilling("invoice_download_error"));
      } finally {
        setDownloadingOrderId(null);
        setInvoiceToPrint(null);
      }
    };

    downloadInvoice();
  }, [downloadingOrderId, token, orgId, setDownloadingOrderId, tBilling]);

  const getStatusColor = useCallback(
    (status: string) => {
      const s = status.toLowerCase();
      if (isDark) {
        switch (s) {
          case "completed":
          case "active":
            return "bg-white/[0.08] text-white border border-white/10 shadow-xs font-semibold";
          case "processing":
            return "bg-white/[0.04] text-white/70 border border-white/[0.06] font-medium";
          case "cancelled":
          case "failed":
            return "bg-red-500/10 text-red-300 border border-red-500/20 font-medium";
          case "refunded":
            return "bg-white/[0.04] text-white/60 border border-white/[0.06] font-medium";
          default: // pending
            return "bg-white/[0.03] text-white/50 border border-white/[0.05] font-medium";
        }
      } else {
        switch (s) {
          case "completed":
          case "active":
            return "bg-gray-900 text-white font-semibold shadow-xs";
          case "processing":
            return "bg-gray-100 text-gray-700 font-medium";
          case "cancelled":
          case "failed":
            return "bg-red-50 text-red-700 border border-red-200 font-medium";
          case "refunded":
            return "bg-gray-100 text-gray-600 font-medium";
          default: // pending
            return "bg-amber-50 text-amber-700 border border-amber-200 font-medium";
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
        return <Check size={10} strokeWidth={3} className="mr-1 text-white/80" />;
      case "processing":
        return (
          <Clock
            size={10}
            className="mr-1 animate-[spin_3s_linear_infinite] will-change-transform text-white/60"
          />
        );
      case "cancelled":
      case "failed":
        return <X size={10} strokeWidth={3} className="mr-1 text-red-400" />;
      case "refunded":
        return <ArrowCounterClockwise size={10} className="mr-1 text-white/60" />;
      default:
        return <Clock size={10} className="mr-1 text-white/40" />;
    }
  }, []);

  const allColumns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        id: "displayId",
        header: t("order"),
        cell: ({ row }) => {
          const order = row.original;
          const parts = order.displayId.split('-');
          const mainRef = parts.length >= 3 ? parts.slice(0, 3).join('-') : order.displayId;
          const hash = parts.length >= 4 ? parts.slice(3).join('-') : '';
          return (
            <div>
              <span
                className={`text-xs font-mono font-semibold tracking-tight block ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {mainRef}
              </span>
              {hash && (
                <span className={`text-[10px] font-mono ${isDark ? "text-white/40" : "text-gray-400"}`}>
                  {hash}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "product",
        header: t("product"),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                isDark ? "bg-white/[0.04] border border-white/8" : "bg-gray-100 border border-gray-200/60"
              }`}>
                <Package size={14} className={isDark ? "text-white/60" : "text-gray-600"} />
              </div>
              <div className="min-w-0 max-w-[180px]">
                <span
                  className={`text-xs font-medium truncate block ${
                    isDark ? "text-zinc-200" : "text-gray-900"
                  }`}
                >
                  {order.product}
                </span>
                {order.itemType && (
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-400"}`}>
                    {order.itemType}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "user",
        header: t("user"),
        cell: ({ row }) => {
          const order = row.original;
          const name = order.userName || "N/A";
          return (
            <div>
              <span className={`text-xs font-medium block ${isDark ? "text-zinc-200" : "text-gray-700"}`}>
                {name}
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-white/40" : "text-gray-400"}`}>
                {order.date}
              </span>
            </div>
          );
        },
      },
      {
        id: "email",
        header: t("email"),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <span
              className={`font-mono text-[11px] ${
                isDark ? "text-white/40" : "text-gray-500"
              }`}
            >
              {order.userEmail}
            </span>
          );
        },
      },
      {
        id: "customer",
        header: t("customer"),
        cell: ({ row }) => {
          const order = row.original;
          const name = order.customer;
          return (
            <div>
              <span className={`text-xs font-medium block ${isDark ? "text-zinc-200" : "text-gray-700"}`}>
                {name}
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-white/40" : "text-gray-400"}`}>
                {order.date}
              </span>
            </div>
          );
        },
      },
      {
        id: "payment",
        header: t("payment"),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono ${
                isDark
                  ? "bg-white/[0.03] text-white/70 border border-white/[0.06]"
                  : "bg-gray-50 text-gray-600 border border-gray-200/60"
              }`}
            >
              {order.paymentMethod === "credit_card" || order.paymentMethod === "card" ? (
                <CreditCard size={12} className={isDark ? "text-white/40" : "text-gray-400"} />
              ) : (
                <Money size={12} className={isDark ? "text-white/40" : "text-gray-400"} />
              )}
              <span className="capitalize">
                {order.paymentProvider || order.paymentMethod || "Stripe"}
              </span>
            </div>
          );
        },
      },
      {
        id: "status",
        header: t("status"),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider ${getStatusColor(
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
        header: () => <div className="text-right">{t("amount")}</div>,
        cell: ({ row }) => {
          const order = row.original;
          const currency = order.amount.replace(/[\d.,]/g, '').trim();
          const number = order.amount.replace(/[^\d.,]/g, '');
          return (
            <div className="text-right text-xs font-mono tabular-nums">
              <span className={isDark ? "text-white/40" : "text-gray-400"}>{currency} </span>
              <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{number}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const order = row.original;
          
          if (isMobile) {
            return (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full pt-1">
                {/* View Details Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction("view", order);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95 ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 text-white border border-white/8 hover:border-white/15"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
                  }`}
                >
                  <Eye size={12} weight="bold" />
                  <span>{tBilling("view_details")}</span>
                </button>

                {/* Download Invoice Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction("download", order);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95 ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 text-white/90 border border-white/8"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
                  }`}
                >
                  <DownloadSimple size={12} weight="bold" />
                  <span>{tBilling("download_invoice")}</span>
                </button>

                {/* SuperAdmin Actions */}
                {isSuperAdmin && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction("edit", order);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95 ${
                        isDark
                          ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/8"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                      }`}
                    >
                      <PencilSimple size={12} weight="bold" />
                      <span>{tBilling("edit_order")}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction("archive", order);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95 ${
                        isDark
                          ? "bg-white/5 hover:bg-white/10 text-white/70 border border-white/8"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                      }`}
                    >
                      <Archive size={12} weight="bold" />
                      <span>{tBilling("archive")}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction("delete", order);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95 ${
                        isDark
                          ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                          : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                      }`}
                    >
                      <Trash size={12} weight="bold" />
                      <span>{tBilling("delete")}</span>
                    </button>
                  </>
                )}
              </div>
            );
          }

          return (
            <div className="text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMenu(e, order.id);
                }}
                className={`p-1.5 transition-all duration-200 rounded-lg ${
                  isDark
                    ? "text-gray-600 hover:text-white hover:bg-white/6"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <DotsThree size={16} weight="bold" />
              </button>
            </div>
          );
        },
      },
    ],
    [isDark, getStatusColor, getStatusIcon, handleOpenMenu, handleAction, isMobile, isSuperAdmin, t, tBilling],
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
        isLoading={loading}
        emptyMessage={tBilling("no_orders")}
        emptySubmessage={tBilling("no_orders_yet")}
        totalItems={totalOrders}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        hideFooter={hideFooter}
      />

      {activeMenu && (
        <ActionMenu
          isOpen={true}
          position={{ x: activeMenu.x, y: activeMenu.y }}
          align={activeMenu.align}
          onClose={handleCloseMenu}
          onAction={handleMenuAction}
          isDark={isDark}
          isSuperAdmin={isSuperAdmin}
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
        onDownload={() => selectedOrder && setDownloadingOrderId(selectedOrder.id)}
        canRefund={
          selectedOrder?.status === "Completed" ||
          selectedOrder?.status === "Active"
        }
        isSuperAdmin={isSuperAdmin}
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

      {/* Hidden container for PDF generation */}
      <div className="fixed top-0 left-[-10000px] pointer-events-none z-[-1]">
        {invoiceToPrint && (
          <AestheticInvoiceTemplate 
            ref={printRef} 
            invoice={invoiceToPrint} 
            orgName={currentOrg?.name} 
            language="es"
          />
        )}
      </div>
    </div>
  );
});
