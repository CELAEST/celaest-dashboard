-- V002: Add organization_id to products for multi-tenant support
-- This migration adds organization ownership to products and soft delete support

-- Add organization_id to products (nullable for existing products)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add is_public flag (for marketplace visibility)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Add deleted_at for soft deletes
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Rename price to base_price for consistency with code
ALTER TABLE products 
RENAME COLUMN price TO base_price;

-- Create index for organization queries
CREATE INDEX IF NOT EXISTS idx_products_organization_id ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_is_public ON products(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Update existing products to belong to the first organization (if any exist)
UPDATE products 
SET organization_id = (SELECT id FROM organizations ORDER BY created_at LIMIT 1)
WHERE organization_id IS NULL;

-- Add NOT NULL constraint after updating existing records
-- ALTER TABLE products ALTER COLUMN organization_id SET NOT NULL;

-- Add rating_avg column (code uses this name)
ALTER TABLE products 
RENAME COLUMN rating_average TO rating_avg;

COMMENT ON COLUMN products.organization_id IS 'Organization that owns this product';
COMMENT ON COLUMN products.is_public IS 'Whether product is visible in public marketplace';
COMMENT ON COLUMN products.deleted_at IS 'Soft delete timestamp';
