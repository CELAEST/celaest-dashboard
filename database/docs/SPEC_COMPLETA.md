# CELAEST Core - Especificacion Tecnica Completa

Version: 2.0
Stack: Go 1.22 / Fiber v2 / PostgreSQL 18 / Redis

---

## QUE SE IMPLEMENTA EN GO

- API REST completa (12 modulos)
- Motor IA multi-proveedor (IA-Mesh)
- Autenticacion JWT (Supabase)
- Workers asincronos
- Cache con Redis
- API Keys validation
- Rate limiting
- Webhooks Stripe
- Analytics y reportes
- Audit logs
- Feature flags

## QUE NO SE IMPLEMENTA EN GO

- Frontend (Next.js ya existe)
- Auth de usuarios finales (Supabase Auth)
- Storage de archivos (Supabase Storage)

---

## MODULO 1: FOUNDATION

Configuracion base y conexiones

Archivos:
- internal/config/config.go
- internal/database/postgres.go
- internal/cache/redis.go
- internal/middleware/logger.go
- internal/middleware/error.go
- internal/middleware/recovery.go
- internal/utils/response.go
- internal/utils/validator.go

Endpoints:
```
GET /health
GET /health/ready
GET /health/live
```

Responsabilidades:
- Pool de conexiones PostgreSQL (pgx)
- Cliente Redis
- Carga de variables de entorno
- Logger estructurado (zerolog)
- Manejo global de errores
- Panic recovery
- Respuestas JSON estandarizadas
- Validador de requests

---

## MODULO 2: USERS MANAGEMENT

Gestion completa de usuarios

Archivos:
- internal/models/user.go
- internal/models/user_session.go
- internal/models/user_api_key.go
- internal/repositories/user_repo.go
- internal/repositories/session_repo.go
- internal/repositories/user_apikey_repo.go
- internal/services/user_service.go
- internal/services/session_service.go
- internal/handlers/user_handler.go

