"use client";

import React, { useState, useMemo } from "react";
import {
  Gear,
  User,
  Shield,
  CreditCard,
  Users,
  Bell,
  Code,
  Globe,
  Check,
  X,
  Copy,
  Clock,
  Plus,
  Trash,
  ArrowRight,
  Eye,
  Key,
  ShieldCheck,
  CheckCircle,
  Warning,
  SlidersHorizontal,
  Terminal,
  DeviceMobile,
  Monitor,
  Buildings,
  Envelope,
  Lock,
  QrCode,
  ArrowsClockwise,
  UploadSimple,
  CaretRight,
  CaretDown,
  Sparkle,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// ─────────────────────────────────────────────────────────────
// TOKYO CARBON & MONOCHROME COLOR CONTRACT (ESTÁNDAR CELAEST)
// Canvas: #030303 / #09090B
// Paneles & Surface: #0D0D11
// Elevación & Inputs: #141418
// Bordes Fantasma: border-white/[0.08] / border-white/[0.06]
// Texto Primario: #FAFAFA / text-white
// Texto Secundario: #A1A1AA / text-white/60
// Micro-Metadata: #71717A / text-white/40
// Floating Luminance Planes:
//   - Starter+: #38BDF8 (Sky)
//   - Pro Tier: #A78BFA (Violet)
//   - Enterprise: #FBBF24 (Amber/Gold)
// Acento Mecánico / Leica Vermillion: #EF4444 (Red-500)
// ─────────────────────────────────────────────────────────────

export type SettingsDomain =
  | "account"
  | "security"
  | "billing"
  | "workspace"
  | "notifications"
  | "developer"
  | "preferences";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar: string;
  status: "active" | "invited";
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  created: string;
  lastUsed: string;
}

export interface SecuritySession {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: "m-1", name: "Esteban Pérez", email: "esteban@celaest.com", role: "owner", avatar: "EP", status: "active" },
  { id: "m-2", name: "Valentina Ruiz", email: "valentina@celaest.com", role: "admin", avatar: "VR", status: "active" },
  { id: "m-3", name: "Carlos Mendoza", email: "carlos@celaest.com", role: "member", avatar: "CM", status: "active" },
  { id: "m-4", name: "Dev Ops Bot", email: "deploy@celaest.internal", role: "member", avatar: "DO", status: "invited" },
];

const INITIAL_KEYS: ApiKeyItem[] = [
  { id: "k-1", name: "Producción Edge WAF", keyPrefix: "cel_live_9482...", scopes: ["telemetry:read", "ai:invoke"], created: "12 Feb 2026", lastUsed: "Hace 4m" },
  { id: "k-2", name: "Staging Pipeline", keyPrefix: "cel_test_1039...", scopes: ["all"], created: "01 Mar 2026", lastUsed: "Hace 2d" },
  { id: "k-3", name: "Reportes Automatizados", keyPrefix: "cel_live_7710...", scopes: ["billing:read", "audit:read"], created: "28 Feb 2026", lastUsed: "Hace 1h" },
];

const INITIAL_SESSIONS: SecuritySession[] = [
  { id: "s-1", device: "Chrome 124 / Windows 11", ip: "190.158.42.10", location: "Bogotá, Colombia", lastActive: "Activo ahora", isCurrent: true },
  { id: "s-2", device: "Safari 17 / macOS Sonoma", ip: "186.115.89.21", location: "Medellín, Colombia", lastActive: "Ayer a las 18:30", isCurrent: false },
  { id: "s-3", device: "CELAEST Mobile App / iOS 18", ip: "190.158.42.10", location: "Bogotá, Colombia", lastActive: "Hace 3 horas", isCurrent: false },
];

// ─────────────────────────────────────────────────────────────
// TOKYO CORNER ACCENTS COMPONENT (EL SELLO DE PRECISIÓN TOKYO)
// ─────────────────────────────────────────────────────────────
const TokyoCornerTicks = () => (
  <>
    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20 pointer-events-none z-20" />
    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20 pointer-events-none z-20" />
    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20 pointer-events-none z-20" />
    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20 pointer-events-none z-20" />
  </>
);

