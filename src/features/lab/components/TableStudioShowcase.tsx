"use client";

import React, { useState } from "react";
import {
  Package,
  CreditCard,
  Money,
  Check,
  Clock,
  ArrowCounterClockwise,
  X,
  DotsThree,
  DownloadSimple,
  Eye,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────
// MODELO EXACTO DE LA TABLA DE ÓRDENES
// ─────────────────────────────────────────────────────────────

interface LabOrder {
  id: string;
  displayId: string;
  product: string;
  itemType?: string;
  customer: string;
  userEmail: string;
  date: string;
  status: "Completed" | "Processing" | "Pending" | "Refunded" | "Failed";
  amount: string;
  paymentMethod: string;
  paymentProvider: string;
}

const SAMPLE_ORDERS: LabOrder[] = [
  {
    id: "ord_9901a8f",
    displayId: "ORD-2026-9081",
    product: "WhatsApp Multi-Agent Routing",
    itemType: "Licencia Anual",
    customer: "Vanguard Capital",
    userEmail: "billing@vanguard-cap.io",
    date: "07 Oct 2026, 16:42",
    status: "Completed",
    amount: "$14,500.00 USD",
    paymentMethod: "wire",
    paymentProvider: "Wire Transfer",
  },
  {
    id: "ord_9902b7c",
    displayId: "ORD-2026-9082",
    product: "Core AI Mesh Cluster GPU",
    itemType: "Suscripción",
    customer: "Cyberdyne Systems",
    userEmail: "ops@cyberdyne.ai",
    date: "07 Oct 2026, 16:35",
    status: "Completed",
    amount: "$3,200.00 USD",
    paymentMethod: "card",
    paymentProvider: "Visa •• 4242",
  },
  {
    id: "ord_9903c6d",
    displayId: "ORD-2026-9083",
    product: "English Learning Engine v4",
    itemType: "Asset Marketplace",
    customer: "Kurogane Logistics",
    userEmail: "accounts@kurogane.jp",
    date: "07 Oct 2026, 16:21",
    status: "Processing",
    amount: "$8,750.50 USD",
    paymentMethod: "card",
    paymentProvider: "Mastercard •• 8821",
  },
  {
    id: "ord_9904d5e",
    displayId: "ORD-2026-9084",
    product: "Lexicon Curation Studio",
    itemType: "Asset Marketplace",
    customer: "Helios Quantum Labs",
    userEmail: "finance@helios-labs.de",
    date: "07 Oct 2026, 15:58",
    status: "Refunded",
    amount: "$540.00 USD",
    paymentMethod: "apple_pay",
    paymentProvider: "Apple Pay",
  },
  {
    id: "ord_9905e4f",
    displayId: "ORD-2026-9085",
    product: "Enterprise Plan - Unlimited",
    itemType: "Licencia Anual",
    customer: "Acme Orbital Satellites",
    userEmail: "procurement@acme-space.com",
    date: "07 Oct 2026, 15:30",
    status: "Completed",
    amount: "$22,000.00 USD",
    paymentMethod: "wire",
    paymentProvider: "Wire Transfer",
  },
  {
    id: "ord_9906f3a",
    displayId: "ORD-2026-9086",
    product: "Telemetry Ingestion Node",
    itemType: "Paquete API",
    customer: "Sentry Core Networks",
    userEmail: "billing@sentrycore.net",
    date: "07 Oct 2026, 14:12",
    status: "Failed",
    amount: "$1,190.00 USD",
    paymentMethod: "card",
    paymentProvider: "Visa •• 4242",
  },
];

export function TableStudioShowcase() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const filteredOrders = SAMPLE_ORDERS.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      order.displayId.toLowerCase().includes(q) ||
      order.product.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      order.userEmail.toLowerCase().includes(q)
    );
  });

  // Status badge limpio: luminancia pura, cero neón cian ni anillos de color
  const renderStatus = (status: LabOrder["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-white/[0.08] text-white border border-white/10 shadow-xs">
            <Check size={10} strokeWidth={3} className="text-white/80" />
            <span>Completada</span>
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-medium bg-white/[0.04] text-white/70 border border-white/[0.06]">
            <Clock size={10} className="text-white/60 animate-spin" />
            <span>En Proceso</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-medium bg-white/[0.03] text-white/50 border border-white/[0.05]">
            <Clock size={10} className="text-white/40" />
            <span>Pendiente</span>
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-medium bg-white/[0.04] text-white/60 border border-white/[0.06]">
            <ArrowCounterClockwise size={10} className="text-white/60" />
            <span>Reembolsada</span>
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-medium bg-red-500/10 text-red-300 border border-red-500/20">
            <X size={10} strokeWidth={3} className="text-red-400" />
            <span>Fallida</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      {/* ── Barra Superior Simple ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por orden, cliente, producto..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#0c0c0e] border border-white/8 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
          />
        </div>

        {/* Filtros de Estado */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "all", label: "Todas" },
            { id: "Completed", label: "Completadas" },
            { id: "Processing", label: "En Proceso" },
            { id: "Refunded", label: "Reembolsadas" },
            { id: "Failed", label: "Fallidas" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                statusFilter === f.id
                  ? "bg-zinc-800/50 border-white/10 text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-white/8"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TABLA DE ÓRDENES (OBSIDIAN LUXURY CON HOVER SIDENAV) ── */}
      <div className="w-full rounded-2xl bg-[#09090b] border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/6 bg-white/[0.015]">
                <th className="w-10 py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedIds.size === filteredOrders.length
                    }
                    onChange={selectAll}
                    className="rounded border-white/20 bg-transparent accent-zinc-200 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 font-semibold">
                  Orden
                </th>
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 font-semibold">
                  Producto
                </th>
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 font-semibold">
                  Cliente
                </th>
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 font-semibold">
                  Método
                </th>
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 font-semibold">
                  Estado
                </th>
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 font-semibold text-right">
                  Monto
                </th>
                <th className="w-16 py-3 px-4 text-right"></th>
              </tr>
            </thead>

            {/* Filas */}
            <tbody className="divide-y divide-white/[0.04]">
              {filteredOrders.map((order) => {
                const isSelected = selectedIds.has(order.id);

                return (
                  <tr
                    key={order.id}
                    onClick={() => toggleSelect(order.id)}
                    className={`
                      group transition-colors duration-150 cursor-pointer border-l-2
                      ${
                        isSelected
                          ? "bg-zinc-800/40 border-l-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          : "border-l-transparent hover:bg-zinc-800/40 hover:border-l-white/20"
                      }
                    `}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-white/20 bg-transparent accent-zinc-200 cursor-pointer"
                      />
                    </td>

                    {/* Orden */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-zinc-100 group-hover:text-white transition-colors">
                        {order.displayId}
                      </span>
                    </td>

                    {/* Producto */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center shrink-0 text-white/60">
                          <Package size={14} />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <span className="text-xs font-medium text-zinc-200 truncate block">
                            {order.product}
                          </span>
                          {order.itemType && (
                            <span className="text-[10px] font-mono text-white/40 uppercase">
                              {order.itemType}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cliente & Fecha */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-zinc-200">
                          {order.customer}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {order.date}
                        </span>
                      </div>
                    </td>

                    {/* Método de Pago */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono text-white/70 bg-white/[0.03] border border-white/[0.06]">
                        {order.paymentMethod === "card" ? (
                          <CreditCard size={12} className="text-white/40" />
                        ) : (
                          <Money size={12} className="text-white/40" />
                        )}
                        <span>{order.paymentProvider}</span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4">
                      {renderStatus(order.status)}
                    </td>

                    {/* Monto */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">
                        {order.amount}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toast.success(`Descargando factura de ${order.displayId}...`)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Descargar Factura"
                        >
                          <DownloadSimple size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info(`Abriendo orden ${order.displayId}`)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Ver Detalle"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
