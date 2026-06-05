"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Tray, CircleNotch } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useIsMobile } from "@/components/ui/use-mobile";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubmessage?: string;
  onRowClick?: (row: TData) => void;
  /** Max height of the scrollable area */
  maxHeight?: string;
  /** Skeleton row count shown during initial load */
  skeletonRows?: number;
  /** Total items on server (for "Showing X of Y") */
  totalItems?: number;
  /** Whether there are more pages to fetch from the server */
  hasNextPage?: boolean;
  /** Whether a next page is currently being fetched */
  isFetchingNextPage?: boolean;
  /** Called when the user scrolls near the bottom — fetch next page */
  onLoadMore?: () => void;
  /** Hide the footer count row */
  hideFooter?: boolean;
  /** Override the default body cell className (default: px-4 py-3 text-sm) */
  bodyCellClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  emptySubmessage = "Intenta ajustar tus filtros o crear un nuevo registro.",
  onRowClick,
  maxHeight = "calc(100vh - 280px)",
  skeletonRows = 8,
  totalItems,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  hideFooter = false,
  bodyCellClassName,
}: DataTableProps<TData, TValue>) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useIsMobile();
  const [sorting, setSorting] = useState<SortingState>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasNextPage || isFetchingNextPage || !onLoadMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) onLoadMore();
        },
        { rootMargin: "200px" },
      );
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, onLoadMore],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const tableConfig = useMemo(
    () => ({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      state: { sorting },
    }),
    [data, columns, sorting],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable(tableConfig);

  const displayTotal = totalItems ?? data.length;

  // Theme-aware class helpers
  const containerCls = isDark
    ? "rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
    : "rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-xl shadow-sm overflow-hidden";

  const headerRowCls = isDark
    ? "border-white/[0.06] hover:bg-transparent"
    : "border-gray-100 hover:bg-transparent";

  const headerCellCls = isDark
    ? "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500"
    : "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400";

  const bodyCellCls = bodyCellClassName ??
    (isDark ? "px-4 py-3 text-sm text-gray-300" : "px-4 py-3 text-sm text-gray-600");

  const rowBorderCls = isDark ? "border-white/[0.04]" : "border-gray-100/80";

  const rowHoverCls = onRowClick
    ? isDark ? "cursor-pointer hover:bg-white/[0.03]" : "cursor-pointer hover:bg-gray-50/60"
    : isDark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50/40";

  const skeletonBgCls = isDark ? "bg-white/[0.06]" : "bg-gray-200/40";
  const skeletonCellBgCls = isDark ? "bg-white/[0.04]" : "bg-gray-200/30";

  // ─── Mobile Card Classes ───
  const cardCls = isDark
    ? "rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors duration-150 active:bg-white/[0.05]"
    : "rounded-xl border border-gray-200/60 bg-white p-4 shadow-sm transition-colors duration-150 active:bg-gray-50";

  const cardLabelCls = isDark
    ? "text-[10px] font-semibold uppercase tracking-wider text-gray-500"
    : "text-[10px] font-semibold uppercase tracking-wider text-gray-400";

  const cardValueCls = isDark
    ? "text-sm text-gray-200"
    : "text-sm text-gray-700";

  // ─── LOADING STATE ───
  if (isLoading) {
    // Mobile skeleton: stacked card skeletons
    if (isMobile) {
      return (
        <div className={`${containerCls} border-0 bg-transparent shadow-none`}>
          <div className="flex flex-col gap-3 p-3">
            {Array.from({ length: Math.min(skeletonRows, 4) }).map((_, i) => (
              <div key={i} className={cardCls}>
                <div className="space-y-3">
                  {Array.from({ length: Math.min(columns.length, 4) }).map((_, j) => (
                    <div key={j} className="flex items-center justify-between gap-4">
                      <Skeleton className={`h-2.5 w-16 rounded-md ${skeletonBgCls}`} />
                      <Skeleton
                        className={`h-4 rounded-md ${skeletonCellBgCls}`}
                        style={{ width: `${40 + ((j * 17 + i * 7) % 35)}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Desktop skeleton: classic table skeleton
    return (
      <div className={containerCls}>
        <Table>
          <TableHeader>
            <TableRow className={headerRowCls}>
              {columns.map((_, i) => (
                <TableHead key={i} className="px-4 py-3">
                  <Skeleton className={`h-3.5 w-20 rounded-md ${skeletonBgCls}`} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow
                key={i}
                className={`${rowBorderCls} hover:bg-transparent`}
              >
                {columns.map((_, j) => (
                  <TableCell key={j} className="px-4 py-3.5">
                    <Skeleton
                      className={`h-4 rounded-md ${skeletonCellBgCls}`}
                      style={{ width: `${55 + ((j * 17 + i * 7) % 35)}%` }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // ─── EMPTY STATE (shared) ───
  const emptyState = (
    <div className="flex flex-col items-center justify-center text-gray-500 space-y-3 py-16 px-4">
      <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/[0.03] text-gray-500 border-white/[0.06]" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
        <Tray className="w-8 h-8" weight="light" />
      </div>
      <div className="space-y-1 text-center">
        <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {emptyMessage}
        </p>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {emptySubmessage}
        </p>
      </div>
    </div>
  );

  // ─── INFINITE SCROLL SENTINEL (shared) ───
  const scrollSentinel = (hasNextPage || isFetchingNextPage) && (
    <div ref={sentinelRef} className="flex items-center justify-center gap-2.5 py-4">
      {isFetchingNextPage ? (
        <>
          <CircleNotch className={`h-4 w-4 animate-spin ${isDark ? "text-cyan-400" : "text-blue-500"}`} />
          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Cargando más...</span>
        </>
      ) : (
        <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>Scroll para más</span>
      )}
    </div>
  );

  // ─── FOOTER (shared) ───
  const footer = !hideFooter && data.length > 0 && (
    <div className={`border-t px-4 py-2.5 ${isDark ? "border-white/[0.06] bg-white/[0.01]" : "border-gray-100 bg-gray-50/50"}`}>
      <p className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        Showing {data.length} of {displayTotal} entries
      </p>
    </div>
  );

  // ─── MOBILE CARD LAYOUT ───
  if (isMobile) {
    const rows = table.getRowModel().rows;
    const headerGroups = table.getHeaderGroups();

    // Extract header labels for card label:value pairs
    const headerLabels: string[] = headerGroups[0]?.headers.map(
      (header: Header<TData, unknown>) => {
        if (header.isPlaceholder) return "";
        const rendered = header.column.columnDef.header;
        if (typeof rendered === "string") return rendered;
        // For non-string headers, use the column id
        return header.column.id;
      }
    ) ?? [];

    return (
      <div className={`${containerCls} border-0 bg-transparent shadow-none`}>
        <div className="overflow-auto" style={{ maxHeight }}>
          {rows.length ? (
            <div className="flex flex-col gap-3 p-3">
              {rows.map((row: Row<TData>) => (
                <div
                  key={row.id}
                  className={`${cardCls} ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  <div className="space-y-2.5">
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>, cellIdx) => {
                      const label = headerLabels[cellIdx] || "";
                      return (
                        <div key={cell.id} className={`flex items-start justify-between gap-3 ${cellIdx === 0 ? "" : `pt-2.5 border-t ${isDark ? "border-white/[0.04]" : "border-gray-100"}`}`}>
                          {label && (
                            <span className={`${cardLabelCls} shrink-0 pt-0.5`}>
                              {label}
                            </span>
                          )}
                          <div className={`${cardValueCls} ${label ? "text-right min-w-0" : "w-full"}`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {scrollSentinel}
            </div>
          ) : (
            emptyState
          )}
        </div>
        {footer}
      </div>
    );
  }

  // ─── DESKTOP TABLE LAYOUT ───
  return (
    <div className={containerCls}>
      <div className="overflow-auto [&>div]:overflow-visible" style={{ maxHeight }}>
        <Table>
          <TableHeader className={`sticky top-0 z-10 ${isDark ? "bg-[#0d0d0d]" : "bg-gray-50"}`}>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <TableRow key={headerGroup.id} className={headerRowCls}>
                {headerGroup.headers.map((header: Header<TData, unknown>) => (
                  <TableHead key={header.id} className={headerCellCls}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row: Row<TData>) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${rowBorderCls} transition-colors duration-150 ${rowHoverCls}`}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <TableCell key={cell.id} className={bodyCellCls}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* Infinite scroll sentinel */}
                {(hasNextPage || isFetchingNextPage) && (
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="py-4 text-center">
                      {scrollSentinel}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer count */}
      {footer}
    </div>
  );
}
