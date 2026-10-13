"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowsClockwise,
  CheckCircle,
  DownloadSimple,
  MagnifyingGlass,
  ShieldCheck,
  Warning,
  Copy,
  Clock,
  Sparkle,
  ArrowRight,
  Package,
  Cpu,
  TerminalWindow,
  GitBranch,
  Shield,
  Tag,
  SlidersHorizontal,
  ArrowCounterClockwise,
  Check,
  CaretRight,
  CaretDown,
  Database,
  FileCode,
  HardDrive,
  Desktop,
  SquaresFour,
  List,
  GitCommit,
  ShareNetwork,
  Lightning,
  Archive,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// ─────────────────────────────────────────────────────────────
// MODELO DE DATOS DE RELEASES & UPDATES (ENTERPRISE LUXURY)
// ─────────────────────────────────────────────────────────────

export interface LabReleaseAsset {
  id: string;
  name: string;
  slug: string;
  currentVersion: string;
  latestVersion: string;
  channel: "lts" | "beta" | "nightly";
  severity: "security" | "feature" | "patch";
  hasUpdate: boolean;
  releaseDate: string;
  packageSize: string;
  checksum: string;
  signatureGpg: string;
  compatibility: string[];
  requiresDbMigration: boolean;
  previousVersion: string;
  changelog: {
    features: string[];
    fixes: string[];
    security: string[];
    breaking: string[];
  };
}

const SAMPLE_RELEASE_ASSETS: LabReleaseAsset[] = [
  {
    id: "rel-mesh-01",
    name: "CELAEST AI Mesh Cluster GPU",
    slug: "celaest-mesh-cluster",
    currentVersion: "2.4.1",
    latestVersion: "2.5.0",
    channel: "lts",
    severity: "security",
    hasUpdate: true,
    releaseDate: "07 Oct 2026",
    packageSize: "142.8 MB",
    checksum: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    signatureGpg: "gpg:key-ed25519-89B4C2-VERIFIED",
    compatibility: ["Linux x86_64", "CUDA 12.4", "Docker Engine 27+"],
    requiresDbMigration: true,
    previousVersion: "2.4.0",
    changelog: {
      features: [
        "Inferencia distribuida con fallback dinámico entre nodos GPU H100",
        "Soporte nativo para tensores cuantizados FP8 con aceleración SIMD",
      ],
      fixes: [
        "Corrección de fuga de memoria en buffers de streaming WebSockets",
        "Manejo robusto de reconexión tras fallo transitorio en gRPC pool",
      ],
      security: [
        "Mitigación CVE-2026-8911: Validación estricta de headers JWT en ingress",
        "Cifrado obligatorio TLS 1.3 en todos los sockets inter-nodo",
      ],
      breaking: [
        "El puerto predeterminado del agente de telemetría cambió de 9090 a 9095",
      ],
    },
  },
  {
    id: "rel-eng-02",
    name: "English Learning Engine v4",
    slug: "english-engine",
    currentVersion: "4.1.0",
    latestVersion: "4.2.0",
    channel: "lts",
    severity: "feature",
    hasUpdate: true,
    releaseDate: "05 Oct 2026",
    packageSize: "89.4 MB",
    checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    signatureGpg: "gpg:key-rsa4096-77F12A-VERIFIED",
    compatibility: ["Go 1.24", "Node 22", "PostgreSQL 16+"],
    requiresDbMigration: false,
    previousVersion: "4.0.8",
    changelog: {
      features: [
        "Generador procedimental de historias con invariancia multi-dominio estricta",
        "Fonética IPA universal sin taxonomías cerradas de palabras",
      ],
      fixes: [
        "Sincronización milimétrica entre chunks de audio TTS y subtítulos",
        "Reducción de latencia en la evaluación fonológica de 320ms a 110ms",
      ],
      security: [
        "Filtro estricto anti-inyección en campos de prompt contextual",
      ],
      breaking: [],
    },
  },
  {
    id: "rel-wa-03",
    name: "WhatsApp Multi-Agent Engine",
    slug: "whatsapp-multiagent",
    currentVersion: "3.0.2",
    latestVersion: "3.0.2",
    channel: "lts",
    severity: "patch",
    hasUpdate: false,
    releaseDate: "28 Sep 2026",
    packageSize: "54.1 MB",
    checksum: "sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    signatureGpg: "gpg:key-ed25519-A331E9-VERIFIED",
    compatibility: ["Node 20+", "Redis 7.2", "Docker Engine"],
    requiresDbMigration: false,
    previousVersion: "3.0.1",
    changelog: {
      features: [
        "Enrutamiento inteligente por intención semántica y cola de agentes humanos",
      ],
      fixes: [
        "Normalización de caracteres Unicode en mensajes entrantes multimedia",
      ],
      security: [
        "Renovación automatizada de tokens OAuth con rotación cada 12h",
      ],
      breaking: [],
    },
  },
  {
    id: "rel-sec-04",
    name: "Zero-Trust Identity Gateway",
    slug: "identity-gateway",
    currentVersion: "1.8.4",
    latestVersion: "1.9.0",
    channel: "beta",
    severity: "security",
    hasUpdate: true,
    releaseDate: "06 Oct 2026",
    packageSize: "36.2 MB",
    checksum: "sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589",
    signatureGpg: "gpg:key-ed25519-55C901-VERIFIED",
    compatibility: ["Linux x86_64", "ARM64", "Cloudflare Workers"],
    requiresDbMigration: false,
    previousVersion: "1.8.3",
    changelog: {
      features: [
        "Soporte para passkeys WebAuthn / FIDO2 con enclave de hardware",
        "Inspección heurística de tokens con revocación en tiempo real (<5ms)",
      ],
      fixes: [
        "Sanitización en cabeceras de autorización con formato irregular",
      ],
      security: [
        "Actualización del cifrador AES-GCM 256 con protección contra ataques de canal lateral",
      ],
      breaking: [
        "Se depreca el soporte para tokens firmados con algoritmo HS256 sin rotación",
      ],
    },
  },
  {
    id: "rel-lex-05",
    name: "Lexicon Curation Studio",
    slug: "lexicon-curation",
    currentVersion: "2.1.0",
    latestVersion: "2.1.0",
    channel: "lts",
    severity: "patch",
    hasUpdate: false,
    releaseDate: "15 Sep 2026",
    packageSize: "41.0 MB",
    checksum: "sha256:d54b359f13110e3a479ff7038e93df12f1f4229fd9d68ec0b5220c82270c1598",
    signatureGpg: "gpg:key-rsa4096-992B1C-VERIFIED",
    compatibility: ["Web Browser", "Next.js 15", "PostgreSQL"],
    requiresDbMigration: false,
    previousVersion: "2.0.9",
    changelog: {
      features: [
        "Algoritmo de validación fonotáctica con 80 tokens estructurales funcionales",
      ],
      fixes: [
        "Corrección de debounce en el buscador léxico de alta frecuencia",
      ],
      security: [],
      breaking: [],
    },
  },
];

