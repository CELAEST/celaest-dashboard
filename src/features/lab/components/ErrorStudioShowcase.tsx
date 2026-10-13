"use client";

import React, { useState, useMemo } from "react";
import {
  WarningOctagon,
  Warning,
  Pulse,
  SquaresFour,
  CheckCircle,
  ShieldCheck,
  Terminal,
  Lightbulb,
  Clock,
  Code,
  Monitor,
  Copy,
  Check,
  DeviceMobile,
  ArrowCounterClockwise,
  MagnifyingGlass,
  TrendDown,
  UsersThree,
  CaretDown,
  CaretUp,
  Sparkle,
  Desktop,
  GitCommit,
  GitBranch,
  SlidersHorizontal,
  ArrowRight,
  Shield,
  Tag,
  X,
  FileCode,
  HardDrive,
  Cpu,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// ─────────────────────────────────────────────────────────────
// MODELO DE DATOS DE ERROR MONITOR (CELAEST OBSIDIAN LUXURY)
// ─────────────────────────────────────────────────────────────

export interface LabErrorLog {
  id: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  status: "failed" | "reviewing" | "resolved" | "ignored";
  errorCode: string;
  message: string;
  template: string;
  version: string;
  affectedUsers: number;
  environment: {
    os: string;
    excelVersion?: string;
    platform: string;
  };
  stackTrace: string;
  suggestion: string;
  userEmail: string;
  lineageSteps?: {
    step: string;
    title: string;
    detail: string;
    badge: string;
    status: "pass" | "fail" | "warn";
  }[];
}

const SAMPLE_REAL_ERRORS: LabErrorLog[] = [
  {
    id: "err-ai-img-01",
    timestamp: "Hace 2m",
    severity: "critical",
    status: "failed",
    errorCode: "AI-IMAGE",
    message: "Fallo en generación de imagen por timeout de API externa en cluster",
    template: "Generador de Miniaturas IA",
    version: "v2.4.0",
    affectedUsers: 14,
    environment: {
      os: "Windows 11 Pro 64-bit",
      excelVersion: "Excel 365 v2409",
      platform: "IA-Mesh",
    },
    stackTrace: `[AI-MESH ERROR 504] Gateway Timeout: POST /v2/models/image-gen/dispatch
  at ImagePipelineService.generateCanvas (internal/mesh/image_service.ts:184)
  at TaskOrchestrator.dispatchExecution (internal/engine/orchestrator.ts:92)
  at async RouteHandler.process (app/api/ai/image/route.ts:44)
  Caused by: SocketTimeoutException: Upstream inference node unassigned after 15000ms`,
    suggestion: "Verifique la disponibilidad del grupo de GPUs en celaest-core y reduzca temporalmente la resolución de lote a 1024x1024.",
    userEmail: "esteban2@celaest.com",
    lineageSteps: [
      { step: "01", title: "Cliente Excel 365", detail: "Invocación de complemento OfficeJS desde Windows 11", badge: "Payload Válido", status: "pass" },
      { step: "02", title: "Gateway WAF Edge", detail: "Validación de token JWT y cuota de organización", badge: "200 OK", status: "pass" },
      { step: "03", title: "Orquestador IA-Mesh", detail: "Asignación de lote de inferencia a clúster de workers", badge: "En Cola", status: "pass" },
      { step: "04", title: "Timeout en Nodo GPU", detail: "Nodo gpu-node-04b no respondió dentro de los 15,000ms configurados", badge: "Timeout 504", status: "fail" },
      { step: "05", title: "Mitigación & Fallback", detail: "Reintentar en clúster secundario con resolución optimizada", badge: "Solución IA", status: "warn" },
    ],
  },
  {
    id: "err-ai-txt-02",
    timestamp: "Hace 11m",
    severity: "warning",
    status: "reviewing",
    errorCode: "AI-TEXT",
    message: "Exceso de tokens en prompt de redacción de contratos corporativos",
    template: "Redactor Legal IA",
    version: "v1.9.2",
    affectedUsers: 3,
    environment: {
      os: "macOS Sonoma 14.6",
      excelVersion: "Excel 365 v2408",
      platform: "IA-Mesh",
    },
    stackTrace: `[AI-TEXT WARNING 429] Context Window Exceeded: 134,200 tokens submitted (limit: 128,000)
  at ContextWindowValidator.checkBudget (services/ai/token_budget.ts:63)
  at LegalContractGenerator.compilePrompt (features/legal/contract_service.ts:112)
  at async PromptPipeline.execute (infrastructure/adapters/llm_client.ts:77)`,
    suggestion: "Active el resumen automático por fragmentos antes de enviar los anexos contractuales al modelo de lenguaje.",
    userEmail: "legal@vanguard-corp.io",
    lineageSteps: [
      { step: "01", title: "Cliente Web / Mac", detail: "Generación de documento contractual masivo (35 páginas)", badge: "Invocación", status: "pass" },
      { step: "02", title: "Token Budget Gate", detail: "Cálculo previo de tokens: 134,200 excede el límite del modelo", badge: "Exceso Detectado", status: "warn" },
      { step: "03", title: "Guardia Lingüística", detail: "Bloqueo preventivo de coste para proteger el presupuesto de tokens", badge: "Contenido", status: "pass" },
      { step: "04", title: "Revisión Operativa", detail: "Fragmentación de anexos en curso por el orquestador", badge: "En Revisión", status: "warn" },
    ],
  },
  {
    id: "err-ai-trans-03",
    timestamp: "Hace 34m",
    severity: "info",
    status: "resolved",
    errorCode: "AI-TRANSLATE",
    message: "Error de parseo en glosario de términos financieros sincronizados",
    template: "Traductor Financiero IA",
    version: "v3.1.0",
    affectedUsers: 1,
    environment: {
      os: "Windows 11 Enterprise",
      excelVersion: "Excel 365 v2401",
      platform: "IA-Mesh",
    },
    stackTrace: `[AI-TRANSLATE RESOLVED] SyntaxError: Unexpected token ';' in JSON glossary table
  at JSON.parse (<anonymous>)
  at FinancialGlossaryParser.loadTerms (features/translation/glossary_parser.ts:45)
  at TranslationEngine.applyLexicon (features/translation/engine.ts:89)`,
    suggestion: "El formato de delimitador fue corregido automáticamente por el sanitizador de términos CELAEST v3.",
    userEmail: "accounts@kurogane.jp",
    lineageSteps: [
      { step: "01", title: "Carga de Glosario", detail: "Importación de archivo CSV delimitado por punto y coma", badge: "Subida", status: "pass" },
      { step: "02", title: "Sanitizador CELAEST", detail: "Corrección automática de formato a JSON estructurado", badge: "Auto-reparado", status: "pass" },
      { step: "03", title: "Motor de Traducción", detail: "Sincronización de 4,200 pares léxicos completada", badge: "100% Activo", status: "pass" },
    ],
  },
  {
    id: "err-sys-waf-04",
    timestamp: "Hace 1h",
    severity: "critical",
    status: "failed",
    errorCode: "SYS-WAF",
    message: "Petición bloqueada por regla de tasa de solicitudes (Rate Limit Ingress)",
    template: "Gateway de Ingress WAF",
    version: "v4.0.1",
    affectedUsers: 45,
    environment: {
      os: "Linux x86_64 Ubuntu 24.04",
      platform: "Cloudflare Edge",
    },
    stackTrace: `[SECURITY ALERT] HTTP 429 Too Many Requests: Client IP 185.191.171.4 exceeds 250 req/min
  at WafRateLimiter.enforce (middleware/security/rate_limiter.go:88)
  at ApiIngressRouter.ServeHTTP (cmd/api/main.go:142)
  Originating signature: Bot-Scanner-Fingerprint-Hash#8891`,
    suggestion: "Revise la lista de exclusiones WAF para integraciones de telemetría de confianza o añada la IP a la lista permitida de la organización.",
    userEmail: "system@celaest.internal",
  },
  {
    id: "err-sys-err-05",
    timestamp: "Hace 3h",
    severity: "warning",
    status: "ignored",
    errorCode: "SYS-ERR",
    message: "Fallo transitorio de conexión con webhook de notificación contable",
    template: "Webhook Dispatcher",
    version: "v1.2.0",
    affectedUsers: 2,
    environment: {
      os: "Server Runtime Go 1.24",
      platform: "Worker Fleet",
    },
    stackTrace: `[SYS-ERR 502] Bad Gateway: POST https://hooks.stripe.com/webhook/invoice-sync
  at WebhookDispatcher.dispatchWithRetry (internal/webhook/dispatcher.go:104)
  at queue.Worker.processNext (internal/queue/worker.go:58)
  Retrying in 120s with exponential backoff`,
    suggestion: "El endpoint remoto experimentó latencia momentánea. El reintento exponencial mitigó la entrega del evento.",
    userEmail: "finance@helios-labs.de",
  },
];

// ─────────────────────────────────────────────────────────────
// SVGs BESPOKE HOLOGRÁFICOS (OBSIDIAN LUXURY STANDARD)
// ─────────────────────────────────────────────────────────────

const SecureSystemVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[104px] h-[104px] overflow-visible">
    <defs>
      <linearGradient id="celaestObsidianShieldLab" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#71717a" stopOpacity="0.4" />
      </linearGradient>
      <radialGradient id="celaestCenterGlowLab" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="50" cy="50" r="46" fill="url(#celaestCenterGlowLab)" />

      <motion.circle 
        cx="50" cy="50" r="46" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="6 8"
        animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      <motion.circle 
        cx="50" cy="50" r="38" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" strokeDasharray="60 120"
        animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
        strokeLinecap="round"
      />

      <line x1="50" y1="6" x2="50" y2="14" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
      <line x1="50" y1="86" x2="50" y2="94" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
      <line x1="6" y1="50" x2="14" y2="50" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
      <line x1="86" y1="50" x2="94" y2="50" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />

      <motion.g
        animate={{ scale: [1, 1.025, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        <path 
          d="M50 20 L24 28 V48 C24 67 36 82 50 88 C64 82 76 67 76 48 V28 Z" 
          fill="rgba(255, 255, 255, 0.04)" 
          stroke="url(#celaestObsidianShieldLab)" 
          strokeWidth="1.6" 
          strokeLinejoin="round"
        />

        <path 
          d="M50 26 L30 32 V48 C30 63 39 75 50 80 C61 75 70 63 70 48 V32 Z" 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.2)" 
          strokeWidth="1" 
          strokeDasharray="3 3"
          strokeLinejoin="round" 
        />

        <motion.path 
          d="M40 52 L47 59 L62 44" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </motion.g>
    </motion.g>
  </svg>
);

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: ERROR STUDIO SHOWCASE (4 ARQUETIPOS)
// ─────────────────────────────────────────────────────────────

export function ErrorStudioShowcase() {
  const [archetype, setArchetype] = useState<"stream" | "chrono" | "bento" | "console">("chrono");
  const [simulateZeroErrors, setSimulateZeroErrors] = useState(false);
  const [errorsList, setErrorsList] = useState<LabErrorLog[]>(SAMPLE_REAL_ERRORS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(SAMPLE_REAL_ERRORS[0].id);
  const [expandedId, setExpandedId] = useState<string | null>(SAMPLE_REAL_ERRORS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "warning">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "failed" | "reviewing" | "resolved" | "ignored">("all");

  const selectedIncident = useMemo(
    () => errorsList.find((e) => e.id === selectedIncidentId) || errorsList[0],
    [errorsList, selectedIncidentId],
  );

  const filteredErrors = useMemo(() => {
    if (simulateZeroErrors) return [];
    return errorsList.filter((item) => {
      if (severityFilter !== "all" && item.severity !== severityFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.message.toLowerCase().includes(q) ||
          item.errorCode.toLowerCase().includes(q) ||
          item.template.toLowerCase().includes(q) ||
          item.userEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [errorsList, simulateZeroErrors, severityFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const crit = errorsList.filter((e) => e.severity === "critical" && e.status === "failed").length;
    const warn = errorsList.filter((e) => e.severity === "warning").length;
    const users = errorsList.reduce((acc, curr) => acc + curr.affectedUsers, 0);
    return {
      criticalCount: simulateZeroErrors ? 0 : crit,
      warningCount: simulateZeroErrors ? 0 : warn,
      totalUsers: simulateZeroErrors ? 0 : users,
      mttr: simulateZeroErrors ? "0m" : "12m",
    };
  }, [errorsList, simulateZeroErrors]);

  const handleUpdateStatus = (id: string, newStatus: LabErrorLog["status"]) => {
    setErrorsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    const label =
      newStatus === "resolved"
        ? "Resuelto"
        : newStatus === "reviewing"
          ? "En Revisión"
          : "Ignorado";
    toast.success(`Incidente actualizado a estado: ${label}`, {
      description: `Se sincronizó con el motor de telemetría de CELAEST.`,
    });
  };

  const handleCopyStack = (e: LabErrorLog) => {
    navigator.clipboard.writeText(e.stackTrace);
    toast.success("Stack trace copiado al portapapeles", {
      description: `${e.errorCode} • ${e.template}`,
    });
  };

  const renderStatusBadge = (status: LabErrorLog["status"]) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.08] text-white border border-white/10 font-semibold shadow-xs">
            <Check size={10} strokeWidth={3} className="text-white/80" />
            Resuelto
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-300 border border-red-500/20 font-medium">
            <X size={10} strokeWidth={3} className="text-red-400" />
            Fallido
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-white/70 border border-white/[0.06] font-medium">
            <Clock size={10} className="text-white/40" />
            En Revisión
          </span>
        );
      case "ignored":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.03] text-white/50 border border-white/[0.05] font-medium">
            <Clock size={10} className="text-white/40" />
            Ignorado
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER DEL ESTUDIO EN LABS (OBSIDIAN LUXURY STANDARD)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#080c14]/90 border border-white/8 backdrop-blur-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white shrink-0">
            <WarningOctagon size={20} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Error & Telemetry Mission Control Studio
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                100% Use-Case Gate
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              4 Arquetipos de Resiliencia • Casos de Uso Reales CELAEST • Obsidian Luxury Standard
            </p>
          </div>
        </div>

        {/* Switcher de Arquetipos & Toggle de Cero Errores */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/8 text-xs">
            <button
              type="button"
              onClick={() => {
                setArchetype("stream");
                setSimulateZeroErrors(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "stream" && !simulateZeroErrors
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Desktop size={13} weight="bold" />
              <span>1. Executive Stream</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setArchetype("chrono");
                setSimulateZeroErrors(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "chrono" && !simulateZeroErrors
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <GitCommit size={13} weight="bold" />
              <span>2. Chrono Lineage ★</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setArchetype("bento");
                setSimulateZeroErrors(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "bento" && !simulateZeroErrors
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <SquaresFour size={13} weight="bold" />
              <span>3. Bento Forensic</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setArchetype("console");
                setSimulateZeroErrors(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "console" && !simulateZeroErrors
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Terminal size={13} weight="bold" />
              <span>4. Dual Console</span>
            </button>
          </div>

          {/* Toggle de Simulación de Cero Errores */}
          <button
            type="button"
            onClick={() => {
              setSimulateZeroErrors(!simulateZeroErrors);
              if (!simulateZeroErrors) {
                toast.info("Simulando estado de 0 incidentes activos");
              } else {
                toast.success("Restaurando flujo de incidentes activos");
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ${
              simulateZeroErrors
                ? "bg-white text-black border-white shadow-xs"
                : "bg-white/[0.04] text-white/70 hover:text-white border-white/10"
            }`}
          >
            <CheckCircle size={13} weight={simulateZeroErrors ? "fill" : "bold"} />
            <span>{simulateZeroErrors ? "0 Errores (Activo)" : "Simular Cero Errores"}</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. KPI STRIP OBSIDIAN (LUMINANCIA PURA • CERO SLOP)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#080c14]/90 border border-white/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Errores Críticos</span>
            <Warning size={14} className={stats.criticalCount > 0 ? "text-red-400" : "text-white/40"} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {stats.criticalCount}
            </span>
            <span className="text-[10px] font-mono text-white/40">sin resolver</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080c14]/90 border border-white/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Advertencias</span>
            <Pulse size={14} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {stats.warningCount}
            </span>
            <span className="text-[10px] font-mono text-white/40">en revisión</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080c14]/90 border border-white/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Usuarios Impactados</span>
            <UsersThree size={14} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {stats.totalUsers}
            </span>
            <span className="text-[10px] font-mono text-white/40">cuentas</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080c14]/90 border border-white/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Tiempo de Resolución (MTTR)</span>
            <Clock size={14} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {stats.mttr}
            </span>
            <span className="text-[10px] font-mono text-white/40">promedio</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CONTENIDO DE ARQUETIPOS O ESTADO DE CERO ERRORES
      ───────────────────────────────────────────────────────────── */}

      {/* ────────────────── CASO CERO ERRORES (ADAPTADO AL 100%) ────────────────── */}
      {simulateZeroErrors ? (
        <div className="relative rounded-2xl border border-white/8 bg-[#080c14]/90 p-8 sm:p-12 text-center backdrop-blur-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.08] text-white border border-white/10 font-semibold shadow-xs">
                <Check size={11} strokeWidth={3} className="text-white/80" />
                Sistema 100% Operativo
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.03] text-white/60 border border-white/8 font-medium">
                <Pulse size={12} className="text-white/60" />
                Telemetría en Vivo
              </span>
            </div>

            <div className="flex justify-center py-2">
              <SecureSystemVisual />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Todo Limpio Por Ahora
              </h3>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-mono max-w-lg mx-auto">
                Cero desviaciones detectadas en los últimos ciclos. Los microservicios de inferencia, gateways WAF y buffers WebRTC operan con normalidad.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/6 text-[10px] font-mono tracking-wider text-white/50 uppercase">
                Incidentes: <strong className="text-white font-semibold">0</strong>
              </span>
              <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/6 text-[10px] font-mono tracking-wider text-white/50 uppercase">
                Buffer: <strong className="text-white font-semibold">Operativo</strong>
              </span>
              <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/6 text-[10px] font-mono tracking-wider text-white/50 uppercase">
                Integridad: <strong className="text-white font-semibold">100%</strong>
              </span>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => toast.success("Diagnóstico ejecutado: 14 servicios en línea y 0 errores.")}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Ejecutar Diagnóstico
              </button>
              <button
                type="button"
                onClick={() => setSimulateZeroErrors(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Restaurar Incidentes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ────────────────── ARQUETIPO 1: EXECUTIVE STREAM (ÓRDENES & LICENCIAS STANDARD) ────────────────── */}
          {archetype === "stream" && (
            <div className="space-y-4">
              {/* Controles de Búsqueda y Filtros Unificados */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#080c14]/90 border border-white/8">
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Buscar por mensaje, código de error, plantilla o usuario..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center p-0.5 rounded-lg border bg-white/[0.02] border-white/8 text-[11px] font-mono">
                    {(["all", "critical", "warning"] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverityFilter(sev)}
                        className={`px-2.5 py-1 rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                          severityFilter === sev ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:text-white"
                        }`}
                      >
                        {sev === "all" ? "Todas" : sev === "critical" ? "Crítico" : "Advertencia"}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex items-center p-0.5 rounded-lg border bg-white/[0.02] border-white/8 text-[11px] font-mono">
                    {(["all", "failed", "reviewing", "resolved"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                          statusFilter === st ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:text-white"
                        }`}
                      >
                        {st === "all" ? "Todos" : st === "failed" ? "Fallido" : st === "reviewing" ? "Revisión" : "Resuelto"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lista Desacoplada de Incidentes */}
              <div className="space-y-3">
                {filteredErrors.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? "bg-[#080c14] border-white/15"
                          : "bg-[#080c14]/70 border-white/6 hover:border-white/12"
                      }`}
                    >
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Barra de Severidad Sobria */}
                          <div
                            className={`w-1.5 h-11 rounded-full shrink-0 ${
                              item.severity === "critical"
                                ? "bg-red-500/80"
                                : item.severity === "warning"
                                  ? "bg-white/40"
                                  : "bg-white/20"
                            }`}
                          />

                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/80">
                                {item.errorCode}
                              </span>
                              {renderStatusBadge(item.status)}
                              <span className="flex items-center gap-1 text-[11px] font-mono text-white/40">
                                <Clock size={11} />
                                {item.timestamp}
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                              {item.message}
                            </h4>

                            <div className="flex items-center gap-4 text-xs font-mono text-white/40 flex-wrap pt-0.5">
                              <span className="flex items-center gap-1.5 text-white/60">
                                <Code size={12} />
                                {item.template}
                              </span>
                              <span className="flex items-center gap-1.5 text-white/60">
                                <Monitor size={12} />
                                {item.environment.os}
                              </span>
                              <span>
                                Usuario: <strong className="text-white/70 font-semibold">{item.userEmail}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 p-1 rounded bg-white/5 text-white/60">
                          {isExpanded ? <CaretUp size={15} /> : <CaretDown size={15} />}
                        </div>
                      </div>

                      {/* Panel Forense Expandible */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/6 p-5 space-y-5 bg-black/40"
                          >
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40 block mb-2">
                                Entorno de Cliente & Versiones
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/6 text-xs font-mono">
                                <div>
                                  <span className="text-white/40 block text-[9px] uppercase">Sistema Operativo</span>
                                  <span className="text-white font-medium">{item.environment.os}</span>
                                </div>
                                {item.environment.excelVersion && (
                                  <div>
                                    <span className="text-white/40 block text-[9px] uppercase">Versión de Excel</span>
                                    <span className="text-white font-medium">{item.environment.excelVersion}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-white/40 block text-[9px] uppercase">Plataforma</span>
                                  <span className="text-white font-medium">{item.environment.platform}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40 flex items-center gap-1.5">
                                  <Terminal size={12} />
                                  Stack Trace de Fallo
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyStack(item)}
                                  className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-[10px] font-mono text-white/70 hover:text-white cursor-pointer flex items-center gap-1.5"
                                >
                                  <Copy size={11} />
                                  <span>Copiar Traza</span>
                                </button>
                              </div>
                              <div className="p-3.5 rounded-lg bg-black/70 border border-white/8 font-mono text-xs text-white/80 overflow-x-auto leading-relaxed">
                                <pre className="whitespace-pre-wrap">{item.stackTrace}</pre>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/8 space-y-1">
                              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60 flex items-center gap-1.5 font-bold">
                                <Lightbulb size={13} />
                                Recomendación de Solución IA
                              </span>
                              <p className="text-xs text-white/70 leading-relaxed font-mono">
                                {item.suggestion}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/6 flex-wrap gap-2">
                              <span className="text-xs font-mono text-white/40">
                                Transición de estado:
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(item.id, "reviewing")}
                                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wider border border-white/10 bg-white/[0.05] text-white/80 hover:bg-white/[0.1] transition-all cursor-pointer"
                                >
                                  En Revisión
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(item.id, "resolved")}
                                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wider bg-white text-black hover:bg-zinc-200 transition-all cursor-pointer"
                                >
                                  Marcar Resuelto
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(item.id, "ignored")}
                                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wider border border-white/6 text-white/50 hover:text-white transition-all cursor-pointer"
                                >
                                  Ignorar
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ────────────────── ARQUETIPO 2: CHRONO LINEAGE RAIL (EL RIEL TEMPORAL DE LANZAMIENTOS) ────────────────── */}
          {archetype === "chrono" && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#080c14]/90 border border-white/8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                      Riel Temporal de Incidentes
                    </span>
                    <span className="text-[10px] font-mono text-white/50 bg-white/[0.02] border border-white/6 px-2 py-0.5 rounded">
                      Linaje de Ejecución Paso a Paso
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Trazabilidad de Linaje en Tiempo Real ({selectedIncident.errorCode})
                  </h3>
                  <p className="text-xs font-mono text-white/40 mt-0.5">
                    Secuencia determinista de ejecución desde el cliente hasta la resolución de falla
                  </p>
                </div>

                {/* Selector rápido de incidente */}
                <select
                  value={selectedIncidentId}
                  onChange={(e) => setSelectedIncidentId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white cursor-pointer focus:outline-none"
                >
                  {errorsList.map((err) => (
                    <option key={err.id} value={err.id}>
                      {err.errorCode} - {err.message.slice(0, 36)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Riel Vertical de 5 Pasos Idéntico a Lanzamientos */}
              <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                {(selectedIncident.lineageSteps || [
                  { step: "01", title: "Cliente Office 365", detail: `Petición originada en ${selectedIncident.environment.os} por ${selectedIncident.userEmail}`, badge: "Invocación", status: "pass" },
                  { step: "02", title: "Gateway de Ingress", detail: "Enrutamiento perimetral y validación de tokens corporativos", badge: "200 OK", status: "pass" },
                  { step: "03", title: "Módulo Orquestador", detail: `Fallo detectado en ${selectedIncident.template} v${selectedIncident.version}`, badge: "Punto de Falla", status: "fail" },
                  { step: "04", title: "Excepción Capturada", detail: selectedIncident.message, badge: selectedIncident.errorCode, status: "fail" },
                  { step: "05", title: "Mitigación Recomendada", detail: selectedIncident.suggestion, badge: "Acción IA", status: "warn" },
                ]).map((stepItem, idx) => (
                  <div key={idx} className="relative">
                    {/* Nodo Ancla Numerado */}
                    <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border border-white/20 bg-[#080c14] text-white flex items-center justify-center font-mono text-[9px] font-bold">
                      {stepItem.step}
                    </div>

                    <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-all space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-white">{stepItem.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/70">
                          {stepItem.badge}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-white/50 leading-relaxed">{stepItem.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de Acción en Linaje */}
              <div className="pt-3 border-t border-white/6 flex items-center justify-between flex-wrap gap-3">
                <span className="text-xs font-mono text-white/40">
                  ¿Desea marcar el linaje de {selectedIncident.errorCode} como resuelto?
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedIncident.id, "resolved")}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Confirmar Resolución
                </button>
              </div>
            </div>
          )}

          {/* ────────────────── ARQUETIPO 3: BENTO FORENSIC (GRID MODULAR ASIMÉTRICO 7/5) ────────────────── */}
          {archetype === "bento" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Columna Izquierda (7/12): Lista Rápida */}
              <div className="lg:col-span-7 space-y-3">
                <div className="p-4 rounded-xl bg-[#080c14]/90 border border-white/8 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Incidentes en Buffer ({filteredErrors.length})
                  </span>
                  <span className="text-[10px] font-mono text-white/40">Seleccione para triage</span>
                </div>

                <div className="space-y-2.5">
                  {filteredErrors.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIncidentId(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selectedIncidentId === item.id
                          ? "bg-[#080c14] border-white/20 ring-1 ring-white/10"
                          : "bg-[#080c14]/60 border-white/6 hover:border-white/12"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white">
                            {item.errorCode}
                          </span>
                          {renderStatusBadge(item.status)}
                          <span className="text-[10px] font-mono text-white/40">{item.timestamp}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-md">
                          {item.message}
                        </h4>
                      </div>
                      <ArrowRight size={14} className="text-white/40 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Derecha (5/12): Inspector Forense */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080c14]/90 border border-white/8 space-y-5 sticky top-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/6">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/40 block">
                      Inspector Forense en Vivo
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {selectedIncident.errorCode} • {selectedIncident.template}
                    </h4>
                  </div>
                  {renderStatusBadge(selectedIncident.status)}
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1">
                    Mensaje de Excepción
                  </span>
                  <p className="text-xs font-mono text-white/80 leading-relaxed p-3 rounded-lg bg-white/[0.02] border border-white/6">
                    {selectedIncident.message}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1">
                    Entorno del Cliente
                  </span>
                  <div className="p-3 rounded-lg bg-black/60 border border-white/6 space-y-1 font-mono text-[11px] text-white/60">
                    <div>OS: <span className="text-white">{selectedIncident.environment.os}</span></div>
                    {selectedIncident.environment.excelVersion && (
                      <div>Excel: <span className="text-white">{selectedIncident.environment.excelVersion}</span></div>
                    )}
                    <div>Usuario: <span className="text-white">{selectedIncident.userEmail}</span></div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1">
                    Sugerencia IA
                  </span>
                  <p className="text-xs font-mono text-white/70 leading-relaxed p-3 rounded-lg bg-white/[0.02] border border-white/6">
                    {selectedIncident.suggestion}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedIncident.id, "resolved")}
                    className="flex-1 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Resolver
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyStack(selectedIncident)}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-medium border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── ARQUETIPO 4: DUAL-PANE TACTICAL CONSOLE (CONSOLA DIVIDIDA) ────────────────── */}
          {archetype === "console" && (
            <div className="rounded-2xl bg-[#080c14]/90 border border-white/8 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
              {/* Panel Izquierdo: Lista Compacta (5/12) */}
              <div className="md:col-span-5 border-r border-white/6 p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/6">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Cola de Telemetría
                    </span>
                    <span className="text-[10px] font-mono text-white/40">5 Eventos</span>
                  </div>

                  <div className="space-y-1.5">
                    {errorsList.map((err) => (
                      <button
                        key={err.id}
                        type="button"
                        onClick={() => setSelectedIncidentId(err.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                          selectedIncidentId === err.id
                            ? "bg-white/[0.08] text-white border border-white/10 shadow-xs"
                            : "bg-transparent text-white/60 hover:bg-white/[0.03] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold">{err.errorCode}</span>
                          <span className="text-white/40">{err.timestamp}</span>
                        </div>
                        <span className="text-xs font-semibold text-white truncate w-full block">
                          {err.message}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/6 text-[10px] font-mono text-white/40">
                  Buffer: Cero congestión de red • Modo interactivo
                </div>
              </div>

              {/* Panel Derecho: Consola de Triage (7/12) */}
              <div className="md:col-span-7 p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white">
                          {selectedIncident.errorCode}
                        </span>
                        {renderStatusBadge(selectedIncident.status)}
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5 tracking-tight">
                        {selectedIncident.message}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyStack(selectedIncident)}
                      className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-xs font-mono text-white/70 hover:text-white cursor-pointer"
                    >
                      Copiar Traza
                    </button>
                  </div>

                  {/* Terminal de Código */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1">
                      Stack Trace
                    </span>
                    <div className="p-3.5 rounded-lg bg-black/80 border border-white/8 font-mono text-xs text-white/80 overflow-x-auto leading-relaxed max-h-48 custom-scrollbar">
                      <pre className="whitespace-pre-wrap">{selectedIncident.stackTrace}</pre>
                    </div>
                  </div>

                  {/* Sugerencia IA */}
                  <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/6 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-bold">
                      Sugerencia de Solución
                    </span>
                    <p className="text-xs font-mono text-white/70 leading-relaxed">
                      {selectedIncident.suggestion}
                    </p>
                  </div>
                </div>

                {/* Pie de Consola */}
                <div className="pt-3 border-t border-white/6 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-mono text-white/40">
                    Afectados: <strong className="text-white font-semibold">{selectedIncident.affectedUsers} usuarios</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedIncident.id, "reviewing")}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-white/10 bg-white/[0.05] text-white/80 hover:bg-white/[0.1] transition-all cursor-pointer"
                    >
                      En Revisión
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedIncident.id, "resolved")}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white text-black hover:bg-zinc-200 transition-all cursor-pointer"
                    >
                      Marcar Resuelto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
