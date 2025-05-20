"use client"

import * as React from "react"
import { addDays, format, isBefore, isAfter, startOfDay, endOfDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CalendarDateRangePickerProps {
  className?: string
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  highlightedDates?: Date[]
}

export function CalendarDateRangePicker({
  className,
  date,
  onDateChange,
  highlightedDates = [],
}: CalendarDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Predefined date ranges
  const dateRanges = {
    today: {
      label: "Today",
      range: {
        from: startOfDay(new Date()),
        to: endOfDay(new Date())
      }
    },
    last7Days: {
      label: "Last 7 Days",
      range: {
        from: startOfDay(addDays(new Date(), -6)),
        to: endOfDay(new Date())
      }
    },
    last30Days: {
      label: "Last 30 Days",
      range: {
        from: startOfDay(addDays(new Date(), -29)),
        to: endOfDay(new Date())
      }
    },
    thisMonth: {
      label: "This Month",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: endOfDay(new Date())
      }
    }
  }

  // Handle predefined range selection
  const handlePredefinedRange = (rangeKey: keyof typeof dateRanges) => {
    onDateChange(dateRanges[rangeKey].range)
    setIsOpen(false)
  }

  // Validate date selection
  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) {
      onDateChange(undefined)
      return
    }

    // Ensure "from" date is not after "to" date
    if (selectedRange.from && selectedRange.to && 
        isAfter(selectedRange.from, selectedRange.to)) {
      onDateChange({
        from: selectedRange.to,
        to: selectedRange.from
      })
      return
    }

    // Don't allow future dates
    const today = endOfDay(new Date())
    if (selectedRange.from && isAfter(selectedRange.from, today)) {
      return
    }
    if (selectedRange.to && isAfter(selectedRange.to, today)) {
      selectedRange.to = today
    }

    onDateChange(selectedRange)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          side="bottom"
          alignOffset={-30}
          style={{ 
            position: 'absolute',
            right: '-336px',
            marginRight: '30px',
            display: 'flex',
          }}
        >
          <div className="p-3">
            <div className="space-y-2">
              {Object.entries(dateRanges).map(([key, value]) => (
                <Button
                  key={key}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => handlePredefinedRange(key as keyof typeof dateRanges)}
                >
                  {value.label}
                </Button>
              ))}
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={(date) => isAfter(date, new Date())}
            className="p-3 demos"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                "hover:bg-accent hover:text-accent-foreground",
                "[&.highlighted]:bg-primary/15"
              ),
              day_range_end: "day-range-end",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              Dropdown: ({ value, onChange, children, ...props }) => {
                return (
                  <Select
                    value={String(value)}
                    onValueChange={(val: string) => onChange?.({ target: { value: val } } as any)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue>{value}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {children}
                    </SelectContent>
                  </Select>
                )
              }
            }}
            // modifiers={{
            //   highlighted: highlightedDates
            // }}
            // modifiersStyles={{
            //   highlighted: {
            //     backgroundColor: "rgba(var(--primary-500), 0.15)",
            //     borderRadius: "0"
            //   }
            // }}
            modifiers={{
              highlighted: highlightedDates
            }}
            modifiersStyles={{
              highlighted: {
                backgroundColor: "rgba(var(--primary-500), 0.15)",
                borderRadius: "0"
              }
            }}
            modifiersClassNames={{
              highlighted: "bg-primary/15 border border-primary rounded-md", // Your custom class for highlighted dates
              disabled: "opacity-50 cursor-not-allowed", // Custom style for disabled dates
              today: "bg-accent text-accent-foreground", // Custom style for today's date
              selected: "bg-[#435476] text-primary-foreground rounded-[4px]", // Custom style for selected date
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

