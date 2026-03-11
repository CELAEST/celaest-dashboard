import React, { useMemo } from "react";
import {
  X,
  MagnifyingGlass,
  Buildings,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Funnel,
  DownloadSimple,
  ClockCounterClockwise,
  CurrencyDollar,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Payment } from "../../types";
import { useTransactionsInfiniteQuery } from "../../hooks/useBillingQuery";
import { format } from "date-fns";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

interface TransactionLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionLogsModal: React.FC<TransactionLogsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { session } = useAuth();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTransactionsInfiniteQuery(
    session?.accessToken ?? null,
  );

  const transactions = useMemo(
    () => data?.pages.flatMap((p) => p.payments ?? []) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;

  const columns: ColumnDef<Payment>[] = useMemo(
    () => [
      {
        id: "date",
        header: "Date & Time",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {format(new Date(tx.created_at), "MMM d, yyyy")}
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(tx.created_at), "HH:mm:ss")}
              </span>
            </div>
          );
        },
      },
      {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <CurrencyDollar className="w-4 h-4 text-emerald-400" />
              {(tx.amount / 1).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
              <span className="text-[10px] text-gray-500 uppercase ml-1">
                {tx.currency}
              </span>
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const tx = row.original;
          const status = tx.status;
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                status === "completed" || status === "succeeded"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : status === "failed"
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : status === "refund_requested"
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {status === "completed" || status === "succeeded" ? (
                <CheckCircle className="w-3 h-3" />
              ) : status === "failed" ? (
                <XCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {status.toUpperCase()}
            </span>
          );
        },
      },
      {
        id: "org",
        header: "Organization ID",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 py-1 px-2 rounded-lg w-fit">
              <Buildings className="w-3 h-3" />
              {tx.organization_id.slice(0, 8)}...
            </div>
          );
        },
      },
      {
        id: "details",
        header: "Details",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-300 capitalize">
                  {tx.provider}
                </span>
                <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
                  {tx.external_payment_id || "LOCAL_TX"}
                </span>
              </div>
              <motion.button
                whileHover={{ x: 4 }}
                className="p-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          );
        },
      },
    ],
    [],
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <ClockCounterClockwise className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Global Transaction Logs
                </h2>
                <p className="text-sm text-gray-400">
                  Total processed: {total} records
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors group"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
            </button>
          </div>

          {/* Controls */}
          <div className="p-4 bg-white/2 border-b border-white/10 flex items-center gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="MagnifyingGlass transactions..."
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                disabled
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed">
              <Funnel className="w-4 h-4" /> Funnel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed">
              <DownloadSimple className="w-4 h-4" /> Export
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto bg-slate-900 custom-scrollbar dark">
            <DataTable
              columns={columns}
              data={transactions}
              isLoading={isLoading}
              emptyMessage="No transactions found"
              emptySubmessage="Transaction history will appear here."
              totalItems={total}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={fetchNextPage}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
