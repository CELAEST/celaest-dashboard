"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  History,
  FileCode,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { Asset, assetsService } from "../services/assets.service";
import { BackendRelease } from "../api/assets.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";
import { AssetFileUploader } from "./AssetFileUploader";

interface ReleaseManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export const ReleaseManagementModal: React.FC<ReleaseManagementModalProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  const { token, orgId } = useApiAuth();
  const [releases, setReleases] = useState<BackendRelease[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // New Release Form State
  const [newVersion, setNewVersion] = useState("");
  const [status, setStatus] = useState<"alpha" | "beta" | "rc" | "stable">(
    "beta",
  );
  const [compatibility, setCompatibility] = useState("");
  const [changelogItems, setChangelogItems] = useState<string[]>([""]);
  const [fileHash, setFileHash] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeneratingHash, setIsGeneratingHash] = useState(false);

  const generateChecksum = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsGeneratingHash(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setFileHash(`sha256:${hashHex}`);
      toast.success("Checksum generated successfully");
    } catch (error) {
      toast.error("Failed to generate checksum");
    } finally {
      setIsGeneratingHash(false);
    }
  };

  const addChangelogItem = () => {
    setChangelogItems([...changelogItems, ""]);
  };

  const updateChangelogItem = (index: number, value: string) => {
    const newItems = [...changelogItems];
    newItems[index] = value;
    setChangelogItems(newItems);
  };

  const removeChangelogItem = (index: number) => {
    if (changelogItems.length === 1) {
      setChangelogItems([""]);
      return;
    }
    setChangelogItems(changelogItems.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isOpen && asset && token && orgId) {
      fetchReleases();
    }
  }, [isOpen, asset, token, orgId]);

  const fetchReleases = async () => {
    if (!asset || !token || !orgId) return;
    setIsLoading(true);
    try {
      const data = await assetsService.getReleases(token, orgId, asset.id);
      setReleases(data || []);
    } catch (error) {
      toast.error("Failed to load releases history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRelease = async () => {
    if (!token || !orgId || !asset) return;
    if (!newVersion) {
      toast.error("Please provide a version number (e.g. 1.0.1)");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a file to upload for this release");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // 1. Upload File to Supabase
      const { supabase } = await import("@/lib/supabase/client");
      if (!supabase) throw new Error("Supabase client not available");

      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `releases/${asset.id}/${Date.now()}.${fileExt}`;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      // 2. Create Release in Backend
      await assetsService.createRelease(token, orgId, asset.id, {
        version: newVersion,
        status: status,
        download_url: urlData.publicUrl,
        file_size_bytes: selectedFile.size,
        file_hash: fileHash || undefined,
        min_app_version: compatibility || undefined,
        changelog: changelogItems.filter((item) => item.trim() !== ""),
        release_notes: changelogItems[0] || "", // Use first item or empty
      });

      toast.success(`Release ${newVersion} created successfully`);
      setUploadProgress(100);

      // Reset form
      setIsCreating(false);
      setNewVersion("");
      setCompatibility("");
      setStatus("beta");
      setChangelogItems([""]);
      setFileHash("");
      setSelectedFile(null);

      // Refresh list
      fetchReleases();
    } catch (error) {
      toast.error(`Failed to create release: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteRelease = async (releaseId: string) => {
    if (!token || !orgId) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this release? This action cannot be undone.",
      )
    )
      return;

    try {
      await assetsService.deleteRelease(token, orgId, releaseId);
      toast.success("Release deleted");
      fetchReleases();
    } catch (error) {
      toast.error("Failed to delete release");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-4xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <History size={24} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
                {isCreating ? "Create New Release" : "RELEASES HISTORY"}
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                {isCreating
                  ? "Publish a new version with full changelog"
                  : asset?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {isCreating ? (
            <div className="space-y-6">
              {/* File Uploader */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                  Upload New Version File
                </label>
                <AssetFileUploader
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                />
              </div>

              {/* Asset Name & Version */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    value={asset?.name || ""}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white/40 cursor-not-allowed italic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Version Number *
                  </label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="e.g., v2.1.0"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-white/10"
                  />
                </div>
              </div>

              {/* Status & Compatibility */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    RELEASE STATUS
                  </label>
                  <div className="relative group">
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target.value as "alpha" | "beta" | "rc" | "stable",
                        )
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="alpha">Alpha (Initial testing)</option>
                      <option value="beta">Beta (Early access testing)</option>
                      <option value="rc">RC (Release Candidate)</option>
                      <option value="stable">Stable (Production ready)</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <Plus size={14} className="rotate-45" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Compatibility
                  </label>
                  <input
                    type="text"
                    value={compatibility}
                    onChange={(e) => setCompatibility(e.target.value)}
                    placeholder="e.g., Excel 2016+ or Python 3.8+"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-white/10"
                  />
                </div>
              </div>

              {/* Changelog */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Changelog (What's New)
                  </label>
                  <button
                    onClick={addChangelogItem}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <Plus
                      size={12}
                      className="text-cyan-400 group-hover:scale-125 transition-transform"
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                      Add Item
                    </span>
                  </button>
                </div>
                <div className="space-y-2">
                  {changelogItems.map((item, index) => (
                    <div key={index} className="relative group">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          updateChangelogItem(index, e.target.value)
                        }
                        placeholder={`Change #${index + 1} (e.g., Added multi-currency support)`}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors pr-12 placeholder:text-white/10"
                      />
                      {changelogItems.length > 1 && (
                        <button
                          onClick={() => removeChangelogItem(index)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Checksum */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                  File Checksum (SHA-256)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={fileHash}
                    onChange={(e) => setFileHash(e.target.value)}
                    placeholder="click generate to create checksum..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-xs placeholder:text-white/10"
                  />
                  <button
                    onClick={generateChecksum}
                    disabled={isGeneratingHash || !selectedFile}
                    className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 group"
                  >
                    {isGeneratingHash ? (
                      <Clock size={16} className="animate-spin" />
                    ) : (
                      <div className="relative">
                        <div className="absolute -inset-1 bg-cyan-400/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CheckCircle2 size={16} className="relative" />
                      </div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Generate
                    </span>
                  </button>
                </div>

                {/* Info Alert */}
                <div className="mt-4 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex gap-4">
                  <div className="p-2 h-fit rounded-lg bg-cyan-500/10">
                    <AlertCircle size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase italic tracking-widest text-cyan-400 mb-1">
                      Checksum Verification
                    </h4>
                    <p className="text-[10px] leading-relaxed text-cyan-400/60 font-medium">
                      Customers can verify file integrity using the SHA-256
                      checksum. This ensures downloads are not corrupted or
                      tampered with.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => setIsCreating(false)}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRelease}
                  disabled={isUploading}
                  className="w-full py-4 bg-cyan-900/40 border border-cyan-500/30 text-cyan-400 rounded-2xl font-black uppercase tracking-[0.2em] italic hover:bg-cyan-500/20 transition-all disabled:opacity-50 relative overflow-hidden group"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Uploading {uploadProgress}%</span>
                    </div>
                  ) : (
                    <span className="group-hover:tracking-[0.3em] transition-all">
                      Publish Release
                    </span>
                  )}

                  {isUploading && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/60">
                  Version History
                </h3>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <Plus
                    size={16}
                    className="text-cyan-500 group-hover:scale-125 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    New Release
                  </span>
                </button>
              </div>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full"
                  />
                  <span className="text-xs font-mono text-white/20 uppercase tracking-widest">
                    Loading History...
                  </span>
                </div>
              ) : releases.length === 0 ? (
                <div className="py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center px-10">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <FileCode size={32} className="text-white/20" />
                  </div>
                  <h3 className="text-lg font-black italic text-white/40 mb-2">
                    NO RELEASES YET
                  </h3>
                  <p className="text-sm text-white/20">
                    This product doesn&apos;t have any published versions.
                    Create your first release to enable downloads.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {releases.map((rel) => (
                    <motion.div
                      key={rel.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all group focus-within:border-cyan-500/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-2xl ${rel.status === "stable" ? "bg-emerald-500/10 text-emerald-500" : "bg-cyan-500/10 text-cyan-500"}`}
                          >
                            <CheckCircle2 size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-lg font-black italic text-white">
                                v{rel.version}
                              </span>
                              <span
                                className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${rel.status === "stable" ? "bg-emerald-500 text-white" : "bg-cyan-500 text-white"}`}
                              >
                                {rel.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(rel.created_at).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>
                                {rel.file_size_bytes
                                  ? (
                                      rel.file_size_bytes /
                                      (1024 * 1024)
                                    ).toFixed(2)
                                  : "0"}{" "}
                                MB
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {rel.download_url && (
                            <a
                              href={rel.download_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                              title="Direct Download Link"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteRelease(rel.id)}
                            className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-white/40 hover:text-red-400"
                            title="Delete Release"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {rel.changelog && (
                        <div className="mt-4 pl-14">
                          <ul className="space-y-2 border-l border-white/10 pl-4">
                            {(Array.isArray(rel.changelog)
                              ? rel.changelog
                              : (rel.changelog as string)?.split("\n") || []
                            ).map((item, i) => (
                              <li
                                key={i}
                                className="text-xs text-white/60 leading-relaxed italic"
                              >
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {!rel.changelog && rel.release_notes && (
                        <div className="mt-4 pl-14">
                          <p className="text-xs text-white/60 leading-relaxed italic border-l border-white/10 pl-4">
                            &quot;{rel.release_notes}&quot;
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center gap-3">
          <AlertCircle size={16} className="text-cyan-500/60" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">
            The latest &quot;stable&quot; version is always served to customers
            by default.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
