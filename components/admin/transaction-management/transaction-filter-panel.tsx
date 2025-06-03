"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { TransactionStatus, TransactionType } from "@/types"
import { cn } from "@/lib/utils"
import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

interface TransactionFilterPanelProps {
  filters: any
  onFilterChange: (filters: any) => void
  onResetFilters: () => void
}

// Mock data for users
const users = [
  { id: "USR-12345", name: "John Smith" },
  { id: "USR-23456", name: "Sarah Johnson" },
  { id: "USR-34567", name: "Michael Brown" },
  { id: "USR-45678", name: "Emily Davis" },
  { id: "USR-56789", name: "Robert Wilson" },
]

// Date range presets
const dateRangePresets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last7days" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This month", value: "thismonth" },
  { label: "Last month", value: "lastmonth" },
  { label: "Custom range", value: "custom" },
]

export function TransactionFilterPanel({ filters, onFilterChange, onResetFilters }: TransactionFilterPanelProps) {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus[]>(filters.status || [])
  const [typeFilter, setTypeFilter] = useState<TransactionType[]>(filters.type || [])
  const [dateRangeType, setDateRangeType] = useState("last7days")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: filters.dateRange.from ? new Date(filters.dateRange.from) : subDays(new Date(), 7),
    to: filters.dateRange.to ? new Date(filters.dateRange.to) : new Date(),
  })
  const [amountRange, setAmountRange] = useState<[number, number]>(filters.amountRange || [0, 10000])
  const [userFilter, setUserFilter] = useState<string>(filters.userId || "")
  const [accountFilter, setAccountFilter] = useState<string>(filters.accountId || "")
  const [priorityFilter, setPriorityFilter] = useState<string[]>(filters.priority || [])
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "")

  // Apply date range preset
  useEffect(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    switch (dateRangeType) {
      case "today":
        setDateRange({
          from: new Date(today.setHours(0, 0, 0, 0)),
          to: today,
        })
        break
      case "yesterday":
        setDateRange({
          from: yesterday,
          to: new Date(yesterday.setHours(23, 59, 59, 999)),
        })
        break
      case "last7days":
        setDateRange({
          from: subDays(today, 7),
          to: today,
        })
        break
      case "last30days":
        setDateRange({
          from: subDays(today, 30),
          to: today,
        })
        break
      case "thismonth":
        setDateRange({
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: today,
        })
        break
      case "lastmonth":
        setDateRange({
          from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          to: new Date(today.getFullYear(), today.getMonth(), 0),
        })
        break
      case "custom":
        // Don't change the date range for custom
        break
    }
  }, [dateRangeType])

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      status: statusFilter,
      type: typeFilter,
      dateRange: {
        from: dateRange.from ? dateRange.from.toISOString() : null,
        to: dateRange.to ? dateRange.to.toISOString() : null,
      },
      amountRange,
      searchQuery,
      userId: userFilter || null,
      accountId: accountFilter || null,
      priority: priorityFilter,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Filters</CardTitle>
        <CardDescription>Refine your transaction view with multiple filters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Transaction Status</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(TransactionStatus).map((status) => (
                <Badge
                  key={status}
                  variant={statusFilter.includes(status) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    status === TransactionStatus.PENDING &&
                      statusFilter.includes(status) &&
                      "bg-yellow-500 hover:bg-yellow-600",
                    (status === TransactionStatus.COMPLETED || status === TransactionStatus.APPROVED) &&
                      statusFilter.includes(status) &&
                      "bg-green-500 hover:bg-green-600",
                    (status === TransactionStatus.REJECTED || status === TransactionStatus.FAILED) &&
                      statusFilter.includes(status) &&
                      "bg-red-500 hover:bg-red-600",
                    status === TransactionStatus.CANCELLED &&
                      statusFilter.includes(status) &&
                      "bg-gray-500 hover:bg-gray-600",
                  )}
                  onClick={() => {
                    setStatusFilter((prev) =>
                      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
                    )
                  }}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(TransactionType).map((type) => (
                <Badge
                  key={type}
                  variant={typeFilter.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
                  }}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {["high", "normal", "low"].map((priority) => (
                <Badge
                  key={priority}
                  variant={priorityFilter.includes(priority) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    priority === "high" && priorityFilter.includes(priority) && "bg-red-500 hover:bg-red-600",
                    priority === "normal" && priorityFilter.includes(priority) && "bg-blue-500 hover:bg-blue-600",
                    priority === "low" && priorityFilter.includes(priority) && "bg-green-500 hover:bg-green-600",
                  )}
                  onClick={() => {
                    setPriorityFilter((prev) =>
                      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
                    )
                  }}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRangeType} onValueChange={setDateRangeType}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {dateRangeType === "custom" && (
              <div className="pt-2">
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Amount Range (${amountRange[0]} - ${amountRange[1]})
            </Label>
            <Slider
              value={amountRange}
              min={0}
              max={10000}
              step={100}
              onValueChange={setAmountRange}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label>User</Label>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              placeholder="Search by account number"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}
