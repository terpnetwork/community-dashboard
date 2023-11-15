import clsx from 'clsx'
import DateTimePicker, { DateTimePickerProps } from 'react-datetime-picker';

import { FaCalendar, FaTimes } from 'react-icons/fa'
import * as React from "react"
import { format } from "date-fns"

 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from '@radix-ui/react-icons';



export const InputDateTime = ({ className, ...rest }: DateTimePickerProps) => {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-[280px] justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 bg-background"  />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
      />
    </PopoverContent>
  </Popover>
  )
}
