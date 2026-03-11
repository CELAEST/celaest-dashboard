# CELAEST Dashboard - Guía Operativa Obligatoria para IA

Esta guía es de cumplimiento obligatorio para cualquier cambio en `celaest-dashboard`.

## Stack técnico
- Next.js 16 + React 19 + TypeScript
- TanStack Query v5 (`useInfiniteQuery` para tablas, `useMutation` para operaciones)
- TanStack React Table v8 (DataTable component)
- Tailwind v4 + diseño "Premium Tech" glassmorphism
- Iconos: `@phosphor-icons/react` (NUNCA lucide-react ni heroicons)
- Estado global: Zustand donde aplique, React Query para server state
- Sonner para toasts

## Prioridad de decisiones
1. Causa raíz > parche rápido.
2. Simplicidad robusta (KISS).
3. Preservar separación features/ (dominio) vs components/ (shared).
4. Seguridad por diseño en cada flujo.

## Principios obligatorios
- No Band-Aids: no deuda técnica para "salir del paso".
- SOLID + DRY en hooks, componentes, stores y servicios.
- Inyección de dependencias via hooks (`useApiAuth`, `useOrgStore`, etc.).
- Multi-tenant: siempre incluir `orgId` en queries y API calls.

## Patrones de datos (server-side pagination)
- Todas las tablas DataTable usan `useInfiniteQuery` con `PAGE_SIZE = 15`.
- Patrón API con `SuccessWithMeta`: usar `skipUnwrap: true` en api-client para obtener `{ success, data, meta }`.
- Patrón API custom shape: usar response directamente sin `skipUnwrap`.
- `getNextPageParam` calcula si hay más páginas según `meta.total_pages` o `page * limit < total`.
- Aplanar páginas con `useMemo(() => data.pages.flatMap(...))`.

## Diseño y UX
- Tema dual dark/light con `useTheme()`.
- Glassmorphism: `bg-linear-to-br from-[#0a0a0a]/80`, `border-white/10`, `backdrop-blur`.
- Skeletons de carga en tablas, nunca spinners a pantalla completa.
- Footer de tablas muestra "Showing X of Y entries".

## Seguridad y calidad
- Validar toda entrada de formularios.
- Nunca exponer tokens en logs o UI.
- Usar `handleApiError()` para manejo consistente de errores.

## Workflow
1. Entender el problema y su impacto visual + funcional.
2. Diseñar solución dentro de la feature existente.
3. Implementar con cambios mínimos y cohesionados.
4. Verificar con `tsc --noEmit` que no hay errores de TypeScript.

## Estructura del proyecto
- `src/features/<domain>/` — cada feature autónoma con api/, hooks/, components/, stores/, types/
- `src/components/ui/` — componentes compartidos (DataTable, modals, etc.)
- `src/lib/` — utilidades core (api-client, auth, error-handler)

## Regla final
Si una solución contradice esta guía, se descarta y se propone una alternativa correcta.
