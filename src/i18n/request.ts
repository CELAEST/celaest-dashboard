import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

// Supported locales
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

/**
 * Determines the active locale using this priority:
 * 1. Explicit cookie set by the LocaleSwitcher component
 * 2. Browser's Accept-Language header
 * 3. Fallback to defaultLocale ("es")
 */
async function getLocale(): Promise<Locale> {
  // 1. Check cookie
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Parse Accept-Language header
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") || "";
  const browserLangs = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().substring(0, 2).toLowerCase());

  for (const lang of browserLangs) {
    if (locales.includes(lang as Locale)) {
      return lang as Locale;
    }
  }

  // 3. Fallback
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
