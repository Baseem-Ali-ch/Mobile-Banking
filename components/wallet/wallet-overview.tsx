"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/currency-utils"
import type { WalletStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react"

export function WalletOverview() {
  const { wallet, transactions, isLoading } = useAppSelector((state) => state.wallet)

  if (isLoading || !wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Calculate total deposits and withdrawals for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentTransactions = transactions.filter((tx) => new Date(tx.date) >= thirtyDaysAgo)

  const totalDeposits = recentTransactions.filter((tx) => tx.type === "DEPOSIT").reduce((sum, tx) => sum + tx.amount, 0)

  const totalWithdrawals = recentTransactions
    .filter((tx) => tx.type === "WITHDRAWAL")
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your available funds</CardDescription>
          </div>
          <WalletStatusBadge status={wallet.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-6 text-primary">{formatCurrency(wallet.balance, wallet.currency)}</div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center text-green-600 mb-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Deposits</span>
              </div>
              <div className="text-xl font-semibold">{formatCurrency(totalDeposits, wallet.currency)}</div>
              <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center text-blue-600 mb-1">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Sent</span>
              </div>
              <div className="text-xl font-semibold">{formatCurrency(totalWithdrawals, wallet.currency)}</div>
              <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
            </CardContent>
          </Card>
        </div>

        {wallet.status !== "ACTIVE" && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Wallet Restricted</p>
              <p className="text-sm">
                {wallet.status === "SUSPENDED"
                  ? "Your wallet is currently suspended. Please contact support for assistance."
                  : "Your wallet is closed. Contact support to reactivate it."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function WalletStatusBadge({ status }: { status: WalletStatus }) {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-green-500">Active</Badge>
    case "SUSPENDED":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          Suspended
        </Badge>
      )
    case "CLOSED":
      return <Badge variant="destructive">Closed</Badge>
    default:
      return null
  }
}
