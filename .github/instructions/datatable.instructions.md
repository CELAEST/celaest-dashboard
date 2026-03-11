---
description: "Use when editing DataTable components or table wrapper components. Covers infinite scroll props, glassmorphism styling, column definitions, dark/light theme patterns, skeleton loading, and footer text."
applyTo: ["src/features/**/components/**Table*.tsx", "src/components/ui/data-table.tsx"]
---

# DataTable Component Conventions

- ALWAYS forward these 4 props to DataTable: `totalItems`, `hasNextPage`, `isFetchingNextPage`, `onLoadMore`
- Interface must include: `isLoading?: boolean; totalItems?: number; hasNextPage?: boolean; isFetchingNextPage?: boolean; onLoadMore?: () => void;`
- Use `useTheme()` for dark/light mode: `const { theme } = useTheme(); const isDark = theme === "dark";`
- Columns defined with `useMemo(() => [...], [isDark, ...deps])`
- Icons from `@phosphor-icons/react` only
- Glassmorphism dark: `bg-linear-to-br from-[#0a0a0a]/80`, `border-white/10`
- Footer pattern: `Showing {items.length} of {total} entries`
