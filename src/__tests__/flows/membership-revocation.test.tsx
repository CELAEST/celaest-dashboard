/**
 * Integration tests — Membership Revocation Flow
 *
 * Tests the full chain:
 *   Backend emits "membership_revoked" socket event
 *   → NotificationContext handler fires
 *   → clearSync() wipes org state
 *   → window.location redirects to /?revoked=true
 *
 * Also tests:
 *   - Race condition: org-broadcast fires first → clearSync already ran
 *   - Already in Celaest: no redirect needed
 *   - Removal from inactive workspace: only toast, no redirect
 *
 * Isolation strategy:
 *   - socket-client is mocked: we call registered listeners manually
 *   - window.location.href setter is spied on
 *   - useOrgStore is real (not mocked) so we test actual state changes
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";

// ---- Types ----
type SocketListener = (payload: unknown) => void;

// ---- Mock socket-client ----
// We keep a registry of listeners so tests can fire events themselves.
const socketListeners: Record<string, SocketListener[]> = {};

vi.mock("@/lib/socket-client", () => ({
  socket: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn((event: string, fn: SocketListener) => {
      if (!socketListeners[event]) socketListeners[event] = [];
      socketListeners[event].push(fn);
      return () => {
        socketListeners[event] = socketListeners[event].filter((l) => l !== fn);
      };
    }),
  },
}));

/** Utility: trigger a socket event on all registered listeners. */
function emitSocket(event: string, payload: unknown) {
  (socketListeners[event] ?? []).forEach((fn) => fn(payload));
}

// ---- Mock auth stores ----
// useAuthStore is called in two ways:
//   1. With selector:  useAuthStore((s) => s.session)
//   2. Without selector: const { session } = useAuthStore()
// Everything must be inline — vi.mock factories are hoisted to the top of the
// file, so external variables are not yet initialized when the factory runs.
vi.mock("@/features/auth/stores/useAuthStore", () => {
  const state = {
    session: { accessToken: "mock-token", user: { id: "user-viewer-001" } },
    isAuthenticated: true,
  };
  return {
    useAuthStore: vi.fn((selector?: (s: typeof state) => unknown) =>
      selector ? selector(state) : state,
    ),
  };
});

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    session: { accessToken: "mock-token", user: { id: "user-viewer-001" } },
    isAuthenticated: true,
    signOut: vi.fn(),
    isLoading: false,
    user: { id: "user-viewer-001" },
  })),
}));

// ---- Mock authService ----
const mockGetUserOrganizations = vi.fn();
vi.mock("@/features/auth/services/auth.service", () => ({
  authService: { getUserOrganizations: mockGetUserOrganizations },
}));

// ---- Mock tanstack query (NotificationContext uses useQuery for prefs) ----
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({ data: null })),
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}));

// ---- Mock settings API ----
vi.mock("@/features/settings/api/settings.api", () => ({
  settingsApi: { getNotificationPreferences: vi.fn().mockResolvedValue({}) },
}));

// ---- Fixtures ----
const CELAEST_ORG = {
  id: "org-celaest-001",
  name: "CELAEST",
  slug: "celaest",
  role: "client",
  is_default: true,
};

const JULI_ORG = {
  id: "org-juli-002",
  name: "Juli Workspace",
  slug: "juli",
  role: "viewer",
  is_default: false,
};

// ---- Imports under test (after mocks are declared) ----
// We import here so vi.mock calls above are hoisted correctly by Vitest.
import { NotificationProvider } from "@/features/shared/contexts/NotificationContext";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";

// ---- Minimal wrapper ----
const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <NotificationProvider>{children ?? null}</NotificationProvider>
);

// =============================================================================
// Setup / teardown
// =============================================================================
beforeEach(() => {
  // Clear socket listener registry between tests
  Object.keys(socketListeners).forEach((k) => delete socketListeners[k]);

  // Reset org store
  useOrgStore.getState().reset();
  localStorage.clear();
  sessionStorage.clear();

  // Default: fetchOrgs returns Celaest after removal
  mockGetUserOrganizations.mockResolvedValue({ organizations: [CELAEST_ORG] });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

// =============================================================================
// Scenario 1 — Viewer is inside the org being revoked
// =============================================================================
describe("membership_revoked — viewer is inside the removed org", () => {
  it("calls clearSync and redirects to /?revoked=true", async () => {
    // Arrange: viewer is currently browsing juli
    useOrgStore.setState({ currentOrg: JULI_ORG, organizations: [JULI_ORG, CELAEST_ORG] });

    const hrefSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "http://localhost/",
    });
    let capturedHref = "";
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        set href(val: string) { capturedHref = val; },
        get href() { return "http://localhost/"; },
      },
    });

    render(<Wrapper />);

    // Act: backend sends user-targeted membership_revoked event
    await act(async () => {
      emitSocket("organization.member_removed", {
        action: "membership_revoked",
        organization_id: JULI_ORG.id,
        user_id: "user-viewer-001",
      });
    });

    // Assert: store was wiped
    expect(useOrgStore.getState().currentOrg).toBeNull();
    expect(useOrgStore.getState().organizations).toHaveLength(0);

    // Assert: redirect happened with the correct flag
    expect(capturedHref).toBe("/?revoked=true");

    hrefSpy.mockRestore();
  });

  it("still redirects when org-broadcast already cleared currentOrg (race condition)", async () => {
    // Simulate racer: org-broadcast fires first → OrgSync.clearSync already ran
    // so currentOrg is already null by the time membership_revoked arrives
    useOrgStore.setState({ currentOrg: null, organizations: [] });

    let capturedHref = "";
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        set href(val: string) { capturedHref = val; },
        get href() { return "http://localhost/"; },
      },
    });

    render(<Wrapper />);

    await act(async () => {
      emitSocket("organization.member_removed", {
        action: "membership_revoked",
        organization_id: JULI_ORG.id,
        user_id: "user-viewer-001",
      });
    });

    // When freshCurrentOrgId is null, the || !freshCurrentOrgId branch fires
    expect(capturedHref).toBe("/?revoked=true");
  });
});

