import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useTheme } from '@/features/shared/contexts/ThemeContext';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  delay?: number;
  hologramImage?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendUp, 
  icon, 
  delay = 0,
  hologramImage
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden backdrop-blur-xl border rounded-2xl p-6 group transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0a0a0a]/60 border-white/5 hover:border-cyan-500/30' 
          : 'bg-white border-gray-200 hover:border-blue-400/30 shadow-sm'
      }`}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-500 group-hover:duration-200 ${
        isDark ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gradient-to-r from-blue-400 to-indigo-500'
      }`} />
      
      {/* Content Container */}
      <div className="relative flex justify-between items-start z-10 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className={`text-xs font-mono uppercase tracking-widest mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>{title}</h3>
            <div className={`text-3xl font-bold tracking-tight ${
                isDark 
                 ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                 : 'text-gray-900'
            }`}>
              {value}
            </div>
          </div>
          
          {trend && (
            <div className={`flex items-center text-sm font-medium mt-4 ${
                trendUp 
                 ? (isDark ? 'text-cyan-400' : 'text-green-600') 
                 : (isDark ? 'text-red-400' : 'text-red-500')
            }`}>
              <span className={`mr-1 ${trendUp && isDark ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : ''}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
              <span className={`text-xs ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>vs last week</span>
            </div>
          )}
        </div>

        {/* Holographic Element */}
        <div className="relative w-16 h-16 flex items-center justify-center">
            {hologramImage ? (
                 <div className="relative w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                     <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${
                         isDark ? 'bg-cyan-500/20' : 'bg-blue-500/20'
                     }`} />
                     <ImageWithFallback 
                        src={hologramImage} 
                        className={`w-full h-full object-contain animate-[spin_10s_linear_infinite] ${
                            isDark ? 'mix-blend-screen' : 'mix-blend-multiply'
                        }`}
                        alt="hologram"
                     />
                 </div>
            ) : (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ring-1 ${
                    isDark 
                     ? 'bg-white/5 text-cyan-400 ring-white/10 group-hover:text-white group-hover:bg-cyan-500/20 group-hover:ring-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                     : 'bg-blue-50 text-blue-600 ring-blue-100 group-hover:bg-blue-100 group-hover:ring-blue-300'
                }`}>
                    {icon}
                </div>
            )}
        </div>
      </div>
      
      {/* Decorative Lines */}
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent ${
          isDark ? 'via-cyan-500/20' : 'via-blue-500/20'
      }`} />
      <div className={`absolute top-0 right-0 w-[1px] h-12 bg-gradient-to-b from-transparent ${
          isDark ? 'from-cyan-500/20' : 'from-blue-500/20'
      }`} />
    </motion.div>
  );
};
