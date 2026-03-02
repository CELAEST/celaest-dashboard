import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Tag,
  FolderTree,
  Type,
  Hash,
  Info,
  Palette,
  Loader2,
  X,
} from "lucide-react";
import { useCategories } from "../hooks/useCategories";

interface CategoryManagementTabProps {
  isDark: boolean;
}

export const CategoryManagementTab: React.FC<CategoryManagementTabProps> = ({
  isDark,
}) => {
  const { categories, isLoading, isCreating, createCategory } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Package",
    color: "#3B82F6",
  });

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3
            className={`text-2xl font-black italic tracking-tighter uppercase ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Category Architecture
          </h3>
          <p
            className={`text-xs mt-1 font-medium tracking-wide ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            ORG-SCOPED TAXONOMY CONTROL CENTER
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
            isDark
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
          }`}
        >
          <Plus size={16} />
          Define Category
        </motion.button>
      </div>

      <div className="flex-1 overflow-auto pr-2 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
          </div>
        ) : categories.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center h-64 rounded-3xl border-2 border-dashed ${isDark ? "border-white/5 bg-white/2" : "border-gray-200 bg-gray-50"}`}
          >
            <FolderTree
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

      {/* Slide-over Form Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className={`w-full max-w-md h-[calc(100vh-2rem)] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${isDark ? "bg-[#0c0c0c] border border-white/10" : "bg-white"}`}
            >
              <div
                className={`p-6 border-b flex items-center justify-between ${isDark ? "border-white/5 bg-white/2" : "border-gray-100 bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-100 text-blue-600"}`}
                  >
                    <FolderTree size={20} />
                  </div>
                  <h3
                    className={`font-black uppercase italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    New Category
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/5 text-gray-500" : "hover:bg-gray-100 text-gray-400"}`}
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-auto p-6 space-y-6 scrollbar-thin"
              >
                <div className="space-y-2">
                  <label
                    className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <Type size={12} /> Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isDark
                        ? "bg-white/3 border-white/5 text-white focus:bg-white/6 focus:border-cyan-500/50 outline-none"
                        : "bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500/50 outline-none"
                    }`}
                    placeholder="e.g. Premium Tools"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <Hash size={12} /> Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl text-sm font-mono transition-all ${
                      isDark
                        ? "bg-white/[0.03] border-white/5 text-cyan-400 focus:bg-white/[0.06] focus:border-cyan-500/50 outline-none"
                        : "bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500/50 outline-none"
                    }`}
                    placeholder="premium-tools (auto-generated if empty)"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <Info size={12} /> Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all resize-none ${
                      isDark
                        ? "bg-white/[0.03] border-white/5 text-white focus:bg-white/[0.06] focus:border-cyan-500/50 outline-none"
                        : "bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500/50 outline-none"
                    }`}
                    placeholder="Provide a brief overview of this category..."
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <Palette size={12} /> Visual Accent
                  </label>
                  <div className="flex items-center gap-4 p-2 rounded-2xl bg-white/[0.02] border border-white/5">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
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

              <div
                className={`p-6 border-t ${isDark ? "border-white/5 bg-white/1" : "border-gray-100 bg-gray-50"}`}
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
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <FolderTree size={18} />
                  )}
                  {isCreating ? "Deploying..." : "Finalize Category"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
