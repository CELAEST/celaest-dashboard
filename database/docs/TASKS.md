# CELAEST Backend - Tareas Go

Stack: Go / Fiber / PostgreSQL / Redis

---

## MODULOS A IMPLEMENTAR EN GO

### 1. Foundation
- Conexion PostgreSQL y Redis
- Configuracion (.env)
- Logger y manejo de errores
- Health checks

### 2. Users Management
- CRUD usuarios
- Perfiles de usuario
- Sesiones activas (user_sessions)
- API Keys de usuario (user_api_keys)
- Roles y permisos

### 3. Organizations
- CRUD organizaciones
- Miembros por organizacion
- Planes de suscripcion

### 4. Authentication
- Validar JWT de Supabase
- API Keys validation
- Rate limiting
- Permisos por rol

### 5. Licensing
- CRUD licencias
- Validacion de licencias
- IP Bindings (max 5 IPs)
- Deteccion de colisiones
- Historial de validaciones
- Renovaciones

### 6. IA-Mesh Engine
- Pool de API Keys (ai_api_pool)
- 5 proveedores: Gemini, OpenAI, Groq, DeepSeek, Anthropic
- Selector con pesos
- Modelos de IA (ai_models)
- Prompts maestros (prompts_master)
- Tareas batch (task_batches)
- Tareas procesadas (processed_tasks)
- Workers asincronos

### 7. Products & Marketplace
- Categorias de productos
- CRUD productos
- Reviews de productos
- Customer assets (compras del usuario)
- Control de descargas

### 8. Releases & Versioning
- Releases por producto
- Versionado semantico
- Estados: stable, beta, alpha, deprecated
- Descargas por version

### 9. Billing & Payments
- Metodos de pago
- Payment gateways
- Ordenes y order items
- Facturas
- Tax rates
- Cupones de descuento
- Webhooks de Stripe

### 10. Settings & Config
- Configuracion del sistema (system_config)
- Feature flags
- Webhooks de usuario
- Webhook deliveries (logs)

### 11. Analytics & ROI
- ROI metrics
- Telemetry events
- Reportes de uso
- Dashboard metricas

### 12. Errors & Audit
- Audit logs
- Error tracking
- Logs de acceso

---

## ENDPOINTS POR MODULO

**Users**
- GET/POST/PATCH/DELETE /api/users
- GET /api/users/sessions/:id
- GET/POST/DELETE /api/users/api-keys/:id

**Organizations**
- GET/POST/PATCH/DELETE /api/organizations
- GET/POST/DELETE /api/organizations/members/:id

**Licenses**
- GET/POST/PATCH/DELETE /api/licenses
- POST /api/licenses/validate
- POST /api/licensesbind-ip/:id/
- GET /api/licenses/collisions/:id
- GET /api/licenses/validations/:id

**IA-Mesh**
- POST /api/ai/chat
- POST /api/ai/tasks
- GET /api/ai/tasks/:id
- GET /api/ai/providers
- GET /api/ai/models
- GET/POST /api/ai/prompts
- GET /api/ai/pool/stats

**Products**
- GET/POST/PATCH/DELETE /api/products
- GET/POST /api/products/reviews/:id
- GET /api/categories

**Releases**
- GET/POST /api/products/releases/:id
- GET /api/releases/:id
- GET /api/releases/download/:id

**Billing**
- GET/POST /api/orders
- POST /api/orders/pay/:id
- GET /api/invoices
- GET/POST /api/payment-methods
- GET/POST /api/coupons
- POST /api/webhooks/stripe

**Settings**
- GET/PATCH /api/settings
- GET/PATCH /api/feature-flags
- GET/POST/DELETE /api/webhooks

**Analytics**
- GET /api/analytics/dashboard
- GET /api/analytics/roi
- GET /api/analytics/usage
- GET /api/analytics/sales

**Audit**
- GET /api/audit-logs
- GET /api/telemetry

---

## BASE DE DATOS

35 tablas ya creadas:

**V001 (15 tablas):**
organizations, users_profile, subscription_plans, licenses, license_usage_log, ai_models, ai_api_pool, prompts_master, task_batches, processed_tasks, roi_metrics, audit_logs, telemetry_events, system_config, feature_flags

**V002 (20 tablas):**
product_categories, products, product_reviews, product_releases, customer_assets, asset_downloads, payment_methods, payment_gateways, orders, order_items, invoices, tax_rates, coupons, user_sessions, user_api_keys, webhooks, webhook_deliveries, license_ip_bindings, license_validations, license_collisions

Migraciones en: celaest-dashboard/database/migrations/

---

## INTEGRACIONES

- Supabase: JWT auth
- Stripe: Pagos
- Redis: Cache + Queue
- 5 proveedores IA

---

## ENTREGABLES

- API REST completa (12 modulos)
- Tests
- Docker setup
- Postman collection

