"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react"

export function AccountSummary() {
  const accounts = useAppSelector((state) => state.accounts.accounts)

  // For demo purposes, if no accounts exist yet
  const demoAccounts =
    accounts.length > 0
      ? accounts
      : [
          {
            id: "1",
            userId: "1",
            accountNumber: "****4567",
            accountName: "Main Checking",
            accountType: "CHECKING",
            bankName: "Example Bank",
            balance: 5280.42,
            currency: "USD",
            isDefault: true,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

  const totalBalance = demoAccounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Account Summary</h2>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="font-medium">$3,240.50</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-100 p-1 dark:bg-red-800">
                <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expenses</p>
                <p className="font-medium">$1,420.30</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demoAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{account.accountName}</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>{account.bankName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{account.accountNumber}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
