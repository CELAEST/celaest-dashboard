-- ============================================================================
-- CELAEST DASHBOARD - SCHEMA COMPLETO v2.0
-- ============================================================================
-- Base de datos: celaest-back (Dashboard SaaS)
-- Puerto: 5432
-- 
-- ARQUITECTURA DE MICROSERVICIOS:
-- - Este schema es para el Dashboard (SaaS, usuarios, licencias, billing)
-- - La IA-Mesh está en celaest_core_db (puerto 5433)
-- 
-- Autor: CELAEST Team
-- Fecha: 2026-02-03
-- ============================================================================

-- ============================================================================
-- EXTENSIONES REQUERIDAS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Cifrado de datos sensibles
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Búsqueda fuzzy

-- ============================================================================
-- TIPOS ENUMERADOS (ENUMS)
-- ============================================================================

-- Roles de usuario
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'admin',
    'manager',
    'operator',
    'viewer'
);

-- Estados de licencia
CREATE TYPE license_status AS ENUM (
    'active',
    'suspended',
    'expired',
    'cancelled',
    'trial'
);

-- Estados de tareas
CREATE TYPE task_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'retrying'
);

-- Acciones de auditoría
CREATE TYPE audit_action AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'export',
    'import',
    'api_call'
);

-- Ciclos de facturación
CREATE TYPE billing_cycle AS ENUM (
    'monthly',
    'quarterly',
    'yearly',
    'lifetime',
    'usage_based'
);

-- Estados de producto (marketplace)
CREATE TYPE product_status AS ENUM (
    'draft',
    'published',
    'archived',
    'coming_soon'
);

-- Tipos de producto
CREATE TYPE product_type AS ENUM (
    'software',
    'saas',
    'api',
    'template',
    'dataset',
    'course',
    'service'
);

-- Estados de release
CREATE TYPE release_status AS ENUM (
    'stable',
    'beta',
    'alpha',
    'deprecated',
    'yanked'
);

-- Estados de orden
CREATE TYPE order_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
    'cancelled'
);

-- Estados de factura
CREATE TYPE invoice_status AS ENUM (
    'draft',
    'sent',
    'paid',
    'overdue',
    'void',
    'uncollectible'
);

-- Tipos de método de pago
CREATE TYPE payment_method_type AS ENUM (
    'credit_card',
    'debit_card',
    'bank_transfer',
    'paypal',
    'stripe',
    'crypto'
);

-- ============================================================================
-- MÓDULO 1: IDENTIDAD Y ORGANIZACIONES
-- ============================================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(500),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2),
    tax_id VARCHAR(50),
    settings JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    max_users INTEGER DEFAULT 5,
    max_api_calls_per_month BIGINT DEFAULT 10000,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE users_profile (
    id UUID PRIMARY KEY,  -- Viene de Supabase Auth
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    role user_role DEFAULT 'viewer' NOT NULL,
    scopes JSONB DEFAULT '[]'::jsonb,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'es',
    preferences JSONB DEFAULT '{}'::jsonb,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step INTEGER DEFAULT 0,
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- MÓDULO 2: LICENCIAS Y SUSCRIPCIONES
-- ============================================================================

CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    currency CHAR(3) DEFAULT 'USD',
    limits JSONB NOT NULL DEFAULT '{
        "max_users": 5,
        "max_ai_requests_per_month": 1000,
        "max_storage_gb": 10,
        "max_concurrent_tasks": 5
    }'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    license_key VARCHAR(64) UNIQUE NOT NULL,
    license_key_hash VARCHAR(128),
    status license_status DEFAULT 'trial' NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    billing_cycle billing_cycle DEFAULT 'monthly',
    next_billing_date DATE,
    custom_limits JSONB,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    ai_requests_used BIGINT DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    suspended_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

CREATE TABLE license_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    ai_requests_count BIGINT DEFAULT 0,
    tokens_input BIGINT DEFAULT 0,
    tokens_output BIGINT DEFAULT 0,
    storage_peak_bytes BIGINT DEFAULT 0,
    active_users_count INTEGER DEFAULT 0,
    calculated_cost DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_license_period UNIQUE (license_id, period_start, period_end)
);

-- Control de IPs por licencia
CREATE TABLE license_ip_bindings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    hostname VARCHAR(255),
    user_agent VARCHAR(500),
    is_trusted BOOLEAN DEFAULT FALSE,
    first_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    request_count BIGINT DEFAULT 1,
    CONSTRAINT unique_license_ip UNIQUE (license_id, ip_address)
);

