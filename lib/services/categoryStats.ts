import { DateRange } from 'react-day-picker';
import { supabase } from '../supabase'

export interface CategoryStats {
  revenue: {
    total: number;
    percentageChange: number;
  };
  items: {
    total: number;
    newThisWeek: number;
  };
  salesVelocity: {
    averageDays: number;
    description: string;
  };
  returnRate: {
    percentage: number;
    change: number;
  };
}

export async function getCategoryStats(categoryId?: string, dateRange?: DateRange): Promise<CategoryStats> {
  if (!categoryId) {
    // Return overall stats if no category selected
    const { data: stats, error } = await supabase
      .rpc('get_overall_stats', {
        date_from: dateRange?.from?.toISOString(),
        date_to: dateRange?.to?.toISOString()
      });

    if (error) throw error;
    return stats;
  }

  // Get category-specific stats
  const { data: stats, error } = await supabase
    .rpc('get_category_stats', {
      category_id: categoryId,
      date_from: dateRange?.from?.toISOString(),
      date_to: dateRange?.to?.toISOString()
    });

  if (error) throw error;
  return stats;
}

// Helper functions for calculations... 