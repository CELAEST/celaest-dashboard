"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Collision } from "@/features/licensing/constants/mock-data";

interface LicensingCollisionsProps {
  collisions: Collision[];
}

export const LicensingCollisions: React.FC<LicensingCollisionsProps> = ({
  collisions,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-4">
      {collisions.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No collisions detected. Great job!
        </div>
      ) : (
        collisions.map((collision) => (
          <div
            key={collision.licenseId}
            className={`p-6 rounded-2xl border flex items-center justify-between ${
              isDark
                ? "bg-red-500/5 border-red-500/20"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3
                  className={`font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Multiple IP Collision Detected
                </h3>
                <p className="text-sm text-gray-500">
                  License {collision.licenseId} is being used on{" "}
                  {collision.ipCount} IPs (Limit: {collision.license.maxIpSlots}
                  )
                </p>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isDark
                  ? "bg-red-500 text-black hover:bg-red-400"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Revoke License
            </button>
          </div>
        ))
      )}
    </div>
  );
};