-- ============================================================================
-- MÓDULO 3: OPERACIONES Y TAREAS
-- ============================================================================

CREATE TABLE task_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    name VARCHAR(200),
    description TEXT,
    status task_status DEFAULT 'pending' NOT NULL,
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    failed_tasks INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    config JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE processed_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES task_batches(id) ON DELETE SET NULL,
    -- Referencia al Core (celaest_core_db.ai_requests)
    core_request_id UUID,
    input_type VARCHAR(50),
    input_text TEXT,
    input_metadata JSONB DEFAULT '{}'::jsonb,
    output_json JSONB,
    output_raw TEXT,
    output_confidence DECIMAL(5,4),
    status task_status DEFAULT 'pending' NOT NULL,
    error_message TEXT,
    error_code VARCHAR(50),
    retry_count INTEGER DEFAULT 0,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    tokens_total INTEGER GENERATED ALWAYS AS (tokens_input + tokens_output) STORED,
    cost_usd DECIMAL(10,6) DEFAULT 0,
    execution_time_ms INTEGER,
    queue_time_ms INTEGER,
    ai_time_ms INTEGER,
    request_id VARCHAR(100),
    user_agent VARCHAR(500),
    ip_address INET,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE roi_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    tasks_completed BIGINT DEFAULT 0,
    tasks_failed BIGINT DEFAULT 0,
    success_rate DECIMAL(5,2),
    time_saved_minutes BIGINT DEFAULT 0,
    manual_equivalent_minutes BIGINT DEFAULT 0,
    cost_ai DECIMAL(12,2) DEFAULT 0,
    cost_manual_equivalent DECIMAL(12,2) DEFAULT 0,
    money_saved DECIMAL(12,2) DEFAULT 0,
    total_tokens BIGINT DEFAULT 0,
    avg_tokens_per_task INTEGER,
    avg_execution_time_ms INTEGER,
    p95_execution_time_ms INTEGER,
    p99_execution_time_ms INTEGER,
    active_users_count INTEGER DEFAULT 0,
    new_users_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_org_period UNIQUE (organization_id, period_type, period_start)
);

-- ============================================================================
-- MÓDULO 4: MARKETPLACE Y PRODUCTOS
-- ============================================================================

CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    icon VARCHAR(100),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(200) UNIQUE NOT NULL,
    sku VARCHAR(50) UNIQUE,
    name VARCHAR(300) NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    product_type product_type NOT NULL DEFAULT 'software',
    tags TEXT[],
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    currency CHAR(3) DEFAULT 'USD',
    is_recurring BOOLEAN DEFAULT FALSE,
    billing_cycle billing_cycle,
    status product_status DEFAULT 'draft' NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    thumbnail_url VARCHAR(500),
    images JSONB DEFAULT '[]'::jsonb,
    video_url VARCHAR(500),
    demo_url VARCHAR(500),
    tech_stack TEXT[],
    requirements TEXT,
    compatibility VARCHAR(500),
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

CREATE TABLE product_releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    version_major INTEGER NOT NULL DEFAULT 1,
    version_minor INTEGER NOT NULL DEFAULT 0,
    version_patch INTEGER NOT NULL DEFAULT 0,
    status release_status DEFAULT 'stable' NOT NULL,
    release_notes TEXT,
    changelog JSONB DEFAULT '[]'::jsonb,
    download_url VARCHAR(500),
    file_size_bytes BIGINT,
    file_hash VARCHAR(128),
    min_requirements JSONB DEFAULT '{}'::jsonb,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    released_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_product_version UNIQUE (product_id, version)
);

CREATE TABLE customer_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
    order_id UUID,  -- Se referencia después
    current_version VARCHAR(50),
    installed_version VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    access_granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_accessed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

-- ============================================================================
-- MÓDULO 5: BILLING Y PAGOS
-- ============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status order_status DEFAULT 'pending' NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency CHAR(3) DEFAULT 'USD',
    coupon_code VARCHAR(50),
    billing_name VARCHAR(200),
    billing_email VARCHAR(255),
    billing_address JSONB,
    payment_method_type payment_method_type,
    payment_provider VARCHAR(50),
    payment_intent_id VARCHAR(255),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    paid_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ
);

