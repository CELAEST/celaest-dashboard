"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, ShoppingCart, Star } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ProductCardPremiumProps {
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
}

export const ProductCardPremium = React.memo(function ProductCardPremium({
  title,
  description,
  price,
  image,
  features,
  rating = 4.9,
  reviews = 234,
  badge,
  onSelect,
}: ProductCardPremiumProps) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        group relative rounded-3xl overflow-hidden transition-all duration-500
        ${
          theme === "dark"
            ? "bg-[#0a0a0a]/60 border border-white/5 hover:border-cyan-500/30"
            : "bg-white border border-gray-200 hover:border-cyan-400 shadow-lg hover:shadow-2xl"
        }
      `}
      style={{
        boxShadow:
          isHovered && theme === "dark"
            ? "0 0 40px rgba(0, 255, 255, 0.15)"
            : undefined,
      }}
    >
      {/* Badge if premium/featured */}
      {badge && (
        <div
          className={`
          absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
          ${
            theme === "dark"
              ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
              : "bg-cyan-500 text-white"
          }
        `}
        >
          {badge}
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full w-full relative"
        >
          <ImageWithFallback
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover ${
              theme === "dark" ? "opacity-90" : "opacity-100"
            }`}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div
          className={`
          absolute inset-0 
          ${
            theme === "dark"
              ? "bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent"
              : "bg-linear-to-t from-white/60 via-transparent to-transparent"
          }
        `}
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`
                  ${
                    i < Math.floor(rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : theme === "dark"
                      ? "text-gray-600"
                      : "text-gray-300"
                  }
                `}
              />
            ))}
          </div>
          <span
            className={`text-xs font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {rating} ({reviews} valoraciones)
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm leading-relaxed ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Features - Human language */}
        <div className="space-y-2 pt-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check
                size={16}
                className={`mt-0.5 shrink-0 ${
                  theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                }`}
              />
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div
                className={`text-xs uppercase tracking-wider mb-1 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Inversión
              </div>
              <div
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {price}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`
              w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all
              ${
                theme === "dark"
                  ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-xl"
              }
            `}
          >
            <ShoppingCart size={16} />
            Adquirir Ahora
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
