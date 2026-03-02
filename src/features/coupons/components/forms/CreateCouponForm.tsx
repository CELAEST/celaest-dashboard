import { useCallback, useMemo } from "react";
import { useForm, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  TicketPercent,
  Tag,
  Calendar,
  Users,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CouponPreviewCard } from "./CouponPreviewCard";
import {
  CreateCouponSchema,
  CreateCouponFormValues,
} from "../../lib/validation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface CreateCouponFormProps {
  onSubmit: (values: CreateCouponFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const CreateCouponForm = ({
  onSubmit,
  isSubmitting,
  onCancel,
}: CreateCouponFormProps) => {
  const form = useForm<CreateCouponFormValues>({
    resolver: zodResolver(
      CreateCouponSchema,
    ) as unknown as Resolver<CreateCouponFormValues>,
    defaultValues: {
      code: "",
      discount_type: "percentage",
      discount_value: 0,
      currency: "USD",
      max_redemptions: null,
      expires_at: null,
    },
  });

  const watchAll = useWatch({ control: form.control });

  const generateCode = useCallback(() => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    form.setValue("code", `CELAEST_${randomCode}`, { shouldValidate: true });
  }, [form]);

  // Preview Helpers
  const previewData = useMemo(() => {
    const isPercentage = watchAll.discount_type === "percentage";
    const valueStr = isPercentage
      ? `${watchAll.discount_value}%`
      : formatCurrency(watchAll.discount_value ?? 0);

    // Safe date formatter
    let formattedDate = "SIN LÍMITE";
    if (watchAll.expires_at) {
      const dateObj = new Date(watchAll.expires_at);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = format(dateObj, "dd MMM yyyy", { locale: es });
      }
    }

    return {
      code: watchAll.code || "CÓDIGO_PROMO",
      value: valueStr,
      type: isPercentage ? "OFF" : "DESC",
      expires: formattedDate,
      limit: watchAll.max_redemptions
        ? `${watchAll.max_redemptions} USOS`
        : "ILIMITADO",
    };
  }, [watchAll]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* FORM SECTION */}
      <div className="flex-1 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                      Código del Cupón
                    </FormLabel>
                    <div className="flex gap-2">
                      <div className="relative flex-1 group">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                        <FormControl>
                          <Input
                            placeholder="EJ: CELAEST_PROMO"
                            className="bg-black/40 border-white/5 focus:border-blue-500/30 pl-9 font-mono uppercase h-11 text-sm tracking-widest"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateCode}
                        className="shrink-0 h-11 border-white/5 bg-white/5 hover:bg-blue-600/10 hover:border-blue-500/20 text-neutral-400 hover:text-blue-400 font-bold transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 mr-2" />
                        Generar
                      </Button>
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                        Tipo
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/40 border-white/5 h-11 text-xs">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-900 border-white/10">
                          <SelectItem value="percentage">
                            Porcentaje (%)
                          </SelectItem>
                          <SelectItem value="fixed_amount">
                            Monto Fijo ($)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                        Valor
                      </FormLabel>
                      <div className="relative group">
                        {watchAll.discount_type === "fixed_amount" ? (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-bold">
                            $
                          </span>
                        ) : (
                          <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                        )}
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="bg-black/40 border-white/5 pl-9 h-11 text-sm font-bold"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="max_redemptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3" /> Límite de Usos
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ilimitado"
                          min="1"
                          className="bg-black/40 border-white/5 h-11 text-sm placeholder:text-neutral-700 font-bold"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Vencimiento
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Sin vencimiento"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-auto">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="text-neutral-500 hover:text-white hover:bg-white/5 text-xs font-bold"
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px] h-11 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Cupón"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* LIVE PREVIEW SECTION */}
      <CouponPreviewCard previewData={previewData} />
    </div>
  );
};
