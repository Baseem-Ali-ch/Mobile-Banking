"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { TransactionCategory, TransactionStatus } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TransactionsList() {
  const transactions = useAppSelector((state) => state.transactions.transactions)

  // For demo purposes, if no transactions exist yet
  const demoTransactions =
    transactions.length > 0
      ? transactions
      : [
          {
            id: "1",
            userId: "1",
            fromAccountId: "1",
            toAccountId: "external",
            amount: 120.5,
            currency: "USD",
            description: "Grocery Shopping",
            category: TransactionCategory.PAYMENT,
            status: TransactionStatus.COMPLETED,
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "2",
            userId: "1",
            fromAccountId: "external",
            toAccountId: "1",
            amount: 2500.0,
            currency: "USD",
            description: "Salary Deposit",
            category: TransactionCategory.DEPOSIT,
            status: TransactionStatus.COMPLETED,
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: "3",
            userId: "1",
            fromAccountId: "1",
            toAccountId: "external",
            amount: 45.99,
            currency: "USD",
            description: "Subscription Payment",
            category: TransactionCategory.PAYMENT,
            status: TransactionStatus.PENDING,
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 259200000).toISOString(),
          },
          {
            id: "4",
            userId: "1",
            fromAccountId: "1",
            toAccountId: "2",
            amount: 1000.0,
            currency: "USD",
            description: "Transfer to Savings",
            category: TransactionCategory.TRANSFER,
            status: TransactionStatus.COMPLETED,
            date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            updatedAt: new Date(Date.now() - 345600000).toISOString(),
          },
          {
            id: "5",
            userId: "1",
            fromAccountId: "1",
            toAccountId: "external",
            amount: 89.99,
            currency: "USD",
            description: "Online Purchase",
            category: TransactionCategory.PAYMENT,
            status: TransactionStatus.COMPLETED,
            date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            updatedAt: new Date(Date.now() - 432000000).toISOString(),
          },
        ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getTransactionIcon = (transaction: any) => {
    if (transaction.category === TransactionCategory.DEPOSIT || transaction.toAccountId === "1") {
      return (
        <div className="rounded-full bg-green-100 p-2 dark:bg-green-800">
          <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-300" />
        </div>
      )
    } else {
      return (
        <div className="rounded-full bg-red-100 p-2 dark:bg-red-800">
          <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-300" />
        </div>
      )
    }
  }

  const getStatusBadge = (status: TransactionStatus) => {
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>All Transactions</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search transactions..." className="w-full pl-8 sm:w-[260px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                {getTransactionIcon(transaction)}
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <p
                    className={cn(
                      "font-medium",
                      transaction.category === TransactionCategory.DEPOSIT || transaction.toAccountId === "1"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {transaction.category === TransactionCategory.DEPOSIT || transaction.toAccountId === "1"
                      ? "+"
                      : "-"}
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                </div>

                <div>{getStatusBadge(transaction.status)}</div>

                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
