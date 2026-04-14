import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfileSettings } from '../useProfileSettings';
import { createWrapper } from '@/test/test-utils';
import { settingsApi } from '../../api/settings.api';

// Mock dependencies
const mockToken = 'mock-token';
vi.mock('@/lib/use-api-auth', () => ({
  useApiAuth: () => ({ token: mockToken, isReady: true }),
}));

const mockUpdateUser = vi.fn();
const mockSignInWithOAuth = vi.fn();
vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      updateUser: mockUpdateUser,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

vi.mock('../../api/settings.api', () => ({
  settingsApi: {
    getMe: vi.fn(),
    updateMe: vi.fn(),
    unlinkProvider: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

const mockUser = {
  id: 'user1',
  email: 'test@celaest.dev',
  display_name: 'Test User',
  avatar_url: 'https://example.com/avatar.png',
  identities: [{ provider: 'google' }],
};

describe('useProfileSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches profile data successfully', async () => {
    vi.mocked(settingsApi.getMe).mockResolvedValue(mockUser as never);

    const { result } = renderHook(() => useProfileSettings(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to finish loading
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(settingsApi.getMe).toHaveBeenCalledWith(mockToken);
    expect(result.current.profile).toEqual(mockUser);
    expect(result.current.avatarUrl).toBe('https://example.com/avatar.png');
    // It should derive connected accounts from identities
    expect(result.current.connectedAccounts).toEqual({ google: true, github: false });
  });

  it('handles optimistic updates when saving profile', async () => {
    vi.mocked(settingsApi.getMe).mockResolvedValue(mockUser as never);
    vi.mocked(settingsApi.updateMe).mockResolvedValue({ ...mockUser, display_name: 'New Name' } as never);

    const { result } = renderHook(() => useProfileSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.saveProfile({ displayName: 'New Name', jobTitle: 'Developer' });
    });

    // Verify optimistic update took place before api resolves
    await waitFor(() => {
      expect(settingsApi.updateMe).toHaveBeenCalledWith(
        expect.objectContaining({ display_name: 'New Name', job_title: 'Developer' }),
        mockToken
      );
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Profile updated successfully'));
  });

  it('handles email change via Supabase', async () => {
    vi.mocked(settingsApi.getMe).mockResolvedValue(mockUser as never);
    mockUpdateUser.mockResolvedValue({ data: {}, error: null });

    const { result } = renderHook(() => useProfileSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleEmailChange('new@celaest.dev');
    });

    expect(mockUpdateUser).toHaveBeenCalledWith({ email: 'new@celaest.dev' });
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Verification email sent')
    );
  });

  it('toggles OAuth account linking (unlink)', async () => {
    vi.mocked(settingsApi.getMe).mockResolvedValue(mockUser as never);
    vi.mocked(settingsApi.unlinkProvider).mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() => useProfileSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Since google is true, this should call unlinkProvider
    act(() => {
      result.current.toggleAccount('google');
    });

    await waitFor(() => {
      expect(settingsApi.unlinkProvider).toHaveBeenCalledWith('google', mockToken);
      expect(toast.success).toHaveBeenCalledWith('google account disconnected');
    });
  });

  it('toggles OAuth account linking (link)', async () => {
    vi.mocked(settingsApi.getMe).mockResolvedValue(mockUser as never);
    mockSignInWithOAuth.mockResolvedValue({ data: {}, error: null });

    const { result } = renderHook(() => useProfileSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Since github is false, this should call signInWithOAuth
    act(() => {
      result.current.toggleAccount('github');
    });

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: expect.any(Object),
      });
    });
  });
});
