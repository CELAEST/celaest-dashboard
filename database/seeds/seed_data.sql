-- ============================================================================
-- CELAEST DASHBOARD - SEED DATA
-- ============================================================================
-- Datos de prueba para desarrollo
-- NOTA: NO ejecutar en producción
-- ============================================================================

-- ============================================================================
-- ORGANIZACIONES
-- ============================================================================
INSERT INTO organizations (id, name, slug, email, phone, country_code, settings, max_users, max_api_calls_per_month)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 
     'CELAEST Demo Corp', 
     'celaest-demo', 
     'demo@celaest.com',
     '+52 55 1234 5678',
     'MX',
     '{"timezone": "America/Mexico_City", "locale": "es-MX"}'::jsonb,
     50, 100000),
    
    ('22222222-2222-2222-2222-222222222222', 
     'Startup Tech MX', 
     'startup-tech', 
     'info@startuptech.mx',
     '+52 33 9876 5432',
     'MX',
     '{"timezone": "America/Mexico_City", "locale": "es-MX"}'::jsonb,
     5, 1000),
    
    ('33333333-3333-3333-3333-333333333333', 
     'Enterprise Global SA', 
     'enterprise-global', 
     'contact@enterprise-global.com',
     '+1 555 123 4567',
     'US',
     '{"timezone": "America/New_York", "locale": "en-US"}'::jsonb,
     -1, -1);

-- ============================================================================
-- USUARIOS
-- ============================================================================
INSERT INTO users_profile (id, organization_id, email, first_name, last_name, display_name, role, scopes, onboarding_completed)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     '11111111-1111-1111-1111-111111111111',
     'admin@celaest.com', 'Admin', 'CELAEST', 'Admin CELAEST',
     'super_admin', '["*"]'::jsonb, TRUE),
    
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
     '11111111-1111-1111-1111-111111111111',
     'manager@celaest-demo.com', 'María', 'García', 'María García',
     'admin', '["licenses:*", "users:*", "billing:read"]'::jsonb, TRUE),
    
    ('cccccccc-cccc-cccc-cccc-cccccccccccc',
     '11111111-1111-1111-1111-111111111111',
     'operator@celaest-demo.com', 'Carlos', 'López', 'Carlos López',
     'operator', '["tasks:*"]'::jsonb, TRUE),
    
    ('dddddddd-dddd-dddd-dddd-dddddddddddd',
     '11111111-1111-1111-1111-111111111111',
     'viewer@celaest-demo.com', 'Ana', 'Martínez', 'Ana Martínez',
     'viewer', '["dashboard:read"]'::jsonb, FALSE),
    
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
     '22222222-2222-2222-2222-222222222222',
     'founder@startuptech.mx', 'Roberto', 'Hernández', 'Roberto Hernández',
     'admin', '["*"]'::jsonb, TRUE);

-- ============================================================================
-- LICENCIAS
-- ============================================================================
INSERT INTO licenses (id, organization_id, plan_id, license_key, license_key_hash, status, starts_at, expires_at, billing_cycle, ai_requests_used)
VALUES
    ('lic-11111111-1111-1111-1111-111111111111',
     '11111111-1111-1111-1111-111111111111',
     (SELECT id FROM subscription_plans WHERE code = 'professional'),
     'CELA-DEMO-PROF-2024-XXXX-YYYY-ZZZZ-1111',
     encode(sha256('CELA-DEMO-PROF-2024-XXXX-YYYY-ZZZZ-1111'::bytea), 'hex'),
     'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', 'yearly', 2500),
    
    ('lic-22222222-2222-2222-2222-222222222222',
     '22222222-2222-2222-2222-222222222222',
     (SELECT id FROM subscription_plans WHERE code = 'starter'),
     'CELA-STRT-2024-XXXX-YYYY-ZZZZ-2222',
     encode(sha256('CELA-STRT-2024-XXXX-YYYY-ZZZZ-2222'::bytea), 'hex'),
     'trial', NOW(), NOW() + INTERVAL '14 days', 'monthly', 150),
    
    ('lic-33333333-3333-3333-3333-333333333333',
     '33333333-3333-3333-3333-333333333333',
     (SELECT id FROM subscription_plans WHERE code = 'enterprise'),
     'CELA-ENTR-2024-XXXX-YYYY-ZZZZ-3333',
     encode(sha256('CELA-ENTR-2024-XXXX-YYYY-ZZZZ-3333'::bytea), 'hex'),
     'active', NOW() - INTERVAL '60 days', NULL, 'yearly', 45000);

