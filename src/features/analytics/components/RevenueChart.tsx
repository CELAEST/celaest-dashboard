"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

const chartData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 9000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 6890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 7490 },
];

interface RevenueChartProps {
  data?: { date: string; sales: number }[];
}

export const RevenueChart = React.memo(function RevenueChart({ data }: RevenueChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayData = useMemo(() => {
    if (!data || data.length === 0) return chartData;
    return data
      .map((item) => ({
        name: new Date(item.date).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
        }),
        sales: item.sales,
      }))
      .reverse();
  }, [data]);

  const width = 1000;
  const height = 300;
  
  const max = Math.max(...displayData.map(d => d.sales), 10);
  const min = Math.min(...displayData.map(d => d.sales), 0);
  const range = max - min || 1;
  const getP = (v: number, i: number) => {
    // Add padding to left (5%) and right (5%)
    const x = width * 0.05 + (i / (displayData.length - 1)) * (width * 0.9);
    // Add padding to top and bottom
    const y = height * 0.85 - ((v - min) / range) * height * 0.7; 
    return { x, y };
  };
  
  const points = displayData.map((d, i) => getP(d.sales, i));
  
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
          <linearGradient id="areaGradDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaGradLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
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
           fill={isDark ? "url(#areaGradDark)" : "url(#areaGradLight)"} 
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
           stroke={isDark ? "#818cf8" : "#6366f1"} 
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
             stroke={isDark ? "#818cf8" : "#6366f1"} 
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
                stroke={isDark ? "#818cf8" : "#6366f1"} strokeWidth="1" strokeDasharray="2 4" opacity="0.5"
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
                ${displayData[hoveredIdx].sales.toLocaleString()}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      {/* X Axis Labels */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-between px-[5%] text-[9px] uppercase font-mono tracking-widest pointer-events-none opacity-40">
        {displayData.map((d, i) => (
          <span key={i} className={isDark ? "text-gray-400" : "text-gray-600"}>{d.name}</span>
        ))}
      </div>
    </div>
  );
});

RevenueChart.displayName = "RevenueChart";