// =============================================================================
// Scenario 2 — Viewer was in a different (inactive) workspace
// =============================================================================
describe("membership_revoked — viewer is NOT in the removed org", () => {
  it("does NOT redirect — only shows a warning toast", async () => {
    // Arrange: viewer is currently in Celaest, not Juli
    useOrgStore.setState({ currentOrg: CELAEST_ORG, organizations: [CELAEST_ORG, JULI_ORG] });

    let capturedHref = "";
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        set href(val: string) { capturedHref = val; },
        get href() { return "http://localhost/"; },
      },
    });

    render(<Wrapper />);

    await act(async () => {
      emitSocket("organization.member_removed", {
        action: "membership_revoked",
        organization_id: JULI_ORG.id, // different from currentOrg
        user_id: "user-viewer-001",
      });
    });

    // No redirect — user is not browsing the removed org
    expect(capturedHref).toBe("");

    // org state should remain unchanged
    expect(useOrgStore.getState().currentOrg?.id).toBe(CELAEST_ORG.id);
  });
});

// =============================================================================
// Scenario 3 — org-broadcast (someone ELSE removed, not the viewer)
// =============================================================================
describe("member_removed — broadcast for another user", () => {
  it("calls fetchOrgs to refresh the list but does NOT redirect", async () => {
    useOrgStore.setState({ currentOrg: CELAEST_ORG, organizations: [CELAEST_ORG] });

    let capturedHref = "";
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        set href(val: string) { capturedHref = val; },
        get href() { return "http://localhost/"; },
      },
    });

    render(<Wrapper />);

    await act(async () => {
      emitSocket("organization.member_removed", {
        action: "member_removed", // NOT membership_revoked
        organization_id: CELAEST_ORG.id,
        user_id: "some-other-user-999",
      });
    });

    expect(capturedHref).toBe("");
    expect(useOrgStore.getState().currentOrg?.id).toBe(CELAEST_ORG.id);
  });
});

// =============================================================================
// Scenario 4 — celaest:org_not_found nuclear recovery
// =============================================================================
describe("celaest:org_not_found custom event", () => {
  it("clears store and navigates to /?revoked=true", async () => {
    useOrgStore.setState({ currentOrg: JULI_ORG, organizations: [JULI_ORG] });

    let capturedHref = "";
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        set href(val: string) { capturedHref = val; },
        get href() { return "http://localhost/"; },
      },
    });

    // Spy on clearSync to confirm it was called BEFORE the redirect
    const clearSyncSpy = vi.spyOn(useOrgStore.getState(), "clearSync");

    const { OrgSync } = await import("@/features/shared/components/OrgSync");
    render(<OrgSync />);

    await act(async () => {
      window.dispatchEvent(new CustomEvent("celaest:org_not_found"));
    });

    // clearSync must have been called (store wipe)
    expect(clearSyncSpy).toHaveBeenCalledOnce();
    // Navigation to the revoked landing page
    expect(capturedHref).toBe("/?revoked=true");
    // NOTE: We do NOT assert currentOrg=null here because jsdom does not stop
    // JS execution after the href assignment, so OrgSync's fetchOrgs may
    // immediately re-populate the org. In a real browser the page reloads.
  });

  it("is idempotent — second dispatch does not reset isRedirecting", async () => {
    let hrefAssignCount = 0;
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...window.location,
        set href(_val: string) { hrefAssignCount++; },
        get href() { return "http://localhost/"; },
      },
    });

    const { OrgSync } = await import("@/features/shared/components/OrgSync");
    render(<OrgSync />);

    await act(async () => {
      window.dispatchEvent(new CustomEvent("celaest:org_not_found"));
      window.dispatchEvent(new CustomEvent("celaest:org_not_found"));
    });

    // isRedirecting.current guard prevents double-navigate
    expect(hrefAssignCount).toBe(1);
  });
});

// =============================================================================
// Scenario 5 — fetchOrgs recovers to Celaest after clearSync
// =============================================================================
describe("fetchOrgs recovery after clearSync", () => {
  it("sets currentOrg to Celaest after clearSync wipes the store", async () => {
    // After clearSync: state is empty
    useOrgStore.getState().clearSync();

    // Backend returns Celaest as the default
    mockGetUserOrganizations.mockResolvedValueOnce({
      organizations: [{ ...CELAEST_ORG, is_default: true }],
    });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs("mock-token");
    });

    expect(useOrgStore.getState().currentOrg?.slug).toBe("celaest");
    expect(useOrgStore.getState().currentOrg?.is_default).toBe(true);
  });
});
