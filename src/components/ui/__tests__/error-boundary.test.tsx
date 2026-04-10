/**
 * Unit tests for ErrorBoundary component.
 *
 * Coverage:
 *   1. Renders children when no error occurs
 *   2. Renders default fallback UI when a child throws
 *   3. Renders custom ReactNode fallback when provided
 *   4. Renders function fallback with error and resetErrorBoundary props
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "../error-boundary";

// Suppress React error boundary console noise during tests
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

// ---------------------------------------------------------------------------
// Test Components
// ---------------------------------------------------------------------------

const ThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) throw new Error("Test explosion");
  return <div>Safe content</div>;
};

const SafeComponent = () => <div>Everything is fine</div>;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Everything is fine")).toBeTruthy();
  });

  it("renders default fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    // Default fallback has the title "Algo salió mal"
    expect(screen.getByText("Algo salió mal")).toBeTruthy();
    expect(screen.getByText("Recargar página")).toBeTruthy();
    expect(screen.getByText("Ir al inicio")).toBeTruthy();
  });

  it("renders custom ReactNode fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback widget</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom fallback widget")).toBeTruthy();
  });

  it("renders function fallback with error and reset props", () => {
    const fallbackFn = vi.fn(({ error, resetErrorBoundary }) => (
      <div>
        <span>Error: {error.message}</span>
        <button onClick={resetErrorBoundary}>Reset</button>
      </div>
    ));

    render(
      <ErrorBoundary fallback={fallbackFn}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Error: Test explosion")).toBeTruthy();
    expect(fallbackFn).toHaveBeenCalled();
    expect(fallbackFn).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        resetErrorBoundary: expect.any(Function),
      })
    );
  });
});
