# 🚀 Guía de Migración - CELAEST Database

## Resumen de Migraciones

| Versión | Archivo | Descripción | Tablas |
|---------|---------|-------------|--------|
| V001 | `V001__initial_schema.sql` | Schema Core | 15 tablas |
| V002 | `V002__extended_modules.sql` | Módulos Extendidos | 18 tablas |

---

## Ejecución de Migraciones

### Opción 1: Manual (Desarrollo)

```bash
# 1. Levantar PostgreSQL con Docker
cd database/scripts
docker-compose up -d

# 2. Conectarse a la base de datos
docker exec -it celaest_postgres psql -U celaest_admin -d celaest_local

# 3. Ejecutar migraciones en orden
\i /path/to/database/migrations/V001__initial_schema.sql
\i /path/to/database/migrations/V002__extended_modules.sql
```

### Opción 2: Usando psql directo

```bash
# Ejecutar V001
psql -h localhost -U celaest_admin -d celaest_local -f database/migrations/V001__initial_schema.sql

# Ejecutar V002
psql -h localhost -U celaest_admin -d celaest_local -f database/migrations/V002__extended_modules.sql
```

### Opción 3: Script automatizado

```bash
#!/bin/bash
# migrate.sh

DB_HOST=localhost
DB_PORT=5432
DB_NAME=celaest_local
DB_USER=celaest_admin

MIGRATIONS_DIR="./database/migrations"

for migration in $(ls $MIGRATIONS_DIR/*.sql | sort); do
    echo "Executing: $migration"
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $migration
    if [ $? -ne 0 ]; then
        echo "Error in migration: $migration"
        exit 1
    fi
done

echo "All migrations completed successfully!"
```

---

## Orden de Dependencias

Las migraciones **DEBEN** ejecutarse en orden estricto:

```
V001__initial_schema.sql (PRIMERO)
    │
    ├── Creates: organizations, users_profile
    ├── Creates: subscription_plans, licenses, license_usage_log
    ├── Creates: ai_models, ai_api_pool, prompts_master
    ├── Creates: task_batches, processed_tasks
    ├── Creates: roi_metrics, telemetry_events
    ├── Creates: audit_logs, system_events
    └── Creates: system_config, feature_flags
    
    │
    ▼

V002__extended_modules.sql (SEGUNDO)
    │
    ├── Creates: product_categories, products, product_reviews
    ├── Creates: product_releases, customer_assets, asset_downloads
    ├── Creates: payment_gateways, payment_methods, orders, order_items
    ├── Creates: invoices, tax_rates, coupons
    ├── Creates: user_sessions, user_api_keys, webhooks, webhook_deliveries
    └── Creates: license_ip_bindings, license_validations, license_collisions
```

---

## Verificación Post-Migración

### Contar tablas

```sql
SELECT count(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Esperado: 33 tablas
```

### Listar todas las tablas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Verificar ENUMs

```sql
SELECT t.typname as enum_name, 
       array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY t.typname
ORDER BY t.typname;
```

### Verificar vistas

```sql
SELECT table_name as view_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- Esperado: 6 vistas
-- v_active_licenses, v_api_pool_status, v_daily_task_metrics
-- v_products_with_stats, v_licenses_with_ip_stats, v_sales_dashboard
```

### Verificar funciones

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

---

## Rollback (Si es necesario)

### Rollback V002

```sql
-- Eliminar vistas V002
DROP VIEW IF EXISTS v_products_with_stats CASCADE;
DROP VIEW IF EXISTS v_licenses_with_ip_stats CASCADE;
DROP VIEW IF EXISTS v_sales_dashboard CASCADE;

-- Eliminar tablas V002 (orden inverso por FK)
DROP TABLE IF EXISTS license_collisions CASCADE;
DROP TABLE IF EXISTS license_validations CASCADE;
DROP TABLE IF EXISTS license_ip_bindings CASCADE;
DROP TABLE IF EXISTS webhook_deliveries CASCADE;
DROP TABLE IF EXISTS webhooks CASCADE;
DROP TABLE IF EXISTS user_api_keys CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS tax_rates CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS payment_gateways CASCADE;
DROP TABLE IF EXISTS asset_downloads CASCADE;
DROP TABLE IF EXISTS customer_assets CASCADE;
DROP TABLE IF EXISTS product_releases CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;

-- Eliminar funciones V002
DROP FUNCTION IF EXISTS generate_order_number CASCADE;
DROP FUNCTION IF EXISTS generate_invoice_number CASCADE;
DROP FUNCTION IF EXISTS update_product_rating CASCADE;

-- Eliminar ENUMs V002
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS release_status CASCADE;
DROP TYPE IF EXISTS asset_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS payment_method_type CASCADE;
DROP TYPE IF EXISTS card_brand CASCADE;
DROP TYPE IF EXISTS gateway_status CASCADE;
DROP TYPE IF EXISTS webhook_status CASCADE;
DROP TYPE IF EXISTS collision_severity CASCADE;
```

---

## Datos de Prueba (Seeds)

Después de las migraciones, ejecutar los seeds:

```bash
psql -h localhost -U celaest_admin -d celaest_local -f database/seeds/seed_data.sql
```

---

## Checklist de Migración

- [ ] PostgreSQL 16+ corriendo
- [ ] Conexión a base de datos verificada
- [ ] Backup de datos existentes (si aplica)
- [ ] V001__initial_schema.sql ejecutado
- [ ] V002__extended_modules.sql ejecutado
- [ ] 33 tablas creadas
- [ ] 6 vistas creadas
- [ ] Funciones y triggers activos
- [ ] Seeds de prueba cargados (opcional)
- [ ] TypeScript types actualizados (`database.types.ts`)

---

## Troubleshooting

### Error: "relation already exists"

```sql
-- Verificar si la tabla existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'nombre_tabla'
);
```

### Error: "permission denied"

```sql
-- Verificar permisos
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO celaest_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO celaest_admin;
```

### Error: "type already exists"

```sql
-- Eliminar tipo existente (con cuidado)
DROP TYPE IF EXISTS nombre_tipo CASCADE;
```
