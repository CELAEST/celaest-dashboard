import { useInfiniteQuery } from "@tanstack/react-query";
import { billingApi, InvoicePageResponse } from "../api/billing.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const INVOICE_PAGE_SIZE = 15;

export const useInvoicesQuery = () => {
  const { token, orgId, isReady } = useApiAuth();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InvoicePageResponse>({
    queryKey: [...QUERY_KEYS.billing.all, "invoices", orgId],
    queryFn: async ({ pageParam }) => {
      if (!token || !orgId) {
        return {
          success: true,
          data: [],
          meta: { page: pageParam as number, per_page: INVOICE_PAGE_SIZE, total: 0, total_pages: 0 },
        };
      }
      return billingApi.getInvoicesPaginated(orgId, token, pageParam as number, INVOICE_PAGE_SIZE);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      return lastPage.meta.page < lastPage.meta.total_pages
        ? lastPage.meta.page + 1
        : undefined;
    },
    enabled: isReady && !!token && !!orgId,
  });

  const invoices = data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const totalInvoices = data?.pages[0]?.meta?.total ?? 0;

  return {
    invoices,
    totalInvoices,
    isLoading,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};
