"use client";

import { Suspense } from "react";
import { AuthPage } from "@/features/auth/components/AuthPage";

export default function SecurityLockoutRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <AuthPage defaultMode="lockout" />
    </Suspense>
  );
}