-- Actualizar referencia en customer_assets
ALTER TABLE customer_assets 
ADD CONSTRAINT fk_customer_assets_order 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
    item_type VARCHAR(50) NOT NULL,
    name VARCHAR(300) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    status invoice_status DEFAULT 'draft' NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency CHAR(3) DEFAULT 'USD',
    billing_name VARCHAR(200),
    billing_email VARCHAR(255),
    billing_address JSONB,
    billing_tax_id VARCHAR(50),
    due_date DATE,
    notes TEXT,
    footer_text TEXT,
    pdf_url VARCHAR(500),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    voided_at TIMESTAMPTZ
);

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,  -- 'percentage', 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    applies_to_products UUID[],
    applies_to_plans UUID[],
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- MÓDULO 6: SETTINGS Y SESIONES
-- ============================================================================

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255),
    ip_address INET,
    user_agent VARCHAR(500),
    device_type VARCHAR(50),
    device_name VARCHAR(200),
    browser VARCHAR(100),
    os VARCHAR(100),
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    key_hash VARCHAR(128) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    scopes JSONB DEFAULT '["read"]'::jsonb,
    rate_limit_rpm INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    usage_count BIGINT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    revoked_at TIMESTAMPTZ
);

-- ============================================================================
-- MÓDULO 7: AUDITORÍA Y TELEMETRÍA
-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    description TEXT,
    changes JSONB,
    request_id VARCHAR(100),
    ip_address INET,
    user_agent VARCHAR(500),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE telemetry_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    event_name VARCHAR(200) NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    ip_address INET,
    user_agent VARCHAR(500),
    device_type VARCHAR(20),
    browser VARCHAR(50),
    os VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- MÓDULO 8: CONFIGURACIÓN DEL SISTEMA
-- ============================================================================

CREATE TABLE system_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by UUID REFERENCES users_profile(id)
);

CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    target_type VARCHAR(20) DEFAULT 'all',
    target_percentage INTEGER,
    target_users UUID[],
    target_organizations UUID[],
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug) WHERE deleted_at IS NULL;

-- Users
CREATE INDEX idx_users_profile_email ON users_profile(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_profile_org ON users_profile(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_profile_role ON users_profile(role) WHERE deleted_at IS NULL;

-- Licenses
CREATE INDEX idx_licenses_org ON licenses(organization_id);
CREATE INDEX idx_licenses_key ON licenses(license_key);
CREATE INDEX idx_licenses_status ON licenses(status) WHERE status = 'active';
CREATE INDEX idx_licenses_expires ON licenses(expires_at) WHERE expires_at IS NOT NULL;

-- License IP Bindings
CREATE INDEX idx_ip_bindings_license ON license_ip_bindings(license_id);
CREATE INDEX idx_ip_bindings_ip ON license_ip_bindings(ip_address);

-- Processed Tasks
CREATE INDEX idx_tasks_org ON processed_tasks(organization_id);
CREATE INDEX idx_tasks_user ON processed_tasks(user_id);
CREATE INDEX idx_tasks_status ON processed_tasks(status) WHERE status IN ('pending', 'processing');
CREATE INDEX idx_tasks_created ON processed_tasks(created_at DESC);
CREATE INDEX idx_tasks_batch ON processed_tasks(batch_id) WHERE batch_id IS NOT NULL;
CREATE INDEX idx_tasks_core_request ON processed_tasks(core_request_id) WHERE core_request_id IS NOT NULL;
CREATE INDEX idx_tasks_org_created ON processed_tasks(organization_id, created_at DESC);

-- ROI Metrics
CREATE INDEX idx_roi_org_period ON roi_metrics(organization_id, period_type, period_start DESC);

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id) WHERE status = 'published';
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Releases
CREATE INDEX idx_releases_product ON product_releases(product_id, version_major DESC, version_minor DESC);

-- Orders
CREATE INDEX idx_orders_org ON orders(organization_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Invoices
CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Sessions
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at) WHERE expires_at < NOW();

-- API Keys
CREATE INDEX idx_api_keys_user ON user_api_keys(user_id);
CREATE INDEX idx_api_keys_org ON user_api_keys(organization_id);

-- Audit
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);

-- Telemetry
CREATE INDEX idx_telemetry_org ON telemetry_events(organization_id, created_at DESC);
CREATE INDEX idx_telemetry_type ON telemetry_events(event_type, created_at DESC);

