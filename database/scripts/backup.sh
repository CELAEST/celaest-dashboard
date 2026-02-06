#!/bin/bash
# ============================================================================
# CELAEST Database Backup Script
# ============================================================================
# Uso: ./backup.sh [full|data|schema]
# 
# Opciones:
#   full   - Backup completo (schema + data)
#   data   - Solo datos
#   schema - Solo estructura
# ============================================================================

set -e

# Configuración
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-celaest_db}"
DB_USER="${DB_USER:-celaest}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}CELAEST Database Backup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Función de backup
do_backup() {
    local TYPE=$1
    local FILENAME=""
    local PG_DUMP_OPTS=""
    
    case $TYPE in
        full)
            FILENAME="${BACKUP_DIR}/celaest_full_${DATE}.sql.gz"
            PG_DUMP_OPTS=""
            echo -e "${YELLOW}Tipo: Backup completo (schema + data)${NC}"
            ;;
        data)
            FILENAME="${BACKUP_DIR}/celaest_data_${DATE}.sql.gz"
            PG_DUMP_OPTS="--data-only"
            echo -e "${YELLOW}Tipo: Solo datos${NC}"
            ;;
        schema)
            FILENAME="${BACKUP_DIR}/celaest_schema_${DATE}.sql.gz"
            PG_DUMP_OPTS="--schema-only"
            echo -e "${YELLOW}Tipo: Solo schema${NC}"
            ;;
        *)
            echo -e "${RED}Error: Tipo de backup no válido: $TYPE${NC}"
            echo "Uso: ./backup.sh [full|data|schema]"
            exit 1
            ;;
    esac
    
    echo ""
    echo "Host: $DB_HOST:$DB_PORT"
    echo "Database: $DB_NAME"
    echo "Output: $FILENAME"
    echo ""
    
    # Ejecutar pg_dump
    echo "Iniciando backup..."
    
    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        $PG_DUMP_OPTS \
        --verbose \
        --no-owner \
        --no-privileges \
        --format=plain \
        | gzip > "$FILENAME"
    
    # Verificar resultado
    if [ $? -eq 0 ]; then
        local SIZE=$(du -h "$FILENAME" | cut -f1)
        echo ""
        echo -e "${GREEN}✓ Backup completado exitosamente${NC}"
        echo "  Archivo: $FILENAME"
        echo "  Tamaño: $SIZE"
    else
        echo -e "${RED}✗ Error durante el backup${NC}"
        exit 1
    fi
}

# Función de limpieza de backups antiguos
cleanup_old_backups() {
    echo ""
    echo "Limpiando backups con más de $RETENTION_DAYS días..."
    
    local COUNT=$(find "$BACKUP_DIR" -name "celaest_*.sql.gz" -mtime +$RETENTION_DAYS | wc -l)
    
    if [ $COUNT -gt 0 ]; then
        find "$BACKUP_DIR" -name "celaest_*.sql.gz" -mtime +$RETENTION_DAYS -delete
        echo -e "${GREEN}✓ Eliminados $COUNT backups antiguos${NC}"
    else
        echo "No hay backups antiguos para eliminar."
    fi
}

# Main
BACKUP_TYPE="${1:-full}"

do_backup "$BACKUP_TYPE"
cleanup_old_backups

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Proceso completado${NC}"
echo -e "${GREEN}========================================${NC}"
