/**
 * useCoupons — Unit Tests
 *
 * Tests the coupons TanStack Query hook for:
 *   - Fetching paginated coupons
 *   - Flattening infinite query pages
 *   - Optimistic delete mutation
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock useApiAuth
const mockAuth = { token: 'test-token', orgId: 'org-001' };
vi.mock('@/lib/use-api-auth', () => ({
  useApiAuth: () => mockAuth,
}));

// Mock couponsApi
const mockGetCouponsPaginated = vi.fn();
const mockDeleteCoupon = vi.fn();
vi.mock('../../api/coupons.api', () => ({
  couponsApi: {
    getCouponsPaginated: (...args: unknown[]) => mockGetCouponsPaginated(...args),
    deleteCoupon: (...args: unknown[]) => mockDeleteCoupon(...args),
  },
}));

import { useCoupons } from '../../stores/useCouponsStore';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
}

const sampleCouponPage = {
  success: true,
  data: [
    { code: 'SAVE10', discount_percentage: 10, is_active: true },
    { code: 'SAVE20', discount_percentage: 20, is_active: true },
  ],
  meta: { page: 1, per_page: 15, total: 2, total_pages: 1 },
};

describe('useCoupons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCouponsPaginated.mockResolvedValue(sampleCouponPage);
  });

  it('fetches and flattens coupon pages', async () => {
    const { result } = renderHook(() => useCoupons(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.coupons).toHaveLength(2);
    expect(result.current.coupons[0].code).toBe('SAVE10');
    expect(result.current.totalCoupons).toBe(2);
  });

  it('returns empty array when auth is missing', async () => {
    mockAuth.token = '';
    mockAuth.orgId = '';

    const { result } = renderHook(() => useCoupons(), { wrapper: createWrapper() });

    // Since enabled == false, query won't fire
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 2000 });
    expect(result.current.coupons).toEqual([]);

    // Restore
    mockAuth.token = 'test-token';
    mockAuth.orgId = 'org-001';
  });

  it('exposes hasNextPage as false when on last page', async () => {
    const { result } = renderHook(() => useCoupons(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('exposes hasNextPage as true when more pages exist', async () => {
    mockGetCouponsPaginated.mockResolvedValue({
      ...sampleCouponPage,
      meta: { page: 1, per_page: 15, total: 30, total_pages: 2 },
    });

    const { result } = renderHook(() => useCoupons(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(true);
  });

  it('exposes deleteCoupon function', async () => {
    const { result } = renderHook(() => useCoupons(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.deleteCoupon).toBe('function');
  });

  it('exposes invalidate function', async () => {
    const { result } = renderHook(() => useCoupons(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.invalidate).toBe('function');
  });
});
