/**
 * Universal Skeleton Primitives
 *
 * Composable building blocks for constructing module-specific loading states.
 * All skeletons use CSS animations for performance (no JS runtime cost).
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ── Stat Card Skeleton ────────────────────────────────────────────────
export const StatCardSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "p-4 rounded-xl bg-neutral-900/60 border border-white/3 flex items-center justify-between",
      className,
    )}
  >
    <div className="space-y-2">
      <Skeleton className="h-3 w-20 bg-white/5" />
      <Skeleton className="h-8 w-16 bg-white/5" />
    </div>
    <Skeleton className="h-10 w-10 rounded-lg bg-white/5" />
  </div>
);

// ── Table Row Skeleton ────────────────────────────────────────────────
export const TableRowSkeleton = ({
  columns = 5,
  className,
}: {
  columns?: number;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-4 px-4 py-3 border-b border-white/2",
      className,
    )}
  >
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          "h-4 bg-white/5 rounded",
          i === 0 ? "w-32" : i === columns - 1 ? "w-8" : "w-24",
        )}
      />
    ))}
  </div>
);

// ── Table Skeleton ────────────────────────────────────────────────────
export const TableSkeleton = ({
  rows = 6,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-xl bg-neutral-900/30 border border-white/2 overflow-hidden",
      className,
    )}
  >
    {/* Header */}
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-20 bg-white/6 rounded" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} columns={columns} />
    ))}
  </div>
);

// ── Form Field Skeleton ───────────────────────────────────────────────
export const FormFieldSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-2", className)}>
    <Skeleton className="h-3 w-24 bg-white/5" />
    <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
  </div>
);

// ── Card Grid Skeleton ────────────────────────────────────────────────
export const CardGridSkeleton = ({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-xl bg-neutral-900/40 border border-white/3 p-5 space-y-3"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg bg-white/5" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-2/3 bg-white/5" />
            <Skeleton className="h-3 w-1/2 bg-white/4" />
          </div>
        </div>
        <Skeleton className="h-20 w-full rounded-lg bg-white/3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md bg-white/5" />
          <Skeleton className="h-8 w-20 rounded-md bg-white/4" />
        </div>
      </div>
    ))}
  </div>
);

// ── Header Skeleton ───────────────────────────────────────────────────
export const HeaderSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "bg-neutral-900/40 border border-white/3 backdrop-blur-md rounded-xl p-4 flex items-center justify-between",
      className,
    )}
  >
    <div className="flex items-center gap-3">
      <Skeleton className="h-9 w-9 rounded-lg bg-white/5" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-28 bg-white/5" />
        <Skeleton className="h-3 w-40 bg-white/4" />
      </div>
    </div>
    <Skeleton className="h-9 w-32 rounded-lg bg-white/5" />
  </div>
);

// ── Full Page Skeleton ────────────────────────────────────────────────
export const PageSkeleton = ({
  type = "table",
  className,
}: {
  type?: "table" | "cards" | "form";
  className?: string;
}) => (
  <div className={cn("h-full w-full flex flex-col gap-3 p-3", className)}>
    <HeaderSkeleton />
    {type === "table" && (
      <div className="flex gap-3 flex-1">
        <TableSkeleton className="flex-1" />
        <div className="w-80 space-y-3 shrink-0">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    )}
    {type === "cards" && <CardGridSkeleton count={6} />}
    {type === "form" && (
      <div className="max-w-2xl space-y-4 p-6 bg-neutral-900/30 rounded-xl border border-white/2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg bg-white/5 mt-4" />
      </div>
    )}
  </div>
);
