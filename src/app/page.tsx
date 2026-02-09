"use client";

import { Suspense } from "react";
import { DashboardShell } from "@/features/control-center/components/DashboardShell";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
          <div className="w-12 h-12 border-4 rounded-full border-cyan-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardShell />
    </Suspense>
  );
}
