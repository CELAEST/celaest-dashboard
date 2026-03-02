import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useROIMetrics } from "../useROIMetrics";
import * as roiQueries from "../useROIQuery";
import { createWrapper } from "@/test/test-utils";

// Mock auth and org contexts
vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user-id" },
    session: { accessToken: "test-token" },
  }),
}));

vi.mock("@/features/shared/stores/useOrgStore", () => ({
  useOrgStore: () => ({
    currentOrg: { id: "test-org-id" },
  }),
}));

// Mock Supabase
vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: vi.fn(() => ({})),
  supabase: {},
}));

// Mock the queries
vi.mock("../useROIQuery", () => ({
  useROIQuery: vi.fn(),
  useROIByProductQuery: vi.fn(),
  useSalesByPeriodQuery: vi.fn(),
  useTasksQuery: vi.fn(),
  useActiveUsersQuery: vi.fn(),
  useUsersQuery: vi.fn(),
}));

// Mock other hooks
vi.mock("@/features/shared/hooks/useTheme", () => ({
  useTheme: () => ({ theme: "dark" }),
}));

vi.mock("@/features/auth/hooks/useAuthorization", () => ({
  useRole: () => ({ isSuperAdmin: true }),
}));

describe("useROIMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for successful data load
    (roiQueries.useTasksQuery as Mock).mockReturnValue({
      data: { completed_tasks: 100 },
      isLoading: false,
      refetch: vi.fn(),
    });

    (roiQueries.useROIQuery as Mock).mockReturnValue({
      data: {},
      isLoading: false,
      refetch: vi.fn(),
    });
    (roiQueries.useActiveUsersQuery as Mock).mockReturnValue({
      data: { monthly_active_users: 50 },
      isLoading: false,
      refetch: vi.fn(),
    });
    (roiQueries.useROIByProductQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: vi.fn(),
    });
    (roiQueries.useUsersQuery as Mock).mockReturnValue({
      data: { churned_users: 5 },
      isLoading: false,
      refetch: vi.fn(),
    });
    (roiQueries.useSalesByPeriodQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it("should calculate derived metrics correctly (saved hours and value generated)", () => {
    // 100 tasks * 0.166 = 16.6 -> rounded to 17h (Wait, my impl uses Math.round(tasks * 0.166))
    // 100 * 0.166 = 16.6. Math.round(16.6) = 17.
    // 17 * 25 = 425.

    const { result } = renderHook(() => useROIMetrics(), {
      wrapper: createWrapper(),
    });

    const timeMetric = result.current.metrics.find(
      (m) => m.label === "Tiempo Total Ahorrado",
    );
    const tasksMetric = result.current.metrics.find(
      (m) => m.label === "Tareas Completadas",
    );
    const valueMetric = result.current.metrics.find(
      (m) => m.label === "Valor Generado",
    );

    expect(timeMetric?.value).toBe("17h");
    expect(tasksMetric?.value).toBe("100");
    expect(valueMetric?.value).toBe("$425");
  });

  it("should handle loading state", () => {
    (roiQueries.useTasksQuery as Mock).mockReturnValue({ isLoading: true });

    const { result } = renderHook(() => useROIMetrics(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.metrics[0].value).toBe("...");
  });

  it("should calculate growth correctly between periods", () => {
    // Current: 100 tasks (17h)
    // Prev: 50 tasks (8h)
    // Growth: (17 - 8) / 8 = 1.125 = +112.5%

    (roiQueries.useTasksQuery as Mock).mockImplementation(
      (token, orgId, period) => {
        if (period === "week")
          return { data: { completed_tasks: 100 }, isLoading: false };
        if (period === "month")
          return { data: { completed_tasks: 50 }, isLoading: false };
        return { data: { completed_tasks: 0 }, isLoading: false };
      },
    );

    const { result } = renderHook(() => useROIMetrics(), {
      wrapper: createWrapper(),
    });

    const timeMetric = result.current.metrics.find(
      (m) => m.label === "Tiempo Total Ahorrado",
    );
    expect(timeMetric?.change).toBe("+112.5%");
  });
});
