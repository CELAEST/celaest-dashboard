import React, { memo, useRef } from "react";
import Image from "next/image";
import { User, Upload, Trash2 } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = memo(
  ({ avatarUrl, onUpload, onRemove }) => {
    const { isDark } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <User className="w-5 h-5 text-cyan-500" />
          Profile Picture
        </h3>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
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
          <div>
            <p
              className={`text-sm mb-3 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Upload a profile picture or use your initials as a fallback.
            </p>
            <div className="flex items-center gap-3">
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
                <Upload className="w-4 h-4" />
                Upload Photo
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
                  <Trash2 className="w-4 h-4" />
                  Remove
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
