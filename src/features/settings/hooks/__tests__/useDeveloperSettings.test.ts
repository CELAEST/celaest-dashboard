import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDeveloperSettings } from '../useDeveloperSettings';
import { createWrapper } from '@/test/test-utils';
import api from '@/lib/api-client';

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({ session: { accessToken: 'mock-token' } }),
}));

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

import { toast } from 'sonner';

const mockApiKeysResponse = {
  api_keys: [
    {
      id: 'key-1',
      name: 'API Key 1',
      key_prefix: 'sk_test_',
      created_at: '2026-01-01T00:00:00Z',
    },
  ],
};

describe('useDeveloperSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue(mockApiKeysResponse as any);
  });

  it('fetches api keys correctly', async () => {
    const { result } = renderHook(() => useDeveloperSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(api.get).toHaveBeenCalledWith('/api/v1/user/api-keys', { token: 'mock-token' });
    expect(result.current.apiKeys).toHaveLength(1);
    expect(result.current.apiKeys[0].id).toBe('key-1');
    expect(result.current.apiKeys[0].key).toBe('sk_test_••••••••');
  });

  it('generates a new api key correctly', async () => {
    const { result } = renderHook(() => useDeveloperSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(api.post).mockResolvedValue({} as any);

    act(() => {
      result.current.generateKey();
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/user/api-keys',
        { name: 'API Key 2' },
        { token: 'mock-token' }
      );
      expect(toast.success).toHaveBeenCalledWith('New API key generated successfully');
    });
  });

  it('revokes an api key optimistically', async () => {
    const { result } = renderHook(() => useDeveloperSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Notice we use a delay so optimism can be verified
    vi.mocked(api.delete).mockImplementation(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    act(() => {
      result.current.revokeKey('key-1');
    });

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/api/v1/user/api-keys/key-1', { token: 'mock-token' });
      expect(result.current.apiKeys).toHaveLength(0);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('API key revoked');
    });
  });

  it('copies key to clipboard', async () => {
    const { result } = renderHook(() => useDeveloperSettings(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.copyToClipboard('sk_test_123');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('sk_test_123');
    expect(toast.success).toHaveBeenCalledWith('API Key copied to clipboard');
  });
});
