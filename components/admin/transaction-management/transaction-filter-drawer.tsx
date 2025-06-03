"use client"

import { useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { resetTransactionFilters, setTransactionFilters } from "@/store/slices/transactionsSlice"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { TransactionStatus } from "@/types"

interface TransactionFilterDrawerProps {
  open: boolean
  onClose: () => void
}

export function TransactionFilterDrawer({ open, onClose }: TransactionFilterDrawerProps) {
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<TransactionStatus | "">("")
  const [accountId, setAccountId] = useState("")
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")

  const handleApplyFilters = () => {
    dispatch(
      setTransactionFilters({
        status: status || null,
        accountId: accountId || null,
        dateRange: {
          from: fromDate ? format(fromDate, "yyyy-MM-dd") : null,
          to: toDate ? format(toDate, "yyyy-MM-dd") : null,
        },
      }),
    )
    onClose()
  }

  const handleResetFilters = () => {
    setStatus("")
    setAccountId("")
    setFromDate(undefined)
    setToDate(undefined)
    setMinAmount("")
    setMaxAmount("")
    dispatch(resetTransactionFilters())
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Transactions</SheetTitle>
          <SheetDescription>Apply filters to narrow down the transaction list</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Transaction Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as TransactionStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Input
              id="account"
              placeholder="Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex space-x-2">
              <div className="w-full">
                <Label htmlFor="from-date" className="sr-only">
                  From Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="from-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>From date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full">
                <Label htmlFor="to-date" className="sr-only">
                  To Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="to-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>To date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amount Range</Label>
            <div className="flex space-x-2">
              <div className="w-full">
                <Label htmlFor="min-amount" className="sr-only">
                  Minimum Amount
                </Label>
                <Input
                  id="min-amount"
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="max-amount" className="sr-only">
                  Maximum Amount
                </Label>
                <Input
                  id="max-amount"
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" className="w-full" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button className="w-full" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