Endpoints:
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/profile
PATCH  /api/users/:id/profile
GET    /api/users/:id/sessions
DELETE /api/users/:id/sessions/:session_id
GET    /api/users/:id/api-keys
POST   /api/users/:id/api-keys
DELETE /api/users/:id/api-keys/:key_id
POST   /api/users/:id/api-keys/:key_id/rotate
```

Tablas:
- users_profile
- user_sessions
- user_api_keys

---

## MODULO 3: ORGANIZATIONS

Gestion de organizaciones y miembros

Archivos:
- internal/models/organization.go
- internal/models/org_member.go
- internal/repositories/organization_repo.go
- internal/services/organization_service.go
- internal/handlers/organization_handler.go

Endpoints:
```
GET    /api/organizations
GET    /api/organizations/:id
POST   /api/organizations
PATCH  /api/organizations/:id
DELETE /api/organizations/:id
GET    /api/organizations/:id/members
POST   /api/organizations/:id/members
PATCH  /api/organizations/:id/members/:user_id
DELETE /api/organizations/:id/members/:user_id
GET    /api/organizations/:id/subscription
```

Tablas:
- organizations
- subscription_plans

---

## MODULO 4: AUTHENTICATION

JWT validation y API Keys

Archivos:
- internal/middleware/auth.go
- internal/middleware/apikey.go
- internal/middleware/ratelimit.go
- internal/middleware/permissions.go
- internal/services/auth_service.go

Endpoints:
```
POST /api/auth/verify
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/logout
```

Flujo JWT:
1. Cliente envia: Authorization: Bearer <token>
2. Middleware valida firma con Supabase JWT secret
3. Extrae user_id y role de claims
4. Verifica rate limit en Redis (100 req/min)
5. Inyecta user en context
6. Permite o rechaza

Flujo API Key:
1. Cliente envia: X-API-Key: <key>
2. Middleware busca key en user_api_keys
3. Verifica: activa, no expirada, scopes
4. Registra uso (last_used_at)
5. Permite o rechaza

Roles:
- admin: acceso total
- developer: gestion de productos y licencias
- client: solo sus recursos
- viewer: solo lectura

---

## MODULO 5: LICENSING SYSTEM

Gestion completa de licencias comerciales

Archivos:
- internal/models/license.go
- internal/models/license_ip.go
- internal/models/license_validation.go
- internal/models/license_collision.go
- internal/repositories/license_repo.go
- internal/repositories/license_ip_repo.go
- internal/repositories/license_validation_repo.go
- internal/services/license_service.go
- internal/services/ip_binding_service.go
- internal/services/collision_service.go
- internal/handlers/license_handler.go

Endpoints:
```
POST   /api/licenses
GET    /api/licenses
GET    /api/licenses/:id
PATCH  /api/licenses/:id
DELETE /api/licenses/:id
POST   /api/licenses/validate
POST   /api/licenses/batch-validate
POST   /api/licenses/:id/bind-ip
DELETE /api/licenses/:id/unbind-ip
GET    /api/licenses/:id/ips
GET    /api/licenses/:id/collisions
GET    /api/licenses/:id/validations
POST   /api/licenses/:id/renew
POST   /api/licenses/:id/revoke
POST   /api/licenses/:id/reactivate
GET    /api/licenses/:id/usage
```

Tablas:
- licenses
- license_ip_bindings
- license_validations
- license_collisions
- license_usage_log

Flujo Validacion:
1. Cliente envia license_key + ip_address + device_info
2. Backend busca licencia en DB
3. Verifica: status=active, no expirada, producto activo
4. Verifica IP: ya vinculada OR slots disponibles (max 5)
5. Si nueva IP y hay slots: auto-bind
6. Detecta colision si misma key desde IPs diferentes en <5min
7. Registra en license_validations
8. Retorna: valid/invalid + reason + remaining_ips

Formato Licencia:
```
CELAEST-{PRODUCT_CODE}-{RANDOM_8}-{CHECKSUM_4}
Ejemplo: CELAEST-MKT-A8F9D2E1-7B3C
```

Deteccion Colisiones:
- Misma licencia validada desde 2+ IPs en ventana de 5 minutos
- Guarda en license_collisions
- Puede auto-revocar si collision_count > threshold

---

## MODULO 6: IA-MESH ENGINE

Motor IA multi-proveedor con balanceo y pooling

Archivos:
- pkg/ai/provider.go (interface)
- pkg/ai/gemini.go
- pkg/ai/openai.go
- pkg/ai/groq.go
- pkg/ai/deepseek.go
- pkg/ai/anthropic.go
- pkg/ai/pool.go
- pkg/ai/selector.go
- pkg/ai/retry.go
- internal/models/ai_model.go
- internal/models/ai_task.go
- internal/models/ai_prompt.go
- internal/repositories/ai_pool_repo.go
- internal/repositories/ai_task_repo.go
- internal/repositories/ai_prompt_repo.go
- internal/services/ai_service.go
- internal/handlers/ai_handler.go
- internal/workers/ai_worker.go
- internal/workers/task_queue.go

Endpoints:
```
POST   /api/ai/chat
POST   /api/ai/completions
POST   /api/ai/tasks
GET    /api/ai/tasks
GET    /api/ai/tasks/:id
GET    /api/ai/tasks/:id/result
DELETE /api/ai/tasks/:id
POST   /api/ai/tasks/:id/retry
GET    /api/ai/providers
GET    /api/ai/models
GET    /api/ai/models/:id
POST   /api/ai/prompts
GET    /api/ai/prompts
GET    /api/ai/prompts/:id
PATCH  /api/ai/prompts/:id
DELETE /api/ai/prompts/:id
GET    /api/ai/pool/stats
GET    /api/ai/pool/keys
POST   /api/ai/pool/keys
PATCH  /api/ai/pool/keys/:id
DELETE /api/ai/pool/keys/:id
```

Tablas:
- ai_models
- ai_api_pool
- prompts_master
- task_batches
- processed_tasks

Flujo Sincrono (chat):
1. POST /api/ai/chat con prompt + provider (opcional)
2. Selecciona API Key del pool (weighted random)
3. Llama a proveedor con timeout 30s
4. Si falla: retry con otra key/provider
5. Retorna respuesta inmediata

Flujo Asincrono (tasks):
1. POST /api/ai/tasks con prompt + config
2. Guarda en processed_tasks (status=pending)
3. Publica job_id en Redis queue
4. Worker consume de queue
5. Selecciona API Key (peso + rate limit)
6. Llama a proveedor (retry x3)
7. Guarda resultado en DB
8. Actualiza status a completed/failed
9. Cliente poll: GET /api/ai/tasks/:id

Selector Weighted:
```
Keys: [Gemini:10, Gemini:10, OpenAI:5, Groq:3]
Total peso: 28
Random 0-28, selecciona segun rango
```

Pool Stats:
- Requests por proveedor
- Latencia promedio
- Error rate
- Tokens consumidos
- Costo estimado

---

## MODULO 7: PRODUCTS & MARKETPLACE

Catalogo completo de productos

Archivos:
- internal/models/product.go
- internal/models/product_category.go
- internal/models/product_review.go
- internal/models/customer_asset.go
- internal/repositories/product_repo.go
- internal/repositories/category_repo.go
- internal/repositories/review_repo.go
- internal/repositories/asset_repo.go
- internal/services/product_service.go
- internal/services/review_service.go
- internal/handlers/product_handler.go
- internal/handlers/category_handler.go

Endpoints:
```
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id

GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
GET    /api/products/:id/reviews
POST   /api/products/:id/reviews
GET    /api/products/:id/releases
GET    /api/products/featured
GET    /api/products/search

GET    /api/my/assets
GET    /api/my/assets/:id
GET    /api/my/assets/:id/download
```

Tablas:
- product_categories
- products
- product_reviews
- customer_assets
- asset_downloads

Tipos de Producto:
- software
- saas
- api
- template
- dataset
- course
- service

Estados:
- draft
- published
- archived
- coming_soon

---

## MODULO 8: RELEASES & VERSIONING

Gestion de versiones y releases

Archivos:
- internal/models/release.go
- internal/repositories/release_repo.go
- internal/services/release_service.go
- internal/handlers/release_handler.go

Endpoints:
```
GET    /api/products/:id/releases
POST   /api/products/:id/releases
GET    /api/releases/:id
PATCH  /api/releases/:id
DELETE /api/releases/:id
GET    /api/releases/:id/download
GET    /api/releases/:id/changelog
GET    /api/releases/latest/:product_id
```

Tablas:
- product_releases

Estados Release:
- stable
- beta
- alpha
- deprecated
- yanked

Versionado:
- Semantic versioning (major.minor.patch)
- Ejemplo: 2.1.0-beta

---

## MODULO 9: BILLING & PAYMENTS

Ordenes, pagos y facturacion con Stripe

Archivos:
- internal/models/order.go
- internal/models/order_item.go
- internal/models/invoice.go
- internal/models/payment_method.go
- internal/models/coupon.go
- internal/models/tax_rate.go
- internal/repositories/order_repo.go
- internal/repositories/invoice_repo.go
- internal/repositories/payment_repo.go
- internal/repositories/coupon_repo.go
- internal/services/billing_service.go
- internal/services/invoice_service.go
- internal/services/payment_service.go
- internal/services/coupon_service.go
- internal/handlers/billing_handler.go
- internal/handlers/webhook_handler.go
- pkg/payment/stripe.go

Endpoints:
```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
POST   /api/orders/:id/pay
POST   /api/orders/:id/cancel
GET    /api/orders/:id/items

GET    /api/invoices
GET    /api/invoices/:id
GET    /api/invoices/:id/pdf
POST   /api/invoices/:id/send

GET    /api/payment-methods
POST   /api/payment-methods
DELETE /api/payment-methods/:id
POST   /api/payment-methods/:id/default

GET    /api/coupons
GET    /api/coupons/:code/validate
POST   /api/coupons
PATCH  /api/coupons/:id
DELETE /api/coupons/:id

GET    /api/tax-rates

POST   /api/webhooks/stripe
```

Tablas:
- orders
- order_items
- invoices
- payment_methods
- payment_gateways
- coupons
- tax_rates

Flujo Pago:
1. Cliente crea orden: POST /api/orders
2. Backend calcula total (items + tax - discount)
3. Guarda orden (status=pending)
4. Cliente paga: POST /api/orders/:id/pay
5. Backend crea Payment Intent en Stripe
6. Retorna client_secret para frontend
7. Cliente completa pago con Stripe.js
8. Stripe envia webhook: payment_intent.succeeded
9. Backend verifica firma HMAC
10. Actualiza orden a completed
11. Crea licencia si aplica
12. Genera factura
13. Envia email confirmacion

Tipos Cupon:
- percentage (10%)
- fixed_amount ($20)

---

## MODULO 10: SETTINGS & CONFIG

Configuracion del sistema y feature flags

Archivos:
- internal/models/system_config.go
- internal/models/feature_flag.go
- internal/models/webhook.go
- internal/models/webhook_delivery.go
- internal/repositories/config_repo.go
- internal/repositories/feature_flag_repo.go
- internal/repositories/webhook_repo.go
- internal/services/config_service.go
- internal/services/feature_flag_service.go
- internal/services/webhook_service.go
- internal/handlers/settings_handler.go
- internal/workers/webhook_worker.go

Endpoints:
```
GET    /api/settings
PATCH  /api/settings
GET    /api/settings/:key

