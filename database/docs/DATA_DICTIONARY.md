# 📖 Diccionario de Datos - CELAEST

Este documento describe en detalle cada tabla, columna, tipo de dato y su propósito en el sistema.

---

## Índice de Tablas

| Módulo | Tabla | Descripción |
|--------|-------|-------------|
| **Identidad** | [organizations](#organizations) | Entidades empresariales (multi-tenant) |
| **Identidad** | [users_profile](#users_profile) | Perfiles de usuario extendidos |
| **Licencias** | [subscription_plans](#subscription_plans) | Catálogo de planes |
| **Licencias** | [licenses](#licenses) | Licencias activas |
| **Licencias** | [license_usage_log](#license_usage_log) | Histórico de consumo |
| **IA-Mesh** | [ai_models](#ai_models) | Catálogo de modelos IA |
| **IA-Mesh** | [ai_api_pool](#ai_api_pool) | Pool de API Keys |
| **IA-Mesh** | [prompts_master](#prompts_master) | Repositorio de prompts |
| **Operaciones** | [task_batches](#task_batches) | Lotes de tareas |
| **Operaciones** | [processed_tasks](#processed_tasks) | Tareas procesadas |
| **Analytics** | [roi_metrics](#roi_metrics) | Métricas de ROI |
| **Auditoría** | [audit_logs](#audit_logs) | Logs de auditoría |
| **Auditoría** | [telemetry_events](#telemetry_events) | Eventos de telemetría |
| **Sistema** | [system_config](#system_config) | Configuración global |
| **Sistema** | [feature_flags](#feature_flags) | Feature flags |

---

## Tipos Enumerados (ENUMs)

### user_role
Roles de usuario en el sistema.

| Valor | Descripción | Permisos |
|-------|-------------|----------|
| `super_admin` | Administrador global | Acceso total al sistema |
| `admin` | Administrador de organización | Gestión completa de su org |
| `manager` | Gestor de equipos | Gestión de usuarios y reportes |
| `operator` | Usuario operativo | Uso del software, sin admin |
| `viewer` | Solo lectura | Visualización de dashboards |

### license_status
Estados posibles de una licencia.

| Valor | Descripción | Acceso |
|-------|-------------|--------|
| `active` | Licencia activa y funcional | ✅ Completo |
| `suspended` | Suspendida (impago, violación) | ❌ Bloqueado |
| `expired` | Expiró naturalmente | ❌ Bloqueado |
| `cancelled` | Cancelada por el usuario | ❌ Bloqueado |
| `trial` | Período de prueba | ⚠️ Limitado |

### ai_provider
Proveedores de IA soportados.

| Valor | API | Modelos Disponibles |
|-------|-----|---------------------|
| `gemini` | Google AI Studio | Gemini Pro, Gemini Flash |
| `groq` | Groq Cloud | Llama 3, Mixtral |
| `deepseek` | DeepSeek API | DeepSeek Chat, Coder |
| `openai` | OpenAI API | GPT-4, GPT-3.5 (futuro) |
| `anthropic` | Anthropic API | Claude (futuro) |
| `local` | Ollama | Modelos locales |

### task_status
Estados de procesamiento de tareas.

| Valor | Descripción | Acción |
|-------|-------------|--------|
| `pending` | En cola esperando | Ninguna |
| `processing` | En ejecución | En progreso |
| `completed` | Completada exitosamente | Finalizada |
| `failed` | Falló | Revisar error |
| `cancelled` | Cancelada por usuario | Finalizada |
| `retrying` | Reintentando | En progreso |

### audit_action
Tipos de acciones auditables.

| Valor | Descripción |
|-------|-------------|
| `create` | Creación de recurso |
| `read` | Lectura de recurso |
| `update` | Actualización de recurso |
| `delete` | Eliminación de recurso |
| `login` | Inicio de sesión |
| `logout` | Cierre de sesión |
| `export` | Exportación de datos |
| `import` | Importación de datos |
| `api_call` | Llamada a API externa |

### billing_cycle
Ciclos de facturación.

| Valor | Descripción | Días |
|-------|-------------|------|
| `monthly` | Mensual | 30 |
| `quarterly` | Trimestral | 90 |
| `yearly` | Anual | 365 |
| `lifetime` | De por vida | ∞ |
| `usage_based` | Por uso | Variable |

---

## Tablas Detalladas

### organizations

**Propósito**: Entidades empresariales que agrupan usuarios. Base del sistema multi-tenant.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `name` | `VARCHAR(255)` | NO | - | Nombre de la organización |
| `slug` | `VARCHAR(100)` | NO | - | URL-friendly identifier (UNIQUE) |
| `email` | `VARCHAR(255)` | SÍ | - | Email de contacto |
| `phone` | `VARCHAR(50)` | SÍ | - | Teléfono |
| `website` | `VARCHAR(500)` | SÍ | - | Sitio web |
| `address_line1` | `VARCHAR(255)` | SÍ | - | Dirección línea 1 |
| `address_line2` | `VARCHAR(255)` | SÍ | - | Dirección línea 2 |
| `city` | `VARCHAR(100)` | SÍ | - | Ciudad |
| `state` | `VARCHAR(100)` | SÍ | - | Estado/Provincia |
| `postal_code` | `VARCHAR(20)` | SÍ | - | Código postal |
| `country_code` | `CHAR(2)` | SÍ | - | Código país ISO 3166-1 |
| `tax_id` | `VARCHAR(50)` | SÍ | - | Identificador fiscal |
| `settings` | `JSONB` | NO | `'{}'` | Configuraciones personalizadas |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `max_users` | `INTEGER` | NO | `5` | Límite de usuarios |
| `max_api_calls_per_month` | `BIGINT` | NO | `10000` | Límite de llamadas API |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |
| `deleted_at` | `TIMESTAMPTZ` | SÍ | - | Fecha de borrado (soft delete) |

**Ejemplo de `settings`**:
```json
{
  "timezone": "America/Mexico_City",
  "locale": "es-MX",
  "branding": {
    "primary_color": "#3B82F6",
    "logo_url": "https://..."
  },
  "feature_flags": ["new_dashboard", "bulk_processing"]
}
```

---

### users_profile

**Propósito**: Perfil extendido del usuario. Complementa `auth.users` de Supabase.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | - | ID de Supabase Auth (PK) |
| `organization_id` | `UUID` | SÍ | - | FK → organizations |
| `email` | `VARCHAR(255)` | NO | - | Email (UNIQUE) |
| `first_name` | `VARCHAR(100)` | SÍ | - | Nombre |
| `last_name` | `VARCHAR(100)` | SÍ | - | Apellido |
| `display_name` | `VARCHAR(200)` | SÍ | - | Nombre para mostrar en UI |
| `avatar_url` | `VARCHAR(500)` | SÍ | - | URL del avatar |
| `phone` | `VARCHAR(50)` | SÍ | - | Teléfono |
| `role` | `user_role` | NO | `'viewer'` | Rol del usuario |
| `scopes` | `JSONB` | NO | `'[]'` | Permisos granulares |
| `timezone` | `VARCHAR(50)` | NO | `'UTC'` | Zona horaria |
| `locale` | `VARCHAR(10)` | NO | `'es'` | Idioma preferido |
| `preferences` | `JSONB` | NO | `'{}'` | Preferencias de UI |
| `onboarding_completed` | `BOOLEAN` | NO | `FALSE` | Onboarding completado |
| `onboarding_step` | `INTEGER` | NO | `0` | Paso actual de onboarding |
| `last_login_at` | `TIMESTAMPTZ` | SÍ | - | Último login |
| `login_count` | `INTEGER` | NO | `0` | Contador de logins |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |
| `deleted_at` | `TIMESTAMPTZ` | SÍ | - | Fecha de borrado |

**Ejemplo de `scopes`**:
```json
["licenses:read", "licenses:write", "billing:admin", "users:manage"]
```

**Ejemplo de `preferences`**:
```json
{
  "theme": "dark",
  "sidebar_collapsed": false,
  "default_dashboard": "overview",
  "notifications": {
    "email": true,
    "push": false,
    "digest": "weekly"
  }
}
```

---

### subscription_plans

**Propósito**: Catálogo de planes de suscripción con límites y precios.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `code` | `VARCHAR(50)` | NO | - | Código único (UNIQUE) |
| `name` | `VARCHAR(100)` | NO | - | Nombre del plan |
| `description` | `TEXT` | SÍ | - | Descripción |
| `price_monthly` | `DECIMAL(10,2)` | SÍ | - | Precio mensual |
| `price_yearly` | `DECIMAL(10,2)` | SÍ | - | Precio anual |
| `currency` | `CHAR(3)` | NO | `'USD'` | Moneda ISO 4217 |
| `limits` | `JSONB` | NO | Ver schema | Límites del plan |
| `features` | `JSONB` | NO | `'[]'` | Características incluidas |
| `is_active` | `BOOLEAN` | NO | `TRUE` | Plan activo |
| `is_public` | `BOOLEAN` | NO | `TRUE` | Visible en pricing |
| `sort_order` | `INTEGER` | NO | `0` | Orden de visualización |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |

**Ejemplo de `limits`**:
```json
{
  "max_users": 20,
  "max_ai_requests_per_month": 10000,
  "max_storage_gb": 50,
  "max_concurrent_tasks": 10,
  "max_batch_size": 100
}
```

**Nota**: `-1` significa ilimitado.

---

### licenses

**Propósito**: Licencias activas de organizaciones. Controla acceso y uso.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `organization_id` | `UUID` | NO | - | FK → organizations |
| `plan_id` | `UUID` | NO | - | FK → subscription_plans |
| `license_key` | `VARCHAR(64)` | NO | - | Token único (UNIQUE) |
| `license_key_hash` | `VARCHAR(128)` | SÍ | - | Hash para búsquedas |
| `status` | `license_status` | NO | `'trial'` | Estado de la licencia |
| `starts_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de inicio |
| `expires_at` | `TIMESTAMPTZ` | SÍ | - | Fecha de expiración |
| `trial_ends_at` | `TIMESTAMPTZ` | SÍ | - | Fin del período de prueba |
| `billing_cycle` | `billing_cycle` | NO | `'monthly'` | Ciclo de facturación |
| `next_billing_date` | `DATE` | SÍ | - | Próxima fecha de cobro |
| `custom_limits` | `JSONB` | SÍ | - | Límites personalizados |
| `current_period_start` | `TIMESTAMPTZ` | SÍ | - | Inicio del período actual |
| `current_period_end` | `TIMESTAMPTZ` | SÍ | - | Fin del período actual |
| `ai_requests_used` | `BIGINT` | NO | `0` | Peticiones de IA usadas |
| `storage_used_bytes` | `BIGINT` | NO | `0` | Almacenamiento usado |
| `notes` | `TEXT` | SÍ | - | Notas internas |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |
| `suspended_at` | `TIMESTAMPTZ` | SÍ | - | Fecha de suspensión |
| `cancelled_at` | `TIMESTAMPTZ` | SÍ | - | Fecha de cancelación |

---

### ai_models

**Propósito**: Catálogo de modelos de IA con capacidades, límites y costos.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `provider` | `ai_provider` | NO | - | Proveedor de IA |
| `model_id` | `VARCHAR(100)` | NO | - | ID del modelo |
| `display_name` | `VARCHAR(200)` | NO | - | Nombre para mostrar |
| `capabilities` | `JSONB` | NO | Ver schema | Capacidades del modelo |
| `max_tokens_input` | `INTEGER` | SÍ | - | Máx tokens de entrada |
| `max_tokens_output` | `INTEGER` | SÍ | - | Máx tokens de salida |
| `context_window` | `INTEGER` | SÍ | - | Ventana de contexto |
| `cost_per_1k_input` | `DECIMAL(10,6)` | SÍ | - | Costo por 1K tokens entrada |
| `cost_per_1k_output` | `DECIMAL(10,6)` | SÍ | - | Costo por 1K tokens salida |
| `is_active` | `BOOLEAN` | NO | `TRUE` | Modelo activo |
| `is_default` | `BOOLEAN` | NO | `FALSE` | Modelo por defecto |
| `priority` | `INTEGER` | NO | `0` | Prioridad para fallback |
| `notes` | `TEXT` | SÍ | - | Notas |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |

**Ejemplo de `capabilities`**:
```json
{
  "text_generation": true,
  "code_generation": true,
  "vision": true,
  "function_calling": true,
  "streaming": true,
  "json_mode": true
}
```

---

### ai_api_pool

**Propósito**: Pool de API Keys para balanceo de carga y redundancia.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `provider` | `ai_provider` | NO | - | Proveedor de IA |
| `key_name` | `VARCHAR(100)` | NO | - | Nombre descriptivo |
| `key_value_encrypted` | `BYTEA` | NO | - | API Key cifrada |
| `key_hint` | `VARCHAR(10)` | SÍ | - | Últimos 4 caracteres |
| `is_active` | `BOOLEAN` | NO | `TRUE` | Key activa |
| `is_healthy` | `BOOLEAN` | NO | `TRUE` | Key saludable |
| `last_health_check` | `TIMESTAMPTZ` | SÍ | - | Último health check |
| `consecutive_failures` | `INTEGER` | NO | `0` | Fallos consecutivos |
| `rate_limit_rpm` | `INTEGER` | SÍ | - | Requests por minuto |
| `rate_limit_tpm` | `INTEGER` | SÍ | - | Tokens por minuto |
| `rate_limit_rpd` | `INTEGER` | SÍ | - | Requests por día |
| `usage_count` | `BIGINT` | NO | `0` | Total de usos |
| `tokens_used` | `BIGINT` | NO | `0` | Total de tokens |
| `last_used_at` | `TIMESTAMPTZ` | SÍ | - | Último uso |
| `priority` | `INTEGER` | NO | `0` | Prioridad de selección |
| `weight` | `INTEGER` | NO | `100` | Peso para balanceo |
| `notes` | `TEXT` | SÍ | - | Notas |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |
| `expires_at` | `TIMESTAMPTZ` | SÍ | - | Fecha de expiración |

**⚠️ SEGURIDAD**: `key_value_encrypted` debe cifrarse con `pgcrypto`:
```sql
-- Cifrar
pgp_sym_encrypt('api-key-value', 'encryption-secret')

-- Descifrar
pgp_sym_decrypt(key_value_encrypted, 'encryption-secret')
```

---

### prompts_master

**Propósito**: Repositorio versionado de prompts del sistema.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `slug` | `VARCHAR(100)` | NO | - | Identificador corto |
| `name` | `VARCHAR(200)` | NO | - | Nombre del prompt |
| `description` | `TEXT` | SÍ | - | Descripción |
| `category` | `VARCHAR(50)` | NO | - | Categoría |
| `subcategory` | `VARCHAR(50)` | SÍ | - | Subcategoría |
| `system_prompt` | `TEXT` | NO | - | Prompt de sistema |
| `user_prompt_template` | `TEXT` | SÍ | - | Template con variables |
| `variables` | `JSONB` | NO | `'[]'` | Variables esperadas |
| `preferred_model_id` | `UUID` | SÍ | - | FK → ai_models |
| `temperature` | `DECIMAL(3,2)` | NO | `0.7` | Temperatura |
| `max_tokens` | `INTEGER` | NO | `2048` | Máx tokens de respuesta |
| `top_p` | `DECIMAL(3,2)` | NO | `1.0` | Top P |
| `version` | `INTEGER` | NO | `1` | Versión del prompt |
| `is_active` | `BOOLEAN` | NO | `TRUE` | Prompt activo |
| `is_default` | `BOOLEAN` | NO | `FALSE` | Prompt por defecto |
| `parent_id` | `UUID` | SÍ | - | FK → prompts_master (self) |
| `usage_count` | `BIGINT` | NO | `0` | Contador de uso |
| `avg_response_time_ms` | `INTEGER` | SÍ | - | Tiempo promedio |
| `success_rate` | `DECIMAL(5,2)` | SÍ | - | Tasa de éxito |
| `tags` | `TEXT[]` | SÍ | - | Etiquetas |
| `notes` | `TEXT` | SÍ | - | Notas |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |

**Ejemplo de `user_prompt_template`**:
```
Analiza el siguiente texto y extrae la información relevante:

Texto: {{input_text}}

Formato de salida: {{output_format}}
Idioma: {{language}}
```

**Ejemplo de `variables`**:
```json
["input_text", "output_format", "language"]
```

---

### processed_tasks

**Propósito**: Registro detallado de cada ejecución de IA. Core de telemetría.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `organization_id` | `UUID` | NO | - | FK → organizations |
| `user_id` | `UUID` | NO | - | FK → users_profile |
| `license_id` | `UUID` | SÍ | - | FK → licenses |
| `batch_id` | `UUID` | SÍ | - | FK → task_batches |
| `model_id` | `UUID` | SÍ | - | FK → ai_models |
| `api_key_id` | `UUID` | SÍ | - | FK → ai_api_pool |
| `prompt_id` | `UUID` | SÍ | - | FK → prompts_master |
| `input_type` | `VARCHAR(50)` | SÍ | - | Tipo de entrada |
| `input_text` | `TEXT` | SÍ | - | Texto de entrada |
| `input_metadata` | `JSONB` | NO | `'{}'` | Metadatos de entrada |
| `output_json` | `JSONB` | SÍ | - | Respuesta estructurada |
| `output_raw` | `TEXT` | SÍ | - | Respuesta cruda |
| `output_confidence` | `DECIMAL(5,4)` | SÍ | - | Score de confianza (0-1) |
| `status` | `task_status` | NO | `'pending'` | Estado de la tarea |
| `error_message` | `TEXT` | SÍ | - | Mensaje de error |
| `error_code` | `VARCHAR(50)` | SÍ | - | Código de error |
| `retry_count` | `INTEGER` | NO | `0` | Intentos realizados |
| `tokens_input` | `INTEGER` | NO | `0` | Tokens de entrada |
| `tokens_output` | `INTEGER` | NO | `0` | Tokens de salida |
| `tokens_total` | `INTEGER` | - | GENERATED | Total de tokens |
| `cost_usd` | `DECIMAL(10,6)` | NO | `0` | Costo en USD |
| `execution_time_ms` | `INTEGER` | SÍ | - | Tiempo total |
| `queue_time_ms` | `INTEGER` | SÍ | - | Tiempo en cola |
| `ai_time_ms` | `INTEGER` | SÍ | - | Tiempo de IA |
| `request_id` | `VARCHAR(100)` | SÍ | - | ID de correlación |
| `user_agent` | `VARCHAR(500)` | SÍ | - | User agent |
| `ip_address` | `INET` | SÍ | - | IP del cliente |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `started_at` | `TIMESTAMPTZ` | SÍ | - | Inicio de procesamiento |
| `completed_at` | `TIMESTAMPTZ` | SÍ | - | Fin de procesamiento |

**Nota**: `tokens_total` es una columna generada: `tokens_input + tokens_output`.

---

### roi_metrics

**Propósito**: Métricas agregadas de ROI por período. Pre-calculadas para dashboards.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `organization_id` | `UUID` | NO | - | FK → organizations |
| `period_type` | `VARCHAR(20)` | NO | - | 'daily', 'weekly', 'monthly' |
| `period_start` | `DATE` | NO | - | Inicio del período |
| `period_end` | `DATE` | NO | - | Fin del período |
| `tasks_completed` | `BIGINT` | NO | `0` | Tareas completadas |
| `tasks_failed` | `BIGINT` | NO | `0` | Tareas fallidas |
| `success_rate` | `DECIMAL(5,2)` | SÍ | - | Tasa de éxito % |
| `time_saved_minutes` | `BIGINT` | NO | `0` | Minutos ahorrados |
| `manual_equivalent_minutes` | `BIGINT` | NO | `0` | Tiempo manual equiv. |
| `cost_ai` | `DECIMAL(12,2)` | NO | `0` | Costo de IA |
| `cost_manual_equivalent` | `DECIMAL(12,2)` | NO | `0` | Costo manual equiv. |
| `money_saved` | `DECIMAL(12,2)` | NO | `0` | Dinero ahorrado |
| `total_tokens` | `BIGINT` | NO | `0` | Total de tokens |
| `avg_tokens_per_task` | `INTEGER` | SÍ | - | Promedio tokens/tarea |
| `avg_execution_time_ms` | `INTEGER` | SÍ | - | Tiempo promedio |
| `p95_execution_time_ms` | `INTEGER` | SÍ | - | Percentil 95 |
| `p99_execution_time_ms` | `INTEGER` | SÍ | - | Percentil 99 |
| `active_users_count` | `INTEGER` | NO | `0` | Usuarios activos |
| `new_users_count` | `INTEGER` | NO | `0` | Usuarios nuevos |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |

**Fórmula de tiempo ahorrado**:
```
time_saved = manual_equivalent_minutes - (tasks * avg_ai_time_minutes)
```

**Fórmula de dinero ahorrado**:
```
money_saved = cost_manual_equivalent - cost_ai
```

---

### audit_logs

**Propósito**: Log inmutable de auditoría para compliance y debugging.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `user_id` | `UUID` | SÍ | - | FK → users_profile |
| `organization_id` | `UUID` | SÍ | - | FK → organizations |
| `action` | `audit_action` | NO | - | Tipo de acción |
| `resource_type` | `VARCHAR(100)` | NO | - | Tipo de recurso |
| `resource_id` | `UUID` | SÍ | - | ID del recurso |
| `description` | `TEXT` | SÍ | - | Descripción |
| `changes` | `JSONB` | SÍ | - | Before/After |
| `request_id` | `VARCHAR(100)` | SÍ | - | ID de correlación |
| `ip_address` | `INET` | SÍ | - | IP del cliente |
| `user_agent` | `VARCHAR(500)` | SÍ | - | User agent |
| `success` | `BOOLEAN` | NO | `TRUE` | Operación exitosa |
| `error_message` | `TEXT` | SÍ | - | Mensaje de error |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha del evento |

**Ejemplo de `changes`**:
```json
{
  "before": {
    "status": "active",
    "ai_requests_used": 500
  },
  "after": {
    "status": "suspended",
    "ai_requests_used": 500
  }
}
```

**⚠️ IMPORTANTE**: Esta tabla es **append-only**. Nunca borrar registros.

---

### telemetry_events

**Propósito**: Eventos de telemetría para analytics de comportamiento.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `organization_id` | `UUID` | SÍ | - | FK → organizations |
| `user_id` | `UUID` | SÍ | - | FK → users_profile |
| `session_id` | `VARCHAR(100)` | SÍ | - | ID de sesión |
| `event_type` | `VARCHAR(100)` | NO | - | Tipo de evento |
| `event_category` | `VARCHAR(50)` | SÍ | - | Categoría |
| `event_name` | `VARCHAR(200)` | NO | - | Nombre del evento |
| `properties` | `JSONB` | NO | `'{}'` | Propiedades del evento |
| `page_url` | `VARCHAR(500)` | SÍ | - | URL de la página |
| `referrer` | `VARCHAR(500)` | SÍ | - | Referrer |
| `ip_address` | `INET` | SÍ | - | IP del cliente |
| `user_agent` | `VARCHAR(500)` | SÍ | - | User agent |
| `device_type` | `VARCHAR(20)` | SÍ | - | desktop/mobile/tablet |
| `browser` | `VARCHAR(50)` | SÍ | - | Navegador |
| `os` | `VARCHAR(50)` | SÍ | - | Sistema operativo |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha del evento |

**Ejemplo de `properties`**:
```json
{
  "task_id": "uuid-here",
  "model_used": "gemini-pro",
  "tokens": 1500,
  "duration_ms": 2300,
  "success": true
}
```

---

### system_config

**Propósito**: Configuraciones globales del sistema (key-value).

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `key` | `VARCHAR(100)` | NO | - | Clave (PK) |
| `value` | `JSONB` | NO | - | Valor |
| `description` | `TEXT` | SÍ | - | Descripción |
| `is_sensitive` | `BOOLEAN` | NO | `FALSE` | No exponer en APIs |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |
| `updated_by` | `UUID` | SÍ | - | FK → users_profile |

---

### feature_flags

**Propósito**: Feature flags para deployment progresivo y A/B testing.

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| `id` | `UUID` | NO | `uuid_generate_v4()` | Identificador único (PK) |
| `flag_key` | `VARCHAR(100)` | NO | - | Clave única (UNIQUE) |
| `name` | `VARCHAR(200)` | NO | - | Nombre del flag |
| `description` | `TEXT` | SÍ | - | Descripción |
| `is_enabled` | `BOOLEAN` | NO | `FALSE` | Flag habilitado |
| `target_type` | `VARCHAR(20)` | NO | `'all'` | Tipo de targeting |
| `target_percentage` | `INTEGER` | SÍ | - | Porcentaje (0-100) |
| `target_users` | `UUID[]` | SÍ | - | Lista de usuarios |
| `target_organizations` | `UUID[]` | SÍ | - | Lista de orgs |
| `metadata` | `JSONB` | NO | `'{}'` | Datos adicionales |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | Última actualización |

**Valores de `target_type`**:
- `all`: Todos los usuarios
- `percentage`: Porcentaje aleatorio
- `users`: Lista específica de usuarios
- `orgs`: Lista específica de organizaciones

---

## Funciones Disponibles

### `generate_license_key()`
Genera un token de licencia seguro de 64 caracteres.

```sql
SELECT generate_license_key();
-- Resultado: '8f4e2d1a9c7b6e3f...' (64 caracteres hex)
```

### `increment_api_key_usage(p_key_id UUID, p_tokens INTEGER)`
Incrementa contadores de uso de una API key.

```sql
SELECT increment_api_key_usage('uuid-here', 1500);
```

### `log_audit(...)`
Registra una entrada en audit_logs.

```sql
SELECT log_audit(
    'user-uuid',
    'org-uuid',
    'update',
    'license',
    'license-uuid',
    'License suspended for non-payment',
    '{"before": {...}, "after": {...}}'::jsonb
);
```

---

## Vistas Disponibles

### `v_active_licenses`
Licencias activas con información de organización y uso.

### `v_api_pool_status`
Estado agregado del pool de API Keys por proveedor.

### `v_daily_task_metrics`
Métricas diarias de tareas agregadas por organización.
