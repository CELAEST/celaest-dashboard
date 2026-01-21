import React from 'react';
import { motion } from 'motion/react';
import { Crown, TrendingUp, Users, Zap, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';

export const SubscriptionManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const usedLicenses = 3;
  const totalLicenses = 5;
  const licensePercentage = (usedLicenses / totalLicenses) * 100;

  const usedApiCalls = 47800;
  const totalApiCalls = 100000;
  const apiPercentage = (usedApiCalls / totalApiCalls) * 100;

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10 backdrop-blur-sm'
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {/* Premium Tier Header with Animated Mesh Gradient */}
      <div className="relative h-44 overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 25%, #22d3ee 50%, #06b6d4 75%, #0891b2 100%)'
              : 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 25%, #7dd3fc 50%, #38bdf8 75%, #0ea5e9 100%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-white" />
                <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                  Active Plan
                </span>
              </div>
              <h2 className="text-white text-3xl font-bold drop-shadow-lg">Premium Tier</h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
            >
              <span className="text-white text-xs font-bold">ACTIVE</span>
            </motion.div>
          </div>

          <div>
            <div className="text-white/80 text-xs mb-1 uppercase tracking-wide">Billed Monthly</div>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-4xl font-bold">$299</span>
              <span className="text-white/70 text-base">/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="p-6 space-y-6">
        {/* Active Licenses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'
              }`}>
                <Users size={16} className={isDark ? 'text-cyan-400' : 'text-cyan-600'} />
              </div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Active Licenses
              </span>
            </div>
            <span className={`text-sm font-bold tabular-nums ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {usedLicenses} / {totalLicenses}
            </span>
          </div>
          
          <div className={`h-2.5 rounded-full overflow-hidden ${
            isDark ? 'bg-white/5' : 'bg-gray-200'
          }`}>
            <motion.div
              className={`h-full ${
                licensePercentage > 80 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${licensePercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                boxShadow: isDark ? '0 0 10px rgba(34, 211, 238, 0.5)' : 'none',
              }}
            />
          </div>
          
          <p className={`text-xs mt-2 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {totalLicenses - usedLicenses} licenses available
          </p>
        </div>

        {/* API Calls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
              }`}>
                <Zap size={16} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
              </div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                API Calls (This Month)
              </span>
            </div>
            <span className={`text-sm font-bold tabular-nums ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {usedApiCalls.toLocaleString()} / {totalApiCalls.toLocaleString()}
            </span>
          </div>
          
          <div className={`h-2.5 rounded-full overflow-hidden ${
            isDark ? 'bg-white/5' : 'bg-gray-200'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${apiPercentage}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              style={{
                boxShadow: isDark ? '0 0 10px rgba(52, 211, 153, 0.5)' : 'none',
              }}
            />
          </div>
          
          <p className={`text-xs mt-2 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {(totalApiCalls - usedApiCalls).toLocaleString()} calls remaining
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isDark
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
            }`}
          >
            <TrendingUp size={16} />
            Upgrade Plan
            <ArrowUpRight size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              isDark
                ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            Manage
          </motion.button>
        </div>
      </div>
    </div>
  );
};
