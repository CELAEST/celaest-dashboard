"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Warning, ArrowClockwise, House } from "@phosphor-icons/react";
import { logger } from "@/lib/logger";

export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: FallbackProps) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Static labels — Class components can't use hooks, so we read from window.__NEXT_INTL_MESSAGES__
// or fall back to hardcoded defaults. The FeatureLoader passes localized fallback renders anyway,
// so these are only used for the top-level boundary that wraps the entire app.
const ERROR_LABELS = {
  title: { en: "Something went wrong", es: "Algo salió mal" },
  desc: {
    en: "An unexpected error occurred. You can try reloading the page or going home.",
    es: "Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.",
  },
  reload: { en: "Reload page", es: "Recargar página" },
  home: { en: "Go home", es: "Ir al inicio" },
  retry: { en: "Try again", es: "Intentar de nuevo" },
};

function getLocale(): "en" | "es" {
  if (typeof document !== "undefined") {
    return document.documentElement.lang === "es" ? "es" : "en";
  }
  return "en";
}

/**
 * Global Error Boundary - Catches unhandled React errors
 * Prevents full app crashes and shows a recovery UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error using global logger (sends to connected services if configured)
    logger.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback({
            error: this.state.error!,
            resetErrorBoundary: this.handleReset,
          });
        }
        return this.props.fallback as ReactNode;
      }

      const locale = getLocale();

      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <Warning className="w-8 h-8 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-center text-white mb-2">
              {ERROR_LABELS.title[locale]}
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-center text-sm mb-6">
              {ERROR_LABELS.desc[locale]}
            </p>

            {/* Error message (dev only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-xs font-mono wrap-anywhere">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg transition-colors"
              >
                <ArrowClockwise className="w-4 h-4" />
                {ERROR_LABELS.reload[locale]}
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                <House className="w-4 h-4" />
                {ERROR_LABELS.home[locale]}
              </button>
            </div>

            {/* Retry button for recoverable errors */}
            <button
              onClick={this.handleReset}
              className="w-full mt-4 text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              {ERROR_LABELS.retry[locale]}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
