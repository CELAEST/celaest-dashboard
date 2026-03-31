import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CurrencyDollar, Clock, Lightning } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

const HolographicClockVisual = () => {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0 pointer-events-none flex items-center justify-end pr-4 mix-blend-screen overflow-hidden">
      <svg viewBox="0 0 120 120" className="w-[130px] h-[130px] opacity-80">
        <defs>
          <filter id="glowTime">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#6b21a8" strokeWidth="0.5" opacity="0.3" />
          <path d="M 10 60 L 110 60 M 60 10 L 60 110" stroke="#6b21a8" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
          
          <motion.circle
            cx="60" cy="60" r="42" fill="none" stroke="#9333ea" strokeWidth="1" strokeDasharray="4 12"
            animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }}
          />

          <motion.circle
            cx="60" cy="60" r="32" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="15 25"
            animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }} opacity="0.8"
          />

          <motion.circle
            cx="60" cy="60" r="22" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="40 10"
            animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }} filter="url(#glowTime)"
          />

          <circle cx="60" cy="60" r="14" fill="rgba(168,85,247,0.2)" />
          <motion.circle
            cx="60" cy="60" r="10" fill="#e9d5ff" opacity="0.9"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} filter="url(#glowTime)"
          />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line key={`tick-${i}`} x1="60" y1="12" x2="60" y2="16" stroke="#c084fc" strokeWidth="1.5" transform={`rotate(${angle} 60 60)`} />
          ))}
        </motion.g>
      </svg>
    </div>
  );
};

