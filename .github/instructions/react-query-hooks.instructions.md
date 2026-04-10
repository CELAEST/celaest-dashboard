---
description: "Use when editing React hooks that fetch data with TanStack Query. Covers useInfiniteQuery patterns, PAGE_SIZE=15, getNextPageParam logic, useMemo for page flattening, query key conventions, and useApiAuth usage."
applyTo: ["src/features/**/hooks/*.ts", "src/features/**/stores/*.ts"]
---

# React Query Hook Conventions

- Use `useInfiniteQuery` for ANY data displayed in DataTable (never `useQuery`)
- PAGE_SIZE constant = 15, defined at top of file
- Always get `{ token, orgId }` from `useApiAuth()`
- Query key must include `orgId`: `[...QUERY_KEYS.<domain>.all, orgId]`
- `enabled: !!token && !!orgId`
- Flatten pages with `useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])`
- Return: `{ items, total, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage }`
- For mutations: use `queryClient.invalidateQueries` on success
- For optimistic updates with infinite data: map over `old.pages` array
