"use client";

import React, { useState, useMemo } from "react";
import {
  Monitor,
  Cpu,
  HardDrive,
  Users,
  CreditCard,
  Calendar,
  Check,
  Clock,
  X,
  Copy,
  Plus,
  DotsThree,
  MagnifyingGlass,
  Key,
  Shield,
  Eye,
  Trash,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────
// MODELO DE LICENCIAS (CELAEST OBSIDIAN LUXURY STANDARD)
// ─────────────────────────────────────────────────────────────

interface LabLicense {
  id: string;
  licenseKey: string;
  planName: string;
  planCode: string;
  productName: string;
  ownerName: string;
  ownerEmail: string;
  orgId: string;
  status: "active" | "expired" | "revoked" | "suspended";
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  activeActivations: number;
  maxActivations: number;
  storageUsedGb: number;
  billingCycle: "monthly" | "annual" | "lifetime";
  nextBillingDate?: string;
  expiresAt?: string;
  createdAt: string;
}

const SAMPLE_LICENSES: LabLicense[] = [
  {
    id: "lic_8910a",
    licenseKey: "CELAEST-ENT-9081-K9X2",
    planName: "Enterprise Mesh Cluster",
    planCode: "ENT-MAX",
    productName: "Core AI Mesh Cluster GPU",
    ownerName: "Cyberdyne Systems",
    ownerEmail: "ops@cyberdyne.ai",
    orgId: "org-cyd-902",
    status: "active",
    aiRequestsUsed: 4230,
    aiRequestsLimit: 10000,
    activeActivations: 4,
    maxActivations: 10,
    storageUsedGb: 14.8,
    billingCycle: "annual",
    nextBillingDate: "15 Nov 2026",
    expiresAt: "15 Nov 2027",
    createdAt: "15 Nov 2025",
  },
  {
    id: "lic_8911b",
    licenseKey: "CELAEST-PRO-4421-M8Y1",
    planName: "Pro Multi-Agent Routing",
    planCode: "PRO",
    productName: "WhatsApp Multi-Agent Engine",
    ownerName: "Vanguard Capital",
    ownerEmail: "billing@vanguard-cap.io",
    orgId: "org-van-401",
    status: "active",
    aiRequestsUsed: 890,
    aiRequestsLimit: 2500,
    activeActivations: 2,
    maxActivations: 5,
    storageUsedGb: 4.2,
    billingCycle: "monthly",
    nextBillingDate: "28 Oct 2026",
    expiresAt: "28 Oct 2026",
    createdAt: "28 Sep 2026",
  },
  {
    id: "lic_8912c",
    licenseKey: "CELAEST-ENG-2290-P3Q7",
    planName: "English Engine Standard",
    planCode: "ENG-STD",
    productName: "English Learning Engine v4",
    ownerName: "Kurogane Logistics",
    ownerEmail: "accounts@kurogane.jp",
    orgId: "org-kur-109",
    status: "active",
    aiRequestsUsed: 120,
    aiRequestsLimit: 1000,
    activeActivations: 1,
    maxActivations: 3,
    storageUsedGb: 1.1,
    billingCycle: "lifetime",
    nextBillingDate: undefined,
    expiresAt: undefined,
    createdAt: "10 Ago 2026",
  },
  {
    id: "lic_8913d",
    licenseKey: "CELAEST-DEV-7712-B4V9",
    planName: "Developer Sandbox Tier",
    planCode: "DEV",
    productName: "Lexicon Curation Studio",
    ownerName: "Helios Quantum Labs",
    ownerEmail: "finance@helios-labs.de",
    orgId: "org-hel-882",
    status: "expired",
    aiRequestsUsed: 500,
    aiRequestsLimit: 500,
    activeActivations: 0,
    maxActivations: 2,
    storageUsedGb: 0.8,
    billingCycle: "monthly",
    nextBillingDate: "01 Oct 2026",
    expiresAt: "01 Oct 2026",
    createdAt: "01 Sep 2026",
  },
  {
    id: "lic_8914e",
    licenseKey: "CELAEST-STD-3391-Z1W4",
    planName: "Standard Security Shield",
    planCode: "SEC-STD",
    productName: "Zero-Trust Identity Gateway",
    ownerName: "Acme Orbital Satellites",
    ownerEmail: "procurement@acme-space.com",
    orgId: "org-acm-319",
    status: "revoked",
    aiRequestsUsed: 140,
    aiRequestsLimit: 1000,
    activeActivations: 0,
    maxActivations: 5,
    storageUsedGb: 2.5,
    billingCycle: "annual",
    nextBillingDate: "12 May 2026",
    expiresAt: "12 May 2026",
    createdAt: "12 May 2025",
  },
  {
    id: "lic_8915f",
    licenseKey: "CELAEST-PRO-6623-T8L5",
    planName: "Pro Multi-Agent Routing",
    planCode: "PRO",
    productName: "WhatsApp Multi-Agent Engine",
    ownerName: "Nakamoto Fintech AG",
    ownerEmail: "security@nakamoto.ch",
    orgId: "org-nak-714",
    status: "active",
    aiRequestsUsed: 1950,
    aiRequestsLimit: 2500,
    activeActivations: 3,
    maxActivations: 5,
    storageUsedGb: 6.9,
    billingCycle: "annual",
    nextBillingDate: "20 Dec 2026",
    expiresAt: "20 Dec 2027",
    createdAt: "20 Dec 2025",
  },
];

export function LicensingStudioShowcase() {
  const [activeTab, setActiveTab] = useState<"licenses" | "collisions" | "analytics">("licenses");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered dataset
  const filteredLicenses = useMemo(() => {
    return SAMPLE_LICENSES.filter((lic) => {
      if (statusFilter !== "all" && lic.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKey = lic.licenseKey.toLowerCase().includes(q);
        const matchPlan = lic.planName.toLowerCase().includes(q);
        const matchOwner = lic.ownerName.toLowerCase().includes(q);
        const matchEmail = lic.ownerEmail.toLowerCase().includes(q);
        if (!matchKey && !matchPlan && !matchOwner && !matchEmail) return false;
      }
      return true;
    });
  }, [statusFilter, searchQuery]);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Clave copiada al portapapeles", {
      description: key,
    });
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLicenses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLicenses.map((l) => l.id)));
    }
  };

  // Render Status Badge with Obsidian Luminance Tokens (no colored neon halos)
  const renderStatus = (status: LabLicense["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.08] text-white border border-white/10 font-semibold shadow-xs">
            <Check size={10} strokeWidth={3} className="text-white/80" />
            Activa
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-white/60 border border-white/[0.06] font-medium">
            <Clock size={10} className="text-white/40" />
            Expirada
          </span>
        );
      case "revoked":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-300 border border-red-500/20 font-medium">
            <X size={10} strokeWidth={3} className="text-red-400" />
            Revocada
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.03] text-white/50 border border-white/[0.05] font-medium">
            <Clock size={10} className="text-white/40" />
            Suspendida
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 text-white">
      {/* ── HEADER DE LUJO ULTRA-COMPACTO (SPACE-SAVING CELAEST STANDARD) ── */}
      <header className="rounded-2xl border border-white/8 bg-[#09090b] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Título & Subtítulo en una sola línea compacta */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center shrink-0 text-white/70">
            <Key size={15} />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-100">
              Centro de Licencias
            </h1>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase border-l border-white/10 pl-3 text-white/40">
              Licensing Hub
            </span>
          </div>
        </div>

        {/* Controles de Tab & Acciones */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Segmented Control */}
          <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/6">
            <button
              type="button"
              onClick={() => setActiveTab("licenses")}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "licenses"
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Licencias
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("collisions")}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "collisions"
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <span>Colisiones</span>
              <span className="px-1 py-0.2 rounded bg-white/10 text-[9px] font-mono text-white/60">
                0
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Analíticas
            </button>
          </div>

          {/* Filtro de Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] border border-white/8 text-white/70 hover:text-white outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#09090b]">Todos los Estados</option>
            <option value="active" className="bg-[#09090b]">Activas</option>
            <option value="expired" className="bg-[#09090b]">Expiradas</option>
            <option value="revoked" className="bg-[#09090b]">Revocadas</option>
          </select>

          {/* Botón Nueva Licencia */}
          <button
            type="button"
            onClick={() => toast.info("Abriendo modal para emitir nueva licencia...")}
            className="px-3 py-1 rounded-lg text-[11px] font-semibold tracking-tight bg-white text-zinc-950 hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={13} weight="bold" />
            <span>Nueva Licencia</span>
          </button>
        </div>
      </header>

      {/* ── TOOLBAR DE BÚSQUEDA FLOTANTE (MINIMALISTA) ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <MagnifyingGlass
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Buscar por clave, cliente o plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/8 text-xs text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors font-mono"
          />
        </div>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest tabular-nums">
          {filteredLicenses.length} licencias registradas
        </span>
      </div>

      {/* ── TABLA DE LICENCIAS (OBSIDIAN LUXURY CON HOVER SIDENAV) ── */}
      <div className="rounded-2xl border border-white/8 bg-[#09090b] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/6 bg-white/[0.015]">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredLicenses.length > 0 &&
                      selectedIds.size === filteredLicenses.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-transparent accent-zinc-200 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-white/40">
                  PRODUCTO & PLAN
                </th>
                <th className="py-3 px-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-white/40">
                  PROPIETARIO / CLAVE
                </th>
                <th className="py-3 px-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-white/40">
                  CONSUMO & DISPOSITIVOS
                </th>
                <th className="py-3 px-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-white/40">
                  FACTURACIÓN
                </th>
                <th className="py-3 px-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-white/40">
                  ESTADO
                </th>
                <th className="py-3 px-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-white/40">
                  VIGENCIA
                </th>
                <th className="py-3 px-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-white/40 text-right">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLicenses.map((lic) => {
                const isSelected = selectedIds.has(lic.id);
                const aiPercent = Math.min(
                  100,
                  Math.round((lic.aiRequestsUsed / lic.aiRequestsLimit) * 100)
                );

                return (
                  <tr
                    key={lic.id}
                    onClick={() => toggleSelect(lic.id)}
                    className="group transition-colors duration-150 hover:bg-zinc-800/40 cursor-pointer"
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(lic.id)}
                        className="rounded border-white/20 bg-transparent accent-zinc-200 cursor-pointer"
                      />
                    </td>

                    {/* Producto & Plan */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center shrink-0 text-white/60">
                          <Monitor size={14} />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <span className="text-xs font-medium text-zinc-200 truncate block">
                            {lic.planName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-mono uppercase bg-white/[0.04] border border-white/8 text-white/50 px-1 py-0.2 rounded">
                              {lic.planCode}
                            </span>
                            <span className="text-[10px] font-mono text-white/40 truncate">
                              {lic.productName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Propietario / Clave */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-zinc-200">
                          {lic.ownerName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-white/50">
                            {lic.licenseKey}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyKey(lic.licenseKey);
                            }}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer"
                            title="Copiar Clave"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Consumo & Dispositivos */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1.5 max-w-[170px]">
                        {/* Barra de progreso AI */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                          <span className="flex items-center gap-1 text-white/60">
                            <Cpu size={11} /> AI
                          </span>
                          <span className="tabular-nums">
                            {lic.aiRequestsUsed} / {lic.aiRequestsLimit}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/50 rounded-full transition-all"
                            style={{ width: `${aiPercent}%` }}
                          />
                        </div>

                        {/* Dispositivos y Storage */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                          <span className="flex items-center gap-1">
                            <Monitor size={11} /> {lic.activeActivations}/{lic.maxActivations} devs
                          </span>
                          <span className="flex items-center gap-1">
                            <HardDrive size={11} /> {lic.storageUsedGb} GB
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Facturación */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono text-white/70 bg-white/[0.03] border border-white/[0.06] w-fit">
                          <CreditCard size={12} className="text-white/40" />
                          <span className="capitalize">{lic.billingCycle}</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/40 mt-1">
                          {lic.nextBillingDate ? `Renueva: ${lic.nextBillingDate}` : "Acceso Vitalicio"}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4">
                      {renderStatus(lic.status)}
                    </td>

                    {/* Vigencia */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/70">
                        <Calendar size={12} className="text-white/40" />
                        <span>{lic.expiresAt || "Permanente"}</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toast.info(`Detalles de ${lic.licenseKey}`)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Ver Detalle"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info(`Menú de opciones para ${lic.licenseKey}`)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Más Opciones"
                        >
                          <DotsThree size={15} weight="bold" />
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
