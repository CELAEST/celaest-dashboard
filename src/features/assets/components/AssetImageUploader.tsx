import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface AssetImageUploaderProps {
  url?: string;
  file?: File | null;
  onFileChange: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  isDark: boolean;
}

export const AssetImageUploader: React.FC<AssetImageUploaderProps> = ({
  url,
  file,
  onFileChange,
  onUrlChange,
  isUploading = false,
  uploadProgress = 0,
  isDark,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local preview for current session
  const previewUrl = React.useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return url;
  }, [file, url]);

  const handleFileSelect = (newFile: File) => {
    if (!newFile) return;

    // Validate file type
    if (!newFile.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    // Validate size (max 5MB)
    if (newFile.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    onFileChange(newFile);
    toast.info("Image selected. It will be uploaded when you save the asset.");
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all overflow-hidden ${
          isDragging
            ? isDark
              ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              : "border-blue-500 bg-blue-50 shadow-md"
            : isDark
              ? "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
              : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white shadow-xs"
        } ${previewUrl ? "h-48" : "h-36"}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
          className="hidden"
          accept="image/*"
        />

        <AnimatePresence mode="wait">
          {previewUrl && !isUploading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={previewUrl}
                alt="Product Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="flex flex-col items-center gap-2 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Upload size={24} />
                  <span className="text-sm font-bold">Replace Image</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null);
                  onUrlChange("");
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all backdrop-blur-md border border-red-500/20"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center p-6 text-center"
            >
              {isUploading ? (
                <div className="space-y-4 w-full max-w-[200px]">
                  <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm font-medium animate-pulse">
                    <Loader2 className="animate-spin text-cyan-500" size={16} />
                    <span
                      className={isDark ? "text-gray-400" : "text-gray-600"}
                    >
                      Uploading to Storage...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`p-3 rounded-xl mb-3 transition-colors ${
                      isDark
                        ? "bg-white/5 text-gray-500 group-hover:bg-cyan-500/10 group-hover:text-cyan-400"
                        : "bg-white text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                    }`}
                  >
                    <Upload size={24} />
                  </div>
                  <p
                    className={`text-sm font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Drop your image here
                  </p>
                  <p
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    PNG, JPG or WebP (Max 5MB)
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual URL fallback (User requested separate fields) */}
      {!file && (
        <div className="relative">
          <input
            type="text"
            value={url || ""}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Or paste an image URL directly..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/50"
                : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
            }`}
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <ImageIcon size={16} />
          </div>
        </div>
      )}

      {/* Benefits / Badges */}
      {!previewUrl && !isUploading && (
        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Supabase Storage
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Delayed Upload
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
            <AlertCircle size={12} className="text-amber-500" />
            5MB Limit
          </div>
        </div>
      )}
    </div>
  );
};
