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
import { motion } from "motion/react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Payment } from "../../types";
import { useTransactionsInfiniteQuery } from "../../hooks/useBillingQuery";
import { format } from "date-fns";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { BillingModal } from "./shared/BillingModal";

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
              <CurrencyDollar className="w-4 h-4 text-teal-400" />
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

  return (
    <BillingModal isOpen={isOpen} onClose={onClose} className="max-w-5xl h-[85vh]" showCloseButton={false}>
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-teal-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(20,184,166,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-teal-600/8 to-transparent" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
        <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-teal-500/50 to-transparent" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-teal-400 border border-white/10 shadow-lg shadow-teal-500/10">
            <ClockCounterClockwise size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Transaction Logs</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Total processed: {total} records</p>
          </div>
        </div>

        <div className="relative z-10">
          <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-4 border-b border-white/5 flex items-center gap-4 shrink-0">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20"
            disabled
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-gray-400 cursor-not-allowed">
          <Funnel className="w-4 h-4" /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-gray-400 cursor-not-allowed">
          <DownloadSimple className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
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
    </BillingModal>
  );
};
