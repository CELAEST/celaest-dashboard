import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import esMessages from "@/messages/es.json";
import { OtpLoginForm } from "@/features/auth/components/forms/OtpLoginForm";
import { LoginForm } from "@/features/auth/components/forms/LoginForm";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es" messages={esMessages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("OtpLoginForm — magic-link single invocation and error recovery", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
    window.history.replaceState({}, "", "/auth?mode=otp&email=celaest.oficial%2Btag%40gmail.com&token=magic-tok-1");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls /api/v1/auth/otp/verify EXACTLY ONCE even in React StrictMode and when parent re-renders with new onSuccess closures", async () => {
    const fetchMock = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/auth/otp/verify")) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              access_token: "jwt-otp-ok",
              expires_in: 3600,
              refresh_token: "ref-otp-ok",
              user: { id: "u-otp-1", email: "celaest.oficial+tag@gmail.com", role: "admin" },
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("{}", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const onSuccess1 = vi.fn();
    const { rerender } = render(
      <React.StrictMode>
        <NextIntlClientProvider locale="es" messages={esMessages}>
          <OtpLoginForm
            isDark={false}
            initialEmail="celaest.oficial+tag@gmail.com"
            initialToken="magic-tok-1"
            onSuccess={onSuccess1}
            onBack={vi.fn()}
          />
        </NextIntlClientProvider>
      </React.StrictMode>,
    );

    const onSuccess2 = vi.fn();
    rerender(
      <React.StrictMode>
        <NextIntlClientProvider locale="es" messages={esMessages}>
          <OtpLoginForm
            isDark={false}
            initialEmail="celaest.oficial+tag@gmail.com"
            initialToken="magic-tok-1"
            onSuccess={onSuccess2}
            onBack={vi.fn()}
          />
        </NextIntlClientProvider>
      </React.StrictMode>,
    );

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    const verifyCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes("/auth/otp/verify"));
    expect(verifyCalls).toHaveLength(1);
    expect(useAuthStore.getState().user?.role).toBe("admin");
    expect(window.location.search).not.toContain("token=magic-tok-1");
  });

  it("shows error, preserves manual 6-digit typing without re-firing magicToken, and lets user resend OTP", async () => {
    const fetchMock = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/auth/otp/verify")) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: "OTP_VERIFICATION_FAILED",
              message: "el código de verificación es inválido o ha expirado",
            },
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.includes("/auth/otp/request")) {
        return new Response(
          JSON.stringify({ success: true, data: { message: "sent" } }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("{}", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(
      <OtpLoginForm
        isDark={false}
        initialEmail="celaest.oficial+tag@gmail.com"
        initialToken="expired-magic-tok-2"
        onSuccess={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("el código de verificación es inválido o ha expirado");
    });

    const input = screen.getByPlaceholderText("000000");
    fireEvent.change(input, { target: { value: "654321" } });

    const verifyCallsAfterTyping = fetchMock.mock.calls.filter(([url]) => String(url).includes("/auth/otp/verify"));
    expect(verifyCallsAfterTyping).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: esMessages.auth.resend_otp }));
    await waitFor(() => {
      const requestCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes("/auth/otp/request"));
      expect(requestCalls).toHaveLength(1);
    });
  });

  it("submits 6-digit signup confirmation code directly when initialEmail is provided without magicToken", async () => {
    window.history.replaceState({}, "", "/auth");
    const fetchMock = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/auth/otp/verify")) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              access_token: "jwt-signup-ok",
              expires_in: 86400,
              refresh_token: "ref-signup-ok",
              user: { id: "u-new-1", email: "nuevo@celaest.com", role: "client" },
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("{}", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const onSuccess = vi.fn();
    renderWithIntl(
      <OtpLoginForm
        isDark={false}
        initialEmail="nuevo@celaest.com"
        onSuccess={onSuccess}
        onBack={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("000000");
    fireEvent.change(input, { target: { value: "849201" } });
    fireEvent.click(screen.getByRole("button", { name: esMessages.auth.verify_otp_button }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user?.email).toBe("nuevo@celaest.com");
  });

  it("does NOT render secondary 6-digit login button on LoginForm", () => {
    renderWithIntl(
      <LoginForm
        isDark={false}
        onSubmit={vi.fn()}
        loading={false}
        onForgotPassword={vi.fn()}
      />,
    );

    expect(screen.queryByText(esMessages.auth.sign_in_with_otp)).toBeNull();
    expect(screen.getByText(esMessages.auth.forgot_password)).toBeTruthy();
  });
});

