# 🗄️ CELAEST Dashboard Database

## Schema Consolidado v2.0

Base de datos del **Dashboard SaaS** siguiendo el patrón **Database per Service**.

---

## 📐 Arquitectura

```
┌────────────────────────────────┬────────────────────────────────────────────┐
│     celaest_app_db             │              celaest_core_db               │
│     (Dashboard SaaS)           │              (IA-Mesh Engine)              │
│     Puerto: 5432               │              Puerto: 5433                  │
├────────────────────────────────┼────────────────────────────────────────────┤
│ • Users & Organizations        │ • AI Models & Providers                    │
│ • Licenses & Plans             │ • API Keys Pool                            │
│ • Tasks & ROI Metrics          │ • Prompts & Cache                          │
│ • Marketplace & Products       │ • AI Requests & Metrics                    │
│ • Orders & Invoices            │ • Cloudflare & Ollama Config               │
│ • Sessions & API Keys          │                                            │
│ • Audit & Telemetry            │                                            │
└────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 📁 Estructura

```
database/
├── README.md                           # Este archivo
├── migrations/
│   └── V001__complete_schema.sql       # Schema completo (23 tablas)
├── seeds/
│   └── seed_data.sql                   # Datos de prueba
├── scripts/
│   ├── docker-compose.yml              # PostgreSQL + PgAdmin
│   └── backup.sh                       # Backup automatizado
└── docs/
    ├── ERD.md                          # Diagrama ER
    ├── DATA_DICTIONARY.md              # Diccionario de datos
    └── ...
```

---

## 🗃️ Tablas (23 total)

| Módulo | Tablas |
|--------|--------|
| **Identidad** | `organizations`, `users_profile` |
| **Licencias** | `subscription_plans`, `licenses`, `license_usage_log`, `license_ip_bindings` |
| **Operaciones** | `task_batches`, `processed_tasks`, `roi_metrics` |
| **Marketplace** | `product_categories`, `products`, `product_releases`, `customer_assets` |
| **Billing** | `orders`, `order_items`, `invoices`, `coupons` |
| **Settings** | `user_sessions`, `user_api_keys` |
| **Auditoría** | `audit_logs`, `telemetry_events` |
| **Sistema** | `system_config`, `feature_flags` |

---

## 🚀 Quick Start

### 1. Iniciar con Docker

```bash
cd database/scripts
docker-compose up -d
```

### 2. Ejecutar Schema

```bash
psql -h localhost -U celaest_app -d celaest_app_db -f migrations/V001__complete_schema.sql
```

### 3. Cargar Datos de Prueba

```bash
psql -h localhost -U celaest_app -d celaest_app_db -f seeds/seed_data.sql
```

### 4. Verificar

```sql
SELECT COUNT(*) FROM organizations;       -- 3
SELECT COUNT(*) FROM users_profile;       -- 5
SELECT COUNT(*) FROM subscription_plans;  -- 4
SELECT COUNT(*) FROM licenses;            -- 3
SELECT COUNT(*) FROM products;            -- 3
```

---

## 🔗 Comunicación con Core

```typescript
// Dashboard llama al API de Core para procesar IA
const response = await fetch('http://localhost:8080/api/v1/ai/process', {
  method: 'POST',
  headers: {
    'X-Organization-ID': orgId,
    'X-User-ID': userId,
    'X-License-ID': licenseId,
  },
  body: JSON.stringify({ prompt_slug: 'extraction_v1', input_text: '...' })
});

const { request_id, output } = await response.json();

// Guardar en Dashboard con referencia al Core
await db.processedTasks.create({
  core_request_id: request_id,  // ← Correlación
  output_json: output,
  // ...
});
```

---

## 📊 Vistas Incluidas

| Vista | Descripción |
|-------|-------------|
| `v_active_licenses` | Licencias activas con % de uso |
| `v_daily_task_metrics` | Métricas diarias de tareas |
| `v_products_published` | Productos publicados con última versión |
| `v_sales_dashboard` | Dashboard de ventas (30 días) |

---

## ⚙️ Funciones Incluidas

| Función | Uso |
|---------|-----|
| `generate_license_key()` | Genera key de 64 chars |
| `generate_order_number()` | ORD-YYYY-XXXXXX |
| `generate_invoice_number()` | INV-YYYY-XXXXXX |
| `log_audit()` | Registra en audit_logs |

---

## 📝 Notas

- **Puerto 5432**: Dashboard (este repo)
- **Puerto 5433**: Core IA-Mesh (celaest-core)
- Los datos de IA (modelos, prompts, API keys) están en `celaest_core_db`
- La correlación es via `processed_tasks.core_request_id`

---

**Versión**: 2.0.0  
**Última actualización**: 2026-02-03
