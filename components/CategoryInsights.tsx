'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getCategoryStats } from '@/lib/services/categoryStats'
import { DateRange } from 'react-day-picker'

interface CategoryInsightsProps {
  categoryId: string;
  dateRange?: DateRange;
}

export function CategoryInsights({ categoryId, dateRange }: CategoryInsightsProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (categoryId) {
      setLoading(true)
      getCategoryStats(categoryId)
        .then(setStats)
        .finally(() => setLoading(false))
    }
  }, [categoryId, dateRange])

  if (loading) return <div>Loading insights...</div>
  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Price Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>£0-50</span>
                <span>{stats.priceBrackets['0-50']}%</span>
              </div>
              <Progress value={stats.priceBrackets['0-50']} />
            </div>
            {/* Add more price brackets */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Sales Velocity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Average Days to Sell</span>
              <span className="text-2xl font-bold">{stats.averageDaysToSell}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fastest Sale</span>
              <span className="text-2xl font-bold">{stats.fastestSale} days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Stock Turnover Rate</span>
              <span className="text-2xl font-bold">{stats.turnoverRate}x</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Return Rate</span>
              <span className="text-2xl font-bold">{stats.returnRate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 