export function ReleaseStudioShowcase() {
  const [archetype, setArchetype] = useState<
    "executive" | "bento" | "chrono" | "canary" | "diff_inspector" | "vault"
  >("chrono");
  const [canaryRing, setCanaryRing] = useState<0 | 1 | 2 | 3>(1);
  const [verificationInput, setVerificationInput] = useState("");
  const [diffViewMode, setDiffViewMode] = useState<"api" | "cve" | "cli">("api");
  const [selectedVaultTab, setSelectedVaultTab] = useState<"binaries" | "containers" | "manifests">("binaries");
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<"all" | "lts" | "beta" | "nightly">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "updates" | "uptodate">("all");
  const [selectedAssetId, setSelectedAssetId] = useState<string>(SAMPLE_RELEASE_ASSETS[0].id);
  const [assets, setAssets] = useState<LabReleaseAsset[]>(SAMPLE_RELEASE_ASSETS);
  const [expandedChangelogs, setExpandedChangelogs] = useState<Set<string>>(new Set([SAMPLE_RELEASE_ASSETS[0].id]));

  // Métricas de estado
  const updateCount = useMemo(() => assets.filter((a) => a.hasUpdate).length, [assets]);
  const securityUpdatesCount = useMemo(
    () => assets.filter((a) => a.hasUpdate && a.severity === "security").length,
    [assets],
  );

  // Filtrado reactivo
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (channelFilter !== "all" && asset.channel !== channelFilter) return false;
      if (statusFilter === "updates" && !asset.hasUpdate) return false;
      if (statusFilter === "uptodate" && asset.hasUpdate) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = asset.name.toLowerCase().includes(q);
        const matchVer = asset.latestVersion.toLowerCase().includes(q);
        const matchCompat = asset.compatibility.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchVer && !matchCompat) return false;
      }
      return true;
    });
  }, [assets, channelFilter, statusFilter, searchQuery]);

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) || filteredAssets[0] || assets[0],
    [assets, selectedAssetId, filteredAssets],
  );

  // Acciones simuladas con Sonner
  const handleCopyChecksum = (checksum: string) => {
    navigator.clipboard.writeText(checksum);
    toast.success("SHA-256 copiado al portapapeles", {
      description: checksum,
    });
  };

  const handleCopyCli = (asset: LabReleaseAsset) => {
    const cmd = `celaest fleet deploy --target ${asset.slug} --release v${asset.latestVersion} --verify-gpg`;
    navigator.clipboard.writeText(cmd);
    toast.success("Comando CLI copiado al portapapeles", {
      description: cmd,
    });
  };

  const handleUpdateSingle = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, currentVersion: a.latestVersion, hasUpdate: false } : a)),
    );
    toast.success(`Actualización v${asset.latestVersion} aplicada con éxito`, {
      description: `${asset.name} ahora está en su versión más reciente.`,
    });
  };

  const handleSkipSingle = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;
    setAssets((prev) => prev.map((a) => (a.id === assetId ? { ...a, hasUpdate: false } : a)));
    toast.info(`Versión v${asset.latestVersion} pospuesta`, {
      description: `Se mantendrá v${asset.currentVersion} hasta el próximo ciclo.`,
    });
  };

  const handleRollback = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              currentVersion: a.previousVersion,
              latestVersion: a.latestVersion,
              hasUpdate: true,
            }
          : a,
      ),
    );
    toast.warning(`Rollback ejecutado a v${asset.previousVersion}`, {
      description: `Se restauró el binario anterior para ${asset.name}.`,
    });
  };

  const handleUpdateAll = () => {
    setAssets((prev) => prev.map((a) => ({ ...a, currentVersion: a.latestVersion, hasUpdate: false })));
    toast.success("Toda la flota fue sincronizada y actualizada", {
      description: "Todos los paquetes y binarios están en la versión más reciente.",
    });
  };

  const handlePromoteCanary = () => {
    if (canaryRing < 3) {
      const nextRing = (canaryRing + 1) as 0 | 1 | 2 | 3;
      setCanaryRing(nextRing);
      toast.success(`Despliegue promovido al Anillo ${nextRing}`, {
        description: `Tráfico asignado ampliado al ${[5, 25, 50, 100][nextRing]}% de la flota.`,
      });
    } else {
      toast.info("La flota ya se encuentra al 100% en Producción Global.");
    }
  };

  const handleAbortCanary = () => {
    setCanaryRing(0);
    toast.error("Rollback de emergencia activado", {
      description: "El tráfico canario ha sido redirigido al 100% a la versión estable previa.",
    });
  };

  const toggleChangelog = (id: string) => {
    setExpandedChangelogs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER DEL ESTUDIO EN LABS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#080c14]/90 border border-white/8 backdrop-blur-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white shrink-0">
            <ArrowsClockwise size={20} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Release & Update Studio
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                100% Use-Case Gate
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              6 Arquetipos de Gobernanza de Versiones • Cero AI Slop • Pure Obsidian Standards
            </p>
          </div>
        </div>

        {/* Switcher de Arquetipos */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/8 shrink-0">
          <button
            type="button"
            onClick={() => setArchetype("executive")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              archetype === "executive"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Desktop size={13} weight="bold" />
            <span>1. Chrono Executive</span>
          </button>
          <button
            type="button"
            onClick={() => setArchetype("bento")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              archetype === "bento"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-white/50 hover:text-white"
            }`}
          >
            <SquaresFour size={13} weight="bold" />
            <span>2. Chrono Bento</span>
          </button>
          <button
            type="button"
            onClick={() => setArchetype("chrono")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              archetype === "chrono"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-white/50 hover:text-white"
            }`}
          >
            <GitCommit size={13} weight="bold" />
            <span>3. Chrono Stream ★</span>
          </button>
          <button
            type="button"
            onClick={() => setArchetype("canary")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              archetype === "canary"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-white/50 hover:text-white"
            }`}
          >
            <ShareNetwork size={13} weight="bold" />
            <span>4. Chrono Canary</span>
          </button>
          <button
            type="button"
            onClick={() => setArchetype("diff_inspector")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              archetype === "diff_inspector"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-white/50 hover:text-white"
            }`}
          >
            <FileCode size={13} weight="bold" />
            <span>5. Chrono Delta</span>
          </button>
          <button
            type="button"
            onClick={() => setArchetype("vault")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              archetype === "vault"
                ? "bg-white text-black font-semibold shadow-xs"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Archive size={13} weight="bold" />
            <span>6. Chrono Provenance</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HUD DE TELEMETRÍA GLOBAL (COMÚN Y CONSISTENTE)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#080c14]/70 border border-white/6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Paquetes Totales</span>
            <Package size={15} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">{assets.length}</span>
            <span className="text-[10px] font-mono text-white/40">flota activa</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080c14]/70 border border-white/6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Actualizaciones Disponibles</span>
            <ArrowsClockwise size={15} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">{updateCount}</span>
            <span className="text-[10px] font-mono text-white/40">deltas pendientes</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080c14]/70 border border-white/6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Parches de Seguridad</span>
            <ShieldCheck size={15} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">{securityUpdatesCount}</span>
            <span className="text-[10px] font-mono text-white/40">críticos</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080c14]/70 border border-white/6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Integridad Criptográfica</span>
            <Shield size={15} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">100%</span>
            <span className="text-[10px] font-mono text-white/40">GPG firmado</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. BARRA DE CONTROL MULTIDIMENSIONAL
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#080c14]/60 border border-white/6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filters */}
          <div className="inline-flex p-0.5 rounded-lg border border-white/8 bg-black/40">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === "all" ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:text-white"
              }`}
            >
              Todos ({assets.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("updates")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === "updates" ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:text-white"
              }`}
            >
              Con Update ({updateCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("uptodate")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === "uptodate" ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:text-white"
              }`}
            >
              Al Día ({assets.length - updateCount})
            </button>
          </div>

          {/* Channel Filters */}
          <div className="inline-flex p-0.5 rounded-lg border border-white/8 bg-black/40">
            {(["all", "lts", "beta", "nightly"] as const).map((chan) => (
              <button
                key={chan}
                type="button"
                onClick={() => setChannelFilter(chan)}
                className={`px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  channelFilter === chan ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:text-white"
                }`}
              >
                {chan === "all" ? "Canales: Todos" : chan.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <MagnifyingGlass
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30"
            />
            <input
              type="text"
              placeholder="Buscar activo, versión o hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2.5 py-1 rounded-lg text-[11px] font-mono border border-white/8 bg-white/[0.03] text-white placeholder-white/30 focus:border-white/20 outline-none"
            />
          </div>

          {/* Bulk Update All */}
          {updateCount > 0 && (
            <button
              type="button"
              onClick={handleUpdateAll}
              className="px-3 py-1 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <ArrowsClockwise size={13} weight="bold" />
              <span>Sincronizar Flota ({updateCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. RENDER DE ARQUETIPOS EN LÍNEA TEMPORAL (CHRONO LINEAGE)
      ───────────────────────────────────────────────────────────── */}

      {/* ARQUETIPO 1: CHRONO EXECUTIVE STREAM (LÍNEA TEMPORAL EJECUTIVA CON ANÁLISIS DE RIESGO & BLAST RADIUS) */}
      {archetype === "executive" && (
        <div className="rounded-2xl bg-[#080c14]/80 border border-white/8 backdrop-blur-2xl p-5 sm:p-6">
          {/* Header del Chrono Executive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/8 mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                  Executive Chrono Stream
                </span>
                <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-white/40">
                  Zero-Downtime Governance
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Línea Temporal Ejecutiva & Matriz de Riesgo Operativo
              </h3>
              <p className="text-xs font-mono text-white/40 mt-0.5">
                Trazabilidad de cambios con auditoría de radio de explosión, SLA de resiliencia y ventanas de rollback
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-white/60">
                {filteredAssets.length} Hitos en Pipeline
              </span>
            </div>
          </div>

          {/* Riel Vertical de Línea Temporal Ejecutiva */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {filteredAssets.map((asset) => {
              const isCriticalSec = asset.severity === "security" && asset.hasUpdate;
              return (
                <div key={asset.id} className="relative">
                  {/* Nodo ancla en el riel */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                      isCriticalSec
                        ? "bg-rose-500/20 border-rose-500 text-rose-300"
                        : asset.hasUpdate
                          ? "bg-white border-white text-black"
                          : "bg-[#080c14] border-white/30 text-white/50"
                    }`}
                  >
                    {isCriticalSec ? (
                      <Shield size={12} weight="bold" />
                    ) : asset.hasUpdate ? (
                      <GitCommit size={12} weight="bold" />
                    ) : (
                      <Check size={11} weight="bold" />
                    )}
                  </div>

                  {/* Tarjeta Ejecutiva del Hito */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-all space-y-4">
                    {/* Fila Superior: Título, Versiones, Canal y Acciones */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{asset.name}</span>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[10px] font-mono">
                            <span className="text-white/40">v{asset.currentVersion}</span>
                            <ArrowRight size={10} className="text-white/40" />
                            <span className="text-white font-bold">v{asset.latestVersion}</span>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 border border-white/5 text-white/50">
                            Canal: {asset.channel.toUpperCase()}
                          </span>
                          {isCriticalSec && (
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/10 text-rose-300">
                              Mitigación CVE Crítica
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-white/40 mt-1">
                          Emitido el {asset.releaseDate} • Binario {asset.packageSize} • Firma: {asset.signatureGpg}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {asset.hasUpdate ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateSingle(asset.id)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <DownloadSimple size={13} weight="bold" />
                              <span>Aprobar v{asset.latestVersion}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSkipSingle(asset.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider border border-white/8 bg-white/[0.02] hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors cursor-pointer"
                            >
                              Posponer
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-white/40 flex items-center gap-1.5">
                              <Check size={11} className="text-white/60" />
                              <span>Sincronizado</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRollback(asset.id)}
                              className="px-2 py-1 rounded text-[10px] font-mono text-white/40 hover:text-white border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer flex items-center gap-1"
                              title="Revertir a versión previa"
                            >
                              <ArrowCounterClockwise size={11} />
                              <span>Rollback</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Matriz Ejecutiva de Riesgo & Blast Radius */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-white/6 font-mono text-[10px]">
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block mb-0.5">Radio de Explosión</span>
                        <span className="text-white font-medium truncate block">Aislado a {asset.slug}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block mb-0.5">Downtime Estimado</span>
                        <span className="text-emerald-400 font-medium block">0s (Hot-Reload Lock-Free)</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block mb-0.5">Reversibilidad</span>
                        <span className="text-white font-medium block">Rollback a v{asset.previousVersion} en &lt;2s</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block mb-0.5">Migración de Esquema</span>
                        <span
                          className={
                            asset.requiresDbMigration ? "text-amber-300 font-medium block" : "text-emerald-400 font-medium block"
                          }
                        >
                          {asset.requiresDbMigration ? "Requiere SQL ($1)" : "Sin Cambios de BD"}
                        </span>
                      </div>
                    </div>

                    {/* Desglose de Cambios de la Versión */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/6 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block mb-1">
                          Nuevas Capacidades (+{asset.changelog.features.length}):
                        </span>
                        <ul className="space-y-1 text-white/70 text-[11px]">
                          {asset.changelog.features.map((f, idx) => (
                            <li key={idx} className="line-clamp-2">
                              • {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block mb-1">
                          Correcciones ({asset.changelog.fixes.length}):
                        </span>
                        <ul className="space-y-1 text-white/70 text-[11px]">
                          {asset.changelog.fixes.map((fx, idx) => (
                            <li key={idx} className="line-clamp-2">
                              • {fx}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block mb-1">Seguridad & Breaking:</span>
                        {asset.changelog.security.length > 0 ? (
                          <ul className="space-y-1 text-rose-300 text-[11px]">
                            {asset.changelog.security.map((sec, idx) => (
                              <li key={idx} className="line-clamp-2">
                                ⚠ {sec}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-white/40 text-[11px] block">0 advertencias de seguridad</span>
                        )}
                      </div>
                    </div>

                    {/* Strip inferior con SHA-256 click-to-copy */}
                    <div className="pt-2 border-t border-white/6 flex flex-wrap items-center justify-between text-[10px] font-mono text-white/40">
                      <div className="flex items-center gap-2">
                        <span>Checksum SHA-256:</span>
                        <button
                          type="button"
                          onClick={() => handleCopyChecksum(asset.checksum)}
                          className="text-white/60 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="truncate max-w-[200px] sm:max-w-xs">{asset.checksum}</span>
                          <Copy size={11} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Entornos:</span>
                        <span className="text-white/60">{asset.compatibility.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ARQUETIPO 2: CHRONO BENTO EPOCH GRID (LÍNEA DE TIEMPO CON BLOQUES MODULARES BENTO POR ÉPOCA) */}
      {archetype === "bento" && (
        <div className="rounded-2xl bg-[#080c14]/80 border border-white/8 backdrop-blur-2xl p-5 sm:p-6">
          {/* Header del Chrono Bento */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/8 mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                  Bento Chrono Lineage
                </span>
                <span className="text-[10px] font-mono text-white/50 bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded">
                  Modular High-Density Epochs
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Línea Temporal Modular Bento & Arquitectura de Versiones
              </h3>
              <p className="text-xs font-mono text-white/40 mt-0.5">
                Cada hito temporal se expande en celdas Bento de alta resolución con telemetría de compilación y firmas
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-white/60">
              Bento Stream v2
            </span>
          </div>

          {/* Riel Vertical de la Línea Temporal Bento */}
          <div className="relative pl-6 sm:pl-8 space-y-10 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="relative">
                {/* Ancla en el riel */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                    asset.hasUpdate
                      ? "bg-white border-white text-black"
                      : "bg-[#080c14] border-white/30 text-white/50"
                  }`}
                >
                  <SquaresFour size={12} weight="bold" />
                </div>

                {/* Contenedor Bento del Hito */}
                <div className="p-5 rounded-2xl bg-[#080c14]/90 border border-white/8 hover:border-white/14 transition-all space-y-4">
                  {/* Barra de Época */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white tracking-tight">{asset.name}</span>
                      <span className="text-[10px] font-mono text-white/40">[{asset.slug}]</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                        Época: {asset.releaseDate}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 border border-white/5 text-white/50">
                        {asset.channel.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Cuadrícula Bento de 3 Bloques */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Celda A: Delta de Versiones y Notas Clave (7 cols) */}
                    <div className="lg:col-span-7 p-4 rounded-xl bg-white/[0.02] border border-white/6 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono uppercase text-white/40">Delta de Versiones</span>
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-white/10 bg-black/40 text-xs font-mono">
                            <span className="text-white/50">v{asset.currentVersion}</span>
                            <ArrowRight size={11} className="text-white/40" />
                            <span className="text-white font-bold">v{asset.latestVersion}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-white/40 block">
                            Capacidades del Hito:
                          </span>
                          <ul className="space-y-1 text-white/70 font-mono text-[11px]">
                            {asset.changelog.features.map((feat, i) => (
                              <li key={i}>• {feat}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[10px] font-mono text-white/40">
                        <span>Peso: {asset.packageSize}</span>
                        <span>Previa: v{asset.previousVersion}</span>
                      </div>
                    </div>

                    {/* Celda B: Enclave Criptográfico y Entornos (5 cols) */}
                    <div className="lg:col-span-5 p-4 rounded-xl bg-white/[0.02] border border-white/6 flex flex-col justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-white/40 block mb-2">
                          Seguridad & Certificación
                        </span>
                        <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-[10px] space-y-1 mb-3">
                          <div className="text-white/40 truncate">Firma: {asset.signatureGpg}</div>
                          <div className="flex items-center justify-between text-white/60">
                            <span className="truncate">Hash: {asset.checksum.slice(0, 20)}...</span>
                            <button
                              type="button"
                              onClick={() => handleCopyChecksum(asset.checksum)}
                              className="text-white/40 hover:text-white transition-colors cursor-pointer ml-1"
                              title="Copiar Checksum"
                            >
                              <Copy size={11} />
                            </button>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                          Compatibilidad Verificada:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {asset.compatibility.map((env, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-mono px-2 py-0.5 rounded border border-white/6 bg-black/40 text-white/60"
                            >
                              {env}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Celda C: Botones de Acción */}
                      <div className="pt-2 border-t border-white/6 flex items-center gap-2">
                        {asset.hasUpdate ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateSingle(asset.id)}
                              className="flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <DownloadSimple size={13} weight="bold" />
                              <span>Instalar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSkipSingle(asset.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider border border-white/8 bg-white/[0.02] hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors cursor-pointer"
                            >
                              Omitir
                            </button>
                          </>
                        ) : (
                          <div className="w-full py-1.5 text-[10px] font-mono tracking-[0.18em] uppercase flex items-center justify-center gap-1.5 text-white/40">
                            <Check size={11} className="text-white/60" />
                            <span>Al Día</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARQUETIPO 3: CHRONO STREAM & FLEET ROLLOUT (TIMELINE TÁCTICO) */}
      {archetype === "chrono" && (
        <div className="rounded-2xl bg-[#080c14]/80 border border-white/8 backdrop-blur-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Línea Temporal de Entregas & Pipeline
              </h3>
              <p className="text-xs font-mono text-white/40">Trazabilidad criptográfica de compilaciones y ramas</p>
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-white/60">
              Chrono Engine v2
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="relative">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                    asset.hasUpdate
                      ? "bg-white border-white text-black"
                      : "bg-[#080c14] border-white/30 text-white/50"
                  }`}
                >
                  <GitCommit size={12} weight="bold" />
                </div>

                {/* Content Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{asset.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white">
                          v{asset.latestVersion}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-white/40">
                          {asset.channel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-white/40 mt-0.5">
                        Build emitido el {asset.releaseDate} • {asset.packageSize}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {asset.hasUpdate ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateSingle(asset.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <DownloadSimple size={13} weight="bold" />
                          <span>Instalar v{asset.latestVersion}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-white/40 flex items-center gap-1.5">
                          <Check size={11} className="text-white/60" />
                          <span>Al Día</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="mt-3 pt-3 border-t border-white/6 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                        Puntos Destacados:
                      </span>
                      <ul className="space-y-1 text-white/70 text-[11px]">
                        {asset.changelog.features.map((f, idx) => (
                          <li key={idx}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                        Compatibilidad Verificada:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {asset.compatibility.map((env, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/8 bg-black/40 text-white/60"
                          >
                            {env}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. ARQUETIPO 4: CHRONO CANARY ROLLOUT STREAM (LÍNEA TEMPORAL DE FASES & ANILLOS)
      ───────────────────────────────────────────────────────────── */}
      {archetype === "canary" && (
        <div className="rounded-2xl bg-[#080c14]/80 border border-white/8 backdrop-blur-2xl p-5 sm:p-6 space-y-6">
          {/* Header del Chrono Canary */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-white/8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                  Canary Chrono Lineage
                </span>
                <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-white/40">
                  SLA 99.998% • Latencia P99 12.4ms
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Línea Temporal de Fases Canario & Propagación Progresiva
              </h3>
              <p className="text-xs font-mono text-white/40 mt-0.5">
                Riel cronológico continuo de promoción estocástica de tráfico, drenado de pods y freno de emergencia
              </p>
            </div>

            {/* Master Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleAbortCanary}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium tracking-wider text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Lightning size={13} weight="bold" />
                <span>Freno de Emergencia</span>
              </button>
              <button
                type="button"
                onClick={handlePromoteCanary}
                disabled={canaryRing === 3}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  canaryRing === 3
                    ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                    : "bg-white text-black hover:bg-zinc-200 border border-white shadow-xs"
                }`}
              >
                <span>Avanzar a Fase {canaryRing < 3 ? canaryRing + 1 : 3}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>

          {/* Riel Vertical de Fases Canario */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {[
              {
                phase: 0,
                timeLabel: "T+00h • Validación Hermética",
                title: "Fase 0: Inyección Sintética & CI/CD",
                traffic: "5% del Tráfico Total",
                scope: "Pods Sintéticos de Ingeniería & Pipelines Automatizados",
                metrics: { p99: "8.2 ms", errors: "0.0000%", rps: "740 req/s", status: "Certificado" },
                nodes: [
                  { id: "pod-synth-iad-01", region: "us-east-va", load: "18% CPU", rtt: "6ms", ver: "v2.5.0-canary" },
                  { id: "pod-synth-fra-01", region: "eu-central-fra", load: "22% CPU", rtt: "12ms", ver: "v2.5.0-canary" },
                ],
              },
              {
                phase: 1,
                timeLabel: "T+12h • Tráfico Real Piloto",
                title: "Fase 1: Early Adopters & Clientes VIP",
                traffic: "25% del Tráfico Total",
                scope: "Tenants de Alta Frecuencia con Monitoreo de Trazas Distribuidas",
                metrics: {
                  p99: "12.4 ms",
                  errors: "0.0018%",
                  rps: "3,820 req/s",
                  status: canaryRing >= 1 ? (canaryRing === 1 ? "En Evaluación" : "Completado") : "En Espera",
                },
                nodes: [
                  {
                    id: "pod-vip-iad-02",
                    region: "us-east-va",
                    load: "34% CPU",
                    rtt: "9ms",
                    ver: canaryRing >= 1 ? "v2.5.0-canary" : "v2.4.1-stable",
                  },
                  {
                    id: "pod-vip-scl-01",
                    region: "sa-east-scl",
                    load: "29% CPU",
                    rtt: "14ms",
                    ver: canaryRing >= 1 ? "v2.5.0-canary" : "v2.4.1-stable",
                  },
                ],
              },
              {
                phase: 2,
                timeLabel: "T+24h • Expansión Transatlántica",
                title: "Fase 2: Clústeres Regionales (US-East & EU-Central)",
                traffic: "50% del Tráfico Total",
                scope: "Particiones Principales con Replicación de BD en Caliente",
                metrics: {
                  p99: "16.1 ms",
                  errors: "0.0021%",
                  rps: "7,450 req/s",
                  status: canaryRing >= 2 ? (canaryRing === 2 ? "En Evaluación" : "Completado") : "En Espera",
                },
                nodes: [
                  {
                    id: "pod-reg-iad-03",
                    region: "us-east-va",
                    load: "41% CPU",
                    rtt: "11ms",
                    ver: canaryRing >= 2 ? "v2.5.0-canary" : "v2.4.1-stable",
                  },
                  {
                    id: "pod-reg-fra-02",
                    region: "eu-central-fra",
                    load: "44% CPU",
                    rtt: "18ms",
                    ver: canaryRing >= 2 ? "v2.5.0-canary" : "v2.4.1-stable",
                  },
                ],
              },
              {
                phase: 3,
                timeLabel: "T+48h • Sellado a Nivel Mundial",
                title: "Fase 3: Producción Global Worldwide",
                traffic: "100% de la Flota Activa",
                scope: "Todos los Centros de Datos • Drenado y Deprecación de Binarios Previos",
                metrics: {
                  p99: "14.2 ms",
                  errors: "0.0016%",
                  rps: "14,820 req/s",
                  status: canaryRing === 3 ? "Desplegado en Producción" : "Pendiente de Promoción",
                },
                nodes: [
                  {
                    id: "pod-glob-sin-01",
                    region: "ap-southeast-sin",
                    load: "28% CPU",
                    rtt: "26ms",
                    ver: canaryRing === 3 ? "v2.5.0-prod" : "v2.4.1-stable",
                  },
                  {
                    id: "pod-glob-nrt-01",
                    region: "ap-northeast-tyo",
                    load: "31% CPU",
                    rtt: "29ms",
                    ver: canaryRing === 3 ? "v2.5.0-prod" : "v2.4.1-stable",
                  },
                ],
              },
            ].map((stage) => {
              const isCurrent = canaryRing === stage.phase;
              const isPassed = canaryRing > stage.phase;
              return (
                <div key={stage.phase} className="relative">
                  {/* Nodo ancla en el riel cronológico */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                      isCurrent
                        ? "bg-white border-white text-black ring-4 ring-white/10"
                        : isPassed
                          ? "bg-white/[0.06] border-white/20 text-white/70"
                          : "bg-[#080c14] border-white/20 text-white/30"
                    }`}
                  >
                    {isPassed ? <Check size={11} weight="bold" /> : <ShareNetwork size={11} weight="bold" />}
                  </div>

                  {/* Tarjeta de Fase Temporal */}
                  <div
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-white/[0.04] border-white/25 shadow-lg"
                        : isPassed
                          ? "bg-white/[0.02] border-white/8 opacity-90"
                          : "bg-black/30 border-white/5 opacity-50"
                    }`}
                  >
                    {/* Encabezado de la fase */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{stage.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white">
                            {stage.traffic}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-white/40 mt-0.5">
                          {stage.timeLabel} • {stage.scope}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded border ${
                          isCurrent
                            ? "bg-white text-black font-semibold border-white"
                            : isPassed
                              ? "bg-white/[0.04] text-white/60 border-white/10"
                              : "bg-white/5 text-white/40 border-white/5"
                        }`}
                      >
                        {stage.metrics.status}
                      </span>
                    </div>

                    {/* Telemetría de la ventana cronológica */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/6 font-mono text-[10px]">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block">Latencia P99</span>
                        <span className="text-white font-bold text-xs mt-0.5 block">{stage.metrics.p99}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block">Tasa 5xx</span>
                        <span className="text-white font-bold text-xs mt-0.5 block">{stage.metrics.errors}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block">Carga Ingress</span>
                        <span className="text-white font-bold text-xs mt-0.5 block">{stage.metrics.rps}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-white/40 uppercase block">Circuit Breaker</span>
                        <span className="text-white font-bold text-xs mt-0.5 block">Sincronizado</span>
                      </div>
                    </div>

                    {/* Muestreo de Pods en esta Fase */}
                    <div className="mt-3 pt-3 border-t border-white/6">
                      <span className="text-[10px] font-mono uppercase text-white/40 block mb-2">
                        Pods Activos en este Anillo Temporal:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
                        {stage.nodes.map((node) => (
                          <div
                            key={node.id}
                            className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between"
                          >
                            <span className="text-white truncate">{node.id}</span>
                            <div className="flex items-center gap-2 text-white/50 shrink-0">
                              <span>{node.ver}</span>
                              <span className="text-emerald-400">{node.rtt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. ARQUETIPO 5: CHRONO DELTA & COMMIT STREAM (LÍNEA TEMPORAL DE COMMITS, DIFFS & AST)
      ───────────────────────────────────────────────────────────── */}
      {archetype === "diff_inspector" && (
        <div className="rounded-2xl bg-[#080c14]/80 border border-white/8 backdrop-blur-2xl p-5 sm:p-6 space-y-6">
          {/* Header del Chrono Delta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                  Git Lineage Chrono Diff
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  Tag: v{selectedAsset.latestVersion} • SHA-1 Lineage
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Línea Temporal de Commits, Diffs de Código & Contratos AST
              </h3>
              <p className="text-xs font-mono text-white/40 mt-0.5">
                Riel cronológico de commits que componen la versión {selectedAsset.name} con diffs inline
              </p>
            </div>

            {/* Selector de servicio */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-white/40 hidden sm:inline">Servicio:</span>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id} className="bg-[#080c14] text-white">
                    {a.name} (v{a.latestVersion})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Riel Vertical de Commits de la Versión */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {[
              {
                sha: "d8a9f24",
                date: "Hoy, 10:45 AM",
                author: "esteban@celaest.com",
                type: "feature",
                message: "feat(mesh): distributed FP8 SIMD tensor quantization and token streaming",
                diff: [
                  "@@ -42,7 +42,9 @@ service InferenceMeshStream @@",
                  "-  uint32 timeout_ms = 2; // DEPRECATED: Unificado en cluster_deadline",
                  "+  uint64 cluster_deadline_epoch_ms = 2; // Strict nanosecond deadline",
                  "+  QuantizationMode quantization = 5; // FP8 / FP16 / INT4 SIMD accelerated",
                  "+  bytes ed25519_client_signature = 6; // Zero-Trust mTLS token",
                ],
                impact: "3 Campos Añadidos • 1 Deprecado • 100% Invariante",
              },
              {
                sha: "c41b892",
                date: "Ayer, 18:20 PM",
                author: "security-auditor@celaest.com",
                type: "security",
                message: "fix(security): sanitize malformed JWT ingress authorization headers (CVE-2026-8911)",
                diff: [
                  "@@ -108,6 +108,9 @@ func ValidateIngressClaims(header string) @@",
                  "-  claims := parseUnchecked(header)",
                  "+  if len(header) > MaxHeaderBytes || !isASCII(header) {",
                  "+      return nil, ErrSecurityMalformedIngressHeader",
                  "+  }",
                  "+  claims, err := parseStrictHMACWithEnclave(header)",
                ],
                impact: "CVSS 8.8 Parcheado • Mitigación de Agotamiento de Sockets",
              },
              {
                sha: "b29e011",
                date: "05 Oct, 14:10 PM",
                author: "devops-infra@celaest.com",
                type: "cli",
                message: "ci(deploy): automated zero-downtime rolling update scripts and Helm chart specs",
                diff: [
                  "@@ -15,4 +15,7 @@ spec.strategy.rollingUpdate @@",
                  "+  maxSurge: 25%",
                  "+  maxUnavailable: 0",
                  "+  timeoutSeconds: 300",
                ],
                impact: "Garantía de Cero Caída en Kubernetes / Docker Swarm",
              },
            ].map((commit) => (
              <div key={commit.sha} className="relative">
                {/* Nodo ancla de commit */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                    commit.type === "security"
                      ? "bg-rose-500/20 border-rose-500 text-rose-300"
                      : "bg-[#080c14] border-white/30 text-white"
                  }`}
                >
                  <FileCode size={11} weight="bold" />
                </div>

                {/* Caja de Detalles del Commit en la Línea de Tiempo */}
                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-black/50 border border-white/10">
                        commit {commit.sha}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">{commit.author}</span>
                      <span className="text-[10px] font-mono text-white/30">• {commit.date}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/8 bg-white/[0.03] text-white/70">
                      {commit.impact}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-white/80">{commit.message}</p>

                  {/* Diff unificado con sintaxis obsidian */}
                  <div className="p-3 rounded-lg bg-black/80 border border-white/6 font-mono text-xs overflow-x-auto space-y-0.5">
                    {commit.diff.map((line, idx) => {
                      const isAdd = line.startsWith("+");
                      const isDel = line.startsWith("-");
                      const isHeader = line.startsWith("@");
                      return (
                        <div
                          key={idx}
                          className={`${
                            isAdd
                              ? "text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded -mx-1"
                              : isDel
                                ? "text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded -mx-1"
                                : isHeader
                                  ? "text-white/40"
                                  : "text-white/70"
                          }`}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </div>

                  {/* Acciones de commit */}
                  <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>Firma PGP: VERIFICADA (Key ID: ED25519-CELAEST)</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`git show ${commit.sha}`);
                        toast.success(`Comando git show ${commit.sha} copiado`);
                      }}
                      className="text-white/50 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Copy size={11} /> Copiar git show
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. ARQUETIPO 6: CHRONO PROVENANCE CHAIN (LÍNEA TEMPORAL DE CUSTODIA CRIPTOGRÁFICA & SLSA)
      ───────────────────────────────────────────────────────────── */}
      {archetype === "vault" && (
        <div className="rounded-2xl bg-[#080c14]/80 border border-white/8 backdrop-blur-2xl p-5 sm:p-6 space-y-6">
          {/* Header del Chrono Provenance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                  SLSA Level 3 Provenance Timeline
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Cadena Inmutable de Custodia
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Línea Temporal de Custodia Criptográfica & Distribución
              </h3>
              <p className="text-xs font-mono text-white/40 mt-0.5">
                Trazabilidad paso a paso desde el compilador hermético hasta la entrega de binarios nativos
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(
                    {
                      spdxVersion: "SPDX-2.3",
                      name: selectedAsset.name,
                      version: selectedAsset.latestVersion,
                      checksum: selectedAsset.checksum,
                      gpg: selectedAsset.signatureGpg,
                      slsaLevel: "3",
                    },
                    null,
                    2,
                  ),
                );
                toast.success("Manifiesto SBOM SPDX-2.3 copiado al portapapeles");
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium tracking-wider text-white bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Archive size={13} weight="bold" />
              <span>Exportar SBOM</span>
            </button>
          </div>

          {/* Verificador de Hash SHA-256 en Vivo */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/8 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Validador de Integridad SHA-256 en Línea de Tiempo
              </span>
              <button
                type="button"
                onClick={() => setVerificationInput(selectedAsset.checksum)}
                className="text-[11px] font-mono text-white/50 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
              >
                [Autocompletar con hash oficial de {selectedAsset.slug}]
              </button>
            </div>

            <input
              type="text"
              placeholder="Pegue aquí el checksum sha256:... para comprobar coincidencia exacta con el enclave"
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />

            {verificationInput && (
              <div
                className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                  verificationInput.trim().toLowerCase() === selectedAsset.checksum.trim().toLowerCase()
                    ? "bg-white/[0.03] border-white/15 text-white"
                    : "bg-white/[0.03] border-white/15 text-white/70"
                }`}
              >
                {verificationInput.trim().toLowerCase() === selectedAsset.checksum.trim().toLowerCase() ? (
                  <>
                    <CheckCircle size={15} weight="bold" className="shrink-0" />
                    <span>INTEGRIDAD VERIFICADA: Coincidencia del 100% con el enclave de compilación CELAEST.</span>
                  </>
                ) : (
                  <>
                    <Warning size={15} weight="bold" className="shrink-0" />
                    <span>DISCREPANCIA: El hash ingresado no corresponde al artefacto oficial v{selectedAsset.latestVersion}.</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Riel Vertical de Custodia Criptográfica (5 Hitos) */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {[
              {
                step: "01",
                title: "Compilación Hermética & Reproducible (SLSA L3)",
                desc: "Construido en contenedor distroless aislado sin acceso a red externa. Los artefactos son 100% deterministas bit a bit.",
                badge: "Enclave Seguro",
                detail: "Digest fuente: git:commit#d8a9f24 • Go 1.24 musl",
              },
              {
                step: "02",
                title: "Firma Digital Criptográfica Ed25519 & Cosign",
                desc: `Certificado OIDC emitido por GitHub Actions Sigstore. Firma privada: ${selectedAsset.signatureGpg}`,
                badge: "Firma Válida",
                detail: `Hash oficial: ${selectedAsset.checksum}`,
              },
              {
                step: "03",
                title: "Atestación en Ledger Público Rekor",
                desc: "Entrada inmutable en el registro de transparencia de la Linux Foundation. Prueba criptográfica de no repudio.",
                badge: "Rekor #89421049",
                detail: "Inmutable • Timestamp sellado por RFC-3161",
              },
              {
                step: "04",
                title: "Generación de Manifiesto SBOM de Seguridad",
                desc: "Auditoría de dependencias CycloneDX 1.5 y SPDX 2.3. Cero vulnerabilidades críticas y 100% licencias compatibles.",
                badge: "0 CVEs • MIT/Apache",
                detail: "Escaneado con Trivy y Semgrep Security Gateway",
              },
              {
                step: "05",
                title: "Bóveda de Binarios Multi-Plataforma Distribuidos",
                desc: "Distribuciones nativas compiladas y listas para despliegue en producción inmediata:",
                badge: "4 Arquitecturas",
                isBinaries: true,
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {/* Nodo ancla de custodia */}
                <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border border-white/30 bg-[#080c14] text-white flex items-center justify-center font-mono text-[9px] font-bold">
                  {step.step}
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-white">{step.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-white/50 leading-relaxed">{step.desc}</p>
                  {step.detail && (
                    <div className="p-2 rounded bg-black/50 border border-white/5 font-mono text-[10px] text-white/70 truncate">
                      {step.detail}
                    </div>
                  )}

                  {/* Binarios descargables en el paso final */}
                  {step.isBinaries && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
                      {[
                        { arch: "Linux x86_64", fmt: "ELF Static musl", size: selectedAsset.packageSize },
                        { arch: "Linux ARM64", fmt: "AWS Graviton / aarch64", size: "136 MB" },
                        { arch: "macOS Silicon", fmt: "Mach-O Arm64 Notarizado", size: "128 MB" },
                        { arch: "Windows x64", fmt: "PE32+ Authenticode EV", size: "148 MB" },
                      ].map((b, i) => (
                        <div key={i} className="p-3 rounded-lg bg-black/60 border border-white/6 flex flex-col justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-white block">{b.arch}</span>
                            <span className="text-[9px] font-mono text-white/40 block">{b.fmt}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toast.success(`Iniciando descarga para ${b.arch}...`)}
                            className="w-full py-1.5 rounded text-[10px] font-mono font-semibold uppercase bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <DownloadSimple size={11} weight="bold" />
                            <span>Descargar ({b.size})</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
