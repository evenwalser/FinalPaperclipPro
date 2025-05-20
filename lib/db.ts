import { supabase } from '@/lib/supabase'

export const db = {
  query: async (text: string, params?: any[]) => {
    const { data, error } = await supabase.rpc('query', { query_text: text, query_params: params })
    if (error) throw error
    return data
  }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('path')

  if (error) throw error
  return data
}

export async function getCategoryStats(categoryPath: string) {
  try {
    // Get items in category and subcategories
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select(`
        *,
        sales (
          id,
          sale_price,
          sale_date,
          status,
          refund_date
        )
      `)
      .or(`category.ilike.${categoryPath}%,subcategory1.ilike.${categoryPath}%,subcategory2.ilike.${categoryPath}%`)

    if (itemsError) {
      console.error('Items query error:', itemsError)
      throw itemsError
    }

    // Calculate stats from completed sales only
    const completedSales = items?.flatMap(item => 
      item.sales?.filter((sale: any) => sale.status === 'completed') || []
    ) || []

    const totalRevenue = completedSales.reduce((sum, sale) => 
      sum + Number(sale.sale_price || 0), 0)

    const returnedSales = items?.flatMap(item => 
      item.sales?.filter((sale: any) => sale.status === 'refunded') || []
    ) || []

    const returnRate = completedSales.length > 0
      ? (returnedSales.length / completedSales.length) * 100
      : 0

    const salesVelocity = completedSales.length > 0
      ? completedSales.length / 30 // average sales per day over 30 days
      : 0

    return {
      revenue: {
        total: totalRevenue,
        change: 0
      },
      itemCount: {
        total: items?.length || 0,
        added: items?.filter(item => 
          new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0
      },
      salesVelocity: {
        days: salesVelocity,
        change: 0
      },
      returnRate: {
        percentage: returnRate,
        change: 0
      }
    }
  } catch (error) {
    console.error('Error getting category stats:', error)
    throw error
  }
}

export async function getTopSellingItems(categoryPath: string) {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      sales (
        sale_price,
        sale_date,
        status
      )
    `)
    .or(`category.ilike.${categoryPath}%,subcategory1.ilike.${categoryPath}%,subcategory2.ilike.${categoryPath}%`)
    .eq('sales.status', 'completed')
    .order('sales.sale_price', { ascending: false })
    .limit(5)

  if (error) throw error
  return data
} 