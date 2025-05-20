CREATE OR REPLACE FUNCTION get_top_selling_items(
  category_id UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  sort_by TEXT DEFAULT 'value'
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  sales_count BIGINT,
  revenue NUMERIC,
  average_price NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    COUNT(*) as sales_count,
    SUM(t.total_amount) as revenue,
    AVG(t.total_amount) as average_price
  FROM items i
  JOIN transactions t ON t.item_id = i.id
  WHERE 
    i.category_path ~ (SELECT path FROM categories WHERE id = category_id)
    AND t.created_at BETWEEN start_date AND end_date
    AND t.status = 'completed'
  GROUP BY i.id, i.title
  ORDER BY 
    CASE 
      WHEN sort_by = 'value' THEN SUM(t.total_amount)
      ELSE COUNT(*)
    END DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql; 