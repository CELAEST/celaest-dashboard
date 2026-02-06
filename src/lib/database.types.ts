/**
 * Database types for CELAEST
 * 
 * Este archivo contiene los tipos TypeScript que corresponden
 * al schema de PostgreSQL local.
 * 
 * ARQUITECTURA HÍBRIDA:
 * - Supabase Cloud: Auth, Storage, Realtime
 * - PostgreSQL Local: Datos de negocio, IA-Mesh, Telemetría
 */

// ============================================================================
// TIPOS BASE
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UUID = string
export type Timestamp = string // ISO 8601

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 
  | 'super_admin'   // Acceso total al sistema
  | 'admin'         // Administrador de organización
  | 'manager'       // Gestor de equipos
  | 'operator'      // Usuario operativo
  | 'viewer'        // Solo lectura

export type LicenseStatus = 
  | 'active'        // Licencia activa y funcional
  | 'suspended'     // Suspendida temporalmente
  | 'expired'       // Expiró naturalmente
  | 'cancelled'     // Cancelada por el usuario
  | 'trial'         // Período de prueba

export type AIProvider = 
  | 'gemini'        // Google Gemini
  | 'groq'          // Groq (Llama, Mixtral)
  | 'deepseek'      // DeepSeek
  | 'openai'        // OpenAI (futuro)
  | 'anthropic'     // Anthropic Claude (futuro)
  | 'local'         // Modelos locales (Ollama)

export type TaskStatus = 
  | 'pending'       // En cola
  | 'processing'    // En ejecución
  | 'completed'     // Completada exitosamente
  | 'failed'        // Falló
  | 'cancelled'     // Cancelada por el usuario
  | 'retrying'      // Reintentando

export type AuditAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'api_call'

export type BillingCycle = 
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'lifetime'
  | 'usage_based'

// ============================================================================
// MÓDULO: IDENTIDAD Y ORGANIZACIONES
// ============================================================================

/**
 * Configuraciones de organización
 */
export interface OrganizationSettings {
  timezone?: string
  locale?: string
  branding?: {
    primary_color?: string
    logo_url?: string
    company_name?: string
  }
  feature_flags?: string[]
}

/**
 * Organización - Entidad empresarial (Multi-tenant)
 */
export interface Organization {
  id: UUID
  name: string
  slug: string
  email: string | null
  phone: string | null
  website: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country_code: string | null
  tax_id: string | null
  settings: OrganizationSettings
  metadata: Json
  max_users: number
  max_api_calls_per_month: number
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp | null
}

export type OrganizationInsert = Omit<Organization, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type OrganizationUpdate = Partial<OrganizationInsert>

/**
 * Preferencias de usuario
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  sidebar_collapsed?: boolean
  default_dashboard?: string
  notifications?: {
    email?: boolean
    push?: boolean
    digest?: 'daily' | 'weekly' | 'never'
  }
}

/**
 * Perfil de usuario extendido
 */
export interface UserProfile {
  id: UUID  // Viene de Supabase Auth
  organization_id: UUID | null
  email: string
  first_name: string | null
  last_name: string | null
  display_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  scopes: string[]
  timezone: string
  locale: string
  preferences: UserPreferences
  onboarding_completed: boolean
  onboarding_step: number
  last_login_at: Timestamp | null
  login_count: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp | null
}

