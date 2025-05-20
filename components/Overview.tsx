"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  ResponsiveContainer,
} from "recharts"
import { DateRange } from 'react-day-picker'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { subMonths } from 'date-fns'

interface OverviewProps {
  currency: string;
  categoryId?: string;
  dateRange?: DateRange;
  storeId?: number
}

interface MonthlySales {
  month: number;
  month_name: string;
  total_sales: number;
  year: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function Overview({ currency, categoryId, storeId, dateRange }: OverviewProps) {
  const [data, setData] = useState<MonthlySales[]>([])
  const [comparisonData, setComparisonData] = useState<MonthlySales[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMonthlySales() {
      try {
        setError(null);
        setLoading(true);
        
        const currentYear = dateRange?.from?.getFullYear() || new Date().getFullYear();
       if(storeId) {
        const { data: sales, error: apiError } = await supabase
        .rpc('get_monthly_sales', {
          store_id_param: storeId,
          year_param: currentYear
        });

      if (apiError) throw apiError;
      setData(sales || []);
       }
      } catch (err) {
        console.error('Failed to fetch monthly sales:', err);
        setError('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlySales();
  }, [categoryId, dateRange,storeId]);

  useEffect(() => {
    if (showComparison) {
      fetchComparisonData()
    }
  }, [showComparison, categoryId, dateRange])

  const fetchComparisonData = async () => {
    if (!dateRange?.from) return;
    
    const previousYear = (dateRange.from.getFullYear() - 1);
    
    try {
      const { data: sales, error } = await supabase.rpc('get_monthly_sales', {
        store_id_param: 105,
        year_param: previousYear
      });
      
      if (error) throw error;
      setComparisonData(sales || []);
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
    }
  }

  if (error) {
    return (
      <div className="h-[350px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center space-y-4">
        <div className="w-full space-y-4">
          <div className="h-8 bg-gray-800/50 animate-pulse rounded" />
          <div className="h-[300px] bg-gray-800/50 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Show'} Year-over-Year
        </Button>
      </div> */}

      <div className="h-[350px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <XAxis dataKey="month_name" />
            <YAxis />
            <Tooltip content={(props) => <CustomTooltip {...props} currency={currency} />} />
            <Legend />
            <Bar
              dataKey="total_sales"
              fill="#adfa1d"
              name="Revenue"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            {showComparison && comparisonData.length > 0 && (
              <Line
                type="monotone"
                dataKey="total_sales"
                data={comparisonData}
                stroke="#888888"
                name="Previous Year"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label, currency }: TooltipProps & { currency: string }) {
  if (!active || !payload?.length) return null
  
  return (
    <Card className="p-3 bg-background border shadow-lg">
      <p className="font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}:</span>
          <span className="font-medium">
            {currency}{entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </Card>
  )
}

