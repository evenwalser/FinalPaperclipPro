// lib/services/recentSales.ts
import { createClient } from "@/utils/supabase/client";
import { DateRange } from "react-day-picker";


export interface Customer {
    email: string;
    name: string;
  }
  
export interface RecentSale {
  id: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  customer_name: string | null;
  customers?: Customer; 
}

export async function getRecentSales(dateRange?: DateRange, storeId?: number): Promise<RecentSale[]> {
  const supabase = createClient();
  try {
    const query = supabase
      .from('sales')
      .select('*, customers(name, email)') 
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(5);

    // if (dateRange?.from) {
    //   query.gte('created_at', dateRange.from.toISOString());
    // }
    // if (dateRange?.to) {
    //   query.lte('created_at', dateRange.to.toISOString());
    // }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    return [];
  }
}