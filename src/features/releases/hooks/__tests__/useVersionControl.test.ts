import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVersionControl } from '../useVersionControl';
import { createWrapper } from '@/test/test-utils';
import { assetsService } from '@/features/assets/services/assets.service';
import { useSocket } from '@/features/shared/hooks/useSocket';

vi.mock('@/lib/use-api-auth', () => ({
  useApiAuth: () => ({ token: 'mock-token', orgId: 'org-123', isReady: true }),
}));

vi.mock('@/features/assets/services/assets.service', () => ({
  assetsService: {
    getGlobalReleases: vi.fn(),
    fetchInventory: vi.fn(),
    updateRelease: vi.fn(),
    createRelease: vi.fn(),
  },
}));

vi.mock('@/features/shared/hooks/useSocket', () => ({
  useSocket: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

const mockReleasesResponse = {
  data: [
    {
      id: 'rel-1',
      product_id: 'prod-1',
      product_name: 'App',
      version: '1.0.0',
      status: 'stable',
      released_at: '2026-01-01T00:00:00Z',
      file_size_bytes: 1024,
      file_hash: 'abc',
    },
  ],
  total: 10,
  page: 1,
};

const mockInventoryResponse = {
  assets: [{ id: 'prod-1', name: 'App' }],
};

describe('useVersionControl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assetsService.getGlobalReleases).mockResolvedValue(mockReleasesResponse as any);
    vi.mocked(assetsService.fetchInventory).mockResolvedValue(mockInventoryResponse as any);
  });

  it('fetches versions and available assets correctly', async () => {
    const { result } = renderHook(() => useVersionControl(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(assetsService.getGlobalReleases).toHaveBeenCalledWith('mock-token', 'org-123', 1, 15);
    expect(result.current.versions).toHaveLength(1);
    expect(result.current.versions[0].versionNumber).toBe('1.0.0');
    expect(result.current.totalVersions).toBe(10);
    expect(result.current.availableAssets).toHaveLength(1);
  });

  it('handles deprecation mutation optimistically', async () => {
    const { result } = renderHook(() => useVersionControl(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(assetsService.updateRelease).mockResolvedValue({} as any);

    act(() => {
      result.current.handleDeprecate('rel-1');
    });

    // Expect the state to be optimisticly updated
    await waitFor(() => {
      const deprecatedRelease = result.current.versions.find(v => v.id === 'rel-1');
      expect(deprecatedRelease?.status).toBe('deprecated');
      expect(assetsService.updateRelease).toHaveBeenCalledWith('mock-token', 'org-123', 'rel-1', { status: 'deprecated' });
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Release marked as deprecated'));
  });

  it('handles creating a new release', async () => {
    const { result } = renderHook(() => useVersionControl(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(assetsService.createRelease).mockResolvedValue({} as any);

    await act(async () => {
      await result.current.handleSaveVersion({
        versionNumber: '1.1.0',
        status: 'beta',
        productId: 'prod-1',
      });
    });

    expect(assetsService.createRelease).toHaveBeenCalledWith(
      'mock-token',
      'org-123',
      'prod-1',
      expect.objectContaining({
        version: '1.1.0',
        status: 'beta',
      })
    );
    expect(toast.success).toHaveBeenCalledWith('Release created successfully');
  });

  it('registers socket event listeners', () => {
    renderHook(() => useVersionControl(), {
      wrapper: createWrapper(),
    });

    expect(useSocket).toHaveBeenCalledWith('release.created', expect.any(Function), true);
    expect(useSocket).toHaveBeenCalledWith('release.updated', expect.any(Function), true);
    expect(useSocket).toHaveBeenCalledWith('release.deleted', expect.any(Function), true);
  });

  it('handles menu toggle correctly', () => {
    const { result } = renderHook(() => useVersionControl(), {
      wrapper: createWrapper(),
    });

    expect(result.current.activeMenu).toBeNull();
    act(() => result.current.toggleMenu('menu-1'));
    expect(result.current.activeMenu).toBe('menu-1');
    act(() => result.current.toggleMenu('menu-1'));
    expect(result.current.activeMenu).toBeNull();
  });
});
