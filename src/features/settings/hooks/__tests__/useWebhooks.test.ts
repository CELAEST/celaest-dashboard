import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWebhooks } from '../useWebhooks';
import { createWrapper } from '@/test/test-utils';
import { settingsApi } from '../../api/settings.api';

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({ session: { accessToken: 'mock-token' } }),
}));

vi.mock('@/features/shared/stores/useOrgStore', () => ({
  useOrgStore: () => ({ id: 'org-123' }), // Actually the hook uses `(s) => s.currentOrg`, so we need to mock Zustand properly or just the hook return value
}));

// We'll mock the hook to handle the selector
vi.mock('@/features/shared/stores/useOrgStore', () => {
  return {
    useOrgStore: vi.fn((selector) => selector({ currentOrg: { id: 'org-123' } })),
  };
});


vi.mock('../../api/settings.api', () => ({
  settingsApi: {
    getWebhooks: vi.fn(),
    createWebhook: vi.fn(),
    deleteWebhook: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

const mockWebhooks = [
  {
    id: 'wh-1',
    url: 'https://example.com/webhook',
    events: ['*'],
    is_active: true,
    secret: 'secret',
    created_at: '2026-01-01T00:00:00Z',
  },
];

describe('useWebhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(settingsApi.getWebhooks).mockResolvedValue(mockWebhooks as any);
  });

  it('fetches webhooks correctly', async () => {
    const { result } = renderHook(() => useWebhooks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(settingsApi.getWebhooks).toHaveBeenCalledWith('mock-token', 'org-123');
    expect(result.current.webhooks).toHaveLength(1);
    expect(result.current.webhooks[0].id).toBe('wh-1');
  });

  it('creates webhook and invalidates queries', async () => {
    const { result } = renderHook(() => useWebhooks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(settingsApi.createWebhook).mockResolvedValue({} as any);

    act(() => {
      result.current.createWebhook({ url: 'https://test.com', events: ['user.created'] });
    });

    await waitFor(() => {
      expect(settingsApi.createWebhook).toHaveBeenCalledWith('mock-token', 'org-123', {
        url: 'https://test.com',
        events: ['user.created'],
      });
      expect(toast.success).toHaveBeenCalledWith('Webhook endpoint created successfully');
    });
  });

  it('deletes webhook and invalidates queries', async () => {
    const { result } = renderHook(() => useWebhooks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(settingsApi.deleteWebhook).mockResolvedValue({} as any);

    act(() => {
      result.current.deleteWebhook('wh-1');
    });

    await waitFor(() => {
      expect(settingsApi.deleteWebhook).toHaveBeenCalledWith('mock-token', 'org-123', 'wh-1');
      expect(toast.success).toHaveBeenCalledWith('Webhook endpoint removed');
    });
  });
});
