# 📈 Modelo de Negocio CELAEST - Documentación de Base de Datos

> **Versión:** 1.0  
> **Fecha:** Febrero 2026  
> **Propósito:** Documentar la relación entre el modelo de datos y el modelo de negocio de CELAEST

---

## 🎯 Resumen Ejecutivo

**CELAEST** es una plataforma **SaaS B2B** que funciona como hub central para la gestión de ecosistemas digitales empresariales. La plataforma monetiza a través de tres canales principales:

| Canal de Ingresos | Modelo | Rango de Precios |
|-------------------|--------|------------------|
| **Productos Digitales** | Pago único (perpetuo) | $99 - $12,000 |
| **Suscripciones** | Recurrente (mensual/anual) | $99 - $1,200/mes |
| **Licencias con Límites** | Por uso (API calls, usuarios) | Variable |

### Diferenciador Clave: IA-Mesh
Motor de inteligencia artificial multi-proveedor que permite:
- Balanceo de carga entre proveedores (Gemini, Groq, OpenAI, Anthropic, DeepSeek)
- Fallback automático si un proveedor falla
- Control granular de costos por organización
- Versionado de prompts con A/B testing

---

## 📊 Mapeo Modelo de Negocio → Base de Datos

### 1. MÓDULO IDENTITY (Identidad y Multi-tenancy)

#### ¿Por qué existe?
CELAEST es una plataforma **multi-tenant** donde múltiples empresas (organizaciones) operan de forma aislada. Cada organización tiene sus propios usuarios, licencias y datos.

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `organizations` | Representa a cada **cliente empresa**. Es la unidad de facturación y la raíz del multi-tenancy. | ✅ Core |
| `users_profile` | Representa a cada **usuario individual** dentro de una organización. Contiene roles y permisos. | ✅ Core |

#### Flujo de Negocio
```
┌─────────────────┐      ┌─────────────────┐
│  Empresa ACME   │      │   Usuario Juan  │
│  (organization) │ 1:N  │  (users_profile)│
├─────────────────┤      ├─────────────────┤
│ slug: acme-corp │◄────►│ role: admin     │
│ max_users: 50   │      │ org_id: acme    │
│ plan: enterprise│      │ scopes: [...]   │
└─────────────────┘      └─────────────────┘
```

#### Campos clave para el negocio
- `max_users`: Límite de usuarios por plan contratado
- `max_api_calls_per_month`: Cuota mensual de IA-Mesh
- `settings.branding`: Permite white-labeling para enterprise
- `onboarding_completed`: Tracking de activación de clientes

#### ✅ Cumple MVP porque:
- Sin organizaciones no hay multi-tenancy (core de SaaS B2B)
- Sin usuarios no hay autenticación ni autorización
- Campos alineados con pricing tiers (starter, professional, enterprise)

---

### 2. MÓDULO LICENSING (Licencias y Suscripciones)

#### ¿Por qué existe?
Las **licencias** son el **activo principal que genera revenue**. Una licencia da derecho a:
- Usar productos específicos
- Consumir cuotas de IA (requests/mes)
- Acceder por tiempo limitado o perpetuo

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `subscription_plans` | Define los **productos/planes** que se venden (Starter, Pro, Enterprise) | ✅ Core |
| `licenses` | Registro de cada **venta realizada**. Es el "contrato" digital. | ✅ Core |
| `license_usage_log` | Tracking de **consumo** para facturación por uso y alertas | ✅ Core |
| `license_ip_bindings` | Control **anti-piratería** por dispositivo/IP | ✅ Core |
| `license_validations` | Log de cada **validación** de licencia en tiempo real | ⚠️ Alta |
| `license_collisions` | Detección de **uso fraudulento** (misma licencia en múltiples IPs) | ⚠️ Alta |

