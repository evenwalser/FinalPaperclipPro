"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from "react-day-picker"
import { addMonths, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        months: "flex space-x-4",
        month: "space-y-3",
        caption: "flex justify-start pl-2 relative items-center h-10",
        caption_label: "text-sm font-medium",
        nav: "absolute right-0 flex items-center space-x-1",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 hover:opacity-100 transition-opacity",
          "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "w-9 text-[0.8rem] font-normal text-gray-500 dark:text-gray-400",
        row: "flex w-full",
        cell: "w-9 h-9 text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground"
        ),
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-gray-400 dark:text-gray-600",
        day_disabled: "text-gray-400 dark:text-gray-600",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export function MonthRangePicker() {
  const [range, setRange] = React.useState<{
    from: Date
    to: Date
  }>({
    from: new Date(2023, 0, 20), // Jan 20, 2023
    to: new Date(2023, 1, 9),    // Feb 09, 2023
  })

  return (
    <div className="flex items-center space-x-4">
      <div className="relative inline-block">
        <Calendar
          mode="range"
          defaultMonth={range.from}
          selected={range}
          onSelect={(value: any) => setRange(value)}
          numberOfMonths={2}
        />
      </div>
      <Button 
        variant="destructive" 
        className="bg-[#FF3B30] hover:bg-[#E6352B] text-white"
      >
        View All
      </Button>
    </div>
  )
}

export { Calendar }

