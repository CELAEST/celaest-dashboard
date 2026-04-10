---
description: "Use when editing API client files or service files. Covers api-client patterns, skipUnwrap for SuccessWithMeta, authorization headers, orgId headers, pagination params, and response type interfaces."
applyTo: ["src/features/**/api/*.ts", "src/features/**/services/*.ts"]
---

# API Client Conventions

- Auth headers: `{ Authorization: \`Bearer ${token}\`, "x-org-id": orgId }`
- For endpoints using `SuccessWithMeta` (returns `{ success, data, meta }`): add `skipUnwrap: true` to get full envelope
- For endpoints with custom shape (returns `{ data[], total, page }`): NO skipUnwrap needed
- Pagination params: `{ page, per_page: limit }` or `{ page, limit }` depending on backend
- Define typed response interfaces (e.g., `InvoicePageResponse`) near the API method
- Service methods should delegate to API methods — no business logic in services
