import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Layers,
  Server,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface License {
  id: string;
  key?: string;
  userId: string;
  productId: string;
  productType: string;
  status: "active" | "expired" | "revoked" | "pending";
  maxIpSlots: number;
  ipBindings?: IpBinding[];
  ipSlotsUsed?: number;
  metadata: {
    expiresAt?: string;
    maxUsageCount?: number;
    currentUsageCount?: number;
    tier?: string;
    notes?: string;
  };
  createdAt: string;
  lastValidatedAt?: string;
}

interface IpBinding {
  licenseId: string;
  ip: string;
  firstSeenAt: string;
  lastSeenAt: string;
  requestCount: number;
  userAgent?: string;
}

interface ValidationLog {
  licenseId: string;
  ip: string;
  timestamp: string;
  success: boolean;
  reason?: string;
}

interface LicenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  logs: ValidationLog[];
  onStatusChange: (status: string) => void;
  onUnbindIp: (ip: string) => void;
}

export const LicenseDetailsModal = ({
  isOpen,
  onClose,
  license,
  logs,
  onStatusChange,
  onUnbindIp,
}: LicenseDetailsModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!license) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-99999"
          />
          <div className="fixed inset-y-0 right-0 z-100000 w-full max-w-2xl pointer-events-none flex justify-end">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full h-full pointer-events-auto flex flex-col shadow-2xl ${
                isDark
                  ? "bg-[#0a0a0a] border-l border-white/10"
                  : "bg-white border-l border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="p-6 border-b shrink-0 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2
                      className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {license.productId}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border uppercase ${
                        license.status === "active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : license.status === "expired"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {license.status}
                    </span>
                  </div>
                  <div
                    className={`text-sm font-mono ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    ID: {license.id}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-white/10 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["active", "expired", "revoked"].map((status) => (
                    <button
                      key={status}
                      onClick={() => onStatusChange(status)}
                      disabled={license.status === status}
                      className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${
                        license.status === status
                          ? isDark
                            ? "bg-white/10 text-white border-white/20"
                            : "bg-gray-100 text-gray-900 border-gray-300"
                          : isDark
                            ? "border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      Set {status}
                    </button>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                  >
                    <div className="text-gray-500 text-xs mb-1">Usage Tier</div>
                    <div
                      className={`font-bold capitalize flex items-center gap-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                    >
                      <Layers size={16} /> {license.metadata.tier || "Standard"}
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
                  >
                    <div className="text-gray-500 text-xs mb-1">
                      Max IP Slots
                    </div>
                    <div
                      className={`font-bold flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                    >
                      <Server size={16} /> {license.maxIpSlots}
                    </div>
                  </div>
                </div>

                {/* IP Bindings Visual */}
                <div>
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <Globe size={16} /> Active Bindings
                  </h3>
                  <div className="space-y-3">
                    {license.ipBindings && license.ipBindings.length > 0 ? (
                      license.ipBindings.map((binding, i) => (
                        <motion.div
                          key={binding.ip}
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
                                  {binding.ip}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                  <Activity size={12} /> {binding.requestCount}{" "}
                                  requests
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => onUnbindIp(binding.ip)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Unbind IP"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="mt-3 text-[10px] text-gray-500 flex justify-between">
                            <span>
                              First seen:{" "}
                              {new Date(
                                binding.firstSeenAt,
                              ).toLocaleDateString()}
                            </span>
                            <span>
                              Last active:{" "}
                              {new Date(
                                binding.lastSeenAt,
                              ).toLocaleTimeString()}
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

                {/* Validation Log Timeline */}
                <div>
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <Clock size={16} /> Recent Activity
                  </h3>
                  <div
                    className={`relative pl-4 space-y-6 border-l ${isDark ? "border-white/10" : "border-gray-200"}`}
                  >
                    {logs.slice(0, 5).map((log, i) => (
                      <div key={i} className="relative pl-6">
                        <div
                          className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                            log.success
                              ? isDark
                                ? "bg-green-500 border-black"
                                : "bg-green-500 border-white"
                              : isDark
                                ? "bg-red-500 border-black"
                                : "bg-red-500 border-white"
                          }`}
                        />
                        <div
                          className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {log.success
                            ? "License Validated"
                            : "Validation Failed"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <span className="font-mono">{log.ip}</span> •{" "}
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        {!log.success && (
                          <div className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle size={12} /> {log.reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
