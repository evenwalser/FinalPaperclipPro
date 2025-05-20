-- Add ltree extension if not exists
CREATE EXTENSION IF NOT EXISTS ltree;

-- Add categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id UUID REFERENCES categories(id),
    level INTEGER NOT NULL,
    path LTREE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add category_path to items if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'items' 
        AND column_name = 'category_path'
    ) THEN
        ALTER TABLE items ADD COLUMN category_path LTREE;
    END IF;
END $$;

-- Add indexes if not exist
CREATE INDEX IF NOT EXISTS category_path_idx ON categories USING GIST (path);
CREATE INDEX IF NOT EXISTS category_parent_idx ON categories(parent_id);
CREATE INDEX IF NOT EXISTS category_level_idx ON categories(level);
CREATE INDEX IF NOT EXISTS item_category_idx ON items USING GIST (category_path); 