export function SettingsStudioShowcase() {
  const [archetype, setArchetype] = useState<"split" | "bento" | "ribbon" | "console">("split");
  const [activeDomain, setActiveDomain] = useState<SettingsDomain>("account");

  // Estado reactivo de configuración
  const [displayName, setDisplayName] = useState("Esteban Pérez");
  const [jobTitle, setJobTitle] = useState("Lead AI Systems Architect");
  const [email, setEmail] = useState("esteban@celaest.com");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [timezone, setTimezone] = useState("America/Bogota (UTC-5)");
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [sessions, setSessions] = useState<SecuritySession[]>(INITIAL_SESSIONS);
  const [selectedKeyForInspector, setSelectedKeyForInspector] = useState<ApiKeyItem>(INITIAL_KEYS[0]);

  // Handlers con toast
  const handleSaveAll = () => {
    toast.success("Configuración guardada en Tokyo Carbon Engine", {
      description: "Parámetros sincronizados exitosamente con CELAEST Hub.",
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Clave copiada al portapapeles");
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.error("Clave de API revocada de inmediato");
  };

  const handleTerminateSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success("Sesión cerrada y token revocado");
  };

  const domainsList = useMemo(
    () => [
      { id: "account" as const, label: "Perfil & Cuenta", icon: User, group: "Identidad" },
      { id: "security" as const, label: "Seguridad & 2FA", icon: Shield, group: "Identidad" },
      { id: "billing" as const, label: "Planes & Facturación", icon: CreditCard, group: "Organización" },
      { id: "workspace" as const, label: "Espacio & Equipo", icon: Users, group: "Organización" },
      { id: "notifications" as const, label: "Notificaciones", icon: Bell, group: "Sistema" },
      { id: "developer" as const, label: "Claves API & Webhooks", icon: Code, group: "Sistema" },
      { id: "preferences" as const, label: "Preferencias Regionales", icon: Globe, group: "Sistema" },
    ],
    []
  );

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-[#FAFAFA]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER DEL ESTUDIO EN LABS (PALETA OFICIAL TOKYO CARBON)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#09090B] border border-white/[0.08] backdrop-blur-2xl">
        <TokyoCornerTicks />
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0D0D11] border border-white/10 flex items-center justify-center text-[#FAFAFA] shrink-0">
            <Gear size={20} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#FAFAFA]">
                Settings & Configuration Architecture Studio
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-white/10 bg-[#141418] text-[#FAFAFA]/70">
                Tokyo Carbon (#09090B)
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">
              4 Arquetipos de configuración con la paleta oficial Tokyo Card #2 (#09090B, #0D0D11, #141418, #FAFAFA)
            </p>
          </div>
        </div>

        {/* Selector de Arquetipos */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-1 rounded-xl bg-[#0D0D11] border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setArchetype("split")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "split"
                  ? "bg-[#FAFAFA] text-[#09090B] font-bold shadow-xs"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              <SlidersHorizontal size={13} weight="bold" />
              <span>1. Split-Pane ★</span>
            </button>

            <button
              type="button"
              onClick={() => setArchetype("bento")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "bento"
                  ? "bg-[#FAFAFA] text-[#09090B] font-bold shadow-xs"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              <Buildings size={13} weight="bold" />
              <span>2. Bento Suite</span>
            </button>

            <button
              type="button"
              onClick={() => setArchetype("ribbon")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "ribbon"
                  ? "bg-[#FAFAFA] text-[#09090B] font-bold shadow-xs"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              <ArrowsClockwise size={13} weight="bold" />
              <span>3. Top Ribbon</span>
            </button>

            <button
              type="button"
              onClick={() => setArchetype("console")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                archetype === "console"
                  ? "bg-[#FAFAFA] text-[#09090B] font-bold shadow-xs"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              <Terminal size={13} weight="bold" />
              <span>4. Dual Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOKYO FLOATING LUMINANCE STRIP (CERO BOLITAS • TIPOGRAFÍA PURA)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Plan con Floating Luminance Morado (Pro Tier) */}
        <div className="relative p-4 rounded-xl bg-[#09090B] border border-white/[0.08] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Plan de Cuenta</span>
            <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase">Pro Tier</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-[#FAFAFA]">Enterprise Pro</span>
            <span className="text-[10px] font-mono text-[#71717A]">$199 / mes</span>
          </div>
        </div>

        {/* Card 2: Seguridad 2FA con Vermillion / White */}
        <div className="relative p-4 rounded-xl bg-[#09090B] border border-white/[0.08] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Seguridad Criptográfica</span>
            <ShieldCheck size={14} className="text-[#FAFAFA]/80" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-[#FAFAFA]">2FA Activo</span>
            <span className="text-[10px] font-mono text-[#71717A]">3 dispositivos</span>
          </div>
        </div>

        {/* Card 3: Organización con Floating Luminance Azul (Starter+) */}
        <div className="relative p-4 rounded-xl bg-[#09090B] border border-white/[0.08] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Espacio de Trabajo</span>
            <span className="text-[10px] font-mono text-sky-400 font-semibold uppercase">Org #1</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-[#FAFAFA]">{members.length} Miembros</span>
            <span className="text-[10px] font-mono text-[#71717A]">CELAEST Global</span>
          </div>
        </div>

        {/* Card 4: Claves API con Floating Luminance Dorado (Enterprise) */}
        <div className="relative p-4 rounded-xl bg-[#09090B] border border-white/[0.08] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-[10px] font-mono tracking-wider uppercase">Tokens de Inferencia</span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">API Edge</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-[#FAFAFA]">{apiKeys.length} Claves</span>
            <span className="text-[10px] font-mono text-[#71717A]">Latencia 12ms</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ARQUETIPO 1: EXECUTIVE SPLIT-PANE (PALETA TOKYO CARD #2)
      ───────────────────────────────────────────────────────────── */}
      {archetype === "split" && (
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#09090B] overflow-hidden flex flex-col md:flex-row min-h-[640px]">
          <TokyoCornerTicks />

          {/* Navegación Lateral Tokyo (#0D0D11) */}
          <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.08] p-3 flex flex-col justify-between bg-[#0D0D11]/90">
            <div className="space-y-4">
              <div className="px-3 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#71717A] block">
                  Panel de Preferencias
                </span>
                <span className="text-xs font-bold text-[#FAFAFA] tracking-tight">CELAEST Hub • Tokyo Core</span>
              </div>

              {/* Grupos de Dominios con Selección por Luminancia Pura */}
              <div className="space-y-3">
                {["Identidad", "Organización", "Sistema"].map((groupName) => {
                  const groupItems = domainsList.filter((d) => d.group === groupName);
                  return (
                    <div key={groupName} className="space-y-1">
                      <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-[#71717A]/70 block">
                        {groupName}
                      </span>
                      {groupItems.map((item) => {
                        const isActive = activeDomain === item.id;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveDomain(item.id)}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#141418] text-[#FAFAFA] border border-white/20 font-bold shadow-xs"
                                : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/[0.03]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon size={14} className={isActive ? "text-[#FAFAFA]" : "text-[#71717A]"} />
                              <span>{item.label}</span>
                            </div>
                            {isActive && <Check size={10} strokeWidth={3} className="text-[#FAFAFA]" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer de la Barra Lateral (#141418) */}
            <div className="p-3 mt-4 rounded-xl bg-[#141418] border border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                <span>Sesión Activa</span>
                <span className="text-[#FAFAFA] font-bold">100% OK</span>
              </div>
              <p className="text-[11px] font-mono text-[#A1A1AA] truncate">{email}</p>
            </div>
          </div>

          {/* Canvas de Ejecución y Edición (#09090B) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
            {/* Header del Dominio (#0D0D11) */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D0D11]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#FAFAFA] tracking-tight">
                    {domainsList.find((d) => d.id === activeDomain)?.label}
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#141418] text-[#A1A1AA] border border-white/[0.06]">
                    Activo
                  </span>
                </div>
                <span className="text-xs font-mono text-[#71717A]">
                  Gestión y control de parámetros corporativos de CELAEST
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#FAFAFA] text-[#09090B] hover:bg-white transition-all cursor-pointer shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>

            {/* Contenido del Dominio Activo */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              {activeDomain === "account" && (
                <div className="space-y-6 max-w-2xl">
                  {/* Avatar Section (#0D0D11) */}
                  <div className="p-5 rounded-xl bg-[#0D0D11] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#141418] border border-white/15 flex items-center justify-center text-[#FAFAFA] text-lg font-bold font-mono">
                        EP
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#FAFAFA]">Avatar Corporativo</h4>
                        <p className="text-xs font-mono text-[#71717A]">JPG, PNG o SVG (máx. 2MB)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toast.info("Selector de archivo abierto")}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 bg-[#141418] text-[#FAFAFA]/80 hover:text-[#FAFAFA] cursor-pointer flex items-center gap-1.5"
                      >
                        <UploadSimple size={12} />
                        <span>Subir</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info("Avatar restaurado por defecto")}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/[0.06] text-[#71717A] hover:text-[#FAFAFA] cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>

                  {/* Formulario de Información (#141418) */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#0D0D11] border border-white/10 text-xs font-mono text-[#FAFAFA] focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                        Cargo / Rol Profesional
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#0D0D11] border border-white/10 text-xs font-mono text-[#FAFAFA] focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                        Correo Electrónico Principal
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          disabled
                          value={email}
                          className="flex-1 px-3.5 py-2 rounded-lg bg-[#0D0D11]/50 border border-white/[0.06] text-xs font-mono text-[#71717A] cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => toast.info("Solicitud de cambio de correo iniciada")}
                          className="px-3 py-2 rounded-lg text-xs font-mono border border-white/10 bg-[#141418] text-[#FAFAFA]/80 hover:text-[#FAFAFA] cursor-pointer"
                        >
                          Modificar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDomain === "security" && (
                <div className="space-y-6 max-w-2xl">
                  {/* 2FA Toggle (#0D0D11) */}
                  <div className="p-5 rounded-xl bg-[#0D0D11] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#FAFAFA]">Autenticación en Dos Pasos (2FA)</h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#141418] text-[#FAFAFA] border border-white/10 font-bold">
                          Hardware TOTP
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#A1A1AA]">
                        Protege el acceso a tus modelos de IA y facturación mediante algoritmo criptográfico.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        toast.success(twoFactorEnabled ? "2FA desactivado" : "2FA activado con éxito");
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                        twoFactorEnabled
                          ? "bg-[#FAFAFA] text-[#09090B] border-[#FAFAFA]"
                          : "bg-[#141418] text-[#A1A1AA] border-white/10 hover:text-[#FAFAFA]"
                      }`}
                    >
                      {twoFactorEnabled ? "Activado" : "Desactivado"}
                    </button>
                  </div>

                  {/* Sesiones Activas (#0D0D11) */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
                      Dispositivos Conectados ({sessions.length})
                    </span>
                    <div className="space-y-2">
                      {sessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="p-3.5 rounded-xl bg-[#0D0D11] border border-white/[0.08] flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#FAFAFA] font-mono">{sess.device}</span>
                              {sess.isCurrent && (
                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#141418] text-[#FAFAFA] border border-white/10 font-bold">
                                  Esta sesión
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-[#71717A]">
                              {sess.ip} • {sess.location} • {sess.lastActive}
                            </p>
                          </div>
                          {!sess.isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleTerminateSession(sess.id)}
                              className="px-2.5 py-1 rounded text-xs font-mono border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 cursor-pointer"
                            >
                              Cerrar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeDomain === "developer" && (
                <div className="space-y-6">
                  {/* Header de Claves */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#FAFAFA]">Claves de Acceso API</h4>
                      <p className="text-xs font-mono text-[#71717A]">
                        Tokens de autorización Bearer para SDKs de Python, Go y Node.js en celaest-core
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newK: ApiKeyItem = {
                          id: `k-${Date.now()}`,
                          name: "Nueva Clave Personal",
                          keyPrefix: `cel_live_${Math.floor(1000 + Math.random() * 9000)}...`,
                          scopes: ["telemetry:read"],
                          created: "Hoy",
                          lastUsed: "Sin uso",
                        };
                        setApiKeys([newK, ...apiKeys]);
                        toast.success("Clave generada con éxito");
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#FAFAFA] text-[#09090B] hover:bg-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={12} weight="bold" />
                      <span>Crear Clave</span>
                    </button>
                  </div>

                  {/* Tabla de Claves (#0D0D11) */}
                  <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#0D0D11]">
                    <div className="p-3 border-b border-white/[0.08] grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                      <span className="col-span-4">Nombre / Identificador</span>
                      <span className="col-span-3">Prefijo de Token</span>
                      <span className="col-span-3">Permisos</span>
                      <span className="col-span-2 text-right">Acciones</span>
                    </div>
                    <div className="divide-y divide-white/[0.06]">
                      {apiKeys.map((keyItem) => (
                        <div key={keyItem.id} className="p-3.5 grid grid-cols-12 items-center text-xs font-mono">
                          <div className="col-span-4 space-y-0.5">
                            <span className="font-bold text-[#FAFAFA] block">{keyItem.name}</span>
                            <span className="text-[10px] text-[#71717A]">Último uso: {keyItem.lastUsed}</span>
                          </div>
                          <div className="col-span-3">
                            <span className="px-2 py-0.5 rounded bg-[#141418] border border-white/[0.08] text-[#FAFAFA]/70">
                              {keyItem.keyPrefix}
                            </span>
                          </div>
                          <div className="col-span-3 flex flex-wrap gap-1">
                            {keyItem.scopes.map((s) => (
                              <span key={s} className="px-1.5 py-0.5 rounded bg-[#141418] text-[9px] text-[#A1A1AA] border border-white/[0.06]">
                                {s}
                              </span>
                            ))}
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyKey(keyItem.keyPrefix)}
                              className="p-1.5 rounded hover:bg-white/10 text-[#A1A1AA] hover:text-[#FAFAFA] cursor-pointer"
                              title="Copiar token"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevokeKey(keyItem.id)}
                              className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer"
                              title="Revocar"
                            >
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeDomain === "workspace" && (
                <div className="space-y-6">
                  {/* Header de Equipo */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#FAFAFA]">Miembros del Espacio de Trabajo</h4>
                      <p className="text-xs font-mono text-[#71717A]">
                        Administra usuarios corporativos, roles RBAC y membresías en la organización.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Modal para invitar miembros abierto")}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#FAFAFA] text-[#09090B] hover:bg-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={12} weight="bold" />
                      <span>Invitar Usuario</span>
                    </button>
                  </div>

                  {/* Tabla de Miembros (#0D0D11) */}
                  <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#0D0D11] divide-y divide-white/[0.06]">
                    {members.map((member) => (
                      <div key={member.id} className="p-3.5 flex items-center justify-between gap-4 text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#141418] border border-white/15 flex items-center justify-center font-bold text-[#FAFAFA] text-[11px]">
                            {member.avatar}
                          </div>
                          <div>
                            <span className="font-bold text-[#FAFAFA] block">{member.name}</span>
                            <span className="text-[11px] text-[#71717A]">{member.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-[#141418] border border-white/[0.08] text-[10px] uppercase text-[#A1A1AA]">
                            {member.role}
                          </span>
                          {member.status === "invited" && (
                            <span className="px-2 py-0.5 rounded bg-[#141418] text-[#71717A] text-[10px] border border-white/[0.06]">
                              Pendiente
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDomain === "notifications" && (
                <div className="space-y-4 max-w-2xl">
                  <div className="p-4 rounded-xl bg-[#0D0D11] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-[#FAFAFA] block">Alertas de Correo Electrónico</span>
                      <span className="text-[11px] font-mono text-[#71717A]">Resúmenes semanales de facturación y consumo de GPU.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`px-3 py-1 rounded text-xs font-mono border ${
                        emailNotifications ? "bg-[#FAFAFA] text-[#09090B] border-[#FAFAFA] font-bold" : "bg-[#141418] text-[#71717A] border-white/10"
                      }`}
                    >
                      {emailNotifications ? "Activo" : "Silenciado"}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D0D11] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-[#FAFAFA] block">Incidentes Críticos & Seguridad</span>
                      <span className="text-[11px] font-mono text-[#71717A]">Avisos inmediatos por desbordamiento de cuota o bloqueos WAF.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurityAlerts(!securityAlerts)}
                      className={`px-3 py-1 rounded text-xs font-mono border ${
                        securityAlerts ? "bg-[#FAFAFA] text-[#09090B] border-[#FAFAFA] font-bold" : "bg-[#141418] text-[#71717A] border-white/10"
                      }`}
                    >
                      {securityAlerts ? "Activo" : "Silenciado"}
                    </button>
                  </div>
                </div>
              )}

              {activeDomain === "preferences" && (
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Idioma de la Plataforma</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage("es")}
                        className={`p-3 rounded-xl border text-xs font-mono text-left ${
                          language === "es" ? "bg-[#141418] border-white/20 text-[#FAFAFA] font-bold" : "bg-[#0D0D11] border-white/[0.06] text-[#71717A]"
                        }`}
                      >
                        Español (Latinoamérica / España)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage("en")}
                        className={`p-3 rounded-xl border text-xs font-mono text-left ${
                          language === "en" ? "bg-[#141418] border-white/20 text-[#FAFAFA] font-bold" : "bg-[#0D0D11] border-white/[0.06] text-[#71717A]"
                        }`}
                      >
                        English (United States)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Zona Horaria Corporativa</label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0D0D11] border border-white/10 text-xs font-mono text-[#FAFAFA] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeDomain === "billing" && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-[#0D0D11] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-semibold">Suscripción Pro Activa</span>
                      <h4 className="text-lg font-bold text-[#FAFAFA]">Enterprise Tier 3</h4>
                      <p className="text-xs font-mono text-[#71717A]">Renovación automática el 15 de Octubre de 2026</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Navegando al centro de facturación")}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#FAFAFA] text-[#09090B] hover:bg-white transition-all cursor-pointer"
                    >
                      Gestionar Facturas
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. ARQUETIPO 2: BENTO COMMAND SUITE (TOKYO MODULAR GRID)
      ───────────────────────────────────────────────────────────── */}
      {archetype === "bento" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Bento 1: Perfil Ejecutivo (7 cols) */}
            <div className="relative md:col-span-7 p-6 rounded-2xl bg-[#09090B] border border-white/[0.08] space-y-4 overflow-hidden">
              <TokyoCornerTicks />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
                  Identidad & Rol
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141418] text-[#FAFAFA] border border-white/10 font-bold">
                  Verificado
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#141418] border border-white/15 flex items-center justify-center font-mono font-bold text-[#FAFAFA] text-lg">
                  EP
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-[#FAFAFA] tracking-tight">{displayName}</h3>
                  <p className="text-xs font-mono text-[#A1A1AA]">{jobTitle}</p>
                  <p className="text-[11px] font-mono text-[#71717A]">{email}</p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.info("Edición de perfil habilitada")}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 bg-[#141418] text-[#FAFAFA]/80 hover:text-[#FAFAFA] cursor-pointer"
                >
                  Editar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("Enlace de cambio de clave enviado")}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/[0.06] text-[#71717A] hover:text-[#FAFAFA] cursor-pointer"
                >
                  Cambiar Clave
                </button>
              </div>
            </div>

            {/* Bento 2: Seguridad & 2FA (5 cols) */}
            <div className="relative md:col-span-5 p-6 rounded-2xl bg-[#09090B] border border-white/[0.08] flex flex-col justify-between overflow-hidden">
              <TokyoCornerTicks />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
                    Blindaje Criptográfico
                  </span>
                  <ShieldCheck size={16} className="text-[#FAFAFA]/80" />
                </div>
                <h4 className="text-sm font-bold text-[#FAFAFA]">2FA Hardware TOTP</h4>
                <p className="text-xs font-mono text-[#A1A1AA] leading-relaxed">
                  Claves de sesión protegidas mediante módulo HSM CELAEST Vault.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-white/[0.06]">
                <span className="text-xs font-mono text-[#71717A]">Estado:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    toast.success("Estado 2FA modificado");
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                    twoFactorEnabled ? "bg-[#FAFAFA] text-[#09090B] border-[#FAFAFA]" : "bg-[#141418] text-[#A1A1AA] border-white/10"
                  }`}
                >
                  {twoFactorEnabled ? "Habilitado" : "Deshabilitado"}
                </button>
              </div>
            </div>

            {/* Bento 3: Claves de API (5 cols) */}
            <div className="relative md:col-span-5 p-6 rounded-2xl bg-[#09090B] border border-white/[0.08] space-y-4 overflow-hidden">
              <TokyoCornerTicks />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
                  Tokens Activos
                </span>
                <span className="text-xs font-mono text-amber-400 font-semibold">{apiKeys.length} claves</span>
              </div>
              <div className="space-y-2">
                {apiKeys.slice(0, 2).map((k) => (
                  <div key={k.id} className="p-2.5 rounded-lg bg-[#0D0D11] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#FAFAFA] font-medium truncate max-w-[140px]">{k.name}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(k.keyPrefix)}
                      className="text-[#71717A] hover:text-[#FAFAFA]"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento 4: Miembros & Organización (7 cols) */}
            <div className="relative md:col-span-7 p-6 rounded-2xl bg-[#09090B] border border-white/[0.08] space-y-4 overflow-hidden">
              <TokyoCornerTicks />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
                  Equipo ({members.length})
                </span>
                <span className="text-[10px] font-mono text-sky-400 font-semibold">CELAEST Global</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {members.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-[#0D0D11] border border-white/[0.06] text-center space-y-1">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-[#141418] flex items-center justify-center font-mono font-bold text-[#FAFAFA] text-[10px]">
                      {m.avatar}
                    </div>
                    <span className="text-[11px] font-bold text-[#FAFAFA] block truncate">{m.name.split(" ")[0]}</span>
                    <span className="text-[9px] font-mono text-[#71717A] uppercase">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. ARQUETIPO 3: TOP RIBBON HUD (EXPANSIÓN HORIZONTAL)
      ───────────────────────────────────────────────────────────── */}
      {archetype === "ribbon" && (
        <div className="relative space-y-5 p-6 rounded-2xl bg-[#09090B] border border-white/[0.08] overflow-hidden">
          <TokyoCornerTicks />

          {/* Cinta Superior de Pestañas Segmentadas (#0D0D11) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/[0.08]">
            {domainsList.map((domain) => {
              const isActive = activeDomain === domain.id;
              const Icon = domain.icon;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setActiveDomain(domain.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? "bg-[#FAFAFA] text-[#09090B] border-[#FAFAFA] font-bold shadow-xs"
                      : "bg-[#0D0D11] text-[#A1A1AA] border-white/[0.06] hover:text-[#FAFAFA] hover:bg-[#141418]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{domain.label}</span>
                </button>
              );
            })}
          </div>

          {/* Vista Amplia de Pantalla Completa */}
          <div className="py-2">
            <h4 className="text-base font-bold text-[#FAFAFA] mb-1">
              {domainsList.find((d) => d.id === activeDomain)?.label}
            </h4>
            <p className="text-xs font-mono text-[#71717A] mb-6">
              Área de trabajo maximizada al 100% de ancho de pantalla bajo la paleta Tokyo Carbon #2.
            </p>

            {/* Simulación de Contenido Ancho (#0D0D11) */}
            {activeDomain === "developer" ? (
              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-4 rounded-xl bg-[#0D0D11] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-[#FAFAFA] font-bold block">{k.name}</span>
                      <span className="text-[#71717A] text-[11px]">{k.keyPrefix} • Creada el {k.created}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(k.keyPrefix)}
                      className="px-3 py-1.5 rounded-lg bg-[#141418] border border-white/10 text-[#FAFAFA]/80 hover:text-[#FAFAFA]"
                    >
                      Copiar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#0D0D11] border border-white/[0.06] text-center space-y-3">
                <CheckCircle size={32} className="mx-auto text-[#71717A]" />
                <h5 className="text-sm font-bold text-[#FAFAFA]">Dominio Operativo y Sincronizado</h5>
                <p className="text-xs font-mono text-[#A1A1AA] max-w-md mx-auto">
                  La vista de cinta superior permite trabajar con tablas de más de 8 columnas sin colisión de viewport.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. ARQUETIPO 4: DUAL CONSOLE (MAESTRO-DETALLE OPERATIVO)
      ───────────────────────────────────────────────────────────── */}
      {archetype === "console" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[560px]">
          {/* Consola Izquierda: Lista Maestra (#09090B) */}
          <div className="relative lg:col-span-5 p-5 rounded-2xl bg-[#09090B] border border-white/[0.08] space-y-3 flex flex-col justify-between overflow-hidden">
            <TokyoCornerTicks />
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#71717A]">
                  Objetos de Configuración
                </span>
                <span className="text-[10px] font-mono text-[#A1A1AA]">{apiKeys.length} Tokens</span>
              </div>
              <div className="space-y-2">
                {apiKeys.map((key) => {
                  const isSelected = selectedKeyForInspector.id === key.id;
                  return (
                    <div
                      key={key.id}
                      onClick={() => setSelectedKeyForInspector(key)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? "bg-[#141418] border-white/20 text-[#FAFAFA]"
                          : "bg-[#0D0D11] border-white/[0.06] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-[#FAFAFA]">{key.name}</span>
                        <span className="text-[9px] font-mono text-[#71717A]">{key.lastUsed}</span>
                      </div>
                      <p className="text-[11px] font-mono text-[#71717A]">{key.keyPrefix}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              className="w-full py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#FAFAFA] text-[#09090B] hover:bg-white transition-all cursor-pointer shadow-xs"
            >
              Confirmar Parámetros
            </button>
          </div>

          {/* Consola Derecha: Inspector Forense JSON & Atributos (#09090B) */}
          <div className="relative lg:col-span-7 p-6 rounded-2xl bg-[#09090B] border border-white/[0.08] space-y-4 flex flex-col justify-between overflow-hidden">
            <TokyoCornerTicks />
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#A1A1AA]" />
                  <span className="text-xs font-bold font-mono text-[#FAFAFA]">
                    Inspector de Token: {selectedKeyForInspector.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#141418] text-[#FAFAFA] border border-white/10 font-bold">
                  Sincronizado
                </span>
              </div>

              {/* JSON Live State (#0D0D11) */}
              <div className="p-4 rounded-xl bg-[#0D0D11] border border-white/10 font-mono text-xs text-[#FAFAFA]/90 overflow-x-auto leading-relaxed">
                <pre>{JSON.stringify(selectedKeyForInspector, null, 2)}</pre>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                  Acciones Rápidas del Inspector
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyKey(selectedKeyForInspector.keyPrefix)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 bg-[#141418] text-[#FAFAFA]/80 hover:text-[#FAFAFA] cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy size={12} />
                    <span>Copiar KeyPrefix</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevokeKey(selectedKeyForInspector.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 cursor-pointer"
                  >
                    Revocar Token
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#71717A]">
              <span>IA-Mesh Pipeline Integrity</span>
              <span className="text-[#FAFAFA] font-bold">Validado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
