"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { confirmTransaction, clearTransactionDraft } from "@/store/slices/transactionsSlice"
import { fetchAccount } from "@/store/slices/accountsSlice"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/currency-utils"
import { TransactionCategory } from "@/types"

export function TransactionConfirmation() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { transactionDraft, isLoading, error } = useAppSelector((state) => state.transactions)
  const { accounts, selectedAccount } = useAppSelector((state) => state.accounts)
  const [sourceAccount, setSourceAccount] = useState<any>(null)
  const [destinationAccount, setDestinationAccount] = useState<any>(null)
  const [saveNewAccount, setSaveNewAccount] = useState(false)

  useEffect(() => {
    if (!transactionDraft) {
      router.push("/dashboard/transfer")
      return
    }

    // Fetch source account details
    if (transactionDraft.fromAccountId) {
      dispatch(fetchAccount(transactionDraft.fromAccountId))
    }

    // Set destination account if it's a saved account
    if (transactionDraft.toAccountId && transactionDraft.toAccountId !== "new") {
      const account = accounts.find((acc) => acc.id === transactionDraft.toAccountId)
      if (account) {
        setDestinationAccount(account)
      }
    }
  }, [dispatch, transactionDraft, accounts, router])

  useEffect(() => {
    if (selectedAccount && transactionDraft?.fromAccountId === selectedAccount.id) {
      setSourceAccount(selectedAccount)
    }
  }, [selectedAccount, transactionDraft])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error])

  const handleConfirm = async () => {
    if (!transactionDraft) return

    try {
      const result = await dispatch(
        confirmTransaction({
          ...transactionDraft,
          saveNewAccount,
        }),
      ).unwrap()

      // Navigate to status page
      router.push(`/dashboard/transfer/status?id=${result.id}`)
    } catch (error) {
      // Error is already handled in the error useEffect
    }
  }

  const handleCancel = () => {
    dispatch(clearTransactionDraft())
    router.push("/dashboard/transfer")
  }

  if (!transactionDraft) {
    return null
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getCategoryLabel = (category: TransactionCategory) => {
    switch (category) {
      case TransactionCategory.TRANSFER:
        return "Transfer"
      case TransactionCategory.PAYMENT:
        return "Payment"
      case TransactionCategory.WITHDRAWAL:
        return "Withdrawal"
      case TransactionCategory.DEPOSIT:
        return "Deposit"
      default:
        return "Other"
    }
  }

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Confirm Transfer</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(transactionDraft.amount)}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">From</p>
              {sourceAccount ? (
                <div className="mt-1">
                  <p className="font-medium">{sourceAccount.accountName}</p>
                  <p className="text-sm text-muted-foreground">•••• {sourceAccount.accountNumber.slice(-4)}</p>
                </div>
              ) : (
                <div className="h-10 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading account details...</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">To</p>
              {transactionDraft.toAccountId === "new" ? (
                <div className="mt-1">
                  <p className="font-medium">{transactionDraft.newAccount?.accountHolderName}</p>
                  <p className="text-sm">
                    {transactionDraft.newAccount?.bankName} - ••••{" "}
                    {transactionDraft.newAccount?.accountNumber.slice(-4)}
                  </p>
                </div>
              ) : destinationAccount ? (
                <div className="mt-1">
                  <p className="font-medium">{destinationAccount.accountName}</p>
                  <p className="text-sm text-muted-foreground">•••• {destinationAccount.accountNumber.slice(-4)}</p>
                </div>
              ) : (
                <div className="h-10 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading account details...</span>
                </div>
              )}
            </div>

            {transactionDraft.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{transactionDraft.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{getCategoryLabel(transactionDraft.category)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{formatDate(new Date())}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="font-medium">TRF{Math.floor(Math.random() * 10000000)}</p>
            </div>
          </CardContent>
        </Card>

        {transactionDraft.toAccountId === "new" && (
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="save-account">Save account for future transfers</Label>
              <p className="text-sm text-muted-foreground">This will add the account to your saved beneficiaries</p>
            </div>
            <Switch id="save-account" checked={saveNewAccount} onCheckedChange={setSaveNewAccount} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={handleConfirm} disabled={isLoading || !sourceAccount} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Transfer
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="w-full">
            <AlertCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
