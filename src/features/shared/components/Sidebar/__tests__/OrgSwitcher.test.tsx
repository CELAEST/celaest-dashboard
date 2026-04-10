/**
 * Tests for OrgSwitcher "Create workspace" plan gate.
 *
 * Coverage:
 *   1. When user has no active plan → shows info toast + navigates to billing
 *   2. When user has an active plan → navigates to settings/workspace
 *   3. Dropdown closes after clicking "Create workspace"
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock useTheme
vi.mock("@/features/shared/hooks/useTheme", () => ({
  useTheme: () => ({ isDark: true, theme: "dark", setTheme: vi.fn() }),
}));

// Mock auth store
vi.mock("@/features/auth/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    session: { accessToken: "test-token" },
    isAuthenticated: true,
  }),
}));

// Mock users API
vi.mock("@/features/users/api/users.api", () => ({
  usersApi: { updateMe: vi.fn() },
}));

// Mock socket client (billing hooks may depend on it)
vi.mock("@/lib/socket-client", () => ({
  socket: {
    on: vi.fn(() => () => {}),
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

// Mock auth context
vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => ({
    session: { accessToken: "test-token" },
    isAuthenticated: true,
    user: { id: "user-1" },
  }),
}));

// --- Configurable billing mock ---
let mockPlan: unknown = null;

vi.mock("@/features/billing/hooks/useBilling", () => ({
  useBilling: () => ({
    plan: mockPlan,
    subscription: null,
    activePlanIds: [],
    activePlans: [],
    allSubscriptions: [],
    usage: {
      licenses: { used: 0, total: 0, percent: 0 },
      apiCalls: { used: 0, total: 0, percent: 0 },
    },
    invoices: [],
    plans: [],
    isLoading: false,
    error: null,
    refresh: vi.fn(),
  }),
}));

// --- Org store mock ---
const ORG_A = { id: "org-1", name: "Acme Corp", slug: "acme", role: "owner", is_default: true };
const ORG_B = { id: "org-2", name: "Beta Inc", slug: "beta", role: "viewer", is_default: false };

vi.mock("@/features/shared/stores/useOrgStore", () => ({
  useOrgStore: () => ({
    currentOrg: ORG_A,
    organizations: [ORG_A, ORG_B],
    setCurrentOrg: vi.fn(),
  }),
}));

// ReactQuery mock
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({ data: null, isLoading: false })),
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}));

// ---------------------------------------------------------------------------
// Import under test
// ---------------------------------------------------------------------------
import { OrgSwitcher } from "../OrgSwitcher";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("OrgSwitcher — Create Workspace plan gate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlan = null;
  });

  const openDropdownAndClickCreate = async () => {
    render(<OrgSwitcher isExpanded={true} />);

    // Open the dropdown by clicking the trigger
    const trigger = screen.getByRole("button", { name: /acme/i });
    fireEvent.click(trigger);

    // Wait for dropdown animation to complete and "Create workspace" to appear
    await waitFor(() => {
      expect(screen.getByText(/create workspace/i)).toBeVisible();
    });

    // Click the "Create workspace" button
    fireEvent.click(screen.getByText(/create workspace/i));
  };

  it("redirects to billing when user has no active plan", async () => {
    mockPlan = null;

    await openDropdownAndClickCreate();

    expect(toast.info).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        description: expect.stringContaining("plan"),
      }),
    );
    expect(mockPush).toHaveBeenCalledWith("/?tab=billing");
  });

  it("redirects to settings/workspace when user has an active plan", async () => {
    mockPlan = {
      id: "plan-1",
      name: "Enterprise",
      code: "enterprise",
      tier: 3,
      is_active: true,
    };

    await openDropdownAndClickCreate();

    expect(toast.info).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/?tab=settings&section=workspace");
  });

  it("closes the dropdown after clicking Create workspace", async () => {
    mockPlan = null;

    await openDropdownAndClickCreate();

    // The dropdown should be closed — "Create workspace" button should not be visible
    await waitFor(() => {
      expect(screen.queryByText(/create workspace/i)).not.toBeInTheDocument();
    });
  });
});
