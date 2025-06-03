"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAccount, fetchAccountTransactions } from "@/store/slices/accountsSlice"
import { ArrowLeft, Edit, ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { BankIcon } from "@/components/accounts/bank-icon"
import { AccountDetailsSkeleton } from "@/components/accounts/account-details-skeleton"
import { cn } from "@/lib/utils"
import { TransactionStatus, TransactionType } from "@/types"
import { formatCurrency } from "@/lib/currency-utils"

interface AccountDetailsProps {
  id: string
}

export function AccountDetails({ id }: AccountDetailsProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedAccount, accountTransactions, isLoading, error } = useAppSelector((state) => state.accounts)
  const { currency } = useAppSelector((state) => state.settings)

  useEffect(() => {
    dispatch(fetchAccount(id))
    dispatch(fetchAccountTransactions(id))
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error])

  const handleEdit = () => {
    router.push(`/dashboard/accounts/edit/${id}`)
  }

  const handleNewTransfer = () => {
    router.push(`/dashboard/transfer?fromAccount=${id}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
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

  if (isLoading || !selectedAccount) {
    return <AccountDetailsSkeleton />
  }

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Account Details</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BankIcon bankName={selectedAccount.bankName} className="h-8 w-8" />
                <div>
                  <CardTitle>{selectedAccount.accountName}</CardTitle>
                  <CardDescription>{selectedAccount.bankName}</CardDescription>
                </div>
              </div>
              {selectedAccount.isDefault && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Default
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-medium">•••• {selectedAccount.accountNumber.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="font-medium">{selectedAccount.accountType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Holder</p>
                  <p className="font-medium">{selectedAccount.accountHolderName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IFSC Code</p>
                  <p className="font-medium font-mono">{selectedAccount.ifscCode || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Routing Number</p>
                  <p className="font-medium">{selectedAccount.routingNumber ? selectedAccount.routingNumber : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="font-medium">{selectedAccount.branchName || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleNewTransfer} className="w-full">
              New Transfer
            </Button>
            <div className="flex w-full gap-3">
              <Button variant="outline" onClick={handleEdit} className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // This would open a statement or detailed view
                  toast({
                    title: "Feature coming soon",
                    description: "Account statements will be available in a future update.",
                  })
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Statement
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          {accountTransactions.length > 0 ? (
            <div className="space-y-3">
              {accountTransactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "rounded-full p-2",
                          transaction.type === TransactionType.DEPOSIT
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-red-100 dark:bg-red-900",
                        )}
                      >
                        {transaction.type === TransactionType.DEPOSIT ? (
                          <ArrowDownLeft className={cn("h-4 w-4", "text-green-600 dark:text-green-400")} />
                        ) : (
                          <ArrowUpRight className={cn("h-4 w-4", "text-red-600 dark:text-red-400")} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{transaction.description}</p>
                          <p
                            className={cn(
                              "font-medium",
                              transaction.type === TransactionType.DEPOSIT
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400",
                            )}
                          >
                            {transaction.type === TransactionType.DEPOSIT ? "+" : "-"}
                            {formatCurrency(transaction.amount, currency)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                          <p className={cn("text-xs font-medium", getStatusColor(transaction.status))}>
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/transactions")}>
                View All Transactions
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No transactions found for this account.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
