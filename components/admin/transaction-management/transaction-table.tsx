"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/currency-utils"
import type { Transaction } from "@/types"

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading: boolean
  onViewTransaction: (transaction: Transaction) => void
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function TransactionTable({ 
  transactions, 
  isLoading, 
  onViewTransaction,
  currentPage = 1,
  totalPages = Math.ceil(transactions.length / 10),
  onPageChange
}: TransactionTableProps) {
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
    } else if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      const aValue = a[sortField] as string
      const bValue = b[sortField] as string
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "FAILED":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "PROCESSING":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const renderSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const startIndex = (currentPage - 1) * 10
  const endIndex = startIndex + 10
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="mb-2 text-lg font-medium">No transactions found</p>
        <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
              <div className="flex items-center">ID {renderSortIcon("id")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
              <div className="flex items-center">Date {renderSortIcon("date")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
              <div className="flex items-center">Description {renderSortIcon("description")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
              <div className="flex items-center">Amount {renderSortIcon("amount")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center">Status {renderSortIcon("status")}</div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id.slice(0, 8)}</TableCell>
              <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewTransaction(transaction)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Responsive pagination */}
      <div className="flex flex-col gap-3 py-4">
        {/* Results count - always visible */}
        <div className="flex justify-center sm:justify-start">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {paginatedTransactions.length} of {transactions.length} transactions
          </p>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-col xs:flex-row items-center justify-center sm:justify-end gap-3">
          {/* Page info - hidden on very small screens, shown on xs and up */}
          <span className="hidden xs:block text-sm order-2 xs:order-1">
            Page {currentPage} of {totalPages}
          </span>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2 order-1 xs:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="min-w-[80px]"
            >
              <span className="hidden xs:inline">Previous</span>
              <span className="xs:hidden">Prev</span>
            </Button>

            {/* Page info for very small screens */}
            <span className="xs:hidden text-sm px-2 py-1 bg-muted rounded text-center min-w-[60px]">
              {currentPage}/{totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="min-w-[80px]"
            >
              <span className="hidden xs:inline">Next</span>
              <span className="xs:hidden">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
