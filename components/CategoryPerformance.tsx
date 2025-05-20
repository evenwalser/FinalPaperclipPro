'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { LineChart } from '@/components/ui/charts'
import { DateRange } from "react-day-picker"

// Stub components if you haven't implemented them yet.
function CategorySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select category</option>
    </select>
  );
}

function MetricsCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: number | undefined;
  trend: number | undefined;
}) {
  return (
    <div className="metrics-card">
      <h3>{title}</h3>
      <p>{value}</p>
      <p>{trend}</p>
    </div>
  );
}

// Assuming calculateTrend and fetchCategoryMetrics are defined elsewhere
interface CategoryMetrics {
  revenue: number;
  units: number;
  avgDaysToSale: number;
  turnoverRate: number;
  trendData: {
    date: string;
    value: number;
  }[];
}

async function fetchCategoryMetrics(category: string, dateRange: DateRange) {
  try {
    const response = await fetch(`/api/metrics?category=${category}&from=${dateRange.from}&to=${dateRange.to}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }
}

function calculateTrend(data?: { date: string; value: number }[]): number | undefined {
  if (!data || data.length < 2) return undefined;
  
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  return ((lastValue - firstValue) / firstValue) * 100;
}

export function CategoryPerformance() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: new Date(), 
    to: new Date() 
  });
  const [metrics, setMetrics] = useState<CategoryMetrics | null>(null);

  useEffect(() => {
    if (selectedCategory && dateRange) {
      fetchCategoryMetrics(selectedCategory, dateRange).then(data => {
        if (data) setMetrics(data);
      });
    }
  }, [selectedCategory, dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <CategorySelector value={selectedCategory} onChange={setSelectedCategory} />
        <DateRangePicker 
          value={dateRange} 
          onChange={(range) => {
            if (range) setDateRange(range);
          }} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsCard
          title="Sales Velocity"
          value={metrics?.turnoverRate}
          trend={calculateTrend(metrics?.trendData)}
        />
        <MetricsCard
          title="Average Days to Sale"
          value={metrics?.avgDaysToSale}
          trend={calculateTrend(metrics?.trendData)}
        />
      </div>

      <Card>
        <LineChart data={metrics?.trendData} xAxis="date" yAxis="value" title="Sales Trend" />
      </Card>
    </div>
  );
}
