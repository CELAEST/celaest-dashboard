import { Invoice } from "../types";

function getInvoiceCandidateValues(invoice: Invoice): string[] {
  return [invoice.id, invoice.invoice_number, invoice.order_id, invoice.license_id].filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
}

export function getInvoiceActionId(invoice: Invoice): string | null {
  const candidateId = typeof invoice.id === "string" ? invoice.id.trim() : "";
  return candidateId.length > 0 ? candidateId : null;
}

export function getInvoiceReferenceSuffix(invoice: Invoice): string {
  const fallback = getInvoiceCandidateValues(invoice)[0] ?? "0000";
  return fallback.slice(-4).toUpperCase().padStart(4, "0");
}