GET    /api/feature-flags
GET    /api/feature-flags/:key
PATCH  /api/feature-flags/:key
POST   /api/feature-flags/:key/toggle

GET    /api/webhooks
GET    /api/webhooks/:id
POST   /api/webhooks
PATCH  /api/webhooks/:id
DELETE /api/webhooks/:id
GET    /api/webhooks/:id/deliveries
POST   /api/webhooks/:id/test
```

Tablas:
- system_config
- feature_flags
- webhooks
- webhook_deliveries

Feature Flags:
- Activar/desactivar features por ambiente
- Rollout gradual (percentage)
- Override por usuario/org

Webhooks Salientes:
- Eventos: order.completed, license.validated, etc
- Reintentos con backoff exponencial
- Firma HMAC para verificacion

---

## MODULO 11: ANALYTICS & ROI

Reportes, metricas y calculo de ROI

Archivos:
- internal/models/roi_metric.go
- internal/models/telemetry.go
- internal/repositories/analytics_repo.go
- internal/repositories/roi_repo.go
- internal/services/analytics_service.go
- internal/services/roi_service.go
- internal/handlers/analytics_handler.go
- internal/workers/analytics_worker.go

Endpoints:
```
GET /api/analytics/dashboard
GET /api/analytics/licenses
GET /api/analytics/licenses/validations
GET /api/analytics/sales
GET /api/analytics/sales/by-product
GET /api/analytics/sales/by-period
GET /api/analytics/ai-usage
GET /api/analytics/ai-usage/by-provider
GET /api/analytics/ai-usage/costs
GET /api/analytics/roi
GET /api/analytics/roi/by-product
GET /api/analytics/users
GET /api/analytics/users/active
GET /api/analytics/export
```

Tablas:
- roi_metrics
- telemetry_events

Metricas Dashboard:
- Total revenue (periodo)
- Active licenses
- New users
- AI requests
- Error rate
- Top products

Calculo ROI:
```
ROI = ((Revenue - Costs) / Costs) * 100

Costs = AI_API_costs + Infrastructure_costs
Revenue = Orders_total - Refunds
```

Worker Diario:
- Agrega metricas del dia anterior
- Calcula ROI por producto
- Guarda en roi_metrics

---

## MODULO 12: AUDIT & ERROR TRACKING

Logs de auditoria y tracking de errores

Archivos:
- internal/models/audit_log.go
- internal/models/telemetry_event.go
- internal/repositories/audit_repo.go
- internal/repositories/telemetry_repo.go
- internal/services/audit_service.go
- internal/middleware/audit.go
- internal/handlers/audit_handler.go

Endpoints:
```
GET /api/audit-logs
GET /api/audit-logs/:id
GET /api/audit-logs/search
GET /api/audit-logs/export

GET /api/telemetry
GET /api/telemetry/errors
GET /api/telemetry/events/:type
```

Tablas:
- audit_logs
- telemetry_events

Eventos Auditados:
- user.login / user.logout
- license.created / license.validated / license.revoked
- order.created / order.completed
- settings.changed
- api_key.created / api_key.deleted

Formato Audit Log:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "action": "license.created",
  "entity_type": "license",
  "entity_id": "uuid",
  "changes": {"status": ["draft", "active"]},
  "ip_address": "192.168.1.1",
  "user_agent": "...",
  "created_at": "2026-02-02T..."
}
```

---

## BASE DE DATOS COMPLETA

### V001 - 15 tablas:
- organizations
- users_profile
- subscription_plans
- licenses
- license_usage_log
- ai_models
- ai_api_pool
- prompts_master
- task_batches
- processed_tasks
- roi_metrics
- audit_logs
- telemetry_events
- system_config
- feature_flags

### V002 - 20 tablas:
- product_categories
- products
- product_reviews
- product_releases
- customer_assets
- asset_downloads
- payment_methods
- payment_gateways
- orders
- order_items
- invoices
- tax_rates
- coupons
- user_sessions
- user_api_keys
- webhooks
- webhook_deliveries
- license_ip_bindings
- license_validations
- license_collisions

**Total: 35 tablas**

Migraciones: celaest-dashboard/database/migrations/

---

## ESTANDARES

