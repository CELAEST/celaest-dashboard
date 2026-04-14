/**
 * useAuthActions — Unit Tests
 *
 * Tests the auth actions hook (signIn, signUp, signOut, OAuth, refreshSession)
 * using a mocked Supabase client.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// Mock auth service
const { mockLogin } = vi.hoisted(() => ({ mockLogin: vi.fn() }));
vi.mock('@/features/auth/services/auth.service', () => ({
  authService: { login: mockLogin },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { renderHook, act } from '@testing-library/react';
import { useAuthActions } from '../useAuthActions';

// ── Supabase mock factory ──────────────────────────────────────────
function createMockSupabase(overrides: Record<string, unknown> = {}) {
  return {
    auth: {
      setSession: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      refreshSession: vi.fn().mockResolvedValue({
        data: {
          session: { access_token: 'tok', expires_at: 999 },
          user: {
            id: 'u1',
            email: 'test@celaest.dev',
            user_metadata: { name: 'Test', role: 'super_admin' },
            app_metadata: { role: 'super_admin' },
            email_confirmed_at: '2026-01-01',
            created_at: '2026-01-01',
          },
        },
        error: null,
      }),
      ...overrides,
    },
  } as never;
}

describe('useAuthActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockReset();
  });

  // ── signIn ──────────────────────────────────────────────────────
  describe('signIn', () => {
    it('returns success when backend returns access_token', async () => {
      mockLogin.mockResolvedValue({ access_token: 'abc', refresh_token: 'rr' });
      const supabase = createMockSupabase();
      const { result } = renderHook(() => useAuthActions(supabase));

      let res: unknown;
      await act(async () => { res = await result.current.signIn('A@B.com', 'pw'); });

      expect(res).toEqual({ success: true });
      expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'pw'); // trimmed + lowercase
      expect(supabase.auth.setSession).toHaveBeenCalledWith({
        access_token: 'abc',
        refresh_token: 'rr',
      });
    });

    it('returns error when authService.login throws', async () => {
      mockLogin.mockRejectedValue(new Error('Invalid creds'));
      const { result } = renderHook(() => useAuthActions(createMockSupabase()));

      let res: { success: boolean; error?: { code: string } };
      await act(async () => { res = await result.current.signIn('x@y.com', 'bad'); });
      expect(res!.success).toBe(false);
      expect(res!.error?.code).toBe('INVALID_CREDENTIALS');
    });

    it('returns error when supabase is null', async () => {
      mockLogin.mockResolvedValue({ access_token: 'abc', refresh_token: 'rr' });
      const { result } = renderHook(() => useAuthActions(null));

      let res: { success: boolean };
      await act(async () => { res = await result.current.signIn('x@y.com', 'pw'); });
      expect(res!.success).toBe(false);
    });
  });

  // ── signUp ──────────────────────────────────────────────────────
  describe('signUp', () => {
    it('returns success when Supabase creates user', async () => {
      const { result } = renderHook(() => useAuthActions(createMockSupabase()));
      let res: { success: boolean };
      await act(async () => { res = await result.current.signUp('e@m.com', 'pass', 'John'); });
      expect(res!.success).toBe(true);
    });

    it('returns error when Supabase signUp returns error', async () => {
      const sbErr = { message: 'Email already taken' };
      const supabase = createMockSupabase({
        signUp: vi.fn().mockResolvedValue({ data: {}, error: sbErr }),
      });
      const { result } = renderHook(() => useAuthActions(supabase));
      let res: { success: boolean; error?: { code: string } };
      await act(async () => { res = await result.current.signUp('e@m.com', 'p', 'J'); });
      expect(res!.success).toBe(false);
    });

    it('returns error when supabase is null', async () => {
      const { result } = renderHook(() => useAuthActions(null));
      let res: { success: boolean; error?: { message: string } };
      await act(async () => { res = await result.current.signUp('e@m.com', 'p', 'J'); });
      expect(res!.success).toBe(false);
      expect(res!.error?.message).toContain('no disponible');
    });
  });

  // ── signInWithGoogle ────────────────────────────────────────────
  describe('signInWithGoogle', () => {
    it('returns success when OAuth succeeds', async () => {
      const { result } = renderHook(() => useAuthActions(createMockSupabase()));
      let res: { success: boolean };
      await act(async () => { res = await result.current.signInWithGoogle(); });
      expect(res!.success).toBe(true);
    });

    it('returns error when supabase is null', async () => {
      const { result } = renderHook(() => useAuthActions(null));
      let res: { success: boolean };
      await act(async () => { res = await result.current.signInWithGoogle(); });
      expect(res!.success).toBe(false);
    });
  });

  // ── signInWithGitHub ────────────────────────────────────────────
  describe('signInWithGitHub', () => {
    it('returns success when OAuth succeeds', async () => {
      const { result } = renderHook(() => useAuthActions(createMockSupabase()));
      let res: { success: boolean };
      await act(async () => { res = await result.current.signInWithGitHub(); });
      expect(res!.success).toBe(true);
    });

    it('returns error on OAuth failure', async () => {
      const supabase = createMockSupabase({
        signInWithOAuth: vi.fn().mockResolvedValue({ error: { message: 'fail' } }),
      });
      const { result } = renderHook(() => useAuthActions(supabase));
      let res: { success: boolean };
      await act(async () => { res = await result.current.signInWithGitHub(); });
      expect(res!.success).toBe(false);
    });
  });

  // ── refreshSession ──────────────────────────────────────────────
  describe('refreshSession', () => {
    it('returns AuthSession data on success', async () => {
      const { result } = renderHook(() => useAuthActions(createMockSupabase()));
      let res: { success: boolean; data?: { accessToken: string } };
      await act(async () => { res = await result.current.refreshSession(); });
      expect(res!.success).toBe(true);
      expect(res!.data?.accessToken).toBe('tok');
    });

    it('returns error when supabase is null', async () => {
      const { result } = renderHook(() => useAuthActions(null));
      let res: { success: boolean };
      await act(async () => { res = await result.current.refreshSession(); });
      expect(res!.success).toBe(false);
    });
  });
});
