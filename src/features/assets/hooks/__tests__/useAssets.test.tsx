import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useAssets } from "../useAssets";
import * as assetsQueries from "../useAssetsQuery";
import { assetsService } from "../../services/assets.service";
import { createWrapper } from "@/test/test-utils";
import { toast } from "sonner";

// Mock dependencies
vi.mock("../useAssetsQuery", () => ({
  useMyAssetsQuery: vi.fn(),
  useOrgInventoryQuery: vi.fn(),
}));

vi.mock("../../services/assets.service", () => ({
  assetsService: {
    downloadAsset: vi.fn(),
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

vi.mock("@/features/shared/stores/useOrgStore", () => ({
  useOrgStore: () => ({
    currentOrg: { id: "test-org-id" },
  }),
}));

describe("useAssets", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (assetsQueries.useMyAssetsQuery as Mock).mockReturnValue({
      data: [{ id: "asset-1", name: "Asset 1" }],
      isLoading: false,
      refetch: vi.fn(),
    });

    (assetsQueries.useOrgInventoryQuery as Mock).mockReturnValue({
      data: [{ id: "inv-1", name: "Inventory 1" }],
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it("should return assets and inventory from queries", () => {
    const { result } = renderHook(() => useAssets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.assets).toHaveLength(1);
    expect(result.current.assets[0].name).toBe("Asset 1");
    expect(result.current.inventory).toHaveLength(1);
    expect(result.current.inventory[0].name).toBe("Inventory 1");
  });

  it("should handle download logic", async () => {
    const mockDownloadUrl = "https://example.com/download";
    (assetsService.downloadAsset as Mock).mockResolvedValue({
      download_url: mockDownloadUrl,
    });

    // Mock window.open
    const windowSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    const { result } = renderHook(() => useAssets(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.downloadAsset("asset-1", "test-slug");
    });

    expect(assetsService.downloadAsset).toHaveBeenCalledWith(
      "test-token",
      "asset-1",
    );
    expect(windowSpy).toHaveBeenCalledWith(mockDownloadUrl, "_blank");
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining("test-slug"),
    );
  });

  it("should handle download failures", async () => {
    (assetsService.downloadAsset as Mock).mockRejectedValue(new Error("Fail"));

    const { result } = renderHook(() => useAssets(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.downloadAsset("asset-1");
    });

    expect(toast.error).toHaveBeenCalledWith("Download failed");
  });
});