### Respuesta JSON Exitosa:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Respuesta JSON Error:
```json
{
  "success": false,
  "error": {
    "code": "LICENSE_EXPIRED",
    "message": "La licencia ha expirado",
    "details": {
      "expired_at": "2026-01-15T00:00:00Z"
    }
  }
}
```

### Codigos HTTP:
```
200 - OK
201 - Created
204 - No Content
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
409 - Conflict
422 - Unprocessable Entity
429 - Too Many Requests
500 - Internal Server Error
503 - Service Unavailable
```

### Paginacion:
```
GET /api/resources?page=1&per_page=20&sort=created_at&order=desc
```

### Filtros:
```
GET /api/licenses?status=active&product_id=xxx&created_after=2026-01-01
```

---

## SEGURIDAD

### Variables Entorno:
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/celaest_local
DATABASE_MAX_CONNS=25

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_SERVICE_KEY=your-service-key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AI Providers (comma-separated for pooling)
GEMINI_API_KEYS=key1,key2,key3
OPENAI_API_KEYS=key1,key2
GROQ_API_KEYS=key1
DEEPSEEK_API_KEYS=key1
ANTHROPIC_API_KEYS=key1

# App
APP_ENV=development
APP_PORT=8080
APP_HOST=0.0.0.0
LOG_LEVEL=info

# Security
ENCRYPTION_KEY=32-byte-key-for-aes256
RATE_LIMIT_PER_MIN=100
```

### Encriptacion:
- API Keys IA en DB: AES-256-GCM
- Licencias: HMAC checksum
- Webhooks: HMAC-SHA256 signature
- Passwords: bcrypt (si aplica)

---

## TESTING

### Unit Tests:
- Todos los services
- Coverage >80%

### Integration Tests:
- Endpoints criticos
- Flujos completos (order -> payment -> license)

### Load Testing:
- k6 scripts
- Target: 10,000 req/s
- Latency p95 < 100ms

Ejemplo:
```go
func TestLicenseService_ValidateLicense(t *testing.T) {
    repo := mocks.NewMockLicenseRepo()
    ipRepo := mocks.NewMockIPRepo()
    service := NewLicenseService(repo, ipRepo)
    
    result, err := service.ValidateLicense(ctx, ValidateRequest{
        LicenseKey: "CELAEST-MKT-A8F9D2E1-7B3C",
        IPAddress:  "192.168.1.1",
        DeviceInfo: "Windows 11",
    })
    
    assert.NoError(t, err)
    assert.True(t, result.Valid)
    assert.Equal(t, 4, result.RemainingIPs)
}
```

---

## DEPLOYMENT

### Dockerfile:
```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o celaest-core cmd/api/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates tzdata
COPY --from=builder /app/celaest-core /app/
EXPOSE 8080
CMD ["/app/celaest-core"]
```

### Docker Compose:
```yaml
services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/celaest
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  worker:
    build: .
    command: /app/celaest-worker
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/celaest
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: celaest
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## CRITERIOS ACEPTACION

1. 12 modulos implementados
2. Todos endpoints funcionando
3. Auth JWT con Supabase OK
4. Auth API Keys OK
5. Rate limiting 100 req/min
6. Licencias validan correctamente
7. IP binding funciona (max 5)
8. Deteccion colisiones funciona
9. IA-Mesh llama 5 proveedores
10. Pool de API Keys con weighted selection
11. Workers procesan queue Redis
12. Stripe payments + webhooks OK
13. Feature flags funcionan
14. Audit logs registran todo
15. Analytics calculan correctamente
16. Tests >80% coverage
17. API <100ms p95 @ 5,000 req/s
18. Health checks OK
19. Docker build exitoso
20. Documentacion API completa

---


---

## ENTREGABLES

- Codigo fuente completo (12 modulos)
- Tests >80% coverage
- Dockerfile + docker-compose.yml
- Makefile con comandos utiles
- Coleccion Postman/Insomnia
- Documentacion API (OpenAPI/Swagger)
- README con instrucciones
- CI/CD pipeline (GitHub Actions)

---

## LIBRERIAS GO

```
github.com/gofiber/fiber/v2
github.com/jackc/pgx/v5
github.com/redis/go-redis/v9
github.com/golang-jwt/jwt/v5
github.com/rs/zerolog
github.com/go-playground/validator/v10
github.com/stretchr/testify
github.com/stripe/stripe-go/v76
github.com/google/uuid
golang.org/x/crypto
```

---

**Fin de especificacion**
