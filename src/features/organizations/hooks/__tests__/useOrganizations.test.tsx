import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useOrganizations,
  useOrganizationMutations,
} from "../useOrganizations";
import { organizationsApi } from "../../api/organizations.api";
import { createWrapper } from "../../../../test/test-utils";
import { toast } from "sonner";

// Mock dependencies
vi.mock("../../api/organizations.api", () => ({
  organizationsApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => ({
    session: { accessToken: "test-token" },
  }),
}));

// Mock Supabase to avoid env var errors
vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: vi.fn(() => ({})),
  supabase: {},
}));

describe("Organizations Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useOrganizations", () => {
    it("should fetch organization list", async () => {
      const mockOrgs = [{ id: "org-1", name: "Org 1" }];
      vi.mocked(organizationsApi.list).mockResolvedValue(mockOrgs);

      const { result } = renderHook(() => useOrganizations("test-token"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(organizationsApi.list).toHaveBeenCalledWith("test-token");
      expect(result.current.data).toEqual(mockOrgs);
    });
  });

  describe("useOrganizationMutations", () => {
    it("should handle create organization", async () => {
      const newOrg = { name: "New Org", slug: "new-org" };
      vi.mocked(organizationsApi.create).mockResolvedValue({
        id: "org-2",
        ...newOrg,
      } as Parameters<Parameters<typeof vi.mocked>[0]>[0]); // Fixed any lint error, cast to matching generic type

      const { result } = renderHook(
        () => useOrganizationMutations("test-token"),
        { wrapper: createWrapper() },
      );

      await result.current.create(newOrg);

      expect(organizationsApi.create).toHaveBeenCalledWith(
        "test-token",
        newOrg,
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Organización creada exitosamente",
      );
    });
  });
});
