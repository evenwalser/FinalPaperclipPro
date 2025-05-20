"use client"

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LineChartProps {
  data?: Array<{ date: string; value: number }>
  xAxis?: string
  yAxis?: string
  title?: string
}

export function LineChart({ data = [], xAxis, yAxis, title }: LineChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
} 