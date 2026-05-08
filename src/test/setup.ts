import '@testing-library/jest-dom'
import { vi } from 'vitest'
import esMessages from '../messages/es.json'

vi.mock('next-intl', () => {
  return {
    useTranslations: (namespace?: string) => {
      const t = (key: string, values?: Record<string, unknown>) => {
        // Find the translation in es.json
        let message = key;
        if (namespace && esMessages[namespace as keyof typeof esMessages]) {
          const ns = esMessages[namespace as keyof typeof esMessages] as Record<string, string>;
          if (ns[key]) {
            message = ns[key];
          }
        }
        if (values) {
          // Simple interpolation for tests
          return Object.keys(values).reduce(
            (acc, k) => acc.replace(`{${k}}`, String(values[k])),
            message
          );
        }
        return message;
      };
      t.rich = (key: string) => t(key);
      t.raw = (key: string) => t(key);
      return t;
    },
    useLocale: () => 'es',
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
  }
});