#### Flujo de Negocio
```
Compra de Licencia:
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  subscription_plan ──► Orden ──► licenses ──► Acceso al producto │
│  (qué se vende)        (venta)   (contrato)   (uso)              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Validación de Licencia (cada uso):
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  App Cliente ──► API ──► license_validations ──► ¿Válida?       │
│                              │                      │            │
│                              ▼                      ▼            │
│                    license_ip_bindings      Acceso o Rechazo    │
│                    (¿IP autorizada?)                             │
│                              │                                   │
│                              ▼                                   │
│                    license_collisions                            │
│                    (¿Uso simultáneo?)                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Campos clave para el negocio
- `license_key`: Token único que el cliente usa para activar
- `status`: active/suspended/expired/cancelled/trial
- `expires_at`: Control de renovaciones y churn
- `ai_requests_used` / `ai_requests_limit`: Facturación por uso
- `custom_limits`: Overrides para clientes enterprise con negocios especiales

#### Modelo de Precios soportado
```sql
-- Plan Starter
limits: {
  "max_users": 5,
  "max_ai_requests_per_month": 1000,
  "max_storage_gb": 10
}

-- Plan Professional  
limits: {
  "max_users": 25,
  "max_ai_requests_per_month": 10000,
  "max_storage_gb": 100
}

-- Plan Enterprise
limits: {
  "max_users": -1,  -- ilimitado
  "max_ai_requests_per_month": 100000,
  "max_storage_gb": 1000
}
```

#### ✅ Cumple MVP porque:
- Sin licencias no hay monetización
- El modelo soporta los 3 tipos de venta (único, suscripción, por uso)
- Control de IP es esencial para prevenir piratería (pérdida de revenue)

---

### 3. MÓDULO IA-MESH (Motor de Inteligencia Artificial)

#### ¿Por qué existe?
El **IA-Mesh** es el **diferenciador competitivo** de CELAEST. Permite a los clientes usar múltiples proveedores de IA sin vendor lock-in, con:
- Balanceo de carga automático
- Fallback si un proveedor falla
- Optimización de costos (usar el más barato disponible)
- Tracking granular de consumo

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `ai_models` | Catálogo de **modelos disponibles** con sus capacidades y precios | ✅ Core |
| `ai_api_pool` | Pool de **API keys** para distribuir carga y evitar rate limits | ✅ Core |
| `prompts_master` | Biblioteca de **prompts optimizados** con versionado | ✅ Core |

#### Flujo de Negocio
```
Ejecución de Tarea IA:
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  1. Usuario solicita tarea IA                                    │
│           │                                                      │
│           ▼                                                      │
│  2. prompts_master → Selecciona prompt óptimo                    │
│           │                                                      │
│           ▼                                                      │
│  3. ai_models → Selecciona modelo (según capacidad/costo)        │
│           │                                                      │
│           ▼                                                      │
│  4. ai_api_pool → Selecciona API key saludable                   │
│           │                                                      │
│           ▼                                                      │
│  5. Ejecuta → Registra en processed_tasks                        │
│           │                                                      │
│           ▼                                                      │
│  6. Cobra → Actualiza license_usage_log                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Campos clave para el negocio
- `ai_models.cost_per_1k_input/output`: Cálculo de costo real por ejecución
- `ai_api_pool.is_healthy`: Evitar usar keys con problemas
- `ai_api_pool.rate_limit_rpm`: Respetar límites de cada proveedor
- `prompts_master.version`: A/B testing de prompts para optimizar resultados

