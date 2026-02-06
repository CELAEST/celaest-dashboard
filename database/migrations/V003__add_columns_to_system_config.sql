-- V003: Add missing columns to system_config for Settings handler
-- Adding category and is_public columns

-- Add category column
ALTER TABLE system_config 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';

-- Add is_public column
ALTER TABLE system_config 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Add created_at column (missing in original schema)
ALTER TABLE system_config 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for category queries
CREATE INDEX IF NOT EXISTS idx_system_config_category ON system_config(category);

-- Update existing records
UPDATE system_config SET category = 'general' WHERE category IS NULL;

COMMENT ON COLUMN system_config.category IS 'Category grouping for settings';
COMMENT ON COLUMN system_config.is_public IS 'Whether this setting is publicly accessible';
