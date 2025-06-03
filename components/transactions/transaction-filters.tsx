"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionStatus } from "@/types"
import { CalendarIcon, FilterX } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function TransactionFilters() {
  const [date, setDate] = useState<Date>()
  const [status, setStatus] = useState<string>("")
  const [account, setAccount] = useState<string>("")

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal sm:w-[240px]",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={TransactionStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={TransactionStatus.REJECTED}>Rejected</SelectItem>
                <SelectItem value={TransactionStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="1">Main Checking</SelectItem>
                <SelectItem value="2">Savings Account</SelectItem>
                <SelectItem value="3">Investment Fund</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => {
              setDate(undefined)
              setStatus("")
              setAccount("")
            }}
          >
            <FilterX className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
