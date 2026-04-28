import React from "react";
import { Invoice } from "../../types";
import Logo from "@/components/icons/Logo";

interface AestheticInvoiceTemplateProps {
  invoice: Invoice;
  orgName?: string;
  orgEmail?: string;
  language?: "es" | "en";
}

// Hardcode hex colors to avoid html2canvas failing on Tailwind v4 lab/oklch colors
const COLORS = {
  bg: "#ffffff",
  textMain: "#111827", // gray-900
  textMuted: "#4b5563", // gray-600
  textLight: "#9ca3af", // gray-400
  textBrand: "#0284c7", // sky-600
  textSuccess: "#059669", // emerald-600
  borderLight: "#f3f4f6", // gray-100
  borderDark: "#e5e7eb", // gray-200
  bgMuted: "#f9fafb", // gray-50
  bgBadge: "#f3f4f6", // gray-100
};

const TRANSLATIONS = {
  en: {
    slogan: "Enterprise Software Solutions",
    title: "INVOICE",
    statusPaid: "PAID",
    statusVoid: "VOID",
    statusDue: "DUE",
    billedTo: "Billed To",
    dateIssued: "Date Issued",
    dueDate: "Due Date",
    uponReceipt: "Upon Receipt",
    description: "Description",
    qty: "Qty",
    unitPrice: "Unit Price",
    amount: "Amount",
    subtotal: "Subtotal",
    discount: "Discount",
    tax: "Tax",
    total: "Total",
    thanks: "Thank you for your business.",
    support: "For any questions regarding this invoice, please contact support.",
    defaultItem: "Premium Subscription Services",
    defaultItemDesc: "Software license and support.",
  },
  es: {
    slogan: "Soluciones de Software Empresarial",
    title: "FACTURA",
    statusPaid: "PAGADA",
    statusVoid: "ANULADA",
    statusDue: "PENDIENTE",
    billedTo: "Facturado A",
    dateIssued: "Fecha de Emisión",
    dueDate: "Fecha de Vencimiento",
    uponReceipt: "Contra Entrega",
    description: "Descripción",
    qty: "Cant.",
    unitPrice: "Precio Unit.",
    amount: "Importe",
    subtotal: "Subtotal",
    discount: "Descuento",
    tax: "Impuestos",
    total: "Total",
    thanks: "Gracias por su preferencia.",
    support: "Si tiene alguna pregunta sobre esta factura, contacte a soporte.",
    defaultItem: "Servicios de Suscripción Premium",
    defaultItemDesc: "Licencia de software y soporte.",
  }
};