-- ============================================================================
-- FUNCIONES
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generar license key
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS VARCHAR(64) AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Generar order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    v_year TEXT;
    v_seq INTEGER;
BEGIN
    v_year := TO_CHAR(NOW(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1
    INTO v_seq
    FROM orders
    WHERE order_number LIKE 'ORD-' || v_year || '-%';
    RETURN 'ORD-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Generar invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    v_year TEXT;
    v_seq INTEGER;
BEGIN
    v_year := TO_CHAR(NOW(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 9) AS INTEGER)), 0) + 1
    INTO v_seq
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || v_year || '-%';
    RETURN 'INV-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Log de auditoría
CREATE OR REPLACE FUNCTION log_audit(
    p_user_id UUID,
    p_org_id UUID,
    p_action audit_action,
    p_resource_type VARCHAR,
    p_resource_id UUID,
    p_description TEXT DEFAULT NULL,
    p_changes JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, description, changes)
    VALUES (p_user_id, p_org_id, p_action, p_resource_type, p_resource_id, p_description, p_changes)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_batches_updated_at BEFORE UPDATE ON task_batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roi_metrics_updated_at BEFORE UPDATE ON roi_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_releases_updated_at BEFORE UPDATE ON product_releases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_assets_updated_at BEFORE UPDATE ON customer_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_api_keys_updated_at BEFORE UPDATE ON user_api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VISTAS
-- ============================================================================

-- Licencias activas con info de organización
CREATE OR REPLACE VIEW v_active_licenses AS
SELECT 
    l.id AS license_id,
    l.license_key,
    l.status,
    l.expires_at,
    l.ai_requests_used,
    o.id AS org_id,
    o.name AS org_name,
    o.slug AS org_slug,
    sp.code AS plan_code,
    sp.name AS plan_name,
    (sp.limits->>'max_ai_requests_per_month')::BIGINT AS max_requests,
    CASE 
        WHEN (sp.limits->>'max_ai_requests_per_month')::BIGINT > 0 
        THEN ROUND((l.ai_requests_used::DECIMAL / (sp.limits->>'max_ai_requests_per_month')::BIGINT) * 100, 2)
        ELSE 0 
    END AS usage_percentage
FROM licenses l
JOIN organizations o ON l.organization_id = o.id
JOIN subscription_plans sp ON l.plan_id = sp.id
WHERE l.status = 'active'
  AND o.deleted_at IS NULL;

-- Métricas diarias de tareas
CREATE OR REPLACE VIEW v_daily_task_metrics AS
SELECT 
    DATE(created_at) AS date,
    organization_id,
    COUNT(*) AS total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed,
    COUNT(*) FILTER (WHERE status = 'failed') AS failed,
    ROUND(AVG(execution_time_ms)) AS avg_execution_ms,
    ROUND(AVG(tokens_total)) AS avg_tokens,
    SUM(cost_usd) AS total_cost
FROM processed_tasks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), organization_id
ORDER BY date DESC;

-- Productos publicados con stats
CREATE OR REPLACE VIEW v_products_published AS
SELECT 
    p.*,
    pc.name AS category_name,
    pc.slug AS category_slug,
    (SELECT version FROM product_releases pr 
     WHERE pr.product_id = p.id AND pr.status = 'stable' 
     ORDER BY released_at DESC LIMIT 1) AS latest_version
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
WHERE p.status = 'published';

-- Dashboard de ventas
CREATE OR REPLACE VIEW v_sales_dashboard AS
SELECT 
    DATE(o.created_at) AS date,
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE o.status = 'completed') AS completed_orders,
    SUM(CASE WHEN o.status = 'completed' THEN o.total ELSE 0 END) AS revenue,
    AVG(CASE WHEN o.status = 'completed' THEN o.total END) AS avg_order_value
FROM orders o
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(o.created_at)
ORDER BY date DESC;

-- ============================================================================
-- DATOS INICIALES
-- ============================================================================

-- Planes de suscripción
INSERT INTO subscription_plans (code, name, description, price_monthly, price_yearly, limits, features, sort_order) VALUES
('free', 'Free', 'Plan gratuito para comenzar', 0, 0, 
    '{"max_users": 1, "max_ai_requests_per_month": 100, "max_storage_gb": 1, "max_concurrent_tasks": 1}',
    '["basic_extraction", "limited_support"]', 1),
    
