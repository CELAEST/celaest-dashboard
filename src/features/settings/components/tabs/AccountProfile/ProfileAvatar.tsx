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
          className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <User className="w-5 h-5 text-cyan-500" />
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
                className="rounded-full object-cover ring-2 ring-cyan-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1">
            <p
              className={`text-sm mb-3 ${
                isDark ? "text-gray-400" : "text-gray-500"
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
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-all shadow-sm hover:shadow-cyan-500/20"
              >
                <UploadSimple className="w-4 h-4" />
                {t("upload_photo")}
              </button>
              {avatarUrl && (
                <button
                  onClick={onRemove}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
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