#### Proveedores soportados
| Proveedor | Modelos | Caso de Uso |
|-----------|---------|-------------|
| **Gemini** | gemini-pro, gemini-ultra | General, multimodal |
| **Groq** | llama-3, mixtral | Velocidad extrema |
| **DeepSeek** | deepseek-coder | Código |
| **OpenAI** | gpt-4, gpt-4-turbo | Premium |
| **Anthropic** | claude-3 | Análisis largo |
| **Local** | ollama/* | Privacidad, sin costo |

#### ✅ Cumple MVP porque:
- Sin IA-Mesh no hay diferenciador vs competencia
- El pool de keys evita caídas de servicio (SLA)
- El tracking de costos permite margen de ganancia controlado

---

### 4. MÓDULO OPERATIONS (Operaciones y Tareas)

#### ¿Por qué existe?
Registra **cada ejecución** de automatización o tarea IA. Sirve para:
- Facturar al cliente (tokens consumidos)
- Auditoría y debugging
- Métricas de uso del producto
- Detectar patrones de uso para upselling

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `task_batches` | Agrupa tareas relacionadas (ej: "Procesar 100 facturas") | ⚠️ Alta |
| `processed_tasks` | Registro de **cada ejecución individual** con resultados | ✅ Core |

#### Campos clave para el negocio
- `tokens_input/output`: Base para facturación por uso
- `cost_usd`: Costo real de la operación (para calcular margen)
- `execution_time_ms`: SLA y performance
- `status`: Tracking de éxito/fallo para calidad de servicio
- `model_id`, `prompt_id`: Trazabilidad completa

#### Métricas derivadas
```sql
-- Revenue por cliente
SELECT organization_id, SUM(cost_usd * markup_factor) as revenue
FROM processed_tasks
GROUP BY organization_id;

-- Margen bruto
SELECT 
  SUM(cost_usd) as costo,
  SUM(billed_amount) as revenue,
  SUM(billed_amount - cost_usd) as margen
FROM processed_tasks;
```

#### ✅ Cumple MVP porque:
- Sin tracking de tareas no se puede facturar por uso
- Necesario para dashboards de cliente (transparencia)

---

### 5. MÓDULO MARKETPLACE (Catálogo de Productos)

#### ¿Por qué existe?
El **Marketplace** es el **escaparate público** donde los prospectos descubren y compran productos. Es el inicio del funnel de conversión.

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `product_categories` | Organización del catálogo (Automatización, IA, Seguridad...) | ✅ Core |
| `products` | Cada **producto a la venta** con precio, descripción, features | ✅ Core |
| `product_reviews` | Social proof para aumentar conversión | ⚠️ Alta |

#### Catálogo actual (del diseño)
| Producto | Precio | Modelo |
|----------|--------|--------|
| Sistema de Automatización Empresarial | $4,500 | Perpetuo |
| Infraestructura Global Optimizada | $1,200/mes | Suscripción |
| Suite de Análisis Inteligente | $8,900 | Perpetuo |
| Seguridad Empresarial Avanzada | $2,100 | Perpetuo |
| CRM Inteligente Global | $150/mes | Suscripción |
| Generador de Contenido IA | $99/mes | Suscripción |
| Plataforma IoT Industrial | $12,000 | Perpetuo |

#### Campos clave para el negocio
- `price` / `original_price`: Para mostrar descuentos ("Antes $X, ahora $Y")
- `is_subscription`: Diferencia entre compra única y recurrente
- `is_featured` / `is_popular`: Control editorial del marketplace
- `avg_rating` / `review_count`: Calculados automáticamente para social proof
- `download_count`: Indicador de popularidad

#### ✅ Cumple MVP porque:
- Sin catálogo no hay qué vender
- Reviews aumentan conversión (testimonios)
- Categorías mejoran descubribilidad

---

### 6. MÓDULO RELEASES (Versiones y Assets)

#### ¿Por qué existe?
Los clientes que compran productos necesitan:
- Descargar el software adquirido
- Recibir actualizaciones
- Ver changelog de nuevas versiones

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `product_releases` | Cada **versión** de un producto (1.0, 1.1, 2.0...) | ✅ Core |
| `customer_assets` | Registro de **qué productos posee** cada cliente | ✅ Core |
| `asset_downloads` | Log de descargas para analytics y soporte | ⚠️ Alta |

#### Flujo de Negocio
```
Compra → Asset creado → Cliente descarga → Actualización disponible
   │         │                │                      │
   ▼         ▼                ▼                      ▼
 order    customer_asset   asset_download    product_release
```

#### Campos clave para el negocio
- `version`: Control semántico (major.minor.patch)
- `status`: draft/beta/stable/deprecated
- `is_critical`: Para updates de seguridad obligatorios
- `checksum_sha256`: Verificación de integridad
- `download_count`: Popular = más ventas

#### ✅ Cumple MVP porque:
- Sin releases los clientes no pueden obtener el producto
- Sin assets no sabemos quién compró qué

---

### 7. MÓDULO BILLING (Facturación y Pagos)

#### ¿Por qué existe?
Gestiona todo el **flujo de dinero**: desde el checkout hasta la factura fiscal.

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `payment_gateways` | Integraciones de pago (Stripe, PayPal, etc.) | ✅ Core |
| `payment_methods` | Tarjetas/cuentas guardadas del cliente | ✅ Core |
| `orders` | Cada **compra realizada** | ✅ Core |
| `order_items` | Detalle de productos en cada orden | ✅ Core |
| `invoices` | **Facturas fiscales** generadas | ✅ Core |
| `tax_rates` | Impuestos por país/estado (IVA, GST...) | ⚠️ Alta |
| `coupons` | Códigos de descuento para promociones | ⚠️ Alta |

#### Flujo de Checkout
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Carrito → payment_method → order → order_items → invoice       │
│              │                │         │            │          │
│              ▼                ▼         ▼            ▼          │
│         Stripe/PayPal    Confirmación  Crear      Factura       │
│                                       license      PDF          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Campos clave para el negocio
- `order_number`: Identificador legible para soporte ("ORD-20260201-XXXX")
- `status`: pending/processing/completed/cancelled/refunded
- `gateway_transaction_id`: Referencia al sistema de pago externo
- `coupon_id`: Tracking de promociones que convirtieron
- `invoice_number`: Cumplimiento fiscal

#### Métricas financieras derivadas
```sql
-- MRR (Monthly Recurring Revenue)
SELECT SUM(price_monthly) as mrr
FROM licenses l
JOIN subscription_plans sp ON l.plan_id = sp.id
WHERE l.status = 'active' AND sp.billing_cycle = 'monthly';

-- Conversion por cupón
SELECT c.code, COUNT(o.id) as orders, SUM(o.total) as revenue
FROM coupons c
LEFT JOIN orders o ON o.coupon_id = c.id
GROUP BY c.code;
```

#### ✅ Cumple MVP porque:
- Sin billing no hay revenue
- Facturas son requisito legal en la mayoría de países
- Cupones son herramienta esencial de marketing

---

### 8. MÓDULO ANALYTICS (Métricas y Telemetría)

#### ¿Por qué existe?
Proporciona **insights de negocio** tanto para CELAEST como para los clientes:
- Dashboard de ROI para el cliente (justificar renovación)
- Métricas de producto para CELAEST (tomar decisiones)

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `roi_metrics` | Métricas de **valor generado** por cliente | ✅ Core |
| `telemetry_events` | Eventos granulares para analytics avanzados | ⚠️ Alta |

#### Métricas de ROI (del diseño)
| Métrica | Descripción | Impacto |
|---------|-------------|---------|
| **Tiempo Ahorrado** | Horas ahorradas vs proceso manual | Justifica renovación |
| **Tareas Completadas** | Ejecuciones de automatización | Engagement |
| **Valor Generado** | $ calculado basado en costo/hora | ROI tangible |
| **Usuarios Activos** | DAU/MAU | Health del cliente |

#### Campos clave para el negocio
- `time_saved_hours`: Para mostrar "Has ahorrado X horas este mes"
- `value_generated_usd`: "Tu ROI es 340%"
- `tasks_completed`: Indicador de adopción

#### ✅ Cumple MVP porque:
- ROI visible = renovaciones (reduce churn)
- Telemetría permite detectar clientes en riesgo

---

### 9. MÓDULO SETTINGS (Configuración Extendida)

#### ¿Por qué existe?
Permite a los clientes enterprise **personalizar e integrar** CELAEST con sus sistemas.

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `user_sessions` | Control de sesiones activas (seguridad) | ⚠️ Alta |
| `user_api_keys` | API keys para integraciones propias del cliente | ⚠️ Alta |
| `webhooks` | Notificaciones a sistemas externos del cliente | ⚠️ Alta |
| `webhook_deliveries` | Log de entregas para debugging | ⬜ Media |

#### Casos de uso enterprise
1. **API Keys**: Cliente usa la API de CELAEST desde su propio sistema
2. **Webhooks**: Cliente recibe notificación cuando una tarea termina
3. **Sessions**: Admin puede cerrar sesiones sospechosas (seguridad)

#### ✅ Cumple MVP porque:
- API keys son esenciales para integraciones (valor enterprise)
- Webhooks permiten automatizaciones avanzadas

---

### 10. MÓDULO AUDIT (Auditoría y Cumplimiento)

#### ¿Por qué existe?
Requisito para clientes enterprise que necesitan **cumplimiento normativo** (SOC2, ISO 27001, GDPR).

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `audit_logs` | **Quién hizo qué y cuándo** (compliance) | ✅ Core |
| `system_events` | Eventos de sistema (deployments, errors) | ⬜ Media |

#### Campos clave para el negocio
- `action`: create/read/update/delete/login/logout/export/import
- `resource_type` + `resource_id`: Qué se modificó
- `changes`: Diff antes/después (JSONB)
- `ip_address`: Para forensics de seguridad

#### ✅ Cumple MVP porque:
- Auditoría es requisito para vender a enterprise
- Necesario para investigar incidentes

---

### 11. MÓDULO SYSTEM (Configuración Global)

#### ¿Por qué existe?
Permite configurar **comportamiento del sistema** sin deployments.

#### Tablas y su propósito de negocio

| Tabla | Propósito de Negocio | MVP? |
|-------|---------------------|------|
| `system_config` | Configuraciones globales (key-value) | ⚠️ Alta |
| `feature_flags` | Activar/desactivar features sin deploy | ⚠️ Alta |

#### Casos de uso
- Activar feature solo para 10% de usuarios (canary release)
- Desactivar feature con bugs sin hacer rollback
- Configurar límites globales del sistema

#### ✅ Cumple MVP porque:
- Feature flags permiten lanzar con menos riesgo
- Configuración dinámica evita downtimes

---

## 📋 Matriz de Cumplimiento MVP

### Features del Dashboard vs Tablas

| Feature (UI) | Tablas que lo soportan | Estado |
|--------------|------------------------|--------|
| **Dashboard (Command Center)** | `roi_metrics`, `processed_tasks`, `licenses` | ✅ |
| **Marketplace** | `products`, `product_categories`, `product_reviews` | ✅ |
| **Licensing Hub** | `licenses`, `subscription_plans`, `license_ip_bindings`, `license_validations`, `license_collisions` | ✅ |
| **Billing Portal** | `orders`, `order_items`, `invoices`, `payment_methods`, `coupons` | ✅ |
| **Asset Manager** | `customer_assets`, `product_releases`, `asset_downloads` | ✅ |
| **Analytics Console** | `roi_metrics`, `telemetry_events` | ✅ |
| **ROI Metrics** | `roi_metrics` | ✅ |
| **Release Manager** | `product_releases`, `products` | ✅ |
| **User Management** | `users_profile`, `organizations` | ✅ |
| **Error Monitoring** | `audit_logs`, `system_events` | ✅ |
| **Settings** | `user_sessions`, `user_api_keys`, `webhooks` | ✅ |

### Cobertura de Tipos del Código

| Tipo en código | Tabla en BD | ✓ |
|----------------|-------------|---|
| `User` | `users_profile` | ✅ |
| `Organization` | `organizations` | ✅ |
| `License` | `licenses` | ✅ |
| `IpBinding` | `license_ip_bindings` | ✅ |
| `Collision` | `license_collisions` | ✅ |
| `Product` | `products` | ✅ |
| `Version` | `product_releases` | ✅ |
| `CustomerAsset` | `customer_assets` | ✅ |
| `Order` | `orders` | ✅ |
| `Invoice` | `invoices` | ✅ |
| `PaymentMethod` | `payment_methods` | ✅ |
| `TaxRate` | `tax_rates` | ✅ |
| `PaymentGateway` | `payment_gateways` | ✅ |
| `Session` | `user_sessions` | ✅ |
| `WebhookEndpoint` | `webhooks` | ✅ |
| `APISettings` | `user_api_keys` | ✅ |

---

## 🏆 Mejores Prácticas Implementadas

### 1. Diseño de Base de Datos

| Práctica | Implementación | Estado |
|----------|----------------|--------|
| **UUID como PK** | Todas las tablas usan UUID v4 | ✅ |
| **Soft Delete** | `deleted_at` en tablas críticas | ✅ |
| **Timestamps automáticos** | Triggers `set_updated_at` | ✅ |
| **Normalización** | 3FN con desnormalización selectiva (JSONB) | ✅ |
| **Índices en FK** | Todos los foreign keys indexados | ✅ |
| **Índices parciales** | Solo filas activas indexadas | ✅ |
| **Check constraints** | Validación de rangos en DB | ✅ |
| **Unique constraints** | Prevención de duplicados | ✅ |

### 2. Seguridad

| Práctica | Implementación | Estado |
|----------|----------------|--------|
| **Cifrado de secretos** | pgcrypto para API keys | ✅ |
| **Auditoría completa** | `audit_logs` con cambios | ✅ |
| **IP tracking** | En validaciones y sesiones | ✅ |
| **Rate limiting preparado** | Campos en `ai_api_pool` | ✅ |
| **PCI-DSS awareness** | Solo last4 de tarjetas | ✅ |

### 3. Escalabilidad

| Práctica | Implementación | Estado |
|----------|----------------|--------|
| **Particionamiento preparado** | `telemetry_events`, `audit_logs` | ✅ |
| **JSONB para flexibilidad** | `metadata`, `settings`, `capabilities` | ✅ |
| **Generated columns** | `tokens_total`, `version_*` | ✅ |
| **Materialized views ready** | Vistas preparadas | ✅ |
| **Connection pooling** | PgBouncer en docker-compose | ✅ |

### 4. Operaciones

| Práctica | Implementación | Estado |
|----------|----------------|--------|
| **Migraciones versionadas** | V001, V002 con orden | ✅ |
| **Seeds de prueba** | seed_data.sql | ✅ |
| **Backup automatizado** | backup.sh script | ✅ |
| **Health checks** | `ai_api_pool.is_healthy` | ✅ |

---

## 📊 Diagrama de Flujo de Revenue

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FLUJO DE MONETIZACIÓN                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  Prospecto  │────►│  Marketplace │────►│   Checkout  │────►│   License   │
  │   (Lead)    │     │  (products)  │     │   (orders)  │     │  (activa)   │
  └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                │                     │
                              ┌─────────────────┘                     │
                              ▼                                       ▼
                    ┌─────────────────┐                    ┌─────────────────┐
                    │    Invoice      │                    │    Uso de IA    │
                    │  (facturación)  │                    │ (processed_tasks)│
                    └─────────────────┘                    └─────────────────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────┐
                                                          │  Usage Billing  │
                                                          │(license_usage_log)│
                                                          └─────────────────┘
                                                                    │
                              ┌──────────────────────────────────────┘
                              ▼
                    ┌─────────────────┐     ┌─────────────────┐
                    │   ROI visible   │────►│   Renovación    │
                    │  (roi_metrics)  │     │   (upsell)      │
                    └─────────────────┘     └─────────────────┘
```

---

## 🎯 Conclusión

El modelo de base de datos **cubre el 100% de las necesidades del MVP** de CELAEST:

| Aspecto | Cobertura |
|---------|-----------|
| **Modelo de monetización** | 3 canales (producto, suscripción, uso) | ✅ |
| **Multi-tenancy** | Organizations + Users | ✅ |
| **Licencias** | Full lifecycle + anti-piratería | ✅ |
| **IA-Mesh** | Multi-proveedor con fallback | ✅ |
| **Marketplace** | Catálogo + reviews + categorías | ✅ |
| **Billing** | Checkout + facturación + cupones | ✅ |
| **Analytics** | ROI + telemetría | ✅ |
| **Integraciones** | API keys + webhooks | ✅ |
| **Compliance** | Auditoría completa | ✅ |

### Próximos pasos sugeridos
1. Cargar datos de prueba con el catálogo real de productos
2. Implementar Row Level Security (RLS) en Supabase
3. Configurar jobs de agregación para `roi_metrics`
4. Implementar workers para `webhook_deliveries`
