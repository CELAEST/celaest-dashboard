import React from "react";
import { motion } from "motion/react";
import { Globe, MapPin, Activity, X } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import type { IPBinding } from "@/features/licensing/types";

interface LicenseBindingsProps {
  bindings?: IPBinding[];
  onUnbind: (ip: string) => void;
}

export const LicenseBindings: React.FC<LicenseBindingsProps> = ({
  bindings,
  onUnbind,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <h3
        className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        <Globe size={16} /> Active Bindings
      </h3>
      <div className="space-y-3">
        {bindings && bindings.length > 0 ? (
          bindings.map((binding, i) => (
            <motion.div
              key={binding.ip_address}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl border group relative ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-white hover:shadow-md transition-shadow"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div
                      className={`font-mono font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {binding.ip_address}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <Activity size={12} /> {binding.request_count} requests
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onUnbind(binding.ip_address)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Unbind IP"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-3 text-[10px] text-gray-500 flex justify-between">
                <span>
                  First seen:{" "}
                  {new Date(binding.first_seen_at).toLocaleDateString()}
                </span>
                <span>
                  Last active:{" "}
                  {new Date(binding.last_seen_at).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div
            className={`text-center py-8 rounded-xl border border-dashed ${isDark ? "border-white/10 text-gray-600" : "border-gray-200 text-gray-400"}`}
          >
            No active IP bindings
          </div>
        )}
      </div>
    </div>
  );
};
