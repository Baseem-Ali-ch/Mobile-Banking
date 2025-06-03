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
}

export function TransactionTable({ transactions, isLoading, onViewTransaction }: TransactionTableProps) {
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
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id.slice(0, 8)}</TableCell>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
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
    </div>
  )
}
