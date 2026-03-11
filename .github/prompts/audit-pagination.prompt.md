---
description: "Audit all DataTable usages and verify pagination is correct: PAGE_SIZE=15, params sent to backend, getNextPageParam logic"
agent: "agent"
argument-hint: "Optional: specific table to audit, or 'all'"
---

Audit DataTable pagination across the dashboard:

1. Search for ALL components using `<DataTable` 
2. For each one, trace the full chain:
   - Hook: Does it use `useInfiniteQuery`? Is PAGE_SIZE = 15?
   - API: Does the method send `page` and `limit`/`per_page` params?
   - HTTP: Are params in the actual request URL/body?
   - getNextPageParam: Is the logic correct?
   - DataTable: Are `totalItems, hasNextPage, isFetchingNextPage, onLoadMore` passed?
   - Footer: Shows "Showing X of Y"?

3. Report a table with pass/fail for each component
4. Fix any issues found
