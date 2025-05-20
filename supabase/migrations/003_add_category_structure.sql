-- Enable the ltree extension for hierarchical data
CREATE EXTENSION IF NOT EXISTS ltree;

-- Create the categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id UUID REFERENCES categories(id),
    level INTEGER NOT NULL,
    path LTREE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_level CHECK (level > 0 AND level <= 3)
);

-- Add indexes
CREATE INDEX category_path_idx ON categories USING GIST (path);
CREATE INDEX category_parent_idx ON categories(parent_id);
CREATE INDEX category_level_idx ON categories(level);

-- Add trigger to update path when parent changes
CREATE OR REPLACE FUNCTION update_category_path() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR NEW.parent_id IS DISTINCT FROM OLD.parent_id THEN
        IF NEW.parent_id IS NULL THEN
            NEW.path = NEW.slug::ltree;
            NEW.level = 1;
        ELSE
            SELECT path || NEW.slug::text::ltree, level + 1
            INTO NEW.path, NEW.level
            FROM categories
            WHERE id = NEW.parent_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER category_path_trigger
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_category_path();

-- Add updated_at trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp(); 