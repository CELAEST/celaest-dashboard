import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { NotificationProvider } from "@/features/shared/contexts/NotificationContext";
import { GeoPricingProvider } from "@/features/billing/providers/GeoPricingProvider";
import { Toaster } from "sonner";
import { ThemeSync } from "@/features/shared/components/ThemeSync";
import { OrgSync } from "@/features/shared/components/OrgSync";
import { RealtimeDashboardSync } from "@/features/shared/components/RealtimeDashboardSync";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dashboard.celaest.com"),
  alternates: {
    canonical: "https://dashboard.celaest.com",
  },
  robots: {
    index: true,
    follow: false,
    googleBot: {
      index: true,
      follow: false,
    },
  },
  title: "CELAEST Dashboard - Software Administrativo de Alto Rendimiento",
  description:
    "Optimiza tu flujo de trabajo con el dashboard profesional de CELAEST. Control total de activos, licencias y métricas en tiempo real.",
  keywords: [
    "software administrativo",
    "dashboard",
    "gestión de activos",
    "enterprise software",
    "CELAEST",
  ],
  authors: [{ name: "CELAEST Team", url: "https://celaest.com/es" }],
  icons: {
    icon: [
      { url: "/favicon-v2.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-48-v2.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192-v2.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-v2.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon-v2.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon-v2.ico"],
  },
  openGraph: {
    title: "CELAEST Dashboard - Eficiencia Operativa",
    description:
      "La plataforma definitiva para la gestión de recursos empresariales.",
    type: "website",
    locale: "es_ES",
    siteName: "CELAEST",
  },
  twitter: {
    card: "summary_large_image",
    title: "CELAEST Dashboard",
    description: "Sistemas de automatización y gestión de alto rendimiento.",
  },
};

export const dynamic = "force-static";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var uiStore = JSON.parse(localStorage.getItem('ui-storage'));
                  var theme = uiStore ? uiStore.state.theme : 'dark';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Saltar al contenido
        </a>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeSync />
          <ErrorBoundary>
            <AuthProvider>
              <GeoPricingProvider>
                <OrgSync />
                <RealtimeDashboardSync />
                <NotificationProvider>
                  <main id="main-content">{children}</main>
                  <Toaster />
                </NotificationProvider>
              </GeoPricingProvider>
            </AuthProvider>
          </ErrorBoundary>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
