import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';

export const ProductSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`
      rounded-3xl overflow-hidden
      ${theme === 'dark' 
        ? 'bg-[#0a0a0a]/60 border border-white/5' 
        : 'bg-white border border-gray-200'
      }
    `}>
      {/* Image Skeleton */}
      <div className="h-[280px] w-full relative overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
          className={`
            w-full h-full
            ${theme === 'dark'
              ? 'bg-gradient-to-r from-white/5 via-white/10 to-white/5'
              : 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
            }
          `}
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className={`h-3 w-20 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          <div className={`h-3 w-24 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        </div>

        {/* Title skeleton */}
        <div className={`h-6 w-3/4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className={`h-4 w-full rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          <div className={`h-4 w-5/6 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        </div>

        {/* Features skeleton */}
        <div className="space-y-2 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
              <div className={`h-3 w-32 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>

        {/* Price & Button skeleton */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className={`h-8 w-28 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          <div className={`h-12 w-full rounded-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
        </div>
      </div>
    </div>
  );
};
