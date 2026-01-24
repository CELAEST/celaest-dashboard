import { X, Globe, Plus, Edit2, Trash2, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TaxRate {
  id: string;
  country: string;
  code: string;
  rate: string;
  vatType: string;
  isActive: boolean;
}

interface ManageTaxRatesModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageTaxRatesModal({
  darkMode,
  isOpen,
  onClose,
}: ManageTaxRatesModalProps) {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    {
      id: "1",
      country: "United States",
      code: "US",
      rate: "0",
      vatType: "VAT/VA",
      isActive: true,
    },
    {
      id: "2",
      country: "European Union",
      code: "EU",
      rate: "21",
      vatType: "VAT/VA",
      isActive: true,
    },
    {
      id: "3",
      country: "United Kingdom",
      code: "UK",
      rate: "20",
      vatType: "VAT/VA",
      isActive: true,
    },
    {
      id: "4",
      country: "Canada",
      code: "CA",
      rate: "5",
      vatType: "GST",
      isActive: true,
    },
    {
      id: "5",
      country: "Australia",
      code: "AU",
      rate: "10",
      vatType: "GST",
      isActive: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [, setEditingId] = useState<string | null>(null);
  const [newTaxRate, setNewTaxRate] = useState({
    country: "",
    code: "",
    rate: "",
    vatType: "VAT",
  });

  const handleAddTaxRate = () => {
    if (newTaxRate.country && newTaxRate.code && newTaxRate.rate) {
      setTaxRates([
        ...taxRates,
        {
          id: Date.now().toString(),
          country: newTaxRate.country,
          code: newTaxRate.code.toUpperCase(),
          rate: newTaxRate.rate,
          vatType: newTaxRate.vatType,
          isActive: true,
        },
      ]);
      setNewTaxRate({ country: "", code: "", rate: "", vatType: "VAT" });
      setIsAdding(false);
    }
  };

  const handleDeleteTaxRate = (id: string) => {
    setTaxRates(taxRates.filter((rate) => rate.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setTaxRates(
      taxRates.map((rate) =>
        rate.id === id ? { ...rate, isActive: !rate.isActive } : rate,
      ),
    );
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
                  ? "bg-gray-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-500/5"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        duration: 0.8,
                        bounce: 0.5,
                      }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        darkMode
                          ? "bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                          : "bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                      }`}
                    >
                      <Globe
                        className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
                      />
                    </motion.div>
                    <div>
                      <h2
                        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Manage Tax Rates
                      </h2>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Configure tax rates by country and region
                      </p>
                    </div>
                  </div>

                  {/* Add New Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAdding(!isAdding)}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                      isAdding
                        ? darkMode
                          ? "bg-purple-500/20 border border-purple-500/30 text-purple-400"
                          : "bg-purple-500/20 border border-purple-500/30 text-purple-600"
                        : darkMode
                          ? "bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                          : "bg-purple-500/10 border border-purple-500/20 text-purple-600 hover:bg-purple-500/20"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </motion.button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Add New Form */}
                <AnimatePresence>
                  {isAdding && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", bounce: 0.3 }}
                      className={`rounded-2xl p-5 overflow-hidden ${
                        darkMode
                          ? "bg-purple-500/5 border border-purple-500/20 shadow-lg"
                          : "bg-purple-500/5 border border-purple-500/20 shadow-lg"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles
                          className={`w-4 h-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
                        />
                        <h3
                          className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Add New Tax Rate
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                        <div className="md:col-span-2">
                          <label
                            className={`block text-xs font-semibold mb-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Country/Region
                          </label>
                          <input
                            type="text"
                            value={newTaxRate.country}
                            onChange={(e) =>
                              setNewTaxRate({
                                ...newTaxRate,
                                country: e.target.value,
                              })
                            }
                            placeholder="Enter country name"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                              darkMode
                                ? "bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50"
                                : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500"
                            }`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Code
                          </label>
                          <input
                            type="text"
                            value={newTaxRate.code}
                            onChange={(e) =>
                              setNewTaxRate({
                                ...newTaxRate,
                                code: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="US"
                            maxLength={3}
                            className={`w-full px-4 py-2.5 rounded-xl font-mono uppercase text-sm transition-all duration-300 ${
                              darkMode
                                ? "bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50"
                                : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500"
                            }`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Rate (%)
                          </label>
                          <input
                            type="number"
                            value={newTaxRate.rate}
                            onChange={(e) =>
                              setNewTaxRate({
                                ...newTaxRate,
                                rate: e.target.value,
                              })
                            }
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                              darkMode
                                ? "bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50"
                                : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsAdding(false)}
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
                          onClick={handleAddTaxRate}
                          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                            darkMode
                              ? "bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                              : "bg-purple-500/20 border border-purple-500/30 text-purple-600 hover:bg-purple-500/30"
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          Add Tax Rate
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tax Rates List */}
                <div className="space-y-3">
                  {taxRates.map((rate, index) => (
                    <motion.div
                      key={rate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className={`group rounded-xl p-4 transition-all duration-300 ${
                        darkMode
                          ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30"
                          : "bg-white/60 border border-gray-200 hover:border-purple-500/30 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Country */}
                          <div className="flex-1">
                            <div
                              className={`text-xs font-semibold mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              COUNTRY/REGION
                            </div>
                            <div
                              className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {rate.country}
                            </div>
                          </div>

                          {/* Code */}
                          <div>
                            <div
                              className={`text-xs font-semibold mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              CODE
                            </div>
                            <div
                              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
                                darkMode
                                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                                  : "bg-purple-500/10 border border-purple-500/20 text-purple-600"
                              }`}
                            >
                              {rate.code}
                            </div>
                          </div>

                          {/* Rate */}
                          <div>
                            <div
                              className={`text-xs font-semibold mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              TAX RATE
                            </div>
                            <div
                              className={`text-2xl font-bold ${
                                darkMode ? "text-cyan-400" : "text-blue-600"
                              }`}
                            >
                              {rate.rate}%
                            </div>
                          </div>

                          {/* VAT Type */}
                          <div>
                            <div
                              className={`text-xs font-semibold mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              TYPE
                            </div>
                            <div
                              className={`text-xs font-mono ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                            >
                              {rate.vatType}
                            </div>
                          </div>

                          {/* Status */}
                          <div>
                            <div
                              className={`text-xs font-semibold mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              STATUS
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggleActive(rate.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                                rate.isActive
                                  ? darkMode
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-200 hover:bg-emerald-500/20"
                                  : darkMode
                                    ? "bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20"
                                    : "bg-gray-500/10 text-gray-600 border border-gray-200 hover:bg-gray-500/20"
                              }`}
                            >
                              {rate.isActive ? "ACTIVE" : "INACTIVE"}
                            </motion.button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingId(rate.id)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              darkMode
                                ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTaxRate(rate.id)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              darkMode
                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Empty State */}
                {taxRates.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <Globe className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <div className="text-base font-semibold mb-2">
                      No tax rates configured
                    </div>
                    <div className="text-xs">
                      Add your first tax rate to get started
                    </div>
                  </motion.div>
                )}
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
                  <div
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {taxRates.length} tax rate{taxRates.length !== 1 ? "s" : ""}{" "}
                    configured
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                      darkMode
                        ? "bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 shadow-lg shadow-purple-500/10"
                        : "bg-purple-500/10 border border-purple-500/20 text-purple-600 hover:bg-purple-500/20 shadow-lg"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
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
