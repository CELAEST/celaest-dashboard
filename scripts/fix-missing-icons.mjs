/**
 * fix-missing-icons.mjs
 * Segunda pasada: corrige iconos que quedaron con nombres de Lucide
 * en archivos que ya importan desde @phosphor-icons/react
 *
 * Ejecutar: node scripts/fix-missing-icons.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, extname } from "path";

// Iconos incorrectos (Lucide/inválido → Phosphor correcto)
const FIX_MAP = {
  // Erróneamente dejados con nombre Lucide o mal mapeados
  Activity: "Pulse",
  TrendingUp: "TrendUp",
  TrendingDown: "TrendDown",
  ChatSquare: "Chat",           // MessageSquare → ChatSquare (incorrecto) → Chat

  // No estaban en el mapa original
  Home: "House",
  History: "ClockCounterClockwise",
  Bot: "Robot",
  Edit3: "PencilSimple",
  BarChart2: "ChartBar",
  BarChart3: "ChartBar",
  PieChart: "ChartPie",
  Banknote: "Money",
  Server: "HardDrives",
  UserCog: "UserGear",
  Ban: "Prohibit",
  ShieldOff: "ShieldSlash",
  LifeBuoy: "Lifebuoy",
  PackageCheck: "Package",
  PowerOff: "Power",
  Type: "TextT",
  LayoutDashboard: "SquaresFour",

  // Variantes con sufijo "Icon" que Lucide exportaba pero Phosphor no
  ChevronLeftIcon: "CaretLeft",
  ChevronUpIcon: "CaretUp",
  MoreHorizontalIcon: "DotsThree",

  // Tipo de props
  LucideProps: "IconProps",
};

function getAllFiles(dir, exts = [".tsx", ".ts"]) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git", "dist"].includes(entry.name)) continue;
      results.push(...getAllFiles(fullPath, exts));
    } else if (exts.includes(extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function fixFile(filePath) {
  const original = readFileSync(filePath, "utf-8");
  // Solo procesar archivos que ya usan @phosphor-icons/react
  if (!original.includes("@phosphor-icons/react")) return false;

  let content = original;
  for (const [wrong, correct] of Object.entries(FIX_MAP)) {
    if (wrong === correct) continue;
    const regex = new RegExp(`\\b${wrong}\\b`, "g");
    content = content.replace(regex, correct);
  }

  if (content === original) return false;
  writeFileSync(filePath, content, "utf-8");
  return true;
}

const ROOT = new URL("../src", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const files = getAllFiles(ROOT);

let fixed = 0;
let skipped = 0;

for (const file of files) {
  if (fixFile(file)) {
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`\n✅ Corrección completada:`);
console.log(`   ${fixed} archivos corregidos`);
console.log(`   ${skipped} archivos sin cambios`);