export type UserProfileInsert = Omit<UserProfile, 'created_at' | 'updated_at'> & {
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type UserProfileUpdate = Partial<Omit<UserProfileInsert, 'id'>>

// ============================================================================
// MÓDULO: LICENCIAS Y SUSCRIPCIONES
// ============================================================================

/**
 * Límites de un plan o licencia
 */
export interface PlanLimits {
  max_users: number           // -1 = ilimitado
  max_ai_requests_per_month: number
  max_storage_gb: number
  max_concurrent_tasks: number
  max_batch_size?: number
  features?: string[]
}

/**
 * Plan de suscripción
 */
export interface SubscriptionPlan {
  id: UUID
  code: string
  name: string
  description: string | null
  price_monthly: number | null
  price_yearly: number | null
  currency: string
  limits: PlanLimits
  features: string[]
  is_active: boolean
  is_public: boolean
  sort_order: number
  created_at: Timestamp
  updated_at: Timestamp
}

/**
 * Licencia activa
 */
export interface License {
  id: UUID
  organization_id: UUID
  plan_id: UUID
  license_key: string
  license_key_hash: string | null
  status: LicenseStatus
  starts_at: Timestamp
  expires_at: Timestamp | null
  trial_ends_at: Timestamp | null
  billing_cycle: BillingCycle
  next_billing_date: string | null
  custom_limits: PlanLimits | null
  current_period_start: Timestamp | null
  current_period_end: Timestamp | null
  ai_requests_used: number
  storage_used_bytes: number
  notes: string | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
  suspended_at: Timestamp | null
  cancelled_at: Timestamp | null
}

export type LicenseInsert = Omit<License, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type LicenseUpdate = Partial<Omit<LicenseInsert, 'organization_id' | 'plan_id'>>

/**
 * Log de uso de licencia por período
 */
export interface LicenseUsageLog {
  id: UUID
  license_id: UUID
  period_start: string
  period_end: string
  ai_requests_count: number
  tokens_input: number
  tokens_output: number
  storage_peak_bytes: number
  active_users_count: number
  calculated_cost: number | null
  created_at: Timestamp
}

// ============================================================================
// MÓDULO: IA-MESH (CEREBRO)
// ============================================================================

/**
 * Capacidades de un modelo de IA
 */
export interface AIModelCapabilities {
  text_generation: boolean
  code_generation: boolean
  vision: boolean
  function_calling: boolean
  streaming: boolean
  json_mode?: boolean
}

/**
 * Modelo de IA disponible
 */
export interface AIModel {
  id: UUID
  provider: AIProvider
  model_id: string
  display_name: string
  capabilities: AIModelCapabilities
  max_tokens_input: number | null
  max_tokens_output: number | null
  context_window: number | null
  cost_per_1k_input: number | null
  cost_per_1k_output: number | null
  is_active: boolean
  is_default: boolean
  priority: number
  notes: string | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

/**
 * API Key en el pool
 */
export interface AIApiKey {
  id: UUID
  provider: AIProvider
  key_name: string
  key_hint: string | null
  is_active: boolean
  is_healthy: boolean
  last_health_check: Timestamp | null
  consecutive_failures: number
  rate_limit_rpm: number | null
  rate_limit_tpm: number | null
  rate_limit_rpd: number | null
  usage_count: number
  tokens_used: number
  last_used_at: Timestamp | null
  priority: number
  weight: number
  notes: string | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
  expires_at: Timestamp | null
}

// No exponer key_value_encrypted en tipos de frontend

/**
 * Prompt del sistema
 */
export interface PromptMaster {
  id: UUID
  slug: string
  name: string
  description: string | null
  category: string
  subcategory: string | null
  system_prompt: string
  user_prompt_template: string | null
  variables: string[]
  preferred_model_id: UUID | null
  temperature: number
  max_tokens: number
  top_p: number
  version: number
  is_active: boolean
  is_default: boolean
  parent_id: UUID | null
  usage_count: number
  avg_response_time_ms: number | null
  success_rate: number | null
  tags: string[] | null
  notes: string | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type PromptMasterInsert = Omit<PromptMaster, 'id' | 'created_at' | 'updated_at' | 'usage_count'> & {
  id?: UUID
  created_at?: Timestamp
  updated_at?: Timestamp
  usage_count?: number
}

export type PromptMasterUpdate = Partial<Omit<PromptMasterInsert, 'slug'>>

// ============================================================================
// MÓDULO: OPERACIONES
// ============================================================================

/**
 * Lote de tareas
 */
export interface TaskBatch {
  id: UUID
  organization_id: UUID
  user_id: UUID
  name: string | null
  description: string | null
  status: TaskStatus
  total_tasks: number
  completed_tasks: number
  failed_tasks: number
  progress_percentage: number
  config: Json
  started_at: Timestamp | null
  completed_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
}

/**
 * Tarea procesada
 */
export interface ProcessedTask {
  id: UUID
  organization_id: UUID
  user_id: UUID
  license_id: UUID | null
  batch_id: UUID | null
  model_id: UUID | null
  api_key_id: UUID | null
  prompt_id: UUID | null
  input_type: string | null
  input_text: string | null
  input_metadata: Json
  output_json: Json | null
  output_raw: string | null
  output_confidence: number | null
  status: TaskStatus
  error_message: string | null
  error_code: string | null
  retry_count: number
  tokens_input: number
  tokens_output: number
  tokens_total: number  // Generated
  cost_usd: number
  execution_time_ms: number | null
  queue_time_ms: number | null
  ai_time_ms: number | null
  request_id: string | null
  user_agent: string | null
  ip_address: string | null
  metadata: Json
  created_at: Timestamp
  started_at: Timestamp | null
  completed_at: Timestamp | null
}

export type ProcessedTaskInsert = Omit<ProcessedTask, 'id' | 'tokens_total' | 'created_at'> & {
  id?: UUID
  created_at?: Timestamp
}

// ============================================================================
// MÓDULO: ANALYTICS
// ============================================================================

/**
 * Métricas de ROI agregadas
 */
export interface ROIMetrics {
  id: UUID
  organization_id: UUID
  period_type: 'daily' | 'weekly' | 'monthly'
  period_start: string
  period_end: string
  tasks_completed: number
  tasks_failed: number
  success_rate: number | null
  time_saved_minutes: number
  manual_equivalent_minutes: number
  cost_ai: number
  cost_manual_equivalent: number
  money_saved: number
  total_tokens: number
  avg_tokens_per_task: number | null
  avg_execution_time_ms: number | null
  p95_execution_time_ms: number | null
  p99_execution_time_ms: number | null
  active_users_count: number
  new_users_count: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

// ============================================================================
// MÓDULO: AUDITORÍA
// ============================================================================

/**
 * Log de auditoría
 */
export interface AuditLog {
  id: UUID
  user_id: UUID | null
  organization_id: UUID | null
  action: AuditAction
  resource_type: string
  resource_id: UUID | null
  description: string | null
  changes: {
    before?: Json
    after?: Json
  } | null
  request_id: string | null
  ip_address: string | null
  user_agent: string | null
  success: boolean
  error_message: string | null
  created_at: Timestamp
}

/**
 * Evento de telemetría
 */
export interface TelemetryEvent {
  id: UUID
  organization_id: UUID | null
  user_id: UUID | null
  session_id: string | null
  event_type: string
  event_category: string | null
  event_name: string
  properties: Json
  page_url: string | null
  referrer: string | null
  ip_address: string | null
  user_agent: string | null
  device_type: 'desktop' | 'mobile' | 'tablet' | null
  browser: string | null
  os: string | null
  created_at: Timestamp
}

// ============================================================================
// MÓDULO: SISTEMA
// ============================================================================

/**
 * Configuración del sistema
 */
export interface SystemConfig {
  key: string
  value: Json
  description: string | null
  is_sensitive: boolean
  updated_at: Timestamp
  updated_by: UUID | null
}

/**
 * Feature flag
 */
export interface FeatureFlag {
  id: UUID
  flag_key: string
  name: string
  description: string | null
  is_enabled: boolean
  target_type: 'all' | 'percentage' | 'users' | 'orgs'
  target_percentage: number | null
  target_users: UUID[] | null
  target_organizations: UUID[] | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

// ============================================================================
// ENUMS V002 - MÓDULOS EXTENDIDOS
// ============================================================================

export type ProductStatus = 
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'archived'

export type ReleaseStatus = 
  | 'draft'
  | 'beta'
  | 'stable'
  | 'deprecated'

export type AssetStatus = 
  | 'active'
  | 'revoked'
  | 'transferred'

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type InvoiceStatus = 
  | 'draft'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export type PaymentMethodType = 
  | 'card'
  | 'bank_transfer'
  | 'paypal'
  | 'crypto'
  | 'other'

export type CardBrand = 
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'other'

export type GatewayStatus = 
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'deprecated'

export type WebhookStatus = 
  | 'active'
  | 'paused'
  | 'disabled'

export type CollisionSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'

// ============================================================================
// MÓDULO: MARKETPLACE Y PRODUCTOS
// ============================================================================

/**
 * Categoría de producto
 */
export interface ProductCategory {
  id: UUID
  name: string
  slug: string
  description: string | null
  icon: string | null
  parent_id: UUID | null
  sort_order: number
  is_active: boolean
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type ProductCategoryInsert = Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>
export type ProductCategoryUpdate = Partial<ProductCategoryInsert>

/**
 * Producto en el marketplace
 */
export interface Product {
  id: UUID
  category_id: UUID | null
  name: string
  slug: string
  description: string | null
  short_description: string | null
  features: string[]
  price: number
  original_price: number | null
  currency: string
  is_subscription: boolean
  subscription_plan_id: UUID | null
  image_url: string | null
  gallery: string[]
  tags: string[]
  status: ProductStatus
  is_featured: boolean
  is_popular: boolean
  sort_order: number
  avg_rating: number
  review_count: number
  download_count: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp | null
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'avg_rating' | 'review_count' | 'download_count'>
export type ProductUpdate = Partial<ProductInsert>

/**
 * Review de producto
 */
export interface ProductReview {
  id: UUID
  product_id: UUID
  user_id: UUID
  rating: number
  title: string | null
  comment: string | null
  is_verified_purchase: boolean
  is_approved: boolean
  helpful_count: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type ProductReviewInsert = Omit<ProductReview, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>
export type ProductReviewUpdate = Partial<ProductReviewInsert>

// ============================================================================
// MÓDULO: RELEASES Y VERSIONES
// ============================================================================

/**
 * Release de producto
 */
export interface ProductRelease {
  id: UUID
  product_id: UUID
  version: string
  version_major: number
  version_minor: number
  version_patch: number
  status: ReleaseStatus
  release_notes: string | null
  changelog: Json
  download_url: string | null
  file_size_bytes: number | null
  checksum_sha256: string | null
  min_system_requirements: Json
  is_critical: boolean
  released_at: Timestamp | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type ProductReleaseInsert = Omit<ProductRelease, 'id' | 'created_at' | 'updated_at'>
export type ProductReleaseUpdate = Partial<ProductReleaseInsert>

/**
 * Asset de cliente (licencia de producto)
 */
export interface CustomerAsset {
  id: UUID
  user_id: UUID
  organization_id: UUID | null
  product_id: UUID
  license_id: UUID | null
  order_id: UUID | null
  current_version_id: UUID | null
  status: AssetStatus
  acquired_at: Timestamp
  expires_at: Timestamp | null
  last_download_at: Timestamp | null
  download_count: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type CustomerAssetInsert = Omit<CustomerAsset, 'id' | 'created_at' | 'updated_at' | 'download_count'>
export type CustomerAssetUpdate = Partial<CustomerAssetInsert>

/**
 * Log de descarga de asset
 */
export interface AssetDownload {
  id: UUID
  asset_id: UUID
  user_id: UUID
  release_id: UUID
  ip_address: string | null
  user_agent: string | null
  download_started_at: Timestamp
  download_completed_at: Timestamp | null
  file_size_bytes: number | null
  metadata: Json
  created_at: Timestamp
}

export type AssetDownloadInsert = Omit<AssetDownload, 'id' | 'created_at'>

// ============================================================================
// MÓDULO: BILLING EXTENDIDO
// ============================================================================

/**
 * Gateway de pago
 */
export interface PaymentGateway {
  id: UUID
  name: string
  code: string
  provider: string
  status: GatewayStatus
  is_default: boolean
  config: Json
  supported_currencies: string[]
  supported_countries: string[]
  fee_percentage: number
  fee_fixed: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type PaymentGatewayInsert = Omit<PaymentGateway, 'id' | 'created_at' | 'updated_at'>
export type PaymentGatewayUpdate = Partial<PaymentGatewayInsert>

/**
 * Método de pago del usuario
 */
export interface PaymentMethod {
  id: UUID
  user_id: UUID
  type: PaymentMethodType
  provider_payment_method_id: string | null
  card_brand: CardBrand | null
  card_last4: string | null
  card_exp_month: number | null
  card_exp_year: number | null
  billing_address: Json
  is_default: boolean
  is_verified: boolean
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp | null
}

export type PaymentMethodInsert = Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>
export type PaymentMethodUpdate = Partial<PaymentMethodInsert>

/**
 * Orden de compra
 */
export interface Order {
  id: UUID
  order_number: string
  user_id: UUID
  organization_id: UUID | null
  payment_method_id: UUID | null
  gateway_id: UUID | null
  status: OrderStatus
  currency: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  total: number
  coupon_id: UUID | null
  billing_address: Json
  gateway_transaction_id: string | null
  gateway_response: Json
  notes: string | null
  paid_at: Timestamp | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type OrderInsert = Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>
export type OrderUpdate = Partial<OrderInsert>

/**
 * Ítem de orden
 */
export interface OrderItem {
  id: UUID
  order_id: UUID
  product_id: UUID | null
  subscription_plan_id: UUID | null
  license_id: UUID | null
  description: string
  quantity: number
  unit_price: number
  discount_amount: number
  tax_amount: number
  total: number
  metadata: Json
  created_at: Timestamp
}

export type OrderItemInsert = Omit<OrderItem, 'id' | 'created_at'>

/**
 * Factura
 */
export interface Invoice {
  id: UUID
  invoice_number: string
  order_id: UUID | null
  user_id: UUID
  organization_id: UUID | null
  status: InvoiceStatus
  currency: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  total: number
  billing_details: Json
  line_items: Json
  due_date: Timestamp
  paid_at: Timestamp | null
  pdf_url: string | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type InvoiceInsert = Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'>
export type InvoiceUpdate = Partial<InvoiceInsert>

/**
 * Tasa de impuesto
 */
export interface TaxRate {
  id: UUID
  name: string
  code: string
  rate: number
  country_code: string | null
  state_code: string | null
  is_inclusive: boolean
  is_active: boolean
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type TaxRateInsert = Omit<TaxRate, 'id' | 'created_at' | 'updated_at'>
export type TaxRateUpdate = Partial<TaxRateInsert>

/**
 * Cupón de descuento
 */
export interface Coupon {
  id: UUID
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number | null
  max_discount_amount: number | null
  currency: string | null
  valid_from: Timestamp
  valid_until: Timestamp | null
  usage_limit: number | null
  usage_count: number
  is_active: boolean
  applies_to_products: UUID[] | null
  applies_to_plans: UUID[] | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type CouponInsert = Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
export type CouponUpdate = Partial<CouponInsert>

// ============================================================================
// MÓDULO: SETTINGS EXTENDIDO
// ============================================================================

/**
 * Sesión de usuario
 */
export interface UserSession {
  id: UUID
  user_id: UUID
  session_token: string
  ip_address: string | null
  user_agent: string | null
  device_info: Json
  location: Json
  is_active: boolean
  last_activity_at: Timestamp
  expires_at: Timestamp
  created_at: Timestamp
}

export type UserSessionInsert = Omit<UserSession, 'id' | 'created_at'>
export type UserSessionUpdate = Partial<UserSessionInsert>

/**
 * API Key de usuario
 */
export interface UserApiKey {
  id: UUID
  user_id: UUID
  organization_id: UUID | null
  name: string
  key_hash: string
  key_prefix: string
  scopes: string[]
  rate_limit_per_minute: number
  rate_limit_per_day: number
  is_active: boolean
  last_used_at: Timestamp | null
  usage_count: number
  expires_at: Timestamp | null
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type UserApiKeyInsert = Omit<UserApiKey, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
export type UserApiKeyUpdate = Partial<UserApiKeyInsert>

/**
 * Webhook endpoint
 */
export interface Webhook {
  id: UUID
  user_id: UUID
  organization_id: UUID | null
  name: string
  url: string
  secret_hash: string
  events: string[]
  status: WebhookStatus
  retry_count: number
  last_triggered_at: Timestamp | null
  last_success_at: Timestamp | null
  last_failure_at: Timestamp | null
  failure_count: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type WebhookInsert = Omit<Webhook, 'id' | 'created_at' | 'updated_at' | 'failure_count'>
export type WebhookUpdate = Partial<WebhookInsert>

/**
 * Entrega de webhook
 */
export interface WebhookDelivery {
  id: UUID
  webhook_id: UUID
  event_type: string
  payload: Json
  response_status: number | null
  response_body: string | null
  response_time_ms: number | null
  attempt_number: number
  next_retry_at: Timestamp | null
  delivered_at: Timestamp | null
  created_at: Timestamp
}

export type WebhookDeliveryInsert = Omit<WebhookDelivery, 'id' | 'created_at'>

// ============================================================================
// MÓDULO: CONTROL DE IP DE LICENCIAS
// ============================================================================

/**
 * Binding de IP a licencia
 */
export interface LicenseIpBinding {
  id: UUID
  license_id: UUID
  ip_address: string
  machine_id: string | null
  hostname: string | null
  os_info: Json
  is_active: boolean
  first_seen_at: Timestamp
  last_seen_at: Timestamp
  validation_count: number
  metadata: Json
  created_at: Timestamp
  updated_at: Timestamp
}

export type LicenseIpBindingInsert = Omit<LicenseIpBinding, 'id' | 'created_at' | 'updated_at' | 'validation_count'>
export type LicenseIpBindingUpdate = Partial<LicenseIpBindingInsert>

/**
 * Validación de licencia
 */
export interface LicenseValidation {
  id: UUID
  license_id: UUID
  ip_binding_id: UUID | null
  ip_address: string
  machine_id: string | null
  validation_type: string
  is_valid: boolean
  failure_reason: string | null
  request_data: Json
  response_data: Json
  response_time_ms: number | null
  created_at: Timestamp
}

export type LicenseValidationInsert = Omit<LicenseValidation, 'id' | 'created_at'>

/**
 * Colisión de licencia
 */
export interface LicenseCollision {
  id: UUID
  license_id: UUID
  ip_binding_a_id: UUID
  ip_binding_b_id: UUID
  collision_type: string
  severity: CollisionSeverity
  detected_at: Timestamp
  resolved_at: Timestamp | null
  resolution_notes: string | null
  auto_resolved: boolean
  metadata: Json
  created_at: Timestamp
}

export type LicenseCollisionInsert = Omit<LicenseCollision, 'id' | 'created_at'>

// ============================================================================
// VISTAS V002 (READ-ONLY)
// ============================================================================

/**
 * Vista: Productos con estadísticas
 */
export interface ProductWithStatsView {
  id: UUID
  name: string
  slug: string
  category_name: string | null
  price: number
  status: ProductStatus
  is_featured: boolean
  avg_rating: number
  review_count: number
  download_count: number
  total_revenue: number
  active_customers: number
  created_at: Timestamp
}

/**
 * Vista: Licencias con estadísticas de IP
 */
export interface LicenseWithIPStatsView {
  license_id: UUID
  license_key: string
  status: LicenseStatus
  org_name: string
  total_ip_bindings: number
  active_ip_bindings: number
  total_validations: number
  collision_count: number
  last_validation_at: Timestamp | null
}

/**
 * Vista: Dashboard de ventas
 */
export interface SalesDashboardView {
  date: string
  total_orders: number
  completed_orders: number
  total_revenue: number
  avg_order_value: number
  new_customers: number
}

// ============================================================================
// VISTAS (READ-ONLY)
// ============================================================================

/**
 * Vista: Licencias activas con info de organización
 */
export interface ActiveLicenseView {
  license_id: UUID
  license_key: string
  status: LicenseStatus
  expires_at: Timestamp | null
  ai_requests_used: number
  org_id: UUID
  org_name: string
  org_slug: string
  plan_code: string
  plan_name: string
  max_requests: number
  usage_percentage: number
}

/**
 * Vista: Estado del pool de API Keys
 */
export interface APIPoolStatusView {
  provider: AIProvider
  total_keys: number
  healthy_keys: number
  unhealthy_keys: number
  total_usage: number
  total_tokens: number
  last_activity: Timestamp | null
}

/**
 * Vista: Métricas diarias de tareas
 */
export interface DailyTaskMetricsView {
  date: string
  organization_id: UUID
  total_tasks: number
  completed: number
  failed: number
  avg_execution_ms: number
  avg_tokens: number
  total_cost: number
}

// ============================================================================
// TIPOS DE UTILIDAD
// ============================================================================

/**
 * Respuesta paginada genérica
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
  }
}

/**
 * Filtros comunes
 */
export interface CommonFilters {
  search?: string
  from_date?: string
  to_date?: string
  organization_id?: UUID
  user_id?: UUID
  status?: string
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// ============================================================================
// DATABASE SCHEMA TYPE (Compatible con Supabase Client)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization
        Insert: OrganizationInsert
        Update: OrganizationUpdate
      }
      users_profile: {
        Row: UserProfile
        Insert: UserProfileInsert
        Update: UserProfileUpdate
      }
      subscription_plans: {
        Row: SubscriptionPlan
        Insert: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SubscriptionPlan, 'id' | 'code'>>
      }
      licenses: {
        Row: License
        Insert: LicenseInsert
        Update: LicenseUpdate
      }
      license_usage_log: {
        Row: LicenseUsageLog
        Insert: Omit<LicenseUsageLog, 'id' | 'created_at'>
        Update: never // Append-only
      }
      ai_models: {
        Row: AIModel
        Insert: Omit<AIModel, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AIModel, 'id' | 'provider' | 'model_id'>>
      }
      ai_api_pool: {
        Row: AIApiKey
        Insert: Omit<AIApiKey, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AIApiKey, 'id' | 'provider'>>
      }
      prompts_master: {
        Row: PromptMaster
        Insert: PromptMasterInsert
        Update: PromptMasterUpdate
      }
      task_batches: {
        Row: TaskBatch
        Insert: Omit<TaskBatch, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TaskBatch, 'id' | 'organization_id' | 'user_id'>>
      }
      processed_tasks: {
        Row: ProcessedTask
        Insert: ProcessedTaskInsert
        Update: never // Inmutable
      }
      roi_metrics: {
        Row: ROIMetrics
        Insert: Omit<ROIMetrics, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ROIMetrics, 'id' | 'organization_id' | 'period_type' | 'period_start'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: never // Append-only
      }
      telemetry_events: {
        Row: TelemetryEvent
        Insert: Omit<TelemetryEvent, 'id' | 'created_at'>
        Update: never // Append-only
      }
      system_config: {
        Row: SystemConfig
        Insert: SystemConfig
        Update: Partial<Omit<SystemConfig, 'key'>>
      }
      feature_flags: {
        Row: FeatureFlag
        Insert: Omit<FeatureFlag, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FeatureFlag, 'id' | 'flag_key'>>
      }
      // ===== V002: TABLAS EXTENDIDAS =====
      product_categories: {
        Row: ProductCategory
        Insert: ProductCategoryInsert
        Update: ProductCategoryUpdate
      }
      products: {
        Row: Product
        Insert: ProductInsert
        Update: ProductUpdate
      }
      product_reviews: {
        Row: ProductReview
        Insert: ProductReviewInsert
        Update: ProductReviewUpdate
      }
      product_releases: {
        Row: ProductRelease
        Insert: ProductReleaseInsert
        Update: ProductReleaseUpdate
      }
      customer_assets: {
        Row: CustomerAsset
        Insert: CustomerAssetInsert
        Update: CustomerAssetUpdate
      }
      asset_downloads: {
        Row: AssetDownload
        Insert: AssetDownloadInsert
        Update: never // Append-only
      }
      payment_gateways: {
        Row: PaymentGateway
        Insert: PaymentGatewayInsert
        Update: PaymentGatewayUpdate
      }
      payment_methods: {
        Row: PaymentMethod
        Insert: PaymentMethodInsert
        Update: PaymentMethodUpdate
      }
      orders: {
        Row: Order
        Insert: OrderInsert
        Update: OrderUpdate
      }
      order_items: {
        Row: OrderItem
        Insert: OrderItemInsert
        Update: never // Inmutable una vez creado
      }
      invoices: {
        Row: Invoice
        Insert: InvoiceInsert
        Update: InvoiceUpdate
      }
      tax_rates: {
        Row: TaxRate
        Insert: TaxRateInsert
        Update: TaxRateUpdate
      }
      coupons: {
        Row: Coupon
        Insert: CouponInsert
        Update: CouponUpdate
      }
      user_sessions: {
        Row: UserSession
        Insert: UserSessionInsert
        Update: UserSessionUpdate
      }
      user_api_keys: {
        Row: UserApiKey
        Insert: UserApiKeyInsert
        Update: UserApiKeyUpdate
      }
      webhooks: {
        Row: Webhook
        Insert: WebhookInsert
        Update: WebhookUpdate
      }
      webhook_deliveries: {
        Row: WebhookDelivery
        Insert: WebhookDeliveryInsert
        Update: never // Append-only
      }
      license_ip_bindings: {
        Row: LicenseIpBinding
        Insert: LicenseIpBindingInsert
        Update: LicenseIpBindingUpdate
      }
      license_validations: {
        Row: LicenseValidation
        Insert: LicenseValidationInsert
        Update: never // Append-only
      }
      license_collisions: {
        Row: LicenseCollision
        Insert: LicenseCollisionInsert
        Update: Partial<Pick<LicenseCollision, 'resolved_at' | 'resolution_notes'>>
      }
    }
    Views: {
      v_active_licenses: {
        Row: ActiveLicenseView
      }
      v_api_pool_status: {
        Row: APIPoolStatusView
      }
      v_daily_task_metrics: {
        Row: DailyTaskMetricsView
      }
      // V002 Views
      v_products_with_stats: {
        Row: ProductWithStatsView
      }
      v_licenses_with_ip_stats: {
        Row: LicenseWithIPStatsView
      }
      v_sales_dashboard: {
        Row: SalesDashboardView
      }
    }
    Functions: {
      generate_license_key: {
        Args: Record<string, never>
        Returns: string
      }
      increment_api_key_usage: {
        Args: { p_key_id: UUID; p_tokens: number }
        Returns: void
      }
      log_audit: {
        Args: {
          p_user_id: UUID
          p_org_id: UUID
          p_action: AuditAction
          p_resource_type: string
          p_resource_id: UUID
          p_description?: string
          p_changes?: Json
        }
        Returns: UUID
      }
      // V002 Functions
      generate_order_number: {
        Args: Record<string, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<string, never>
        Returns: string
      }
      update_product_rating: {
        Args: { p_product_id: UUID }
        Returns: void
      }
    }
    Enums: {
      user_role: UserRole
      license_status: LicenseStatus
      ai_provider: AIProvider
      task_status: TaskStatus
      audit_action: AuditAction
      billing_cycle: BillingCycle
      // V002 Enums
      product_status: ProductStatus
      release_status: ReleaseStatus
      asset_status: AssetStatus
      order_status: OrderStatus
      invoice_status: InvoiceStatus
      payment_method_type: PaymentMethodType
      card_brand: CardBrand
      gateway_status: GatewayStatus
      webhook_status: WebhookStatus
      collision_severity: CollisionSeverity
    }
  }
}

// ============================================================================
// EXPORTS LEGACY (Compatibilidad hacia atrás)
// ============================================================================

// Mantenemos estos exports para no romper código existente
export type { UserRole as user_role }
