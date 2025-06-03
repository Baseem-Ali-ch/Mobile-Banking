"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchTransactions } from "@/store/slices/transactionsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/currency-utils"

export function TransactionStats() {
  const dispatch = useAppDispatch()
  const { transactions, isLoading } = useAppSelector((state) => state.transactions)

  // Fetch transactions in useEffect
  useEffect(() => {
    if (transactions.length === 0 && !isLoading) {
      dispatch(fetchTransactions())
    }
  }, [dispatch, transactions.length, isLoading])

  // Calculate stats
  const totalTransactions = transactions.length
  const pendingCount = transactions.filter((tx) => tx.status === "PENDING").length
  const completedCount = transactions.filter((tx) => tx.status === "COMPLETED").length
  const rejectedCount = transactions.filter((tx) => tx.status === "REJECTED").length

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const incomingAmount = transactions.filter((tx) => tx.type === "INCOMING").reduce((sum, tx) => sum + tx.amount, 0)
  const outgoingAmount = transactions.filter((tx) => tx.type === "OUTGOING").reduce((sum, tx) => sum + tx.amount, 0)

  const completionRate = totalTransactions > 0 ? Math.round((completedCount / totalTransactions) * 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTransactions}</div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="mr-1">Pending:</span>
              <span className="font-medium text-amber-600">{pendingCount}</span>
            </div>
            <div className="mx-2">•</div>
            <div className="flex items-center">
              <span className="mr-1">Completed:</span>
              <span className="font-medium text-green-600">{completedCount}</span>
            </div>
          </div>
          <Progress className="mt-3" value={completionRate} />
          <div className="mt-1 text-right text-xs text-muted-foreground">{completionRate}% completion rate</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Incoming Amount</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(incomingAmount)}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            From {transactions.filter((tx) => tx.type === "INCOMING").length} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Outgoing Amount</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(outgoingAmount)}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            From {transactions.filter((tx) => tx.type === "OUTGOING").length} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <div className="flex space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </div>
          <Progress
            className="mt-3"
            value={totalTransactions > 0 ? (completedCount / (completedCount + rejectedCount)) * 100 : 0}
          />
        </CardContent>
      </Card>
    </div>
  )
}