-- ============================================================================
-- TAREAS PROCESADAS
-- ============================================================================
INSERT INTO processed_tasks (id, organization_id, user_id, license_id, core_request_id, input_type, input_text, output_json, status, tokens_input, tokens_output, cost_usd, execution_time_ms, created_at, completed_at)
VALUES
    ('task-11111111-1111-1111-1111-111111111111',
     '11111111-1111-1111-1111-111111111111',
     'cccccccc-cccc-cccc-cccc-cccccccccccc',
     'lic-11111111-1111-1111-1111-111111111111',
     'core-11111111-1111-1111-1111-111111111111',
     'chat',
     'Mi nombre es Juan Pérez, trabajo en ACME Corp como Gerente.',
     '{"nombre": "Juan Pérez", "empresa": "ACME Corp", "cargo": "Gerente"}'::jsonb,
     'completed', 150, 85, 0.000325, 1250,
     NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
    
    ('task-22222222-2222-2222-2222-222222222222',
     '11111111-1111-1111-1111-111111111111',
     'cccccccc-cccc-cccc-cccc-cccccccccccc',
     'lic-11111111-1111-1111-1111-111111111111',
     NULL,
     'chat', '', NULL, 'failed', 0, 0, 0, 50,
     NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
    
    ('task-33333333-3333-3333-3333-333333333333',
     '11111111-1111-1111-1111-111111111111',
     'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
     'lic-11111111-1111-1111-1111-111111111111',
     'core-33333333-3333-3333-3333-333333333333',
     'file',
     'Lorem ipsum dolor sit amet...',
     NULL, 'processing', 500, 0, 0, NULL,
     NOW() - INTERVAL '30 seconds', NULL);

-- ============================================================================
-- MÉTRICAS ROI
-- ============================================================================
INSERT INTO roi_metrics (organization_id, period_type, period_start, period_end, tasks_completed, tasks_failed, success_rate, time_saved_minutes, cost_ai, cost_manual_equivalent, money_saved, total_tokens, active_users_count)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'daily',
     CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day',
     45, 3, 93.75, 180, 1.25, 75.00, 73.75, 9500, 4),
    
    ('11111111-1111-1111-1111-111111111111', 'weekly',
     CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '1 day',
     312, 18, 94.55, 1240, 8.50, 516.67, 508.17, 68000, 12),
    
    ('11111111-1111-1111-1111-111111111111', 'monthly',
     DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'),
     DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day',
     1250, 62, 95.04, 5000, 35.00, 2083.33, 2048.33, 275000, 25);

-- ============================================================================
-- PRODUCTOS DE EJEMPLO
-- ============================================================================
INSERT INTO products (id, slug, name, short_description, category_id, product_type, price, status, is_featured, features)
VALUES
    ('prod-11111111-1111-1111-1111-111111111111',
     'invoice-extractor-pro',
     'Invoice Extractor Pro',
     'Extracción automática de datos de facturas con IA',
     (SELECT id FROM product_categories WHERE slug = 'extractors'),
     'software', 49.00, 'published', TRUE,
     '["Extracción de 50+ campos", "Soporte multi-idioma", "API incluida", "Actualizaciones por 1 año"]'::jsonb),
    
    ('prod-22222222-2222-2222-2222-222222222222',
     'contract-analyzer',
     'Contract Analyzer',
     'Análisis inteligente de contratos legales',
     (SELECT id FROM product_categories WHERE slug = 'extractors'),
     'software', 99.00, 'published', FALSE,
     '["Análisis de cláusulas", "Detección de riesgos", "Resumen ejecutivo"]'::jsonb),
    
    ('prod-33333333-3333-3333-3333-333333333333',
     'data-template-pack',
     'Data Template Pack',
     'Pack de 50 templates de extracción',
     (SELECT id FROM product_categories WHERE slug = 'templates'),
     'template', 29.00, 'published', FALSE,
     '["50 templates listos", "Documentación incluida", "Soporte por email"]'::jsonb);

-- ============================================================================
-- RELEASES DE PRODUCTOS
-- ============================================================================
INSERT INTO product_releases (product_id, version, version_major, version_minor, version_patch, status, release_notes)
VALUES
    ('prod-11111111-1111-1111-1111-111111111111', '1.0.0', 1, 0, 0, 'stable', 'Versión inicial'),
    ('prod-11111111-1111-1111-1111-111111111111', '1.1.0', 1, 1, 0, 'stable', 'Mejoras de rendimiento'),
    ('prod-22222222-2222-2222-2222-222222222222', '1.0.0', 1, 0, 0, 'stable', 'Versión inicial'),
    ('prod-33333333-3333-3333-3333-333333333333', '1.0.0', 1, 0, 0, 'stable', 'Pack inicial');

-- ============================================================================
-- ÓRDENES DE EJEMPLO
-- ============================================================================
INSERT INTO orders (id, organization_id, user_id, order_number, status, subtotal, total, currency, paid_at, completed_at)
VALUES
    ('order-11111111-1111-1111-1111-111111111111',
     '11111111-1111-1111-1111-111111111111',
     'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
     'ORD-2026-000001', 'completed', 49.00, 49.00, 'USD',
     NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    
    ('order-22222222-2222-2222-2222-222222222222',
     '22222222-2222-2222-2222-222222222222',
     'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
     'ORD-2026-000002', 'completed', 29.00, 29.00, 'USD',
     NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- ============================================================================
-- ITEMS DE ÓRDENES
-- ============================================================================
INSERT INTO order_items (order_id, product_id, item_type, name, quantity, unit_price, total_price)
VALUES
    ('order-11111111-1111-1111-1111-111111111111',
     'prod-11111111-1111-1111-1111-111111111111',
     'product', 'Invoice Extractor Pro', 1, 49.00, 49.00),
    
    ('order-22222222-2222-2222-2222-222222222222',
     'prod-33333333-3333-3333-3333-333333333333',
     'product', 'Data Template Pack', 1, 29.00, 29.00);

-- ============================================================================
-- ASSETS DE CLIENTES
-- ============================================================================
INSERT INTO customer_assets (user_id, organization_id, product_id, license_id, order_id, current_version, is_active)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
     '11111111-1111-1111-1111-111111111111',
     'prod-11111111-1111-1111-1111-111111111111',
     'lic-11111111-1111-1111-1111-111111111111',
     'order-11111111-1111-1111-1111-111111111111',
     '1.1.0', TRUE),
    
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
     '22222222-2222-2222-2222-222222222222',
     'prod-33333333-3333-3333-3333-333333333333',
     'lic-22222222-2222-2222-2222-222222222222',
     'order-22222222-2222-2222-2222-222222222222',
     '1.0.0', TRUE);

-- ============================================================================
-- FACTURAS
-- ============================================================================
INSERT INTO invoices (organization_id, order_id, license_id, invoice_number, status, subtotal, total, currency, billing_name, billing_email, paid_at)
VALUES
    ('11111111-1111-1111-1111-111111111111',
     'order-11111111-1111-1111-1111-111111111111',
     'lic-11111111-1111-1111-1111-111111111111',
     'INV-2026-000001', 'paid', 49.00, 49.00, 'USD',
     'CELAEST Demo Corp', 'billing@celaest-demo.com',
     NOW() - INTERVAL '15 days'),
    
    ('22222222-2222-2222-2222-222222222222',
     'order-22222222-2222-2222-2222-222222222222',
     'lic-22222222-2222-2222-2222-222222222222',
     'INV-2026-000002', 'paid', 29.00, 29.00, 'USD',
     'Startup Tech MX', 'billing@startuptech.mx',
     NOW() - INTERVAL '10 days');

-- ============================================================================
-- SESIONES DE USUARIO
-- ============================================================================
INSERT INTO user_sessions (user_id, session_token, ip_address, device_type, browser, os, is_active, expires_at)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     'sess_admin_' || encode(gen_random_bytes(16), 'hex'),
     '192.168.1.100', 'desktop', 'Chrome', 'Windows', TRUE,
     NOW() + INTERVAL '7 days'),
    
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
     'sess_manager_' || encode(gen_random_bytes(16), 'hex'),
     '192.168.1.101', 'desktop', 'Firefox', 'macOS', TRUE,
     NOW() + INTERVAL '7 days');

