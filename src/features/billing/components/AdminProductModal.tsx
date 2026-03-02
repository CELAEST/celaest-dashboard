import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import {
  Asset,
  assetsService,
} from "@/features/assets/services/assets.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateProductPayload,
  UpdateProductPayload,
} from "@/features/assets/api/assets.api";

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Asset | null;
  token: string;
  orgId: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  basePrice: number;
  status: string;
  productType: string;
  isPublic: boolean;
  isFeatured: boolean;
  shortDescription?: string;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  product,
  token,
  orgId,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      slug: "",
      basePrice: 0,
      status: "draft",
      productType: "software",
      isPublic: true,
      isFeatured: false,
      shortDescription: "",
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        slug: product.slug,
        basePrice: product.price || 0,
        status: product.status || "draft",
        productType: product.type || "software",
        isPublic: product.isPublic ?? true,
        isFeatured: product.isFeatured ?? false,
        shortDescription: product.shortDescription || "",
      });
    } else if (!product && isOpen) {
      reset({
        name: "",
        slug: "",
        basePrice: 0,
        status: "draft",
        productType: "software",
        isPublic: true,
        isFeatured: false,
        shortDescription: "",
      });
    }
  }, [product, isOpen, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (isEditing && product) {
        const payload: UpdateProductPayload = {
          name: data.name,
          slug: data.slug,
          base_price: Number(data.basePrice),
          status: data.status,
          is_public: data.isPublic,
          is_featured: data.isFeatured,
          short_description: data.shortDescription,
        };
        return assetsService.updateAsset(token, orgId, product.id, payload);
      } else {
        const payload: CreateProductPayload = {
          name: data.name,
          slug: data.slug,
          base_price: Number(data.basePrice),
          status: data.status,
          product_type: data.productType,
          is_public: data.isPublic,
          is_featured: data.isFeatured,
          short_description: data.shortDescription,
        };
        return assetsService.createAsset(token, orgId, payload);
      }
    },
    onSuccess: () => {
      // SuperAdminProducts invalidate
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success(
        `Product ${isEditing ? "updated" : "created"} successfully!`,
      );
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to save product");
    },
  });

  const onSubmit = (data: ProductFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0a0a]/80 dark:backdrop-blur-2xl border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-white/5">
          <DialogTitle className="text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white">
            {isEditing ? "Edit Global Product" : "Create Global Product"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? "Modify existing product details."
              : "Add a new product to the global catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="name"
              >
                Product Name
              </Label>
              <Input
                id="name"
                className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl"
                placeholder="e.g. Celaest Platform"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="slug"
              >
                URL Slug
              </Label>
              <Input
                id="slug"
                className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl font-mono text-xs"
                placeholder="e.g. celaest-platform"
                {...register("slug", { required: "Slug is required" })}
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="basePrice"
              >
                Base Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-7 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl font-mono"
                  {...register("basePrice", { required: "Required" })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                htmlFor="productType"
              >
                Type
              </Label>
              <Input
                id="productType"
                className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl font-mono text-xs"
                placeholder="software, asset, plugin"
                {...register("productType")}
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
              htmlFor="shortDescription"
            >
              Short Description
            </Label>
            <Input
              id="shortDescription"
              className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus-visible:ring-cyan-500/50 rounded-xl"
              placeholder="Brief description of the product..."
              {...register("shortDescription")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-col gap-3 p-4 border rounded-2xl bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-gray-900 dark:text-white">
                  Public Visibility
                </Label>
                <Controller
                  control={control}
                  name="isPublic"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-relaxed">
                Will this product be visible on the main catalog?
              </p>
            </div>

            <div className="flex flex-col gap-3 p-4 border rounded-2xl bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-gray-900 dark:text-white">
                  Is Featured?
                </Label>
                <Controller
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-relaxed">
                Highlight this product in hero sections.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
            <Button
              variant="outline"
              type="button"
              className="rounded-xl border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 dark:hover:bg-white/5 font-bold"
              onClick={onClose}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-6 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 font-bold"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
