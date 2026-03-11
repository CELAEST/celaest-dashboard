import React from "react";
import { Lightning, Code, HardDrives, Stack } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

export const PRODUCT_TYPES = [
  {
    value: "excel-automation",
    label: "Excel Automation",
    icon: Lightning,
    color: "text-green-500",
    desc: "Automate complex spreadsheets",
  },
  {
    value: "python-script",
    label: "Python Script",
    icon: Code,
    color: "text-blue-500",
    desc: "Execute Python workflows",
  },
  {
    value: "nodejs-api",
    label: "Node.js API",
    icon: HardDrives,
    color: "text-yellow-500",
    desc: "Backend integration",
  },
  {
    value: "macro-suite",
    label: "Macro Suite",
    icon: Stack,
    color: "text-purple-500",
    desc: "Advanced macro controls",
  },
];

interface LicenseTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export const LicenseTypeSelector: React.FC<LicenseTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}
      >
        Product TextT
      </label>
      <div className="grid grid-cols-2 gap-3">
        {PRODUCT_TYPES.map((type) => (
          <div
            key={type.value}
            onClick={() => onSelect(type.value)}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
              selectedType === type.value
                ? isDark
                  ? "bg-amber-500/10 border-amber-500/50"
                  : "bg-blue-50 border-blue-500"
                : isDark
                  ? "bg-white/5 border-white/5 hover:bg-white/10"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <type.icon size={20} className={type.color} />
            <div>
              <div
                className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {type.label}
              </div>
              <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                {type.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
