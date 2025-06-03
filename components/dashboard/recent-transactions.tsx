"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { TransactionStatus } from "@/types"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/currency-utils"

export function RecentTransactions() {
  const router = useRouter()
  const { recentTransactions } = useAppSelector((state) => state.dashboard)
  const { currency } = useAppSelector((state) => state.settings)

  const formatDate = (dateString: string) => {
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
  }

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return "text-yellow-500"
      case TransactionStatus.COMPLETED:
        return "text-green-500"
      case TransactionStatus.REJECTED:
        return "text-red-500"
      case TransactionStatus.CANCELLED:
        return "text-gray-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs gap-1"
          onClick={() => router.push("/dashboard/transactions")}
        >
          View All <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <Card>
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "rounded-full p-2",
                      transaction.type === "DEPOSIT" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900",
                    )}
                  >
                    {transaction.type === "DEPOSIT" ? (
                      <ArrowDownLeft className={cn("h-4 w-4", "text-green-600 dark:text-green-400")} />
                    ) : (
                      <ArrowUpRight className={cn("h-4 w-4", "text-red-600 dark:text-red-400")} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                      <p className="text-xs text-muted-foreground truncate max-w-[100px]">{transaction.accountName}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-medium",
                      transaction.type === "DEPOSIT"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {transaction.type === "DEPOSIT" ? "+" : "-"}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                  <p className={cn("text-xs font-medium", getStatusColor(transaction.status))}>{transaction.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No recent transactions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
