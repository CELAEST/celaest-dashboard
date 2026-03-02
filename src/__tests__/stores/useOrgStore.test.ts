/**
 * Unit tests for useOrgStore — membership revocation & org recovery flows.
 *
 * Testing strategy (Google SWE Book §12):
 * - Each test covers ONE behavior.
 * - Arrange / Act / Assert structure.
 * - Mocks at the boundary, never the unit under test.
 * - Tests are deterministic: no real timers, no real network.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";

// ---------- Store under test ----------
// Import AFTER setting up mocks so module-level code (revoked landing check) doesn't read real localStorage.
let useOrgStore: typeof import("@/features/shared/stores/useOrgStore").useOrgStore;

// ---------- Shared fixtures ----------
const CELAEST_ORG = {
  id: "org-celaest-001",
  name: "CELAEST",
  slug: "celaest",
  role: "client",
  is_default: true,
  is_system_default: true,
};

const JULI_ORG = {
  id: "org-juli-002",
  name: "Juli Workspace",
  slug: "juli",
  role: "viewer",
  is_default: false,
};

const MOCK_TOKEN = "eyJhbGciOiJSUzI1NiJ9.mock";

// ---------- Mock authService ----------
const mockGetUserOrganizations = vi.fn();

vi.mock("@/features/auth/services/auth.service", () => ({
  authService: {
    getUserOrganizations: mockGetUserOrganizations,
  },
}));

// ---------- Test setup ----------
beforeEach(async () => {
  // Reset localStorage before each test (module-level code reads it on import)
  localStorage.clear();

  // Dynamic import so the store is fresh for each test
  vi.resetModules();
  const mod = await import("@/features/shared/stores/useOrgStore");
  useOrgStore = mod.useOrgStore;

  // Reset store state
  useOrgStore.getState().reset();

  mockGetUserOrganizations.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

// =============================================================================
// clearSync
// =============================================================================
describe("clearSync()", () => {
  it("wipes currentOrg and organizations from memory", () => {
    useOrgStore.setState({ currentOrg: JULI_ORG, organizations: [JULI_ORG, CELAEST_ORG] });

    useOrgStore.getState().clearSync();

    const { currentOrg, organizations } = useOrgStore.getState();
    expect(currentOrg).toBeNull();
    expect(organizations).toHaveLength(0);
  });

  it("clears currentOrg in celaest-org-storage (Zustand persist re-writes the key with null)", () => {
    // Zustand persist always keeps the key; clearSync sets currentOrg to null
    // so the persisted value must reflect that — not the stale Juli org.
    localStorage.setItem(
      "celaest-org-storage",
      JSON.stringify({ state: { currentOrg: JULI_ORG }, version: 0 }),
    );

    useOrgStore.getState().clearSync();

    // Zustand persist may re-write the key after setState, so we check the value.
    const raw = localStorage.getItem("celaest-org-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      expect(parsed?.state?.currentOrg).toBeNull();
    } else {
      // Key was removed and not re-written yet — also correct.
      expect(raw).toBeNull();
    }
  });

  it("removes celaest:revoked_orgs blacklist from sessionStorage", () => {
    // This is the critical fix: sessionStorage survives window.location.href
    // redirects within the same tab. Without clearing it here, the revoked
    // org ID persists across the /?revoked=true redirect and blocks billing,
    // assets and checkout requests even after currentOrg is already Celaest.
    sessionStorage.setItem(
      "celaest:revoked_orgs",
      JSON.stringify([JULI_ORG.id]),
    );

    useOrgStore.getState().clearSync();

    expect(sessionStorage.getItem("celaest:revoked_orgs")).toBeNull();
  });

  it("removes celaest:home_org_id from sessionStorage so it is rebuilt cleanly on next fetchOrgs", () => {
    sessionStorage.setItem("celaest:home_org_id", CELAEST_ORG.id);

    useOrgStore.getState().clearSync();

    // clearSync must wipe the tracker so that the next fetchOrgs re-writes it
    // with the correct value from the fresh org list, preventing stale protection.
    expect(sessionStorage.getItem("celaest:home_org_id")).toBeNull();
  });

  it("sets lastFetched to null so next fetchOrgs bypasses TTL", () => {
    useOrgStore.setState({ lastFetched: Date.now() });

    useOrgStore.getState().clearSync();

    expect(useOrgStore.getState().lastFetched).toBeNull();
  });
});

// =============================================================================
// fetchOrgs — TTL / force
// =============================================================================
describe("fetchOrgs() — cache control", () => {
  it("skips fetch when TTL is fresh and org is present", async () => {
    useOrgStore.setState({ currentOrg: JULI_ORG, lastFetched: Date.now() });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN);
    });

    expect(mockGetUserOrganizations).not.toHaveBeenCalled();
  });

  it("fetches when force=true even if TTL is fresh", async () => {
    useOrgStore.setState({ currentOrg: JULI_ORG, lastFetched: Date.now() });
    mockGetUserOrganizations.mockResolvedValueOnce({ organizations: [JULI_ORG] });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN, true);
    });

    expect(mockGetUserOrganizations).toHaveBeenCalledOnce();
  });

  it("fetches when currentOrg is null regardless of TTL (post-removal recovery)", async () => {
    useOrgStore.setState({ currentOrg: null, lastFetched: Date.now() });
    mockGetUserOrganizations.mockResolvedValueOnce({ organizations: [CELAEST_ORG] });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN);
    });

    expect(mockGetUserOrganizations).toHaveBeenCalledOnce();
  });

  it("does not double-fetch when isLoading is already true", async () => {
    useOrgStore.setState({ isLoading: true });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN, true);
    });

    expect(mockGetUserOrganizations).not.toHaveBeenCalled();
  });
});

// =============================================================================
// fetchOrgs — org selection after removal
// =============================================================================
describe("fetchOrgs() — org selection after membership removal", () => {
  it("selects the org marked is_default when currentOrg is null", async () => {
    useOrgStore.setState({ currentOrg: null, lastFetched: null });
    mockGetUserOrganizations.mockResolvedValueOnce({
      organizations: [JULI_ORG, CELAEST_ORG], // Celaest has is_default: true
    });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN);
    });

    expect(useOrgStore.getState().currentOrg?.id).toBe(CELAEST_ORG.id);
  });

  it("falls back to first org when none is marked is_default", async () => {
    const orgA = { ...JULI_ORG, is_default: false };
    const orgB = { ...CELAEST_ORG, is_default: false };
    useOrgStore.setState({ currentOrg: null, lastFetched: null });
    mockGetUserOrganizations.mockResolvedValueOnce({ organizations: [orgA, orgB] });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN);
    });

    expect(useOrgStore.getState().currentOrg?.id).toBe(orgA.id);
  });

  it("removes evicted org from selection when it is no longer in the list", async () => {
    // Before removal: viewer is in Juli
    useOrgStore.setState({ currentOrg: JULI_ORG, lastFetched: null });
    // After removal: backend no longer returns Juli
    mockGetUserOrganizations.mockResolvedValueOnce({ organizations: [CELAEST_ORG] });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN, true);
    });

    expect(useOrgStore.getState().currentOrg?.id).toBe(CELAEST_ORG.id);
  });

  it("preserves currentOrg when it is still present in the updated list", async () => {
    useOrgStore.setState({ currentOrg: JULI_ORG });
    mockGetUserOrganizations.mockResolvedValueOnce({
      organizations: [JULI_ORG, CELAEST_ORG],
    });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN, true);
    });

    // Juli should NOT be replaced — it is still valid
    expect(useOrgStore.getState().currentOrg?.id).toBe(JULI_ORG.id);
  });

  it("sets currentOrg to null when org list is empty", async () => {
    useOrgStore.setState({ currentOrg: JULI_ORG });
    mockGetUserOrganizations.mockResolvedValueOnce({ organizations: [] });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN, true);
    });

    expect(useOrgStore.getState().currentOrg).toBeNull();
  });

  it("preserves existing currentOrg on network error (no wipe on transient failure)", async () => {
    useOrgStore.setState({ currentOrg: CELAEST_ORG });
    mockGetUserOrganizations.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN, true);
    });

    // Must NOT wipe currentOrg on transient error
    expect(useOrgStore.getState().currentOrg?.id).toBe(CELAEST_ORG.id);
    expect(useOrgStore.getState().isLoading).toBe(false);
  });
});

// =============================================================================
// sessionStorage blacklist filtering
// =============================================================================
describe("fetchOrgs() — blacklist filtering", () => {
  it("filters out blacklisted org from the results", async () => {
    sessionStorage.setItem(
      "celaest:revoked_orgs",
      JSON.stringify([JULI_ORG.id]),
    );
    useOrgStore.setState({ currentOrg: null, lastFetched: null });
    mockGetUserOrganizations.mockResolvedValueOnce({
      organizations: [JULI_ORG, CELAEST_ORG],
    });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN);
    });

    const orgs = useOrgStore.getState().organizations;
    expect(orgs.some((o) => o.id === JULI_ORG.id)).toBe(false);
    expect(orgs.some((o) => o.id === CELAEST_ORG.id)).toBe(true);

    sessionStorage.clear();
  });
});

// =============================================================================
// fetchOrgs — home org protection (celaest:home_org_id)
// =============================================================================
describe("fetchOrgs() — home org ID tracking", () => {
  it("writes celaest:home_org_id for the is_system_default org", async () => {
    useOrgStore.setState({ currentOrg: null, lastFetched: null });
    mockGetUserOrganizations.mockResolvedValueOnce({
      organizations: [JULI_ORG, CELAEST_ORG], // CELAEST_ORG has is_system_default: true
    });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN);
    });

    expect(sessionStorage.getItem("celaest:home_org_id")).toBe(CELAEST_ORG.id);
  });

  it("writes celaest:home_org_id for an org whose slug starts with 'celaest' when no is_system_default", async () => {
    const celaestNoFlag = { ...CELAEST_ORG, is_system_default: false };
    useOrgStore.setState({ currentOrg: null, lastFetched: null });
    mockGetUserOrganizations.mockResolvedValueOnce({
      organizations: [JULI_ORG, celaestNoFlag],
    });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN);
    });

    expect(sessionStorage.getItem("celaest:home_org_id")).toBe(celaestNoFlag.id);
  });

  it("does NOT overwrite home_org_id when the org list has no home org candidate", async () => {
    sessionStorage.setItem("celaest:home_org_id", "existing-celaest-id");
    const otherOrg = { ...JULI_ORG, id: "other-org-123" };
    useOrgStore.setState({ currentOrg: null, lastFetched: null });
    mockGetUserOrganizations.mockResolvedValueOnce({
      organizations: [otherOrg],
    });

    await act(async () => {
      await useOrgStore.getState().fetchOrgs(MOCK_TOKEN, true);
    });

    // When no home org candidate found, the existing value is preserved
    expect(sessionStorage.getItem("celaest:home_org_id")).toBe("existing-celaest-id");
    sessionStorage.clear();
  });
});
