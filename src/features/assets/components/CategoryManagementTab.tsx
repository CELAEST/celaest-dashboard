import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Tag,
  FolderOpen,
  TextT,
  Hash,
  Info,
  Palette,
  CircleNotch,
  X,
} from "@phosphor-icons/react";
import { useCategories } from "../hooks/useCategories";

interface CategoryManagementTabProps {
  isDark: boolean;
  onCreateRef?: (fn: () => void) => void;
}

export const CategoryManagementTab: React.FC<CategoryManagementTabProps> = ({
  isDark,
  onCreateRef,
}) => {
  const { categories, isLoading, isCreating, createCategory } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Package",
    color: "#3B82F6",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    onCreateRef?.(() => setIsFormOpen(true));
  }, [onCreateRef]);

  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFormOpen(false);
      };
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isFormOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
      });
      setIsFormOpen(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "Package",
        color: "#3B82F6",
      });
    } catch {
      // Error handled by hook toast
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex-1 overflow-auto pr-2 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <CircleNotch className="animate-spin text-cyan-500" size={32} />
          </div>
        ) : categories.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center h-64 rounded-3xl border-2 border-dashed ${isDark ? "border-white/5 bg-white/2" : "border-gray-200 bg-gray-50"}`}
          >
            <FolderOpen
              size={48}
              className={isDark ? "text-gray-700" : "text-gray-300"}
            />
            <p
              className={`mt-4 font-bold text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              No categories defined yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group relative p-5 rounded-2xl border transition-all ${
                    isDark
                      ? "bg-white/3 border-white/5 hover:bg-white/6 hover:border-white/10"
                      : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${cat.color}20`,
                          border: `1px solid ${cat.color}40`,
                        }}
                      >
                        <Tag size={20} style={{ color: cat.color }} />
                      </div>
                      <div>
                        <h4
                          className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {cat.name}
                        </h4>
                        <p
                          className={`text-[10px] font-mono tracking-tighter ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          /{cat.slug}
                        </p>
                      </div>
                    </div>
                  </div>
                  {cat.description && (
                    <p
                      className={`mt-4 text-xs leading-relaxed line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {cat.description}
                    </p>
                  )}
                  <div
                    className={`mt-4 pt-4 border-t flex items-center justify-between ${isDark ? "border-white/5" : "border-gray-50"}`}
                  >
                    <span
                      className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${isDark ? "bg-white/5 text-gray-500" : "bg-gray-100 text-gray-500"}`}
                    >
                      Active
                    </span>
                    <span
                      className={`text-[9px] font-mono ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    >
                      ID: {cat.id.substring(0, 8)}...
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isFormOpen && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 99999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                role="dialog"
                aria-modal="true"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                  }}
                  onClick={() => setIsFormOpen(false)}
                />

                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                  style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    maxWidth: "28rem",
                    margin: "0 1rem",
                    maxHeight: "94vh",
                    borderRadius: "1.5rem",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    background: isDark ? "#0a0a0a" : "#ffffff",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid #e5e7eb",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                    {/* Top accent line */}
                    <div
                      className={`absolute inset-x-0 top-0 h-px z-20 ${
                        isDark
                          ? "bg-linear-to-r from-transparent via-cyan-500/70 to-transparent"
                          : "bg-linear-to-r from-transparent via-blue-400/50 to-transparent"
                      }`}
                    />

                    {/* Corner glow */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "18rem",
                        height: "18rem",
                        background: isDark
                          ? "radial-gradient(circle at top right, rgba(6,182,212,0.06), transparent 70%)"
                          : "radial-gradient(circle at top right, rgba(59,130,246,0.06), transparent 70%)",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    />

                    {/* Header */}
                    <div
                      className="relative px-6 py-5 flex items-center justify-between overflow-hidden shrink-0"
                      style={{
                        borderBottom: isDark
                          ? "1px solid rgba(255,255,255,0.07)"
                          : "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* Gradient wash */}
                      <div
                        className={`absolute inset-0 ${
                          isDark
                            ? "bg-linear-to-r from-cyan-500/10 via-teal-600/8 to-transparent"
                            : "bg-linear-to-r from-cyan-50 via-blue-50/60 to-transparent"
                        }`}
                      />
                      {/* Grid dots */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: isDark
                            ? "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)"
                            : "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                          pointerEvents: "none",
                        }}
                      />
                      {/* Bottom accent line */}
                      <div
                        className={`absolute bottom-0 left-0 h-px w-2/5 ${
                          isDark
                            ? "bg-linear-to-r from-cyan-500/50 to-transparent"
                            : "bg-linear-to-r from-cyan-400/30 to-transparent"
                        }`}
                      />

                      <div className="relative z-10 flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
                            isDark
                              ? "bg-[#111] text-cyan-400 border border-white/10 shadow-cyan-500/10"
                              : "bg-white text-cyan-600 border border-cyan-100 shadow-cyan-200/40"
                          }`}
                        >
                          <FolderOpen size={22} weight="duotone" />
                        </div>
                        <h3
                          className={`text-lg font-black uppercase italic tracking-tighter ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          New Category
                        </h3>
                      </div>
                      <div className="relative z-10">
                        <button
                          onClick={() => setIsFormOpen(false)}
                          aria-label="Cerrar formulario de categoría"
                          className={`p-2 rounded-full transition-colors ${
                            isDark
                              ? "hover:bg-white/10 text-gray-400 hover:text-white"
                              : "hover:bg-black/5 text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit}
                      className="flex-1 overflow-y-auto p-6 space-y-6"
                    >
                      <div className="space-y-2">
                        <label
                          className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <TextT size={12} /> Name
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:bg-white/8 focus:border-cyan-500/50 outline-none"
                              : "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500/50 outline-none"
                          }`}
                          placeholder="e.g. Premium Tools"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <Hash size={12} /> Slug
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              slug: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            })
                          }
                          className={`w-full px-4 py-3 rounded-xl text-sm font-mono transition-all border ${
                            isDark
                              ? "bg-white/5 border-white/10 text-cyan-400 focus:bg-white/8 focus:border-cyan-500/50 outline-none"
                              : "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500/50 outline-none"
                          }`}
                          placeholder="premium-tools (auto-generated if empty)"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <Info size={12} /> Description
                        </label>
                        <textarea
                          rows={4}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all resize-none border ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:bg-white/8 focus:border-cyan-500/50 outline-none"
                              : "bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500/50 outline-none"
                          }`}
                          placeholder="Provide a brief overview of this category..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <Palette size={12} /> Visual Accent
                        </label>
                        <div
                          className={`flex items-center gap-4 p-3 rounded-2xl ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                color: e.target.value,
                              })
                            }
                            className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
                          />
                          <div className="flex-1">
                            <p
                              className={`text-[10px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              Color Identity
                            </p>
                            <p
                              className={`text-[9px] uppercase font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}
                            >
                              {formData.color}
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Footer */}
                    <div
                      className={`p-6 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}
                    >
                      <motion.button
                        disabled={isCreating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${
                          isDark
                            ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50"
                            : "bg-blue-600 text-white shadow-xl hover:bg-blue-700 disabled:opacity-50"
                        }`}
                      >
                        {isCreating ? (
                          <CircleNotch className="animate-spin" size={20} />
                        ) : (
                          <FolderOpen size={18} />
                        )}
                        {isCreating ? "Deploying..." : "Finalize Category"}
                      </motion.button>
                    </div>
                  </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};
