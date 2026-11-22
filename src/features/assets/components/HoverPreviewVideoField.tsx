import React, { useEffect, useRef, useState } from "react";
import { FilmStrip, UploadSimple, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_CLIP_MB = 15;
const ACCEPTED_CLIP_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

interface HoverPreviewVideoFieldProps {
  url?: string;
  file?: File | null;
  onUrlChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
  isDark: boolean;
}

/** Modular uploader + CDN URL input for instant hover MP4/WebM product card clips. */
export const HoverPreviewVideoField: React.FC<HoverPreviewVideoFieldProps> = ({
  url,
  file,
  onUrlChange,
  onFileChange,
  isDark,
}) => {
  const t = useTranslations("marketplace");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    // Defer sync update cleanly to cleanup lifecycle
    const id = window.setTimeout(() => setObjectUrl(nextUrl), 0);
    return () => {
      window.clearTimeout(id);
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  const activePreviewUrl = file ? objectUrl : url?.trim() || "";

  const handleSelectFile = (selected: File | undefined) => {
    if (!selected) return;
    if (!ACCEPTED_CLIP_TYPES.includes(selected.type)) {
      toast.error(t("hover_clip_invalid_type"));
      return;
    }
    if (selected.size > MAX_CLIP_MB * 1024 * 1024) {
      toast.error(t("hover_clip_too_large"));
      return;
    }
    onFileChange(selected);
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="preview_video_url"
        className={`flex items-center gap-2 text-xs uppercase tracking-wider font-bold ${
          isDark ? "text-gray-300" : "text-gray-400"
        }`}
      >
        <FilmStrip size={14} weight="fill" className="text-cyan-400" />
        {t("hover_clip_label")}
      </label>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          id="preview_video_url"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={url ?? ""}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={t("hover_clip_placeholder")}
          className={`flex-1 px-4 py-3 rounded-lg border transition-all outline-none text-sm font-mono ${
            isDark
              ? "bg-white/8 border-white/13 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/12"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          }`}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => handleSelectFile(e.target.files?.[0])}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 ${
            isDark
              ? "bg-white/6 border-white/15 text-cyan-300 hover:bg-white/12"
              : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200"
          }`}
        >
          <UploadSimple size={15} weight="bold" />
          {file ? t("hover_clip_replace") : t("hover_clip_upload")}
        </button>

        {activePreviewUrl && (
          <button
            type="button"
            onClick={() => {
              onFileChange(null);
              setObjectUrl(null);
              onUrlChange("");
            }}
            aria-label={t("hover_clip_clear")}
            title={t("hover_clip_clear")}
            className={`px-3 py-2.5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/12 text-white/60 hover:text-red-400 hover:border-red-500/40"
                : "bg-white border-zinc-200 text-zinc-500 hover:text-red-600"
            }`}
          >
            <X size={15} weight="bold" />
          </button>
        )}
      </div>

      <p className={`text-[10px] ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        {t("hover_clip_hint")}
      </p>

      {activePreviewUrl && (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-black">
          <video
            src={activePreviewUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          {file && (
            <div className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
              {file.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