-- ============================================================================
-- API KEYS DE USUARIO
-- ============================================================================
INSERT INTO user_api_keys (user_id, organization_id, name, key_hash, key_prefix, scopes, rate_limit_rpm, is_active)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     '11111111-1111-1111-1111-111111111111',
     'API Key Principal',
     encode(sha256('sk_live_demo_key_1'::bytea), 'hex'),
     'sk_live_',
     '["read", "write", "admin"]'::jsonb, 100, TRUE),
    
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
     '11111111-1111-1111-1111-111111111111',
     'API Key Desarrollo',
     encode(sha256('sk_test_demo_key_2'::bytea), 'hex'),
     'sk_test_',
     '["read", "write"]'::jsonb, 60, TRUE);

-- ============================================================================
-- LOGS DE AUDITORÍA
-- ============================================================================
INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, description, success)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     '11111111-1111-1111-1111-111111111111',
     'login', 'session', NULL, 'Login exitoso desde dashboard', TRUE),
    
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     '11111111-1111-1111-1111-111111111111',
     'create', 'user', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
     'Nuevo usuario creado: Ana Martínez', TRUE),
    
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
     '11111111-1111-1111-1111-111111111111',
     'update', 'license', 'lic-11111111-1111-1111-1111-111111111111',
     'Licencia renovada', TRUE);

