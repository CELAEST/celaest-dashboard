import { Suspense } from "react";
import { ReleaseManager } from "@/features/releases/components/ReleaseManager";

export const metadata = {
  title: "Vendor / Releases - Celaest",
  description: "Manage your digital products, releases, and pipelines.",
};

export default function VendorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReleaseManager />
    </Suspense>
  );
}
