# 🛠️ Guía de Mantenimiento de Base de Datos - CELAEST

## Índice

1. [Operaciones Diarias](#operaciones-diarias)
2. [Mantenimiento Semanal](#mantenimiento-semanal)
3. [Mantenimiento Mensual](#mantenimiento-mensual)
4. [Monitoreo y Alertas](#monitoreo-y-alertas)
5. [Troubleshooting](#troubleshooting)
6. [Procedures de Emergencia](#procedures-de-emergencia)

---

## Operaciones Diarias

### 1. Verificar Estado del Servicio

```bash
# Docker
docker ps | grep celaest_postgres

# Estado de conexiones
docker exec celaest_postgres psql -U celaest -d celaest_db -c \
  "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"
```

### 2. Verificar Logs de Errores

```bash
# Últimos 100 errores
docker logs celaest_postgres 2>&1 | grep -i error | tail -100
```

### 3. Verificar Backups Automáticos

```bash
# Listar backups recientes
ls -la database/scripts/backups/ | head -10
```

---

## Mantenimiento Semanal

### 1. Vacuum y Analyze

```sql
-- Ejecutar VACUUM ANALYZE en tablas de alto tráfico
VACUUM ANALYZE processed_tasks;
VACUUM ANALYZE telemetry_events;
VACUUM ANALYZE audit_logs;

-- Verificar bloat (espacio desperdiciado)
SELECT 
    schemaname || '.' || relname AS table,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
```

### 2. Revisar Índices No Utilizados

```sql
-- Índices que no se han usado
SELECT 
    schemaname || '.' || relname AS table,
    indexrelname AS index,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size,
    idx_scan AS times_used
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 3. Verificar Queries Lentos

```sql
-- Top 10 queries más lentas
SELECT 
    substring(query, 1, 100) AS short_query,
    calls,
    round(total_exec_time::numeric, 2) AS total_time_ms,
    round(mean_exec_time::numeric, 2) AS avg_time_ms,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

---

## Mantenimiento Mensual

### 1. Backup Completo Verificado

```bash
# Backup completo
./database/scripts/backup.sh full

# Verificar integridad
gunzip -t database/scripts/backups/celaest_full_*.sql.gz && echo "OK"
```

### 2. Archivado de Datos Históricos

```sql
-- Archivar telemetry_events mayores a 90 días
-- Primero: exportar a archivo
COPY (
    SELECT * FROM telemetry_events 
    WHERE created_at < NOW() - INTERVAL '90 days'
) TO '/tmp/telemetry_archive.csv' WITH CSV HEADER;

-- Luego: eliminar
DELETE FROM telemetry_events 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Similar para audit_logs (archivar antes de 180 días)
-- NOTA: audit_logs es compliance, considerar requisitos legales
```

### 3. Reindex de Tablas Grandes

```sql
-- Reindex concurrente (no bloquea)
REINDEX INDEX CONCURRENTLY idx_tasks_org_created;
REINDEX INDEX CONCURRENTLY idx_telemetry_org;
REINDEX INDEX CONCURRENTLY idx_audit_logs_created_at;
```

### 4. Actualizar Estadísticas

```sql
-- Actualizar estadísticas completas
ANALYZE VERBOSE;
```

---

## Monitoreo y Alertas

### Queries de Monitoreo

```sql
-- 1. Tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('celaest_db')) AS db_size;

-- 2. Tamaño por tabla
SELECT 
    relname AS table,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 15;

-- 3. Conexiones activas por usuario
SELECT 
    usename AS user,
    state,
    count(*) AS connections
FROM pg_stat_activity
GROUP BY usename, state
ORDER BY connections DESC;

-- 4. Transacciones por segundo
SELECT 
    xact_commit + xact_rollback AS transactions,
    xact_commit AS commits,
    xact_rollback AS rollbacks
FROM pg_stat_database
WHERE datname = 'celaest_db';

-- 5. Cache hit ratio (debe ser > 99%)
SELECT 
    round(100.0 * sum(blks_hit) / sum(blks_hit + blks_read), 2) AS cache_hit_ratio
FROM pg_stat_database
WHERE datname = 'celaest_db';

-- 6. Locks activos
SELECT 
    locktype,
    relation::regclass,
    mode,
    granted
FROM pg_locks
WHERE NOT granted;
```

### Métricas Clave para Alertar

| Métrica | Umbral Warning | Umbral Critical |
|---------|----------------|-----------------|
| Conexiones activas | > 150 | > 180 |
| Cache hit ratio | < 99% | < 95% |
| Disk usage | > 80% | > 90% |
| Replication lag | > 5s | > 30s |
| Long running queries | > 30s | > 60s |
| Dead tuples ratio | > 10% | > 20% |

---

## Troubleshooting

### Problema: Queries Lentas

1. **Identificar la query**:
```sql
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '10 seconds';
```

2. **Analizar el plan**:
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT ... ; -- Tu query lenta aquí
```

3. **Acciones comunes**:
   - Agregar índice faltante
   - Actualizar estadísticas: `ANALYZE table_name;`
   - Revisar si necesita VACUUM

### Problema: Espacio en Disco

1. **Identificar tablas grandes**:
```sql
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 5;
```

2. **Identificar bloat**:
```sql
SELECT schemaname, relname, 
       n_dead_tup, n_live_tup,
       round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

3. **Solución**:
```sql
VACUUM FULL table_name; -- CUIDADO: Bloquea la tabla
-- O mejor:
VACUUM table_name;
```

### Problema: Conexiones Agotadas

1. **Ver conexiones**:
```sql
SELECT pid, usename, client_addr, state, query_start, query
FROM pg_stat_activity
ORDER BY query_start;
```

2. **Terminar conexiones idle viejas**:
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND query_start < now() - interval '1 hour';
```

### Problema: Locks/Deadlocks

1. **Identificar locks**:
```sql
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

2. **Terminar proceso bloqueante** (con cuidado):
```sql
SELECT pg_terminate_backend(blocking_pid);
```

---

## Procedures de Emergencia

### 🚨 Restauración de Backup

```bash
# 1. Detener aplicación
docker-compose -f app/docker-compose.yml stop

# 2. Restaurar
gunzip -c backups/celaest_full_YYYYMMDD.sql.gz | \
  docker exec -i celaest_postgres psql -U celaest -d celaest_db

# 3. Verificar
docker exec celaest_postgres psql -U celaest -d celaest_db -c "SELECT count(*) FROM users_profile;"

# 4. Reiniciar aplicación
docker-compose -f app/docker-compose.yml start
```

### 🚨 Corrupción de Datos

1. **Identificar tablas corruptas**:
```sql
-- Intentar scan completo
SELECT count(*) FROM table_name;
-- Si falla, hay corrupción
```

2. **Opciones de recuperación**:
   - Restaurar desde backup
   - `pg_dump` parcial de tablas sanas
   - Contactar soporte de PostgreSQL

### 🚨 Failover Manual

```bash
# Si usas replicación, promover réplica
docker exec celaest_postgres_replica pg_ctl promote -D /var/lib/postgresql/data

# Actualizar connection string en aplicación
# Verificar integridad de datos
```

---

## Checklist de Mantenimiento

### Diario ✅
- [ ] Verificar que los backups automáticos se ejecutaron
- [ ] Revisar logs de errores
- [ ] Verificar métricas de performance

### Semanal ✅
- [ ] Ejecutar VACUUM ANALYZE en tablas de alto tráfico
- [ ] Revisar queries lentas
- [ ] Verificar uso de disco

### Mensual ✅
- [ ] Backup completo verificado
- [ ] Archivar datos históricos
- [ ] Reindex de tablas grandes
- [ ] Actualizar estadísticas completas
- [ ] Revisar y optimizar índices no utilizados

### Trimestral ✅
- [ ] Prueba de restauración de backup
- [ ] Revisar políticas de retención
- [ ] Actualizar documentación
- [ ] Revisar permisos y accesos