('starter', 'Starter', 'Para pequeños equipos', 29, 290, 
    '{"max_users": 5, "max_ai_requests_per_month": 1000, "max_storage_gb": 10, "max_concurrent_tasks": 3}',
    '["basic_extraction", "advanced_extraction", "email_support", "api_access"]', 2),
    
('professional', 'Professional', 'Para equipos en crecimiento', 99, 990, 
    '{"max_users": 20, "max_ai_requests_per_month": 10000, "max_storage_gb": 50, "max_concurrent_tasks": 10}',
    '["basic_extraction", "advanced_extraction", "priority_support", "api_access", "custom_prompts", "analytics"]', 3),
    
('enterprise', 'Enterprise', 'Para grandes organizaciones', 299, 2990, 
    '{"max_users": -1, "max_ai_requests_per_month": -1, "max_storage_gb": 500, "max_concurrent_tasks": -1}',
    '["all_features", "dedicated_support", "custom_integration", "sla", "on_premise_option"]', 4);

-- Configuración del sistema
INSERT INTO system_config (key, value, description, is_sensitive) VALUES
('app_name', '"CELAEST Dashboard"', 'Nombre de la aplicación', FALSE),
('app_version', '"2.0.0"', 'Versión actual', FALSE),
('maintenance_mode', 'false', 'Modo mantenimiento', FALSE),
('default_timezone', '"America/Mexico_City"', 'Zona horaria por defecto', FALSE),
('max_file_upload_mb', '50', 'Tamaño máximo de archivo en MB', FALSE),
('core_api_url', '"http://localhost:8080"', 'URL del API de celaest-core', FALSE),
('telemetry_enabled', 'true', 'Habilitar telemetría', FALSE);

-- Feature flags
INSERT INTO feature_flags (flag_key, name, description, is_enabled, target_type) VALUES
('new_dashboard', 'Nuevo Dashboard', 'Dashboard rediseñado', FALSE, 'percentage'),
('ai_streaming', 'Streaming de IA', 'Respuestas en tiempo real', TRUE, 'all'),
('advanced_analytics', 'Analytics Avanzado', 'Métricas detalladas', FALSE, 'orgs'),
('bulk_processing', 'Procesamiento Bulk', 'Múltiples archivos', TRUE, 'all'),
('marketplace', 'Marketplace', 'Marketplace de productos', TRUE, 'all');

-- Categorías de productos de ejemplo
INSERT INTO product_categories (slug, name, description, icon, sort_order) VALUES
('extractors', 'Extractores de Datos', 'Herramientas para extracción de datos', 'FileSearch', 1),
('templates', 'Templates', 'Plantillas prediseñadas', 'LayoutTemplate', 2),
('integrations', 'Integraciones', 'Conectores y APIs', 'Plug', 3),
('analytics', 'Analytics', 'Herramientas de análisis', 'BarChart', 4);

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================
-- 
-- RESUMEN DE TABLAS (23 total):
-- 
-- Identidad (2):        organizations, users_profile
-- Licencias (3):        subscription_plans, licenses, license_usage_log, license_ip_bindings
-- Operaciones (3):      task_batches, processed_tasks, roi_metrics
-- Marketplace (4):      product_categories, products, product_releases, customer_assets
-- Billing (4):          orders, order_items, invoices, coupons
-- Settings (2):         user_sessions, user_api_keys
-- Auditoría (2):        audit_logs, telemetry_events
-- Sistema (2):          system_config, feature_flags
--
-- ARQUITECTURA:
-- ┌────────────────────────────┬────────────────────────────────────────────┐
-- │     celaest_app_db         │              celaest_core_db               │
-- │     (Dashboard SaaS)       │              (IA-Mesh Engine)              │
-- │     Puerto: 5432           │              Puerto: 5433                  │
-- ├────────────────────────────┼────────────────────────────────────────────┤
-- │ • Users & Organizations    │ • AI Models & Providers                    │
-- │ • Licenses & Plans         │ • API Keys Pool                            │
-- │ • Tasks & ROI Metrics      │ • Prompts & Cache                          │
-- │ • Marketplace & Products   │ • AI Requests & Metrics                    │
-- │ • Orders & Invoices        │ • Cloudflare & Ollama Config               │
-- │ • Sessions & API Keys      │                                            │
-- │ • Audit & Telemetry        │                                            │
-- └────────────────────────────┴────────────────────────────────────────────┘
-- ============================================================================
