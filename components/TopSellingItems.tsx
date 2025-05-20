'use client'

import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface TopSellingItem {
  id: string;
  title: string;
  salesCount: number;
  revenue: number;
  averagePrice: number;
}

interface TopSellingItemsProps {
  categoryId?: string;
  dateRange?: DateRange;
}

type SortBy = 'value' | 'volume';

export function TopSellingItems({ categoryId, dateRange }: TopSellingItemsProps) {
  const [items, setItems] = useState<TopSellingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('value')

  useEffect(() => {
    async function fetchTopSellers() {
      try {
        const { data, error } = await supabase
          .rpc('get_top_selling_items', {
            category_id: categoryId,
            start_date: dateRange?.from?.toISOString(),
            end_date: dateRange?.to?.toISOString(),
            sort_by: sortBy
          })

        if (error) throw error;
        setItems(data)
      } catch (error) {
        console.error('Failed to fetch top sellers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopSellers()
  }, [categoryId, dateRange, sortBy])

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant={sortBy === 'value' ? 'default' : 'outline'}
          onClick={() => setSortBy('value')}
          size="sm"
        >
          By Value
        </Button>
        <Button
          variant={sortBy === 'volume' ? 'default' : 'outline'}
          onClick={() => setSortBy('volume')}
          size="sm"
        >
          By Volume
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      {item.salesCount} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">£{item.revenue}</p>
                    <p className="text-sm text-gray-500">
                      avg. £{item.averagePrice}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 