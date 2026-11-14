import React from "react";
import { motion } from "motion/react";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="min-h-[556px] rounded-2xl bg-[#09090b] border border-white/[0.08] overflow-hidden flex flex-col justify-between">
      <div>
        {/* Studio 214px Hero Skeleton */}
        <div className="h-[214px] w-full relative overflow-hidden bg-[#050507]">
          <motion.div
            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-linear-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03]"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        {/* Body & 3 Flush Hairline Rows */}
        <div className="px-[22px] pt-1 pb-4 space-y-3">
          <div className="h-5 w-2/3 rounded bg-white/[0.08]" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-full rounded bg-white/[0.05]" />
            <div className="h-3.5 w-4/5 rounded bg-white/[0.05]" />
          </div>

          <div className="pt-1 border-t border-white/[0.06] divide-y divide-white/[0.05]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                <div className="h-3 w-36 rounded bg-white/[0.06]" />
                <div className="h-2.5 w-10 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>

          <div className="h-7 w-11/12 rounded bg-white/[0.04]" />
        </div>
      </div>

      {/* Footer Price + Dual CTA Skeleton */}
      <div className="px-[22px] pt-3 pb-[18px] border-t border-white/[0.06] space-y-2.5">
        <div className="flex items-end justify-between">
          <div className="h-7 w-28 rounded bg-white/[0.08]" />
          <div className="h-3 w-16 rounded bg-white/[0.05]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-[9px] bg-white/[0.05]" />
          <div className="h-9 rounded-[9px] bg-white/[0.08]" />
        </div>
      </div>
    </div>
  );
};
