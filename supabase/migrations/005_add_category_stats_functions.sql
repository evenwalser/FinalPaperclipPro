-- Function to calculate category stats
CREATE OR REPLACE FUNCTION get_category_stats(
  category_id UUID,
  date_from TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  date_to TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH category_sales AS (
    SELECT 
      i.id,
      t.created_at as sale_date,
      t.total_amount,
      EXTRACT(EPOCH FROM (t.created_at - i.created_at))/86400 as days_to_sell,
      t.is_return
    FROM items i
    JOIN transactions t ON t.item_id = i.id
    WHERE i.category_path ~ (SELECT path FROM categories WHERE id = category_id)
    AND t.created_at BETWEEN date_from AND date_to
  ),
  previous_period AS (
    SELECT COUNT(*) as sales, SUM(total_amount) as revenue
    FROM category_sales
    WHERE sale_date BETWEEN date_from - (date_to - date_from) AND date_from
  ),
  current_period AS (
    SELECT COUNT(*) as sales, SUM(total_amount) as revenue
    FROM category_sales
    WHERE sale_date BETWEEN date_from AND date_to
  )
  SELECT json_build_object(
    'revenue', json_build_object(
      'total', COALESCE((SELECT revenue FROM current_period), 0),
      'percentageChange', CASE 
        WHEN (SELECT revenue FROM previous_period) = 0 THEN 0
        ELSE ((SELECT revenue FROM current_period) - (SELECT revenue FROM previous_period)) / (SELECT revenue FROM previous_period) * 100
      END
    ),
    'items', json_build_object(
      'total', (SELECT COUNT(*) FROM items WHERE category_path ~ (SELECT path FROM categories WHERE id = category_id)),
      'newThisWeek', (
        SELECT COUNT(*) 
        FROM items 
        WHERE category_path ~ (SELECT path FROM categories WHERE id = category_id)
        AND created_at >= NOW() - INTERVAL '7 days'
      )
    ),
    'salesVelocity', json_build_object(
      'averageDays', COALESCE((SELECT AVG(days_to_sell) FROM category_sales), 0),
      'description', 'Average time to sell'
    ),
    'returnRate', json_build_object(
      'percentage', COALESCE((
        SELECT COUNT(*) FILTER (WHERE is_return) * 100.0 / NULLIF(COUNT(*), 0)
        FROM category_sales
      ), 0),
      'change', COALESCE((
        SELECT (
          (COUNT(*) FILTER (WHERE is_return AND sale_date >= date_from) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE sale_date >= date_from), 0)) -
          (COUNT(*) FILTER (WHERE is_return AND sale_date < date_from) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE sale_date < date_from), 0))
        )
        FROM category_sales
      ), 0)
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 