-- ============================================================================
-- EVENTOS DE TELEMETRÍA
-- ============================================================================
INSERT INTO telemetry_events (organization_id, user_id, session_id, event_type, event_category, event_name, properties, page_url, device_type, browser, os)
VALUES
    ('11111111-1111-1111-1111-111111111111',
     'cccccccc-cccc-cccc-cccc-cccccccccccc',
     'sess_abc123', 'page_view', 'navigation', 'Dashboard Viewed',
     '{"dashboard_type": "overview"}'::jsonb, '/dashboard', 'desktop', 'Chrome', 'Windows'),
    
    ('11111111-1111-1111-1111-111111111111',
     'cccccccc-cccc-cccc-cccc-cccccccccccc',
     'sess_abc123', 'feature_used', 'ai', 'Data Extraction Started',
     '{"input_type": "chat"}'::jsonb, '/tasks/new', 'desktop', 'Chrome', 'Windows');

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
DO $$
DECLARE
    v_orgs INTEGER;
    v_users INTEGER;
    v_licenses INTEGER;
    v_tasks INTEGER;
    v_products INTEGER;
    v_orders INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_orgs FROM organizations;
    SELECT COUNT(*) INTO v_users FROM users_profile;
    SELECT COUNT(*) INTO v_licenses FROM licenses;
    SELECT COUNT(*) INTO v_tasks FROM processed_tasks;
    SELECT COUNT(*) INTO v_products FROM products;
    SELECT COUNT(*) INTO v_orders FROM orders;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE 'CELAEST DASHBOARD - SEED DATA CARGADA';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Organizaciones: %', v_orgs;
    RAISE NOTICE 'Usuarios: %', v_users;
    RAISE NOTICE 'Licencias: %', v_licenses;
    RAISE NOTICE 'Tareas: %', v_tasks;
    RAISE NOTICE 'Productos: %', v_products;
    RAISE NOTICE 'Órdenes: %', v_orders;
    RAISE NOTICE '============================================';
END $$;
