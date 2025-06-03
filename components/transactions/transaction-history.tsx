"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchTransactions,
  clearTransactionsFilter,
  setStatusFilter,
  setAccountFilter,
  setDateRangeFilter,
} from "@/store/slices/transactionsSlice"
import { fetchAccounts } from "@/store/slices/accountsSlice"
import { Search, ArrowUpRight, ArrowDownLeft, ChevronRight, FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"
import { TransactionHistorySkeleton } from "@/components/transactions/transaction-history-skeleton"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currency-utils"
import { TransactionStatus, TransactionType } from "@/types"
import { format } from "date-fns"

export function TransactionHistory() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { transactions, filteredTransactions, filter, isLoading, error } = useAppSelector((state) => state.transactions)
  const { accounts } = useAppSelector((state) => state.accounts)
  const [searchTerm, setSearchTerm] = useState("")
  const [displayedTransactions, setDisplayedTransactions] = useState<any[]>([])

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchAccounts())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error])

  useEffect(() => {
    // Filter transactions based on search term
    if (searchTerm.trim() === "") {
      setDisplayedTransactions(filteredTransactions || [])
    } else {
      const term = searchTerm.toLowerCase()
      setDisplayedTransactions(
        (filteredTransactions || []).filter((tx) => {
          if (!tx) return false

          return (
            (tx.description && tx.description.toLowerCase().includes(term)) ||
            (tx.id && tx.id.toLowerCase().includes(term)) ||
            (tx.fromAccountName && tx.fromAccountName.toLowerCase().includes(term)) ||
            (tx.toAccountName && tx.toAccountName.toLowerCase().includes(term))
          )
        }),
      )
    }
  }, [filteredTransactions, searchTerm])

  const handleRefresh = async () => {
    try {
      await dispatch(fetchTransactions()).unwrap()
    } catch (error) {
      // Error is already handled in the error useEffect
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/transactions/${id}`)
  }

  const handleClearFilters = () => {
    dispatch(clearTransactionsFilter())
    setSearchTerm("")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date"

    try {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (date.toDateString() === today.toDateString()) {
        return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
      } else {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }
    } catch (error) {
      return "Invalid date"
    }
  }

  const getStatusBadge = (status: TransactionStatus | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>

    switch (status) {
      case TransactionStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completed
          </Badge>
        )
      case TransactionStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      case TransactionStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Rejected
          </Badge>
        )
      case TransactionStatus.CANCELLED:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading && transactions.length === 0) {
    return <TransactionHistorySkeleton />
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="container px-4 py-6 pb-20">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Transactions</h1>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Filters</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={handleClearFilters}>
                  <FilterX className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Status</p>
                <Select
                  value={filter?.status || ""}
                  onValueChange={(value) => dispatch(setStatusFilter((value as TransactionStatus) || null))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value={TransactionStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={TransactionStatus.REJECTED}>Rejected</SelectItem>
                    <SelectItem value={TransactionStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Account</p>
                <Select
                  value={filter?.accountId || ""}
                  onValueChange={(value) => dispatch(setAccountFilter(value || null))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-8 w-full justify-start text-left font-normal text-xs",
                        !filter?.dateRange?.from && !filter?.dateRange?.to && "text-muted-foreground",
                      )}
                    >
                      {filter?.dateRange?.from ? (
                        filter?.dateRange?.to ? (
                          <>
                            {format(new Date(filter.dateRange.from), "LLL dd")} -{" "}
                            {format(new Date(filter.dateRange.to), "LLL dd")}
                          </>
                        ) : (
                          format(new Date(filter.dateRange.from), "LLL dd, y")
                        )
                      ) : (
                        "Pick a date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filter?.dateRange?.from ? new Date(filter.dateRange.from) : new Date()}
                      selected={{
                        from: filter?.dateRange?.from ? new Date(filter.dateRange.from) : undefined,
                        to: filter?.dateRange?.to ? new Date(filter.dateRange.to) : undefined,
                      }}
                      onSelect={(range) => {
                        dispatch(
                          setDateRangeFilter({
                            from: range?.from ? range.from.toISOString() : null,
                            to: range?.to ? range.to.toISOString() : null,
                          }),
                        )
                      }}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {displayedTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No transactions found</p>
                {(filter?.status ||
                  filter?.accountId ||
                  filter?.dateRange?.from ||
                  filter?.dateRange?.to ||
                  searchTerm) && (
                  <Button variant="link" onClick={handleClearFilters} className="mt-2">
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {displayedTransactions.map(
                (transaction) =>
                  transaction && (
                    <Card
                      key={transaction.id}
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => transaction.id && handleViewDetails(transaction.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "rounded-full p-2",
                              transaction.type === TransactionType.DEPOSIT
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-red-100 dark:bg-red-900",
                            )}
                          >
                            {transaction.type === TransactionType.DEPOSIT ? (
                              <ArrowDownLeft className={cn("h-4 w-4", "text-green-600 dark:text-green-400")} />
                            ) : (
                              <ArrowUpRight className={cn("h-4 w-4", "text-red-600 dark:text-red-400")} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{transaction.description || "Unnamed Transaction"}</p>
                              <div className="flex items-center">
                                <p
                                  className={cn(
                                    "font-medium",
                                    transaction.type === TransactionType.DEPOSIT
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400",
                                  )}
                                >
                                  {transaction.type === TransactionType.DEPOSIT ? "+" : "-"}
                                  {formatCurrency(transaction.amount || 0)}
                                </p>
                                <ChevronRight className="h-5 w-5 text-muted-foreground ml-1" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">{formatDate(transaction.date || "")}</p>
                                {getStatusBadge(transaction.status)}
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {transaction.fromAccountName || transaction.toAccountName || "Unknown Account"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ),
              )}
            </div>
          )}
        </div>
      </div>
    </PullToRefresh>
  )
}