export const AestheticInvoiceTemplate = React.forwardRef<HTMLDivElement, AestheticInvoiceTemplateProps>(
  ({ invoice, orgName, orgEmail, language = "es" }, ref) => {
    const t = TRANSLATIONS[language];
    
    // Formatting currency depending on the selected language standard
    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat(language === "es" ? "es-ES" : "en-US", {
        style: "currency",
        currency: invoice.currency || "USD"
      }).format(val);
    };

    // Formatting dates depending on language
    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };

    return (
      <div
        ref={ref}
        style={{ 
          width: "800px", 
          minHeight: "1131px", 
          padding: "60px 80px", 
          fontFamily: "sans-serif",
          backgroundColor: COLORS.bg,
          color: COLORS.textMain,
          position: "relative"
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex flex-col">
            {/* Logo / Brand Name */}
            <div className="flex items-center gap-2 mb-2">
              <Logo className="w-8 h-8" color={COLORS.textBrand} />
              <span className="text-2xl font-bold tracking-tighter uppercase" style={{ color: COLORS.textMain }}>CELAEST</span>
            </div>
            <p className="text-sm font-medium" style={{ color: COLORS.textMuted }}>{t.slogan}</p>
            <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>support@celaest.com</p>
          </div>

          <div className="text-right">
            <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: COLORS.textMain }}>{t.title}</h1>
            <p className="text-lg font-mono font-medium" style={{ color: COLORS.textMuted }}>{invoice.invoice_number || invoice.id?.slice(0, 8)}</p>
            <div 
              className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: COLORS.bgBadge, color: COLORS.textMuted }}
            >
              {invoice.status === "paid" ? t.statusPaid : invoice.status === "void" ? t.statusVoid : t.statusDue}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex justify-between mb-16 pb-8 border-b" style={{ borderColor: COLORS.borderLight }}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.textLight }}>{t.billedTo}</p>
            <p className="text-base font-semibold" style={{ color: COLORS.textMain }}>{invoice.customer_name || invoice.billing_name || orgName || "Valued Customer"}</p>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>{invoice.customer_email || invoice.billing_email || orgEmail || "No email provided"}</p>
          </div>

          <div className="flex gap-12 text-right">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.textLight }}>{t.dateIssued}</p>
              <p className="text-sm font-semibold capitalize" style={{ color: COLORS.textMain }}>
                {formatDate(invoice.created_at)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.textLight }}>{t.dueDate}</p>
              <p className="text-sm font-semibold capitalize" style={{ color: COLORS.textMain }}>
                {invoice.due_date ? formatDate(invoice.due_date) : t.uponReceipt}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-16">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-tl-lg" style={{ backgroundColor: COLORS.bgMuted, color: COLORS.textMuted }}>{t.description}</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right" style={{ backgroundColor: COLORS.bgMuted, color: COLORS.textMuted }}>{t.qty}</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right" style={{ backgroundColor: COLORS.bgMuted, color: COLORS.textMuted }}>{t.unitPrice}</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right rounded-tr-lg" style={{ backgroundColor: COLORS.bgMuted, color: COLORS.textMuted }}>{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b" style={{ borderColor: COLORS.borderLight }}>
                <td className="py-5 px-4">
                  <p className="text-sm font-bold" style={{ color: COLORS.textMain }}>{invoice.item_name || t.defaultItem}</p>
                  <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>{t.defaultItemDesc}</p>
                </td>
                <td className="py-5 px-4 text-right text-sm" style={{ color: COLORS.textMuted }}>1</td>
                <td className="py-5 px-4 text-right text-sm font-mono" style={{ color: COLORS.textMuted }}>
                  {formatCurrency(invoice.subtotal)}
                </td>
                <td className="py-5 px-4 text-right text-sm font-mono font-semibold" style={{ color: COLORS.textMain }}>
                  {formatCurrency(invoice.subtotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: COLORS.borderLight }}>
              <span className="text-sm font-medium" style={{ color: COLORS.textMuted }}>{t.subtotal}</span>
              <span className="text-sm font-mono font-semibold" style={{ color: COLORS.textMain }}>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between py-2 border-b" style={{ borderColor: COLORS.borderLight }}>
                <span className="text-sm font-medium" style={{ color: COLORS.textMuted }}>{t.discount}</span>
                <span className="text-sm font-mono font-semibold" style={{ color: COLORS.textSuccess }}>-{formatCurrency(invoice.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b" style={{ borderColor: COLORS.borderLight }}>
              <span className="text-sm font-medium" style={{ color: COLORS.textMuted }}>{t.tax}</span>
              <span className="text-sm font-mono font-semibold" style={{ color: COLORS.textMain }}>{formatCurrency(invoice.tax_amount)}</span>
            </div>
            <div className="flex justify-between py-4 mt-2 rounded-lg px-4 border" style={{ backgroundColor: COLORS.bgMuted, borderColor: COLORS.borderLight }}>
              <span className="text-base font-bold uppercase tracking-tight" style={{ color: COLORS.textMain }}>{t.total}</span>
              <span className="text-xl font-mono font-bold" style={{ color: COLORS.textBrand }}>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-16 left-20 right-20 pt-8 border-t flex justify-between items-end" style={{ borderColor: COLORS.borderDark }}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.textMain }}>{t.thanks}</p>
            <p className="text-xs" style={{ color: COLORS.textLight }}>{t.support}</p>
          </div>
          <div className="flex items-center gap-2" style={{ color: COLORS.textBrand }}>
             <Logo className="w-5 h-5 opacity-80" color="currentColor" />
          </div>
        </div>
      </div>
    );
  }
);

AestheticInvoiceTemplate.displayName = "AestheticInvoiceTemplate";
