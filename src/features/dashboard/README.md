# Control Center (Dashboard)

**Feature 1** — Vista general del sistema.

## Endpoints REST usados
- `GET /health` — Estado del backend (DB, Redis)
- `GET /api/v1/org/analytics/dashboard?period=month` — Métricas del dashboard (requiere JWT + X-Organization-ID)

## Eventos Socket
Ninguno (no aporta valor realtime para overview estático).

## Decisiones
- **useControlCenterData**: Client-side fetch porque requiere token/orgId del contexto.
- **Promise.allSettled**: Health sin auth; dashboard con auth. Si uno falla, el otro se muestra.
- **Adapter**: Usa `api` global con token y orgId; no duplica lógica.
- **System Health**: Mapea `health.services` (database, redis) al UI existente.
