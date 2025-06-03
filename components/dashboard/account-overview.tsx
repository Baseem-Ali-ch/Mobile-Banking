"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currency-utils"

export function AccountOverview() {
  const { totalBalance, pendingAmount, completedAmount, rejectedAmount, accountStatuses } = useAppSelector(
    (state) => state.dashboard,
  )
  const { currency } = useAppSelector((state) => state.settings)

  // Calculate percentages for the progress bars
  const totalTransactions = pendingAmount + completedAmount + rejectedAmount
  const pendingPercentage = totalTransactions > 0 ? (pendingAmount / totalTransactions) * 100 : 0
  const completedPercentage = totalTransactions > 0 ? (completedAmount / totalTransactions) * 100 : 0
  const rejectedPercentage = totalTransactions > 0 ? (rejectedAmount / totalTransactions) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Account Overview</h2>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-primary p-6 text-primary-foreground">
            <p className="text-sm font-medium opacity-80">Total Balance</p>
            <h3 className="text-3xl font-bold mt-1">{formatCurrency(totalBalance, currency)}</h3>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary-foreground/20 p-1.5">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs opacity-80">Income</p>
                  <p className="font-medium">{formatCurrency(completedAmount, currency)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary-foreground/20 p-1.5">
                  <ArrowDownRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs opacity-80">Expenses</p>
                  <p className="font-medium">{formatCurrency(pendingAmount + rejectedAmount, currency)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(pendingAmount, currency)}</span>
              </div>
              <Progress value={pendingPercentage} className="h-2 bg-muted" indicatorClassName="bg-yellow-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(completedAmount, currency)}</span>
              </div>
              <Progress value={completedPercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(rejectedAmount, currency)}</span>
              </div>
              <Progress value={rejectedPercentage} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {accountStatuses.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {accountStatuses.map((account) => (
            <Card
              key={account.id}
              className={cn(
                "overflow-hidden border-l-4",
                account.status === "ACTIVE"
                  ? "border-l-green-500"
                  : account.status === "PENDING"
                    ? "border-l-yellow-500"
                    : "border-l-red-500",
              )}
            >
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
                <p className="text-sm font-bold mt-1">{formatCurrency(account.balance, currency)}</p>
                <div
                  className={cn(
                    "text-[10px] uppercase font-semibold mt-2 px-1.5 py-0.5 rounded-sm w-fit",
                    account.status === "ACTIVE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : account.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                  )}
                >
                  {account.status}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
