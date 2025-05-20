'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

const metrics = [
  { label: 'Revenue', value: '$5,231', icon: DollarSign, gradient: 'gradient-green' },
  { label: 'Items in Stock', value: '143', icon: Package, gradient: 'gradient-blue' },
  { label: 'Sales', value: '35', icon: ShoppingCart, gradient: 'gradient-red' },
  { label: 'Customers', value: '12', icon: Users, gradient: 'gradient-purple' },
]

export function DashboardMetrics() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          className={`card p-6 ${metric.gradient}`}
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{metric.label}</h3>
            <metric.icon className="h-8 w-8 text-white opacity-80" />
          </div>
          <p className="text-3xl font-bold text-white">{metric.value}</p>
          {hoveredIndex === index && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 text-sm text-white"
            >
              <p>7% increase from last week</p>
              <p>15% increase from last month</p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

