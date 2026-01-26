import {
  X,
  Save,
  Edit2,
  User,
  Package,
  CreditCard,
  Key,
  FileText,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { SettingsSelect } from "../../../settings/components/SettingsSelect";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Order {
  id: string;
  product: string;
  customer: string;
  date: string;
  status: "Processing" | "Shipped" | "Pending" | "Delivered";
  amount: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  initialMode?: "view" | "edit";
  onSave?: (updatedOrder: Order) => void;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  initialMode = "view",
  onSave,
}: OrderDetailsModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [formData, setFormData] = useState<Order | null>(null);

  // Track props to reset state when they change (prevents cascading renders)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevOrder, setPrevOrder] = useState(order);
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);

  if (
    isOpen !== prevIsOpen ||
    order !== prevOrder ||
    initialMode !== prevInitialMode
  ) {
    setPrevIsOpen(isOpen);
    setPrevOrder(order);
    setPrevInitialMode(initialMode);

    if (isOpen && order) {
      setFormData(order);
      setMode(initialMode);
    }
  }

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (onSave && formData) {
      onSave(formData);
    }
    onClose();
  };

  // Ensure portal target exists
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-99999"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className={`w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto ${
                isDark ? "bg-[#0a0a0a]" : "bg-white"
              }`}
            >
              {/* Header with Gradient */}
              <div
                className={`relative px-8 py-6 flex justify-between items-start overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 opacity-10 ${
                    isDark
                      ? "bg-linear-to-r from-purple-500 via-indigo-600 to-blue-600"
                      : "bg-linear-to-r from-purple-100 via-indigo-100 to-blue-100"
                  }`}
                />

                <div className="relative z-10 flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      isDark
                        ? "bg-[#111] text-purple-400 border border-white/10"
                        : "bg-white text-purple-600 shadow-purple-200/50"
                    }`}
                  >
                    <Package size={24} />
                  </div>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Order {formData.id}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                          isDark
                            ? "bg-white/10 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Purchased: {formData.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-full transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-gray-400"
                        : "hover:bg-black/5 text-gray-500"
                    }`}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Body Content - Two Column Layout */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                  {/* Left Column: Main Info */}
                  <div className="space-y-8">
                    {/* Product Section */}
                    <div className="space-y-4">
                      <h3
                        className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Digital Product
                      </h3>
                      <div
                        className={`p-4 rounded-xl border transition-colors ${
                          isDark
                            ? "bg-white/5 border-white/5"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        {mode === "view" ? (
                          <div className="space-y-1">
                            <div
                              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {formData.product}
                            </div>
                            <div
                              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                            >
                              License Type: Enterprise
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label
                              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                            >
                              Product Name
                            </label>
                            <input
                              type="text"
                              value={formData.product}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  product: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 rounded-lg bg-transparent border outline-none font-semibold ${
                                isDark
                                  ? "border-white/10 focus:border-purple-500 text-white"
                                  : "border-gray-200 focus:border-purple-500 text-gray-900"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Log / Status Tracker */}
                    <div className="space-y-4">
                      <h3
                        className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Activity Log
                      </h3>
                      {mode === "view" ? (
                        <div className="relative">
                          {/* Explicit Center Line */}
                          <div
                            className={`absolute top-2 bottom-0 left-[7px] w-[2px] border-l-2 border-dashed ${
                              isDark
                                ? "border-indigo-500/30"
                                : "border-indigo-300"
                            }`}
                          />

                          {/* Items */}
                          <div className="space-y-8">
                            {/* Current Status */}
                            <div className="relative pl-8">
                              <div
                                className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 ${
                                  isDark
                                    ? "bg-indigo-500 border-indigo-900 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    : "bg-indigo-600 border-white shadow-md"
                                }`}
                              />
                              <div
                                className={`font-semibold text-base leading-tight ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
                              >
                                {formData.status}
                              </div>
                              <div
                                className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                              >
                                Current Status
                              </div>
                            </div>

                            {/* Email Sent (Mock) */}
                            <div className="relative pl-8 opacity-70">
                              <div
                                className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 ${
                                  isDark
                                    ? "bg-gray-800 border-[#0a0a0a]"
                                    : "bg-gray-200 border-white"
                                }`}
                              />
                              <div
                                className={`font-semibold text-base leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
                              >
                                License Key Generated
                              </div>
                              <div
                                className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                              >
                                Automated System
                              </div>
                            </div>

                            {/* Order Placed (Mock) */}
                            <div className="relative pl-8 opacity-40">
                              <div
                                className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 ${
                                  isDark
                                    ? "bg-gray-800 border-[#0a0a0a]"
                                    : "bg-gray-200 border-white"
                                }`}
                              />
                              <div
                                className={`font-semibold text-base leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
                              >
                                Payment Confirmed
                              </div>
                              <div
                                className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                              >
                                {formData.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Update Status
                          </label>
                          <SettingsSelect
                            label=""
                            value={formData.status}
                            onChange={(val) =>
                              setFormData({
                                ...formData,
                                status: val as Order["status"],
                              })
                            }
                            options={[
                              { value: "Processing", label: "Processing" },
                              { value: "Shipped", label: "Active" },
                              { value: "Delivered", label: "Completed" },
                              { value: "Pending", label: "Pending" },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Sidebar */}
                  <div
                    className={`rounded-2xl p-6 space-y-6 ${
                      isDark
                        ? "bg-white/5 border border-white/5"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    {/* Price Card */}
                    <div className="text-center pb-6 border-b border-gray-500/10">
                      <div
                        className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Total Paid
                      </div>
                      {mode === "view" ? (
                        <div
                          className={`text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {formData.amount}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <span className="text-2xl mr-1 text-gray-500">$</span>
                          <input
                            type="number"
                            className={`w-32 bg-transparent text-center text-3xl font-bold outline-none border-b border-dashed ${
                              isDark
                                ? "text-white border-gray-700"
                                : "text-gray-900 border-gray-300"
                            }`}
                            value={formData.amount
                              .replace("$", "")
                              .replace(",", "")}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amount: `$${e.target.value}`,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}
                        >
                          <User
                            size={16}
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Customer
                          </div>
                          {mode === "view" ? (
                            <div
                              className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {formData.customer}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={formData.customer}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  customer: e.target.value,
                                })
                              }
                              className={`w-full mt-1 bg-transparent border-b outline-none text-sm ${
                                isDark
                                  ? "border-gray-700 text-white"
                                  : "border-gray-300 text-gray-900"
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}
                        >
                          <CreditCard
                            size={16}
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Method
                          </div>
                          <div
                            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                          >
                            Stripe •••• 4242
                          </div>
                        </div>
                      </div>

                      {/* License Key Mockup instead of Shipping */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}
                        >
                          <Key
                            size={16}
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            License Key
                          </div>
                          <div
                            className={`text-sm font-mono truncate w-32 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                          >
                            XXXX-XXXX-XXXX
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}
                        >
                          <Mail
                            size={16}
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Delivery Email
                          </div>
                          <div
                            className={`text-sm truncate w-32 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                          >
                            user@example.com
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() =>
                          toast.success(
                            `Downloading invoice for ${formData.id}...`,
                            { description: "Check your downloads folder." },
                          )
                        }
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-colors ${
                          isDark
                            ? "border-white/10 hover:bg-white/5 text-gray-300"
                            : "border-gray-200 hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <FileText size={16} />
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div
                className={`px-8 py-5 border-t flex justify-between items-center ${isDark ? "border-white/10" : "border-gray-100"}`}
              >
                <div
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Last edit: {formData.date}
                </div>
                <div className="flex gap-3">
                  {mode === "view" ? (
                    <>
                      <button
                        onClick={onClose}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => setMode("edit")}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 ${
                          isDark
                            ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                            : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                        }`}
                      >
                        <Edit2 size={16} />
                        Edit Details
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setMode("view")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 ${
                          isDark
                            ? "bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 shadow-green-500/20"
                            : "bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-green-500/20"
                        }`}
                      >
                        <Save size={16} />
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
