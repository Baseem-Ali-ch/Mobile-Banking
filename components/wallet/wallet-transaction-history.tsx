"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { getWalletTransactions } from "@/store/slices/walletSlice"
import { formatCurrency } from "@/lib/currency-utils"
import type { WalletTransaction, WalletTransactionType, WalletTransactionStatus } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function WalletTransactionHistory() {
  const dispatch = useAppDispatch()
  const { transactions, pendingTransactions, transactionsLoading, transactionsError } = useAppSelector(
    (state) => state.wallet,
  )

  useEffect(() => {
    if (transactions.length === 0 && !transactionsLoading) {
      dispatch(getWalletTransactions())
    }
  }, [dispatch, transactions.length, transactionsLoading])

  if (transactionsLoading && transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (transactionsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading transactions: {transactionsError}</p>
            <Button variant="outline" className="mt-2" onClick={() => dispatch(getWalletTransactions())}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const allTransactions = [...pendingTransactions, ...transactions]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Recent wallet activity</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {allTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {allTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

function TransactionItem({ transaction }: { transaction: WalletTransaction }) {
  const isPending = transaction.status === "PENDING"

  return (
    <div className={`p-4 rounded-lg border ${isPending ? "border-yellow-200 bg-yellow-50/50" : "border-border"}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <TransactionTypeIcon type={transaction.type} className="mt-1 mr-3" />
          <div>
            <div className="font-medium">{getTransactionTitle(transaction)}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(transaction.date), "MMM d, yyyy • h:mm a")}
            </div>
            {transaction.reference && (
              <div className="text-xs text-muted-foreground mt-1">Ref: {transaction.reference}</div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`font-semibold ${getAmountColor(transaction.type)}`}>
            {getAmountPrefix(transaction.type)}
            {formatCurrency(transaction.amount, transaction.currency)}
          </div>
          <div className="mt-1">
            <TransactionStatusBadge status={transaction.status} />
          </div>
          {transaction.fee && transaction.fee > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              Fee: {formatCurrency(transaction.fee, transaction.currency)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TransactionTypeIcon({ type, className = "" }: { type: WalletTransactionType; className?: string }) {
  switch (type) {
    case "DEPOSIT":
      return <ArrowUpRight className={`h-5 w-5 text-green-500 ${className}`} />
    case "WITHDRAWAL":
      return <ArrowDownRight className={`h-5 w-5 text-blue-500 ${className}`} />
    case "TRANSFER":
      return <RefreshCw className={`h-5 w-5 text-purple-500 ${className}`} />
    case "FEE":
      return <AlertCircle className={`h-5 w-5 text-orange-500 ${className}`} />
    case "REFUND":
      return <CheckCircle className={`h-5 w-5 text-teal-500 ${className}`} />
    default:
      return <AlertCircle className={`h-5 w-5 text-muted-foreground ${className}`} />
  }
}

function TransactionStatusBadge({ status }: { status: WalletTransactionStatus }) {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-green-500">Completed</Badge>
    case "PENDING":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          Pending
        </Badge>
      )
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>
    case "CANCELLED":
      return (
        <Badge variant="outline" className="border-gray-500 text-gray-500">
          Cancelled
        </Badge>
      )
    default:
      return null
  }
}

function getTransactionTitle(transaction: WalletTransaction): string {
  switch (transaction.type) {
    case "DEPOSIT":
      return (
        transaction.description ||
        `Deposit via ${transaction.paymentMethod?.replace("_", " ").toLowerCase() || "bank transfer"}`
      )
    case "WITHDRAWAL":
      return transaction.description || "Withdrawal to bank account"
    case "TRANSFER":
      return transaction.description || "Transfer"
    case "FEE":
      return transaction.description || "Service fee"
    case "REFUND":
      return transaction.description || "Refund"
    default:
      return transaction.description || "Transaction"
  }
}

function getAmountColor(type: WalletTransactionType): string {
  switch (type) {
    case "DEPOSIT":
    case "REFUND":
      return "text-green-600"
    case "WITHDRAWAL":
    case "FEE":
      return "text-red-600"
    default:
      return ""
  }
}

function getAmountPrefix(type: WalletTransactionType): string {
  switch (type) {
    case "DEPOSIT":
    case "REFUND":
      return "+"
    case "WITHDRAWAL":
    case "FEE":
      return "-"
    default:
      return ""
  }
}
