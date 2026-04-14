import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserManagement } from '../useUserManagement';
import { createWrapper } from '@/test/test-utils';
import { usersApi } from '../../api/users.api';

vi.mock('@/lib/use-api-auth', () => ({
  useApiAuth: () => ({ token: 'mock-token', orgId: 'org-123', isReady: true }),
}));

vi.mock('../../api/users.api', () => ({
  usersApi: {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    updateRole: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

const mockUsersResponse = {
  success: true,
  data: [
    {
      id: 'u1',
      email: 'test1@celaest.dev',
      role: 'admin',
      display_name: 'Test 1',
    },
    {
      id: 'u2',
      email: 'test2@celaest.dev',
      role: 'member',
      display_name: 'User 2',
    },
  ],
  meta: {
    page: 1,
    per_page: 15,
    total: 2,
    total_pages: 1,
  },
};

describe('useUserManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usersApi.getUsers).mockResolvedValue(mockUsersResponse as any);
  });

  it('fetches users and computes total', async () => {
    const { result } = renderHook(() => useUserManagement(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(usersApi.getUsers).toHaveBeenCalledWith(1, 15, 'mock-token', 'org-123');
    expect(result.current.users).toHaveLength(2);
    expect(result.current.totalUsers).toBe(2);
  });

  it('filters users by search query and role', async () => {
    const { result } = renderHook(() => useUserManagement(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Initially 2 users
    expect(result.current.filteredUsers).toHaveLength(2);

    // Search by email
    act(() => result.current.setSearchQuery('test1'));
    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].id).toBe('u1');

    // Search by name
    act(() => result.current.setSearchQuery('User 2'));
    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].id).toBe('u2');

    // Reset search, filter by role
    act(() => {
      result.current.setSearchQuery('');
      result.current.setRoleFilter('admin');
    });
    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].role).toBe('admin');
  });

  it('handles createUser mutation', async () => {
    const { result } = renderHook(() => useUserManagement(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(usersApi.createUser).mockResolvedValue({} as any);

    let success = false;
    await act(async () => {
      success = await result.current.createUser({ email: 'new@c.dev', role: 'member' });
    });

    expect(success).toBe(true);
    expect(usersApi.createUser).toHaveBeenCalledWith(
      { email: 'new@c.dev', role: 'member' },
      'mock-token',
      'org-123'
    );
    expect(toast.success).toHaveBeenCalledWith('Usuario invitado correctamente');
  });

  it('handles deleteUser mutation optimistically', async () => {
    const { result } = renderHook(() => useUserManagement(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(usersApi.deleteUser).mockResolvedValue({} as any);

    act(() => {
      result.current.deleteUser('u1');
    });

    await waitFor(() => {
      expect(usersApi.deleteUser).toHaveBeenCalledWith('u1', 'mock-token', 'org-123');
      expect(result.current.users).toHaveLength(1); // Optimistically removed
      expect(result.current.users[0].id).toBe('u2');
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Usuario eliminado correctamente'));
  });

  it('handles handleChangeRole mutation optimistically', async () => {
    const { result } = renderHook(() => useUserManagement(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(usersApi.updateRole).mockResolvedValue({} as any);

    act(() => {
      result.current.handleChangeRole('u2', 'admin');
    });

    await waitFor(() => {
      expect(usersApi.updateRole).toHaveBeenCalledWith('u2', 'admin', 'mock-token', 'org-123');
      const updatedUser = result.current.users.find(u => u.id === 'u2');
      expect(updatedUser?.role).toBe('admin');
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Rol actualizado correctamente'));
  });
});
