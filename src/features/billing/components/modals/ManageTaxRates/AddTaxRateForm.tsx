import React from "react";
import { Plus, Save, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SettingsSelect } from "../../../../settings/components/SettingsSelect";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { TaxRate } from "../../../types";
import { COUNTRIES } from "../../../constants/countries";

interface AddTaxRateFormProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  editingId: string | null;
  newTaxRate: Partial<TaxRate>;
  setNewTaxRate: (rate: Partial<TaxRate>) => void;
  handleAddTaxRate: () => void;
  handleSaveEdit: () => void;
}

export const AddTaxRateForm: React.FC<AddTaxRateFormProps> = ({
  isAdding,
  setIsAdding,
  editingId,
  newTaxRate,
  setNewTaxRate,
  handleAddTaxRate,
  handleSaveEdit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isEditing = !!editingId;

  return (
    <AnimatePresence>
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`rounded-2xl p-5 mb-4 relative z-10 ${
            isDark
              ? "bg-purple-500/5 border border-purple-500/20 shadow-lg shadow-purple-500/5"
              : "bg-purple-500/5 border border-purple-500/20 shadow-lg shadow-purple-500/5"
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (isEditing) {
                handleSaveEdit();
              } else {
                handleAddTaxRate();
              }
            }
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`p-1.5 rounded-lg ${
                isDark ? "bg-purple-500/20" : "bg-purple-100"
              }`}
            >
              {isEditing ? (
                <Save
                  className={`w-4 h-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              ) : (
                <Plus
                  className={`w-4 h-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              )}
            </div>
            <h3
              className={`text-base font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {isEditing ? "Edit Tax Rate" : "Add New Tax Rate"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_80px_1fr] gap-4 mb-4">
            {/* Country Selector */}
            <div className="flex flex-col gap-1.5">
              <SettingsSelect
                label="Country"
                value={newTaxRate.region || ""}
                onChange={(val) => {
                  const country = COUNTRIES.find((c) => c.name === val);
                  if (country) {
                    setNewTaxRate({
                      ...newTaxRate,
                      region: country.name,
                      // Auto-identify code-based ID only if not editing or if explicitly matching
                      id: isEditing
                        ? newTaxRate.id
                        : `tax_${country.code.toLowerCase()}_standard`,
                      name: isEditing
                        ? newTaxRate.name
                        : `${country.name} Standard`,
                    });
                  }
                }}
                options={COUNTRIES.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
              />
            </div>

            {/* Display Name */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Label/Name
              </label>
              <input
                type="text"
                value={newTaxRate.name || ""}
                onChange={(e) =>
                  setNewTaxRate({
                    ...newTaxRate,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Standard VAT"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-300 outline-none ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                    : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                }`}
              />
            </div>

            {/* Rate */}
            <div className="flex flex-col gap-1.5 pt-px">
              <label
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Rate (%)
              </label>
              <input
                type="number"
                value={newTaxRate.rate || ""}
                onChange={(e) =>
                  setNewTaxRate({
                    ...newTaxRate,
                    rate: e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-4 py-2.5 rounded-xl text-sm text-center font-bold transition-all duration-300 outline-none ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                    : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                }`}
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <SettingsSelect
                label="Tax Type"
                value={newTaxRate.type || "VAT"}
                onChange={(val) =>
                  setNewTaxRate({ ...newTaxRate, type: val as string })
                }
                options={[
                  { value: "VAT", label: "VAT" },
                  { value: "GST", label: "GST" },
                  { value: "Sales Tax", label: "Sales Tax" },
                ]}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(false)}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isDark
                  ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                  : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isEditing ? handleSaveEdit : handleAddTaxRate}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                isDark
                  ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20"
                  : "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20"
              }`}
            >
              {isEditing ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Update Rate
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Tax Rate
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
