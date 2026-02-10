import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { licensingService } from "@/features/licensing/services/licensing.service";
import type { LicenseResponse } from "@/features/licensing/types";

export const licenseFormSchema = z.object({
  plan_id: z.string().min(1, "Plan ID is required"),
  billing_cycle: z.enum(["monthly", "quarterly", "yearly", "lifetime"]),
  notes: z.string().optional(),
});

export type LicenseFormData = z.infer<typeof licenseFormSchema>;

export const useCreateLicense = (
  onLicenseCreated: (license: LicenseResponse) => void
) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState("");

  const form = useForm<LicenseFormData>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      plan_id: "",
      billing_cycle: "monthly",
      notes: "",
    },
  });

  const resetForm = () => {
    setStep(1);
    setCreatedKey("");
    form.reset();
  };

  const handleCreateLicense = async (data: LicenseFormData) => {
    setLoading(true);
    try {
      const result = await licensingService.create({
        plan_id: data.plan_id,
        billing_cycle: data.billing_cycle,
        notes: data.notes || undefined,
      });

      onLicenseCreated(result);
      setCreatedKey(result.license_key);
      setStep(3); // Move to success step
      toast.success("License created successfully!");
    } catch (error) {
      console.error("Failed to create license:", error);
      toast.error("Failed to create license");
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    loading,
    createdKey,
    form,
    resetForm,
    handleCreateLicense,
  };
};
