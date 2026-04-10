---
description: "Create a new feature module in celaest-dashboard with the standard folder structure: api, hooks, components, stores, types"
agent: "agent"
argument-hint: "Feature name (e.g., notifications, reports)"
---

Create a new feature module for the given domain following the project structure:

```
src/features/<domain>/
├── api/<domain>.api.ts
├── hooks/use<Domain>Query.ts
├── components/
├── stores/
└── types/index.ts
```

Requirements:
- API file with typed interfaces and methods using `api-client`
- Hook using `useInfiniteQuery` with PAGE_SIZE=15 if it has a list
- Types file with domain interfaces
- Use `useApiAuth()` for auth, include `orgId` in all calls
- Add query keys to `src/features/shared/constants/queryKeys.ts`
