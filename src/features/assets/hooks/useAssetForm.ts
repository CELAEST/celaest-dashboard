import { z } from "zod";

export const assetSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["excel", "script", "google-sheet", "software", "plugin", "theme", "template", "asset", "service"]),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  operationalCost: z.number().min(0, "Operational cost must be positive"),
  status: z.enum(["active", "draft", "archived", "stable"]),
  description: z.string().optional(),
  features: z.string().optional(), 
  requirements: z.string().optional(),
  external_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  thumbnail_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  pending_image: z.any().optional(), // For local File object before upload
  productFile: z.any().optional(), // For logic use only
});

export type AssetFormValues = z.infer<typeof assetSchema>;
