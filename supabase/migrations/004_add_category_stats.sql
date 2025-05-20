-- Add category statistics table
CREATE TABLE category_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    date DATE NOT NULL,
    total_items INTEGER,
    active_items INTEGER,
    sold_items INTEGER,
    average_price NUMERIC(10,2),
    average_days_to_sell NUMERIC(10,2),
    return_rate NUMERIC(5,2),
    revenue_last_month NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, date)
);

-- Add category performance table
CREATE TABLE category_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    date TIMESTAMPTZ NOT NULL,
    metrics JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX category_stats_date_idx ON category_stats(date);
CREATE INDEX category_performance_date_idx ON category_performance(date);

-- Add function to update category stats
CREATE OR REPLACE FUNCTION update_category_stats()
RETURNS trigger AS $$
BEGIN
    -- Implementation of stats update logic
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stats updates
CREATE TRIGGER category_stats_update
    AFTER INSERT OR UPDATE OR DELETE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_category_stats(); 