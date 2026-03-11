import { motion } from "motion/react";
import { Tag, Lightning, Check } from "@phosphor-icons/react";

interface CouponPreviewCardProps {
  previewData: {
    code: string;
    value: string;
    type: string;
    expires: string;
    limit: string;
  };
}

export const CouponPreviewCard = ({ previewData }: CouponPreviewCardProps) => {
  return (
    <div className="w-full lg:w-72 shrink-0">
      <div className="sticky top-0 bg-neutral-900/50 border border-white/5 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Tag className="w-24 h-24 text-blue-500 -rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <Lightning className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
              Live Preview
            </span>
          </div>

          {/* THE CARD */}
          <motion.div
            layout
            className="relative p-6 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-900/40 border border-white/20 aspect-4/5 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 blur-2xl rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black/20 blur-xl rounded-full" />

            <div className="space-y-1">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                {previewData.type}
              </span>
              <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
                {previewData.value}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 group relative overflow-hidden">
                <div className="text-[8px] font-bold text-white/40 uppercase mb-1">
                  Código Promocional
                </div>
                <div className="text-sm font-black text-white font-mono tracking-widest truncate">
                  {previewData.code}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <div className="text-[8px] font-black text-white/30 uppercase">
                    Expira
                  </div>
                  <div className="text-[10px] font-bold text-white/70">
                    {previewData.expires}
                  </div>
                </div>
                <div className="bg-black/20 px-2 py-1 rounded-md">
                  <div className="text-[8px] font-black text-white/30 uppercase leading-none">
                    Limit
                  </div>
                  <div className="text-[9px] font-black text-white/60 mt-0.5 leading-none">
                    {previewData.limit}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-500" />
              </div>
              <p className="text-[10px] text-neutral-500 leading-tight">
                Sincronizado con el motor de CELAEST en tiempo real.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-[9px] text-blue-400 font-bold leading-relaxed italic">
                &quot;Los cupones maestros aumentan la tasa de conversión hasta
                un 24%.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
