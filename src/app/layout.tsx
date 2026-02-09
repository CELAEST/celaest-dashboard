import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { OrgProvider } from "@/features/shared/contexts/OrgContext";
import { NotificationProvider } from "@/features/shared/contexts/NotificationContext";
import { Toaster } from "sonner";
import { ThemeSync } from "@/features/shared/components/ThemeSync";
import { ErrorBoundary } from "@/components/ui/error-boundary";

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
  authors: [{ name: "CELAEST Team" }],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var uiStore = JSON.parse(localStorage.getItem('ui-storage'));
                  var theme = uiStore ? uiStore.state.theme : 'system';
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
        <ThemeSync />
        <ErrorBoundary>
          <NotificationProvider>
            <AuthProvider>
              <OrgProvider>
                {children}
                <Toaster />
              </OrgProvider>
            </AuthProvider>
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
