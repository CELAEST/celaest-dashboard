---
name: infinite-scroll-table
description: "Add server-side infinite scroll pagination to a DataTable. Use when converting a table from loading all data to paginated useInfiniteQuery, adding pagination to a feature table, or migrating from manual pagination buttons to infinite scroll. Covers API method, hook, table component, and parent wiring."
argument-hint: "Feature name (e.g., invoices, coupons, versions)"
---

# Infinite Scroll Table Migration

## When to Use
- A DataTable loads ALL records instead of paginating
- Converting from `useQuery` to `useInfiniteQuery`
- Converting manual page buttons to infinite scroll
- Adding a new paginated table to a feature

## Architecture

```
src/features/<domain>/
├── api/<domain>.api.ts          # Add paginated API method
├── hooks/use<Domain>Query.ts    # useInfiniteQuery hook (or update existing)
├── components/<Table>.tsx       # Add infinite scroll props to DataTable
└── components/<Parent>.tsx      # Wire props from hook to table
```

## Procedure

### Step 1: API Method

Two patterns depending on backend response shape:

**Pattern A — Backend uses `SuccessWithMeta`** (returns `{ success, data, meta: { page, per_page, total, total_pages } }`)

```typescript
// Use skipUnwrap: true to get the full envelope
export interface <Domain>PageResponse {
  success: boolean;
  data: <Entity>[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
}

async get<Domain>Paginated(token: string, orgId: string, page = 1, limit = 15): Promise<<Domain>PageResponse> {
  return api.get<<Domain>PageResponse>("/api/v1/org/<entities>", {
    params: { page, per_page: limit },
    headers: { Authorization: `Bearer ${token}`, "x-org-id": orgId },
    skipUnwrap: true,
  });
}
```

**Pattern B — Backend returns custom shape** (e.g., `{ data[], total, page }`)

```typescript
// No skipUnwrap needed, use the response directly
async get<Domain>(token: string, orgId: string, page = 1, limit = 15) {
  return api.get<PaginatedResponse>("/api/v1/org/<entities>", {
    params: { page, per_page: limit },
    headers: { Authorization: `Bearer ${token}`, "x-org-id": orgId },
  });
}
```

### Step 2: Hook with `useInfiniteQuery`

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useApiAuth } from "@/lib/use-api-auth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const PAGE_SIZE = 15;

export function use<Domain>Query() {
  const { token, orgId } = useApiAuth();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [...QUERY_KEYS.<domain>.all, orgId],
      queryFn: async ({ pageParam = 1 }) => {
        if (!token || !orgId) return /* empty response */;
        return <domain>Api.get<Domain>Paginated(token, orgId, pageParam, PAGE_SIZE);
      },
      initialPageParam: 1,
      // Pattern A (SuccessWithMeta):
      getNextPageParam: (lastPage) =>
        lastPage.meta.page < lastPage.meta.total_pages
          ? lastPage.meta.page + 1
          : undefined,
      // Pattern B (custom shape):
      // getNextPageParam: (lastPage) =>
      //   lastPage.page * PAGE_SIZE < lastPage.total
      //     ? lastPage.page + 1
      //     : undefined,
      enabled: !!token && !!orgId,
    });

  // Flatten pages into single array
  const items = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const total = data?.pages[0]?.meta?.total ?? 0;

  return {
    items,
    total,
    isLoading,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  };
}
```

### Step 3: Table Component — Add Props

```typescript
interface <Table>Props {
  data: <Entity>[];
  isLoading?: boolean;
  totalItems?: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  // ... existing props
}

// In the return, forward to DataTable:
<DataTable
  columns={columns}
  data={data}
  isLoading={isLoading}
  totalItems={totalItems}
  hasNextPage={hasNextPage}
  isFetchingNextPage={isFetchingNextPage}
  onLoadMore={onLoadMore}
/>
```

### Step 4: Parent Component — Wire Everything

```typescript
const { items, total, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
  use<Domain>Query();

// Pass to table:
<<Table>
  data={items}
  isLoading={isLoading}
  totalItems={total}
  hasNextPage={hasNextPage}
  isFetchingNextPage={isFetchingNextPage}
  onLoadMore={fetchNextPage}
/>

// Footer text:
<p>Showing {items.length} of {total} entries</p>
```

### Step 5: Verify

Run `npx tsc --noEmit` to check for TypeScript errors.

## Rules
- PAGE_SIZE is ALWAYS 15
- ALWAYS use `useMemo` to flatten pages
- ALWAYS include `orgId` in query key
- ALWAYS pass all 4 DataTable props: `totalItems`, `hasNextPage`, `isFetchingNextPage`, `onLoadMore`
- NEVER load all data and paginate client-side
- For `SuccessWithMeta` responses, ALWAYS use `skipUnwrap: true`
