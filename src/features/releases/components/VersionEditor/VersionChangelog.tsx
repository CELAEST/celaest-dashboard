import React, { memo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface VersionChangelogProps {
  changelog: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const VersionChangelog: React.FC<VersionChangelogProps> = memo(
  ({ changelog, onChange, onAdd, onRemove }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <label
            className={`text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Changelog (What&apos;s New)
          </label>
          <button
            type="button"
            onClick={onAdd}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>
        <div className="space-y-3">
          {changelog.map((item, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`Change #${
                  index + 1
                } (e.g., Added multi-currency support)`}
                className={`flex-1 px-4 py-3 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAdd();
                  }
                }}
              />
              {changelog.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className={`p-3 rounded-xl transition-colors ${
                    isDark
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

VersionChangelog.displayName = "VersionChangelog";
