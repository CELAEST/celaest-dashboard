import {
  X,
  CreditCard,
  Key,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Gateway {
  id: string;
  name: string;
  logo: string;
  status: "active" | "standby" | "disabled";
  apiKey: string;
  webhookUrl: string;
  testMode: boolean;
}

interface ConfigurePaymentGatewaysModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurePaymentGatewaysModal({
  darkMode,
  isOpen,
  onClose,
}: ConfigurePaymentGatewaysModalProps) {
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: "stripe",
      name: "Stripe",
      logo: "💳",
      status: "active",
      apiKey: "",
      webhookUrl: "https://api.celaest.com/webhooks/stripe",
      testMode: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "💰",
      status: "standby",
      apiKey: "",
      webhookUrl: "https://api.celaest.com/webhooks/paypal",
      testMode: false,
    },
    {
      id: "square",
      name: "Square",
      logo: "⬛",
      status: "disabled",
      apiKey: "",
      webhookUrl: "https://api.celaest.com/webhooks/square",
      testMode: true,
    },
  ]);

  const [editingGateway, setEditingGateway] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [editForm, setEditForm] = useState<Partial<Gateway>>({});

  const handleEdit = (gateway: Gateway) => {
    setEditingGateway(gateway.id);
    setEditForm(gateway);
  };

  const handleSaveEdit = () => {
    if (editingGateway && editForm) {
      setGateways(
        gateways.map((g) =>
          g.id === editingGateway ? { ...g, ...editForm } : g,
        ),
      );
      setEditingGateway(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingGateway(null);
    setEditForm({});
  };

  const handleToggleStatus = (id: string) => {
    setGateways(
      gateways.map((g) => {
        if (g.id === id) {
          const statuses: Array<"active" | "standby" | "disabled"> = [
            "active",
            "standby",
            "disabled",
          ];
          const currentIndex = statuses.indexOf(g.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...g, status: nextStatus };
        }
        return g;
      }),
    );
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskApiKey = (key: string, show: boolean) => {
    if (show) return key;
    if (!key) return "Not configured";
    return `${key.substring(0, 8)}${"•".repeat(Math.min(20, key.length - 8))}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "emerald";
      case "standby":
        return "orange";
      case "disabled":
        return "gray";
      default:
        return "gray";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div
              className={`relative w-full max-w-5xl max-h-[85vh] rounded-3xl transition-all duration-300 flex flex-col ${
                darkMode
                  ? "bg-gray-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-cyan-500/5"
                  : "bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-white/10 shrink-0">
                <button
                  onClick={onClose}
                  className={`absolute right-4 top-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      darkMode
                        ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                        : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                    }`}
                  >
                    <CreditCard
                      className={`w-8 h-8 ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                    />
                  </motion.div>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Payment Gateway Configuration
                    </h2>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Manage API keys, webhooks, and gateway settings
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-4 rounded-xl flex items-start gap-3 ${
                    darkMode
                      ? "bg-blue-500/5 border border-blue-500/20"
                      : "bg-blue-500/5 border border-blue-500/20"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  </motion.div>
                  <div>
                    <div
                      className={`text-xs font-semibold mb-1 flex items-center gap-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Security Notice
                    </div>
                    <div
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      API keys are encrypted at rest and in transit. Never share
                      your production keys.
                    </div>
                  </div>
                </motion.div>

                {/* Gateways List */}
                <div className="space-y-4">
                  {gateways.map((gateway, index) => {
                    const isEditing = editingGateway === gateway.id;
                    const statusColor = getStatusColor(gateway.status);

                    return (
                      <motion.div
                        key={gateway.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={!isEditing ? { scale: 1.01, y: -2 } : {}}
                        className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                          darkMode
                            ? "bg-black/40 backdrop-blur-xl border border-white/10"
                            : "bg-white/60 border border-gray-200 shadow-sm"
                        }`}
                      >
                        {/* Gateway Header */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-4">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="text-4xl"
                              >
                                {gateway.logo}
                              </motion.div>
                              <div>
                                <h3
                                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                                >
                                  {gateway.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      handleToggleStatus(gateway.id)
                                    }
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                                      statusColor === "emerald"
                                        ? darkMode
                                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                          : "bg-emerald-500/10 text-emerald-600 border border-emerald-200 hover:bg-emerald-500/20"
                                        : statusColor === "orange"
                                          ? darkMode
                                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20"
                                            : "bg-orange-500/10 text-orange-600 border border-orange-200 hover:bg-orange-500/20"
                                          : darkMode
                                            ? "bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20"
                                            : "bg-gray-500/10 text-gray-600 border border-gray-200 hover:bg-gray-500/20"
                                    }`}
                                  >
                                    {gateway.status.toUpperCase()}
                                  </motion.button>
                                  {gateway.testMode && (
                                    <motion.span
                                      animate={{ opacity: [0.7, 1, 0.7] }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                      }}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                        darkMode
                                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                          : "bg-yellow-500/10 text-yellow-600 border border-yellow-200"
                                      }`}
                                    >
                                      TEST MODE
                                    </motion.span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {!isEditing && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(gateway)}
                                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                  darkMode
                                    ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                                    : "bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20"
                                }`}
                              >
                                Configure
                              </motion.button>
                            )}
                          </div>

                          {/* Configuration Form */}
                          {isEditing ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4"
                            >
                              {/* API Key */}
                              <div>
                                <label
                                  className={`block text-xs font-semibold mb-2 ${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  API Key / Secret
                                </label>
                                <div className="relative">
                                  <Key
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <input
                                    type={
                                      showApiKey[gateway.id]
                                        ? "text"
                                        : "password"
                                    }
                                    value={editForm.apiKey || ""}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        apiKey: e.target.value,
                                      })
                                    }
                                    placeholder="Enter API key or secret"
                                    className={`w-full pl-10 pr-12 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 ${
                                      darkMode
                                        ? "bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50"
                                        : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                                    }`}
                                  />
                                  <button
                                    onClick={() =>
                                      toggleApiKeyVisibility(gateway.id)
                                    }
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                                      darkMode
                                        ? "text-gray-500 hover:text-gray-300"
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                                  >
                                    {showApiKey[gateway.id] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Webhook URL */}
                              <div>
                                <label
                                  className={`block text-xs font-semibold mb-2 ${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  Webhook URL
                                </label>
                                <div className="relative">
                                  <Zap
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    value={editForm.webhookUrl || ""}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        webhookUrl: e.target.value,
                                      })
                                    }
                                    placeholder="https://..."
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 ${
                                      darkMode
                                        ? "bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50"
                                        : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                                    }`}
                                  />
                                </div>
                              </div>

                              {/* Test Mode Toggle */}
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`p-4 rounded-xl flex items-center justify-between ${
                                  darkMode
                                    ? "bg-white/5 border border-white/10"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div>
                                  <div
                                    className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                                  >
                                    Test Mode
                                  </div>
                                  <div
                                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    Enable test mode for development and testing
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setEditForm({
                                      ...editForm,
                                      testMode: !editForm.testMode,
                                    })
                                  }
                                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                                    editForm.testMode
                                      ? darkMode
                                        ? "bg-linear-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
                                        : "bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                                      : darkMode
                                        ? "bg-gray-700"
                                        : "bg-gray-300"
                                  }`}
                                >
                                  <motion.div
                                    animate={{ x: editForm.testMode ? 28 : 4 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30,
                                    }}
                                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                  />
                                </button>
                              </motion.div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 justify-end pt-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleCancelEdit}
                                  className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                    darkMode
                                      ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                                      : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  Cancel
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleSaveEdit}
                                  className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                                    darkMode
                                      ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                                      : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                  }`}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Save Configuration
                                </motion.button>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* API Key Display */}
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`p-4 rounded-xl ${
                                  darkMode
                                    ? "bg-white/5 border border-white/10"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div
                                  className={`text-xs font-semibold mb-2 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  API KEY
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <code
                                    className={`text-xs font-mono ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                  >
                                    {maskApiKey(
                                      gateway.apiKey,
                                      showApiKey[gateway.id],
                                    )}
                                  </code>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      toggleApiKeyVisibility(gateway.id)
                                    }
                                    className={`p-1 rounded ${
                                      darkMode
                                        ? "hover:bg-white/10"
                                        : "hover:bg-gray-200"
                                    }`}
                                  >
                                    {showApiKey[gateway.id] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </motion.button>
                                </div>
                              </motion.div>

                              {/* Webhook URL Display */}
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`p-4 rounded-xl ${
                                  darkMode
                                    ? "bg-white/5 border border-white/10"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div
                                  className={`text-xs font-semibold mb-2 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  WEBHOOK URL
                                </div>
                                <code
                                  className={`text-xs font-mono break-all ${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {gateway.webhookUrl}
                                </code>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t shrink-0 ${
                  darkMode
                    ? "border-white/10 bg-black/20"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle
                      className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    />
                    <div
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Changes are saved automatically
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                      darkMode
                        ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/10"
                        : "bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20 shadow-lg"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Done
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
