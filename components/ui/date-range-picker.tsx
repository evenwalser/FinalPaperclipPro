"use client"

import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div>
      <input 
        type="date" 
        value={value?.from?.toISOString().split('T')[0]} 
        onChange={(e) => onChange({ 
          from: new Date(e.target.value),
          to: value?.to
        })}
      />
      <input 
        type="date"
        value={value?.to?.toISOString().split('T')[0]}
        onChange={(e) => onChange({
          from: value?.from,
          to: new Date(e.target.value)
        })}
      />
    </div>
  )
} 