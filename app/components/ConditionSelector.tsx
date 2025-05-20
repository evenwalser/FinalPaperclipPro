'use client'

import { motion } from 'framer-motion'

type Condition = 'New' | 'Like New' | 'Very Good' | 'Good' | 'Fair'

const conditions: { value: Condition; icon: string; description: string }[] = [
  {
    value: 'New',
    icon: '✨',
    description: 'Brand new, unused item with original tags/packaging'
  },
  {
    value: 'Like New',
    icon: '🌟',
    description: 'Unused item without tags, in perfect condition'
  },
  {
    value: 'Very Good',
    icon: '👌',
    description: 'Gently used, well maintained, no noticeable flaws'
  },
  {
    value: 'Good',
    icon: '👍',
    description: 'Used with minor wear, fully functional'
  },
  {
    value: 'Fair',
    icon: '🤝',
    description: 'Shows wear, but still useful and presentable'
  }
]

interface ConditionSelectorProps {
  value: Condition;
  onChange: (value: Condition) => void;
}

export function ConditionSelector({ value, onChange }: ConditionSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {conditions.map((condition) => (
          <motion.button
            key={condition.value}
            type="button"
            onClick={() => onChange(condition.value)}
            className={`
              flex-1 border-2 rounded-md p-3 transition-all
              ${value === condition.value 
                ? 'border-[#FF3B30] bg-[#FF3B30]/5' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xl">{condition.icon}</span>
              <span className="text-xs font-medium">{condition.value}</span>
            </div>
          </motion.button>
        ))}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
        {conditions.find(c => c.value === value)?.description}
      </p>
    </div>
  )
} 