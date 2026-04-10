/**
 * Script de migración masiva: lucide-react → @phosphor-icons/react
 * Ejecutar: node scripts/migrate-icons.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

// ─── Mapa de nombres: Lucide → Phosphor ──────────────────────────────────────
const ICON_MAP = {
  // Loaders / Spinners
  Loader2: "CircleNotch",
  Loader: "CircleNotch",

  // Chevrones / Carets
  ChevronDown: "CaretDown",
  ChevronDownIcon: "CaretDown",
  ChevronUp: "CaretUp",
  ChevronRight: "CaretRight",
  ChevronRightIcon: "CaretRight",
  ChevronLeft: "CaretLeft",
  ChevronsUpDown: "CaretUpDown",

  // Puntos / More
  MoreHorizontal: "DotsThree",
  MoreVertical: "DotsThreeVertical",
  GripVerticalIcon: "DotsSixVertical",

  // Cierre / X
  XIcon: "X",
  XCircle: "XCircle",

  // Búsqueda
  Search: "MagnifyingGlass",
  SearchIcon: "MagnifyingGlass",

  // Checks / Alertas
  CheckIcon: "Check",
  CheckCircle: "CheckCircle",
  CheckCircle2: "CheckCircle",
  AlertCircle: "Warning",
  AlertTriangle: "Warning",
  AlertOctagon: "Warning",

  // Flechas
  ArrowRight: "ArrowRight",
  ArrowLeft: "ArrowLeft",
  ArrowUpRight: "ArrowUpRight",
  ArrowDownCircle: "ArrowCircleDown",
  ArrowRightCircle: "ArrowCircleRight",

  // Shields
  ShieldAlert: "ShieldWarning",
  ShieldX: "ShieldSlash",

  // Navegación / UI
  LayoutGrid: "SquaresFour",
  EyeOff: "EyeSlash",
  Edit2: "PencilSimple",
  Edit: "PencilSimple",
  Trash2: "Trash",
  MinusIcon: "Minus",
  CircleIcon: "Circle",
  Settings: "Gear",
  Settings2: "GearSix",
  Filter: "Funnel",
  SlidersHorizontal: "Sliders",

  // Iconos de marca / visual
  Sparkles: "Sparkle",
  Zap: "Lightning",
  BrainCircuit: "Brain",
  TicketPercent: "Tag",
  Quote: "Quotes",
  Share2: "ShareNetwork",
  Award: "Medal",
  MessageSquare: "ChatSquare",

  // Refresh / Rotate
  RefreshCw: "ArrowClockwise",
  RefreshCcw: "ArrowCounterClockwise",
  RotateCcw: "ArrowCounterClockwise",

  // I/O
  Download: "DownloadSimple",
  Upload: "UploadSimple",
  Save: "FloppyDisk",
  ExternalLink: "ArrowSquareOut",

  // Usuarios / Auth
  Mail: "Envelope",
  Send: "PaperPlaneTilt",
  LogOut: "SignOut",
  LogIn: "SignIn",
  Github: "GithubLogo",
  Fingerprint: "Fingerprint",

  // Dinero / Billing
  DollarSign: "CurrencyDollar",
  CreditCard: "CreditCard",
  ShoppingCart: "ShoppingCart",
  ShoppingBag: "ShoppingBag",
  Store: "Storefront",
  Receipt: "Receipt",
  Package: "Package",

  // Empresa / Org
  Building2: "Buildings",
  Briefcase: "Briefcase",
  Layers: "Stack",
  FolderTree: "FolderOpen",
  Box: "Cube",
  Palette: "Palette",

  // Devices / Tech
  Smartphone: "DeviceMobile",
  ServerCrash: "HardDrives",
  Wifi: "WifiHigh",
  QrCode: "QrCode",

  // Media
  Image: "Image",
  Play: "Play",

  // Social / Content
  PauseCircle: "PauseCircle",
  Crown: "Crown",
  Bomb: "Bomb",
  MapPin: "MapPin",
  GitBranch: "GitBranch",
  Lightbulb: "Lightbulb",
  Tag: "Tag",
  Hash: "Hash",
  Minus: "Minus",
  Archive: "Archive",
  Square: "Square",
  FileSpreadsheet: "FileCsv",

  // Notificaciones / Feed
  Bell: "Bell",
  Info: "Info",
  Activity: "Activity",
  TrendingUp: "TrendingUp",
  TrendingDown: "TrendingDown",
};

// Tipo LucideIcon → Icon de phosphor
const TYPE_MAP = {
  LucideIcon: "Icon",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getAllFiles(dir, exts = [".tsx", ".ts"]) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
      results.push(...getAllFiles(fullPath, exts));
    } else if (exts.includes(extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function migrateFile(filePath) {
  const original = readFileSync(filePath, "utf-8");
  if (!original.includes("lucide-react")) return false;

  let content = original;

  // 1. Reemplazar imports: from "lucide-react" → from "@phosphor-icons/react"
  content = content.replace(/from ["']lucide-react["']/g, 'from "@phosphor-icons/react"');

  // 2. Renombrar el tipo LucideIcon en imports
  //    import { LucideIcon } from "@phosphor-icons/react"
  //    import type { LucideIcon } from "..."
  content = content.replace(
    /\bLucideIcon\b/g,
    "Icon"
  );

  // 3. Renombrar iconos en imports y usos (nombre del componente)
  for (const [lucideName, phosphorName] of Object.entries(ICON_MAP)) {
    if (lucideName === phosphorName) continue; // No hay cambio
    // Solo reemplazar word boundaries para no afectar strings o partes de palabras
    const regex = new RegExp(`\\b${lucideName}\\b`, "g");
    content = content.replace(regex, phosphorName);
  }

  if (content === original) return false;

  writeFileSync(filePath, content, "utf-8");
  return true;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const ROOT = new URL("../src", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
console.log(`\n🔍 Escaneando: ${ROOT}\n`);

const files = getAllFiles(ROOT);
let migrated = 0;
let skipped = 0;

for (const file of files) {
  const changed = migrateFile(file);
  if (changed) {
    const rel = file.replace(ROOT, "").replace(/\\/g, "/");
    console.log(`✅ ${rel}`);
    migrated++;
  } else {
    skipped++;
  }
}

console.log(`\n──────────────────────────────────────`);
console.log(`✅ Migrados: ${migrated} archivos`);
console.log(`⏭  Sin cambios: ${skipped} archivos`);
console.log(`──────────────────────────────────────\n`);
console.log(`Siguiente paso: npm uninstall lucide-react\n`);
