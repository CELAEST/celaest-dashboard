import React, { memo, useRef } from "react";
import Image from "next/image";
import { User, UploadSimple, Trash } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = memo(
  ({ avatarUrl, onUpload, onRemove }) => {
    const { isDark } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations("settings");

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-base font-bold font-jakarta mb-4 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <User className={`w-5 h-5 ${isDark ? "text-white/70" : "text-gray-700"}`} />
          {t("profile_picture")}
        </h3>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={64}
                height={64}
                className={`rounded-full object-cover ring-2 ${
                  isDark ? "ring-white/10" : "ring-gray-200"
                }`}
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border shadow-xs ${
                  isDark
                    ? "bg-white/[0.04] border-white/8 text-white/70"
                    : "bg-gray-100 border-gray-300 text-gray-700"
                }`}
              >
                <User className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1">
            <p
              className={`text-xs mb-3 ${
                isDark ? "text-white/50" : "text-gray-500"
              }`}
            >
              {t("upload_avatar_desc")}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isDark
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <UploadSimple className="w-4 h-4" weight="bold" />
                {t("upload_photo")}
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={onRemove}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Trash className="w-4 h-4" />
                  {t("remove_photo")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProfileAvatar.displayName = "ProfileAvatar";
