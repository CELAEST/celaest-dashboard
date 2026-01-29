"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, ShoppingCart, Star, Eye, Zap, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ProductCardCompactProps {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  features: string[];
  rating?: number;
  reviews?: number;
  badge?: string;
  onSelect: () => void;
  onViewDetails?: () => void;
}

export const ProductCardCompact = React.memo(function ProductCardCompact({
  title,
  description,
  price,
  image,
  features,
  rating = 4.9,
  reviews = 234,
  badge,
  onSelect,
  onViewDetails,
}: ProductCardCompactProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        group relative rounded-4xl overflow-hidden transition-all duration-700 flex flex-col h-full snap-start
        ${
          isDark
            ? "bg-[#0c0c0c] border border-white/5 hover:border-cyan-500/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            : "bg-white border border-gray-100/50 hover:border-cyan-500/30 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]"
        }
      `}
    >
      {/* Visual Header / Image Container - Compact for viewport fit */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "4/3" }}
      >
        {/* Animated Background Image */}
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>

        {/* Dynamic Overlays */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? "bg-black/20" : "bg-black/40"
          }`}
        />

        <div
          className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent`}
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {badge && (
            <div className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30 flex items-center gap-1">
              <Zap size={8} fill="currentColor" />
              {badge}
            </div>
          )}
        </div>

        {/* Price Tag - Compact */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className="flex flex-col">
            <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest mb-0.5">
              Price
            </span>
            <span className="text-white text-xl font-black tracking-tight drop-shadow-2xl">
              {price}
            </span>
          </div>
        </div>

        {/* Floating Quick Action */}
        <motion.div
          animate={{ x: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-3 right-3 z-20"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
            <ArrowRight size={16} />
          </div>
        </motion.div>
      </div>

      {/* Content Section - Compact for viewport fit */}
      <div className="p-4 flex-1 flex flex-col space-y-3">
        {/* Header: Title & Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={
                      i < Math.floor(rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200/20"
                    }
                  />
                ))}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {reviews} reviews
              </span>
            </div>
          </div>

          <h3
            className={`text-lg font-black leading-[1.1] tracking-tighter line-clamp-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        </div>

        {/* Description - Compact */}
        <p
          className={`text-xs leading-relaxed line-clamp-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Professional Feature Set - Compact */}
        <div className="grid grid-cols-2 gap-2 py-1">
          {features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-start gap-1.5">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Check size={10} className="text-cyan-500" strokeWidth={3} />
              </div>
              <span
                className={`text-[10px] font-bold leading-snug line-clamp-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Action Center - Compact buttons */}
        <div className="pt-3 mt-auto grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewDetails}
            className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 border-2 transition-all ${
              isDark
                ? "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10 hover:text-white"
                : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100 hover:border-gray-200 hover:text-gray-900"
            }`}
          >
            <Eye size={14} strokeWidth={3} />
            Explore
          </motion.button>

          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-xl shadow-cyan-500/20 ${
              isDark
                ? "bg-cyan-500 text-black hover:bg-cyan-400"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <ShoppingCart size={14} strokeWidth={3} />
            Acquire
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
