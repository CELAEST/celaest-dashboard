"use client";

import React from "react";
import { useFinancialDashboard } from "../../hooks/useFinancialDashboard";
import { RevenueCard } from "../dashboard/RevenueCard";
import { MrrCard } from "../dashboard/MrrCard";
import { MetricCard } from "../dashboard/MetricCard";

export const AdminOverviewView: React.FC = () => {
  const { totalRevenue, paidInvoices, refundedFunds, mrr, mrrGrowth, metrics } =
    useFinancialDashboard();

  return (
    <div className="h-full w-full p-4 flex flex-col min-h-0 overflow-hidden">
      {/* Container: Full Width, Vertical Max Height limit */}
      <div className="flex-1 flex flex-col w-full h-full min-h-0 lg:max-h-[1100px] mx-auto">
        {/* Bento Grid: Row 1 takes ALL available space, Row 2 is auto-sized (compact) */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-rows-[1fr_auto] gap-4 min-h-0">
          {/* Row 1: Hero Metrics (Revenue & MRR) */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:min-h-0 lg:h-full shrink-0">
            <div className="lg:col-span-2 h-full min-h-0">
              <MrrCard mrr={mrr} growth={mrrGrowth} className="h-full" />
            </div>
            <div className="h-full min-h-0">
              <RevenueCard
                totalRevenue={totalRevenue}
                paidInvoices={paidInvoices}
                refundedFunds={refundedFunds}
                className="h-full"
              />
            </div>
          </div>

          {/* Row 2: Secondary Metrics (Detail Strip) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:min-h-0 shrink-0 lg:h-full">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className={`h-full min-h-0 ${
                  idx === metrics.length - 1
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <MetricCard metric={metric} index={idx} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
