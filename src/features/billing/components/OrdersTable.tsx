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

export const OrdersTable = React.memo(function OrdersTable({ hideFooter }: OrdersTableProps) {
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
            return "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20";
          case "processing":
            return "text-cyan-400 bg-cyan-500/10 ring-cyan-500/20";
          case "cancelled":
          case "failed":
            return "text-red-400 bg-red-500/10 ring-red-500/20";
          default: // pending
            return "text-amber-400 bg-amber-500/10 ring-amber-500/20";
        }
      } else {
        switch (s) {
          case "completed":
          case "active":
            return "text-emerald-600 bg-emerald-50 ring-emerald-200";
          case "processing":
            return "text-blue-600 bg-blue-50 ring-blue-200";
          case "cancelled":
          case "failed":
            return "text-red-600 bg-red-50 ring-red-200";
          default: // pending
            return "text-amber-600 bg-amber-50 ring-amber-200";
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
        return <CheckCircle size={11} weight="fill" className="mr-1" />;
      case "processing":
        return (
          <Clock
            size={11}
            weight="bold"
            className="mr-1 animate-[spin_3s_linear_infinite] will-change-transform"
          />
        );
      case "cancelled":
      case "failed":
        return <Warning size={11} weight="fill" className="mr-1" />;
      default:
        return <Clock size={11} weight="bold" className="mr-1" />;
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
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                {mainRef}
              </span>
              {hash && (
                <span className={`text-[10px] font-mono ${isDark ? "text-gray-600" : "text-gray-400"}`}>
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
                isDark ? "bg-white/6 border border-white/6" : "bg-gray-100 border border-gray-200/60"
              }`}>
                <Package size={14} weight="duotone" className={isDark ? "text-cyan-400" : "text-blue-500"} />
              </div>
              <div className="min-w-0 max-w-[180px]">
                <span
                  className={`text-xs font-semibold truncate block ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {order.product}
                </span>
                {order.itemType && (
                  <span className={`text-[10px] capitalize ${isDark ? "text-gray-500" : "text-gray-400"}`}>
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
              <span className={`text-xs font-medium block ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {name}
              </span>
              <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
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
                isDark ? "text-cyan-400/60" : "text-blue-500/60"
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
              <span className={`text-xs font-medium block ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {name}
              </span>
              <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
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
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                isDark
                  ? "bg-white/4 text-gray-300 ring-1 ring-inset ring-white/6"
                  : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200/60"
              }`}
            >
              {order.paymentMethod === "credit_card" || order.paymentMethod === "card" ? (
                <CreditCard size={13} weight="fill" className={isDark ? "text-gray-500" : "text-gray-400"} />
              ) : (
                <Money size={13} weight="fill" className={isDark ? "text-gray-500" : "text-gray-400"} />
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
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${getStatusColor(
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
              <span className={isDark ? "text-gray-500" : "text-gray-400"}>{currency}</span>
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
                      ? "bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10"
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
                      ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60"
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
                          ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
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
                          ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
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
