import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useTheme } from '@/features/shared/contexts/ThemeContext';

const data = [
  { name: 'Mon', sales: 4000, traffic: 2400 },
  { name: 'Tue', sales: 3000, traffic: 1398 },
  { name: 'Wed', sales: 9000, traffic: 3800 },
  { name: 'Thu', sales: 2780, traffic: 3908 },
  { name: 'Fri', sales: 6890, traffic: 4800 },
  { name: 'Sat', sales: 2390, traffic: 3800 },
  { name: 'Sun', sales: 7490, traffic: 4300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-lg backdrop-blur-md border ${
          isDark 
           ? 'bg-black/90 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
           : 'bg-white/90 border-gray-200 shadow-lg'
      }`}>
        <p className={`text-xs font-mono mb-1 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{label}</p>
        <p className={`font-bold text-sm ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const SalesChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const strokeColor = isDark ? '#22d3ee' : '#3b82f6';
  const axisColor = isDark ? '#666' : '#9ca3af';

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className={`w-2 h-2 rounded-full ${
                isDark ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-blue-500'
            }`} />
            Revenue Flow
        </h3>
        <select className={`text-xs rounded-lg px-2 py-1 outline-none border ${
            isDark 
             ? 'bg-black/30 border-white/10 text-gray-400 focus:border-cyan-500/50' 
             : 'bg-white border-gray-200 text-gray-600 focus:border-blue-500'
        }`}>
            <option>Last 7 Days</option>
            <option>Last Month</option>
        </select>
      </div>
      
      <div className="w-full h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
            <XAxis 
                dataKey="name" 
                stroke={axisColor} 
                tick={{fill: axisColor, fontSize: 10}} 
                axisLine={false}
                tickLine={false}
            />
            <YAxis 
                stroke={axisColor} 
                tick={{fill: axisColor, fontSize: 10}} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: isDark ? 'rgba(34,211,238,0.2)' : 'rgba(59,130,246,0.2)', strokeWidth: 2 }} />
            <Area 
                type="monotone" 
                dataKey="sales" 
                stroke={strokeColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
