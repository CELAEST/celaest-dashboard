import { logger } from "@/lib/logger";
import { useState, useMemo, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Tag,
  Power,
  Clock,
  Pulse,
  MagnifyingGlass,
  Lightning,
  Calendar,
} from "@phosphor-icons/react";
import { DataTable } from "@/components/ui/data-table";
import { useCoupons } from "../stores/useCouponsStore";
import { Coupon } from "../lib/types";
import { CreateCouponModal } from "./modals/CreateCouponModal";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import { Copy, Check } from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageBanner } from "@/components/layout/PageLayout";

const CodeCell = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 group/code">
      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5 group-hover/code:border-blue-500/30 transition-colors">
        <Tag className="w-3.5 h-3.5 text-neutral-500 group-hover/code:text-blue-400 transition-colors" />
        <span className="font-mono text-[13px] font-bold text-neutral-200 tracking-wider">
          {code}
        </span>
      </div>
      <button
        onClick={copyToClipboard}
        className="opacity-0 group-hover/code:opacity-100 p-1.5 rounded-md hover:bg-neutral-800 text-neutral-500 hover:text-blue-400 transition-all"
        title="Copiar código"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};

export const CouponsDashboardView = () => {
  const { coupons, totalCoupons, isLoading, deleteCoupon, invalidate, hasNextPage, isFetchingNextPage, fetchNextPage } = useCoupons();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoupons = useMemo(() => {
    if (!searchQuery) return coupons;
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [coupons, searchQuery]);

  const handleDelete = useCallback(
    async (code: string) => {
      if (
        confirm(
          `¿Estás seguro que deseas desactivar el cupón ${code}? No se podrá volver a usar.`,
        )
      ) {
        try {
          await deleteCoupon(code);
        } catch (error: unknown) {
          logger.error("Failed to deactivate coupon", error);
          alert("Error al desactivar el cupón.");
        }
      }
    },
    [deleteCoupon],
  );

  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => {
      const expiresAt = c.expires_at;
      const expiryDate =
        typeof expiresAt === "object" && expiresAt !== null
          ? expiresAt.Time
          : expiresAt;
      const isExpired =
        !!expiresAt &&
        (typeof expiresAt === "object" ? expiresAt.Valid : true) &&
        expiryDate &&
        expiryDate !== "0001-01-01T00:00:00Z" &&
        new Date(expiryDate as string) < new Date();
      return c.is_active && !isExpired;
    }).length;
    const expired = coupons.filter((c) => {
      const expiresAt = c.expires_at;
      const expiryDate =
        typeof expiresAt === "object" && expiresAt !== null
          ? expiresAt.Time
          : expiresAt;
      return (
        !!expiresAt &&
        (typeof expiresAt === "object" ? expiresAt.Valid : true) &&
        expiryDate &&
        expiryDate !== "0001-01-01T00:00:00Z" &&
        new Date(expiryDate as string) < new Date()
      );
    }).length;

    return { total, active, expired };
  }, [coupons]);

  // Mapear columnas para DataTable
  const columns = useMemo<ColumnDef<Coupon>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Código",
        cell: ({ row }) => <CodeCell code={row.original.code} />,
      },
      {
        accessorKey: "discount",
        header: "Descuento",
        cell: ({ row }: { row: { original: Coupon } }) => {
          const coupon = row.original;
          const isPercentage = coupon.discount_type === "percentage";
          return (
            <div className="flex flex-col">
              <span
                className={`text-[13px] font-bold ${isPercentage ? "text-emerald-400" : "text-blue-400"}`}
              >
                {isPercentage
                  ? `${coupon.discount_value}%`
                  : formatCurrency(coupon.discount_value)}
              </span>
              <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-tighter">
                {isPercentage ? "Descuento total" : "Monto Fijo"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "uses",
        header: "Uso y Redención",
        cell: ({ row }: { row: { original: Coupon } }) => {
          const coupon = row.original;
          const current = coupon.current_redemptions || 0;
          const maxRaw = coupon.max_redemptions;
          const max =
            typeof maxRaw === "object" && maxRaw !== null
              ? maxRaw.Int64
              : maxRaw;
          const percent = max ? Math.min((current / max) * 100, 100) : 0;

          if (!max) {
            return (
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-neutral-800/50">
                  <Pulse className="w-3 h-3 text-neutral-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-neutral-300">
                    {current}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                    Ilimitado
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div className="w-32 flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold text-neutral-300">
                  {current} <span className="text-neutral-600">/ {max}</span>
                </span>
                <span className="text-[9px] font-bold text-neutral-500">
                  {Math.round(percent)}%
                </span>
              </div>
              <div className="h-1 w-full bg-white/3 rounded-full overflow-hidden border border-white/2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  className={`h-full rounded-full ${percent > 90 ? "bg-amber-500" : "bg-blue-500/80"}`}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "expires_at",
        header: "Vencimiento",
        cell: ({ row }: { row: { original: Coupon } }) => {
          const expiresAt = row.original.expires_at;
          const date =
            typeof expiresAt === "object" && expiresAt !== null
              ? expiresAt.Time
              : expiresAt;
          const isValid =
            !!expiresAt &&
            (typeof expiresAt === "object"
              ? expiresAt.Valid
              : !!date && date !== "0001-01-01T00:00:00Z");

          if (!isValid || !date)
            return (
              <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">
                Sin Límite
              </span>
            );

          const expirationDate = new Date(date);
          const isPast = expirationDate < new Date();
          const distance = formatDistanceToNow(expirationDate, {
            locale: es,
            addSuffix: true,
          });

          return (
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
                  isPast
                    ? "bg-red-500/5 border-red-500/10 text-red-500/50"
                    : "bg-blue-500/5 border-blue-500/10 text-blue-400/60"
                }`}
              >
                <Calendar className="w-3 h-3" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${
                    isPast ? "text-red-400/80" : "text-neutral-200"
                  }`}
                >
                  {isPast ? "Expirado" : distance}
                </span>
                <span className="text-[9px] text-neutral-600 font-bold font-mono">
                  {format(expirationDate, "dd MMM, yyyy • HH:mm", {
                    locale: es,
                  }).toUpperCase()}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }: { row: { original: Coupon } }) => {
          const isActive = row.original.is_active;
          const expiresAt = row.original.expires_at;
          const expiryDate =
            typeof expiresAt === "object" && expiresAt !== null
              ? expiresAt.Time
              : expiresAt;
          const isExpired =
            !!expiresAt &&
            (typeof expiresAt === "object" ? expiresAt.Valid : true) &&
            expiryDate &&
            expiryDate !== "0001-01-01T00:00:00Z" &&
            new Date(expiryDate as string) < new Date();
          const trulyActive = isActive && !isExpired;
          return (
            <div className="flex items-center">
              <div
                className={`flex items-center gap-2 px-2.5 py-1 rounded-full border shadow-sm transition-all duration-300 ${
                  trulyActive
                    ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                    : isExpired
                      ? "bg-amber-500/5 text-amber-500 border-amber-500/20 shadow-amber-500/5"
                      : "bg-red-500/5 text-red-400 border-red-500/20 shadow-red-500/5"
                }`}
              >
                {trulyActive && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  />
                )}
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {trulyActive ? "Live" : isExpired ? "Expirado" : "Baja"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: Coupon } }) => {
          const isActive = row.original.is_active;
          return (
            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row.original.code);
                }}
                className={`h-8 w-8 rounded-lg hover:bg-red-500/10 transition-colors ${isActive ? "text-neutral-500 hover:text-red-400" : "text-neutral-700 pointer-events-none"}`}
                disabled={!isActive}
                title={isActive ? "Desactivar Cupón" : "Desactivado"}
              >
                <Power className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete],
  );

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col">
      {/* Absolute Minimal Premium Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[0%] -right-[5%] w-[30%] h-[30%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <PageBanner
        title="Cupones"
        subtitle="Control de promociones y redenciones"
        actions={
          <div className="relative flex-1 max-w-md group">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Buscar código..."
              className="bg-black/20 border-white/5 focus:border-blue-500/30 w-full h-9 rounded-lg pl-9 text-xs placeholder:text-neutral-700 transition-all"
            />
          </div>
        }
      />

      <motion.div
        className="relative z-10 flex flex-1 min-h-0 gap-3 overflow-hidden px-3 pb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* MAIN AREA (Left) - Dominant element */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">

          {/* TABLE CONTAINER - Dominant Height/Width */}
          <div className="flex-1 bg-neutral-900/30 border border-white/2 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex-1 overflow-auto custom-scrollbar bento-table-container">
              <DataTable
                columns={columns}
                data={filteredCoupons}
                isLoading={isLoading}
                emptyMessage="No se encontraron cupones"
                emptySubmessage="Ajusta el filtro o crea un nuevo código de descuento."
                totalItems={totalCoupons}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
              />
            </div>
          </div>
        </div>

        {/* PRO SIDEBAR (Right) - High Density Metrics & Actions */}
        <div className="w-80 flex flex-col gap-3 shrink-0">
          {/* PRIMARY ACTION - "PRO" PLACEMENT AT BOTTOM */}
          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm tracking-tight shadow-lg shadow-blue-600/10 border-t border-blue-400/20 flex items-center justify-center gap-2 group shrink-0 transition-all active:scale-[0.98]"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 stroke-3 group-hover:scale-110 transition-transform" />
            <span>Generar Cupón</span>
          </Button>
          {/* STATS STACK - Compact Cards */}

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: Tag,
                color: "text-blue-400",
                bg: "bg-blue-500/5",
                border: "border-blue-500/10",
              },
              {
                label: "Activos",
                value: stats.active,
                icon: Pulse,
                color: "text-emerald-400",
                bg: "bg-emerald-500/5",
                border: "border-emerald-500/10",
              },
              {
                label: "Expirados",
                value: stats.expired,
                icon: Clock,
                color: "text-amber-400",
                bg: "bg-amber-500/5",
                border: "border-amber-500/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-xl bg-neutral-900/60 border border-white/3 flex items-center justify-between group overflow-hidden relative`}
              >
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-white mt-1 leading-none tracking-tighter">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.border}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* GUIDE / SYSTEM STATUS */}
          <div className="flex-1 rounded-xl bg-neutral-900/30 border border-white/2 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Lightning className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Guía Rápida
              </span>
            </div>

            <div className="space-y-4 text-[11px] text-neutral-500 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 mt-1 shrink-0" />
                <p>
                  Usa códigos{" "}
                  <strong className="text-neutral-300">UPPERCASE</strong> para
                  mayor claridad en marketing.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1 shrink-0" />
                <p>
                  Las restricciones de uso se validan en tiempo real durante el
                  checkout.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 mt-1 shrink-0" />
                <p>
                  Los cupones expirados se archivan automáticamente pero
                  retienen historial.
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/2">
              <div className="flex items-center justify-between bg-black/40 rounded-lg p-3 border border-white/1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-bold text-neutral-400 uppercase">
                    Motor Sincronizado
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-600">
                  v2.4.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          invalidate();
        }}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
          height: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .bento-table-container table {
          border-collapse: separate;
          border-spacing: 0;
        }
        .bento-table-container tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.015);
          transition: background-color 0.2s;
        }
        .bento-table-container tr:hover {
          background-color: rgba(255, 255, 255, 0.01);
        }
        .bento-table-container td {
          padding-top: 12px;
          padding-bottom: 12px;
        }
      `}</style>
    </div>
  );
};
