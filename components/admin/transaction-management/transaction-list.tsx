"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight } from "lucide-react"
import { formatCurrency } from "@/lib/currency-utils"
import { TransactionStatus, type Transaction } from "@/types"

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  onViewTransaction: (id: string) => void
  emptyMessage?: string
}

export function TransactionList({
  transactions,
  loading,
  error,
  onViewTransaction,
  emptyMessage = "No transactions found",
}: TransactionListProps) {
  const [sortField, setSortField] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    }

    if (sortField === "date" || sortField === "createdAt") {
      const dateA = new Date(a[sortField] || a.createdAt).getTime()
      const dateB = new Date(b[sortField] || b.createdAt).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    }

    const valueA = String(a[sortField] || "")
    const valueB = String(b[sortField] || "")
    return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
      case TransactionStatus.APPROVED:
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {status}
          </Badge>
        )
      case TransactionStatus.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        )
      case TransactionStatus.REJECTED:
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {status}
          </Badge>
        )
      case TransactionStatus.CANCELLED:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {status}
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-8 w-[100px]" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <XCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Error loading transactions</h3>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-muted-foreground mt-2">No transactions match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort("id")}>
              <div className="flex items-center">
                ID
                {sortField === "id" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
              <div className="flex items-center">
                Date
                {sortField === "date" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead>From / To</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
              <div className="flex items-center">
                Amount
                {sortField === "amount" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center">
                Status
                {sortField === "status" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className={
                transaction.status === TransactionStatus.PENDING
                  ? "bg-yellow-50 dark:bg-yellow-950/10"
                  : transaction.status === TransactionStatus.REJECTED
                    ? "bg-red-50 dark:bg-red-950/10"
                    : ""
              }
            >
              <TableCell className="font-medium">{transaction.id.slice(0, 8)}...</TableCell>
              <TableCell>{formatDate(transaction.date || transaction.createdAt)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{transaction.fromAccountName || "External Account"}</span>
                  <span className="text-xs text-muted-foreground">
                    to {transaction.toAccountName || "External Account"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewTransaction(transaction.id)}>
                  View
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
