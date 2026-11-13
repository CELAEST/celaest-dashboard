"use client";

import { Suspense } from "react";
import { AuthPage } from "@/features/auth/components/AuthPage";

export default function AuthRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <AuthPage />
    </Suspense>
  );
}

