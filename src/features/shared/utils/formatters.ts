/**
 * Feature: Shared - Utils
 * Centralized formatting utilities for dates, currency, and numbers.
 */

/**
 * Formats a number as currency.
 * @param amount - The numeric value to format.
 * @param currency - The currency code (e.g., 'USD', 'EUR').
 * @param locale - The locale to use for formatting (default: 'en-US').
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Formats a date string or object into a human-readable format.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting (default: 'es-ES').
 * @param options - Custom Intl.DateTimeFormatOptions.
 */
export const formatDate = (
  date: string | number | Date,
  locale: string = "es-ES",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
): string => {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
};

/**
 * Formats a number with locale configuration.
 * @param value - The number to format.
 * @param locale - The locale to use (default: 'en-US').
 */
export const formatNumber = (
  value: number,
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale).format(value);
};
