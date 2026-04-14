import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWorkspaceSettings } from '../useWorkspaceSettings';
import { createWrapper } from '@/test/test-utils';
import { usersApi } from '@/features/users/api/users.api';
import { socket } from '@/lib/socket-client';

vi.mock('@/features/auth/stores/useAuthStore', () => ({
  useAuthStore: () => ({ session: { accessToken: 'mock-token' } }),
}));

vi.mock('@/features/shared/stores/useOrgStore', () => ({
  useOrgStore: () => ({ currentOrg: { id: 'org-123' } }),
}));

vi.mock('@/features/users/api/users.api', () => ({
  usersApi: {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateRole: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

vi.mock('@/lib/socket-client', () => ({
  socket: {
    on: vi.fn().mockImplementation(() => vi.fn()), // on() returns unsubscribe fn
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

const mockMembersResponse = {
  data: [
    {
      id: 'user-1',
      email: 'user1@celaest.dev',
      first_name: 'User',
      last_name: 'One',
      role: 'admin',
      status: 'active',
      avatar_url: 'avatar.jpg',
    },
    {
      id: 'user-2',
      email: 'user2@celaest.dev',
      name: 'User 2',
      role: 'member',
      status: 'invited',
    },
  ],
};

describe('useWorkspaceSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usersApi.getUsers).mockResolvedValue(mockMembersResponse as any);
  });

  it('fetches members and maps them correctly', async () => {
    const { result } = renderHook(() => useWorkspaceSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(usersApi.getUsers).toHaveBeenCalledWith(1, 50, 'mock-token', 'org-123');
    expect(result.current.members).toHaveLength(2);
    expect(result.current.members[0]).toEqual({
      id: 'user-1',
      name: 'User One',
      email: 'user1@celaest.dev',
      role: 'admin',
      status: 'active',
      avatar: 'avatar.jpg',
    });
    // Tests fallback to name if first_name not present
    expect(result.current.members[1].name).toBe('User 2');
  });

  it('removes member optimistically', async () => {
    const { result } = renderHook(() => useWorkspaceSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(usersApi.deleteUser).mockImplementation(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    act(() => {
      result.current.removeMember('user-1');
    });

    await waitFor(() => {
      expect(usersApi.deleteUser).toHaveBeenCalledWith('user-1', 'mock-token', 'org-123');
      expect(result.current.members).toHaveLength(1);
      expect(result.current.members[0].id).toBe('user-2');
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Member removed'));
  });

  it('handles invite member correctly', async () => {
    const { result } = renderHook(() => useWorkspaceSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(usersApi.createUser).mockResolvedValue({} as any);

    // Initial state
    act(() => result.current.setShowInviteModal(true));
    expect(result.current.showInviteModal).toBe(true);

    act(() => {
      result.current.inviteMember({ email: 'new@x.com', role: 'member' });
    });

    await waitFor(() => {
      expect(usersApi.createUser).toHaveBeenCalledWith(
        { email: 'new@x.com', role: 'member', first_name: 'new' },
        'mock-token',
        'org-123'
      );
    });

    await waitFor(() => {
      expect(result.current.showInviteModal).toBe(false);
      expect(toast.success).toHaveBeenCalledWith('Invitation sent successfully');
      // refetch is handled so we expect getUsers to be called again
      expect(usersApi.getUsers).toHaveBeenCalledTimes(2);
    });
  });

  it('updates member role optimistically', async () => {
    const { result } = renderHook(() => useWorkspaceSettings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(usersApi.updateRole).mockImplementation(async () => {
      await new Promise(r => setTimeout(r, 100));
      return {} as any;
    });

    act(() => {
      result.current.updateRole('user-2', 'admin');
    });

    await waitFor(() => {
      expect(usersApi.updateRole).toHaveBeenCalledWith('user-2', 'admin', 'mock-token', 'org-123');
      const updatedUser = result.current.members.find(m => m.id === 'user-2');
      expect(updatedUser?.role).toBe('admin');
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Member role updated'));
  });

  it('subscribes to socket events', () => {
    renderHook(() => useWorkspaceSettings(), {
      wrapper: createWrapper(),
    });

    expect(socket.on).toHaveBeenCalledWith('organization.member_added', expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith('organization.member_removed', expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith('organization.member_updated', expect.any(Function));
  });
});
