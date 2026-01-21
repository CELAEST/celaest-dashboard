import React from 'react';
import { motion } from 'motion/react';
import { GitBranch, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';

export const ReleaseMetrics: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const metrics = [
    {
      label: 'Total Releases',
      value: 68,
      icon: GitBranch,
      color: 'cyan',
      trend: '+12 this month',
    },
    {
      label: 'Update Adoption',
      value: '82.4%',
      icon: TrendingUp,
      color: 'emerald',
      trend: 'Customers on latest',
    },
    {
      label: 'Active Versions',
      value: 14,
      icon: Users,
      color: 'blue',
      trend: 'In circulation',
    },
    {
      label: 'Deprecated',
      value: 8,
      icon: AlertTriangle,
      color: 'orange',
      trend: 'Legacy versions',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      cyan: {
        bg: isDark ? 'bg-cyan-500/10' : 'bg-cyan-50',
        text: isDark ? 'text-cyan-400' : 'text-cyan-600',
        border: isDark ? 'border-cyan-500/20' : 'border-cyan-200',
      },
      emerald: {
        bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
        text: isDark ? 'text-emerald-400' : 'text-emerald-600',
        border: isDark ? 'border-emerald-500/20' : 'border-emerald-200',
      },
      blue: {
        bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        border: isDark ? 'border-blue-500/20' : 'border-blue-200',
      },
      orange: {
        bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
        text: isDark ? 'text-orange-400' : 'text-orange-600',
        border: isDark ? 'border-orange-500/20' : 'border-orange-200',
      },
    };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        const Icon = metric.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl border p-5 ${
              isDark
                ? 'bg-gradient-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${colors.bg}`}>
                <Icon size={20} className={colors.text} />
              </div>
            </div>
            <div>
              <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {metric.label}
              </p>
              <div className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {metric.value}
              </div>
              <p className={`text-xs ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {metric.trend}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