const HolographicRevenueVisual = () => {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0 pointer-events-none flex items-center justify-end pr-4 mix-blend-screen overflow-hidden">
      <svg viewBox="0 0 120 120" className="w-[130px] h-[130px] opacity-80">
        <defs>
          <filter id="glowRev">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
          
          <g opacity="0.3" stroke="#059669" strokeWidth="0.5">
            <path d="M 60 110 L 20 90 L 60 70 L 100 90 Z" fill="none" />
            <path d="M 40 100 L 80 80 M 40 80 L 80 100" strokeDasharray="1 2" />
          </g>

          <motion.path
            d="M 60 20 L 90 55 L 60 90 L 30 55 Z" fill="rgba(52, 211, 153, 0.1)" stroke="#10b981" strokeWidth="1"
            animate={{ rotateY: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 55px" }}
          />
          <motion.path
            d="M 60 20 L 90 55 L 60 90" fill="none" stroke="#6ee7b7" strokeWidth="1.5"
            animate={{ rotateY: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 55px" }} filter="url(#glowRev)"
          />

          <motion.circle
            cx="60" cy="55" r="5" fill="#34d399"
            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} filter="url(#glowRev)"
          />
          
          <line x1="30" y1="55" x2="90" y2="55" stroke="#059669" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="60" y1="20" x2="60" y2="90" stroke="#059669" strokeWidth="0.5" strokeDasharray="2 2" />

          {[1, 2, 3].map((i) => (
            <motion.circle
              key={`in-${i}`} cx="10" cy="80" r="1.5" fill="#a7f3d0"
              animate={{ cx: [10, 30], cy: [80, 70], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}

          <motion.ellipse
            cx="60" cy="55" rx="45" ry="15" fill="none" stroke="#059669" strokeWidth="0.8" strokeDasharray="4 8"
            animate={{ rotateZ: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 55px" }}
          />
        </motion.g>
      </svg>
    </div>
  );
};

const SvgSplineChart = ({ data, isDark }: { data: { name: string; value: number }[]; isDark: boolean }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  if (!data || data.length === 0) return null;
  const width = 1000;
  const height = 200;
  const normalizedData = data.length === 1 ? [data[0], data[0]] : data;

  const max = Math.max(...normalizedData.map(d => d.value), 10);
  const min = Math.min(...normalizedData.map(d => d.value), 0);
  const range = max - min || 1;
  const getP = (v: number, i: number) => {
    // Add padding to left (5%) and right (5%)
    const x = width * 0.05 + (i / (normalizedData.length - 1)) * (width * 0.9);
    // Add padding to top and bottom
    const y = height * 0.85 - ((v - min) / range) * height * 0.7; 
    return { x, y };
  };
  
  const points = normalizedData.map((d, i) => getP(d.value, i));
  
  let dPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cp1x = p1.x + (p2.x - p1.x) / 3;
    const cp1y = p1.y;
    const cp2x = p1.x + 2 * (p2.x - p1.x) / 3;
    const cp2y = p2.y;
    dPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  const areaD = `${dPath} L ${points[points.length-1].x} ${height * 0.95} L ${points[0].x} ${height * 0.95} Z`;

  // Calculate generic Y steps
  const ySteps = [min, min + range * 0.33, min + range * 0.66, max].reverse();

  return (
    <div className="w-full h-full relative" onMouseLeave={() => setHoveredIdx(null)}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full overflow-visible" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGradDarkRoi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaGradLightRoi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g opacity={isDark ? 0.3 : 0.1} pointerEvents="none">
          {/* Y Grid lines */}
          {ySteps.map((val, i) => {
            const yPos = height * 0.85 - ((val - min) / range) * height * 0.7;
            return (
              <line
                key={`grid-y-${i}`} x1={0} y1={yPos} x2={width} y2={yPos}
                stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4"
              />
            );
          })}
        </g>
        
        {/* Y Axis Labels */}
        <g pointerEvents="none">
          {ySteps.map((val, i) => {
             const yPos = height * 0.85 - ((val - min) / range) * height * 0.7;
             return (
               <text 
                 key={`label-y-${i}`} 
                 x={width * 0.04} y={yPos - 5} 
                 fill={isDark ? "#52525b" : "#9ca3af"} 
                 fontSize="9" fontFamily="monospace" textAnchor="end"
               >
                 {val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${Math.round(val)}`}
               </text>
             );
          })}
        </g>

        {/* Hover interaction zones */}
        {points.map((_, i) => {
          const segWith = (width * 0.9) / (points.length - 1 || 1);
          const startX = points[i].x - segWith / 2;
          return (
            <rect 
              key={`zone-${i}`}
              x={startX} y={0} width={segWith} height={height} 
              fill="transparent" className="cursor-crosshair"
              onMouseEnter={() => setHoveredIdx(i)}
              onTouchStart={() => setHoveredIdx(i)}
            />
          );
        })}

        <motion.path 
           d={areaD} 
           fill={isDark ? "url(#areaGradDarkRoi)" : "url(#areaGradLightRoi)"} 
           initial={{ opacity: 0, scaleY: 0 }} 
           animate={{ opacity: 1, scaleY: 1 }} 
           transition={{ duration: 1.2, ease: "easeOut" }} 
           style={{ transformOrigin: "bottom" }}
           pointerEvents="none"
        />
        
        {/* Precision core line */}
        <motion.path 
           d={dPath} 
           fill="none" 
           stroke={isDark ? "#22d3ee" : "#0ea5e9"} 
           strokeWidth="1.5" 
           strokeLinecap="round" strokeLinejoin="round"
           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} 
           transition={{ duration: 1.5, ease: "easeInOut" }} 
           pointerEvents="none"
        />
        
        {/* True data points */}
        {points.map((p, i) => (
           <motion.circle 
             key={i} cx={p.x} cy={p.y} 
             r={hoveredIdx === i ? 4 : 2} 
             fill={isDark ? "#09090b" : "#ffffff"} 
             stroke={isDark ? "#22d3ee" : "#0ea5e9"} 
             strokeWidth={1.5}
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: hoveredIdx === i ? 1.5 : 1, opacity: 1 }}
             transition={{ duration: 0.2 }}
             pointerEvents="none"
           />
        ))}

        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.g
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} pointerEvents="none"
            >
              <line 
                x1={points[hoveredIdx].x} y1={points[hoveredIdx].y} x2={points[hoveredIdx].x} y2={height * 0.95} 
                stroke={isDark ? "#22d3ee" : "#0ea5e9"} strokeWidth="1" strokeDasharray="2 4" opacity="0.5"
              />
              <rect 
                x={points[hoveredIdx].x - 45} y={points[hoveredIdx].y - 36} 
                width="90" height="26" rx="4"
                fill={isDark ? "rgba(24,24,27,0.9)" : "rgba(255,255,255,0.9)"}
                stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="1"
              />
              <text 
                x={points[hoveredIdx].x} y={points[hoveredIdx].y - 19} 
                textAnchor="middle" 
                className="text-[10px] font-mono font-medium"
                fill={isDark ? "#e4e4e7" : "#3f3f46"}
              >
                ${normalizedData[hoveredIdx].value.toLocaleString()}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      {/* X Axis Labels */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-between px-[5%] text-[9px] uppercase font-mono tracking-widest pointer-events-none opacity-40">
        {normalizedData.map((d, i) => (
          <span key={i} className={isDark ? "text-gray-400" : "text-gray-600"}>{d.name}</span>
        ))}
      </div>
    </div>
  );
};

export const ROICard = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { stats, salesByPeriod, roi } = useAnalytics();

  const trendData = React.useMemo(() => {
    if (!salesByPeriod || salesByPeriod.length === 0) {
      return [{ name: "—", value: 0 }];
    }
    return salesByPeriod.slice(-10).map((entry) => ({
      name: entry.date?.slice(5) || "—",
      value: Math.round(entry.sales || 0),
    }));
  }, [salesByPeriod]);

  const totalOrders = stats?.total_orders ?? 0;
  const timeSavedHours = Math.round(totalOrders * 0.166);
  const totalRevenue = stats?.total_revenue ?? 0;
  const revenueGrowth = stats?.revenue_growth ?? 0;
  const roiPercentage = roi?.roi_percentage ?? 0;

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
    return `$${val.toFixed(0)}`;
  };

  const formatGrowth = (val: number) => {
    return `${val >= 0 ? "+" : ""}${val.toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lg:col-span-2 h-full rounded-card overflow-hidden p-4 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr] gap-3 transition-all duration-500 hover:shadow-2xl ${
        isDark
          ? "bg-[#09090b] border border-white/10"
          : "bg-white border border-gray-100 shadow-xl"
      }`}
    >
      <div
        className={`rounded-card p-5 flex flex-col justify-between relative overflow-hidden group ${
          isDark
            ? "bg-white/2 border border-white/5 hover:bg-white/4"
            : "bg-gray-50/50 border border-gray-100 hover:bg-gray-50"
        }`}
      >
        <HolographicClockVisual />
        <div className="flex items-start justify-between z-10 pointer-events-none">
          <div
            className={`w-7 h-7 flex items-center justify-center rounded-input ${
              isDark 
                ? "bg-linear-to-b from-white/8 to-transparent border border-white/8 text-purple-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]" 
                : "bg-linear-to-b from-white to-gray-50 border border-gray-200 text-purple-600 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10 mt-4 pointer-events-none">
          <div
            className={`text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total Time Saved
          </div>
          <div className="flex items-baseline gap-2">
            <div
              className={`text-3xl lg:text-4xl font-black tracking-tighter tabular-nums transition-all duration-300 ${
                isDark ? "text-white group-hover:text-purple-50" : "text-gray-900"
              }`}
            >
              {timeSavedHours.toLocaleString()}
              <span className="text-xl ml-1 opacity-50">hrs</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap ${
                isDark
                  ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {formatGrowth(revenueGrowth)} vs prev
            </div>
          </div>
        </div>
      </div>

      <div
        className={`rounded-card p-5 flex flex-col justify-between relative overflow-hidden group ${
          isDark
            ? "bg-white/2 border border-white/5 hover:bg-white/4"
            : "bg-gray-50/50 border border-gray-100 hover:bg-gray-50"
        }`}
      >
        <HolographicRevenueVisual />
        <div className="flex items-start justify-between z-10 pointer-events-none">
          <div
            className={`w-7 h-7 flex items-center justify-center rounded-input ${
              isDark 
                ? "bg-linear-to-b from-white/8 to-transparent border border-white/8 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]" 
                : "bg-linear-to-b from-white to-gray-50 border border-gray-200 text-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
            }`}
          >
            <CurrencyDollar className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10 mt-4 pointer-events-none">
          <div
            className={`text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Revenue Total
          </div>
          <div className="flex items-baseline gap-2">
            <div
              className={`text-3xl lg:text-4xl font-black tracking-tighter tabular-nums transition-all duration-300 ${
                isDark ? "text-white group-hover:text-emerald-50" : "text-gray-900"
              }`}
            >
              {formatCurrency(totalRevenue)}
            </div>
            <div
              className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap ${
                isDark
                  ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              ROI {formatGrowth(roiPercentage)}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`col-span-1 md:col-span-2 rounded-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px] group ${
          isDark
            ? "bg-linear-to-br from-cyan-500/5 to-blue-500/5 border border-white/5"
            : "bg-linear-to-br from-blue-50/50 to-indigo-50/50 border border-gray-100"
        }`}
      >
        <div className="relative z-10 flex justify-between items-start pointer-events-none">
          <div>
            <div
              className={`text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Efficiency Trend
            </div>
            <div
              className={`text-3xl font-black tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {formatGrowth(roiPercentage)}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-input backdrop-blur-md transition-transform duration-300 group-hover:rotate-12 ${
              isDark
                ? "bg-white/10 text-white"
                : "bg-white/60 text-gray-900 shadow-sm"
            }`}
          >
            <Lightning className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[70%] w-full flex items-end">
          <SvgSplineChart data={trendData} isDark={isDark} />
        </div>
      </div>
    </motion.div>
  );
});

ROICard.displayName = "ROICard";
