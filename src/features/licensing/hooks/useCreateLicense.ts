import { useState } from "react";
import { toast } from "sonner";
import { License } from "@/features/licensing/constants/mock-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const licenseFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  productId: z.string().optional(),
  productType: z.string().min(1, "Product type is required"),
  maxIpSlots: z.number().min(1, "At least 1 IP slot is required").max(100, "Max 100 slots"),
  expiresAt: z.string().optional(),
  tier: z.enum(["basic", "pro", "enterprise"]),
});

export type LicenseFormData = z.infer<typeof licenseFormSchema>;

export const useCreateLicense = (onLicenseCreated: (license: License) => void) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState("");

  const form = useForm<LicenseFormData>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      userId: "user_demo_001",
      productId: "",
      productType: "excel-automation",
      maxIpSlots: 1,
      expiresAt: "",
      tier: "basic",
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
      // Mock API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newKey = "sk_test_mock_key_" + Math.random().toString(36).substring(7);
      
      const newLic: License = {
          id: `lic_${Date.now()}`,
          userId: data.userId,
          productId: data.productId || `prod_${Date.now()}`,
          productType: data.productType,
          status: "active",
          maxIpSlots: data.maxIpSlots,
          ipSlotsUsed: 0,
          ipBindings: [],
          metadata: {
              tier: data.tier || "basic",
          },
          createdAt: new Date().toISOString(),
      };
      
      onLicenseCreated(newLic);
      setCreatedKey(newKey);
      setStep(3); // Move to success step
      toast.success("License created successfully! (Mock)");
    } catch (error) {
      console.error(error);
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
