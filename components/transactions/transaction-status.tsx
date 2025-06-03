"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTransactionDetails, pollTransactionStatus } from "@/store/slices/transactionsSlice"
import { CheckCircle, XCircle, Clock, Share2, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/currency-utils"
import { TransactionStatus as TxStatus } from "@/types"

interface TransactionStatusProps {
  transactionId?: string
}

export function TransactionStatus({ transactionId }: TransactionStatusProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedTransaction, isLoading, error } = useAppSelector((state) => state.transactions)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!transactionId) {
      router.push("/dashboard/transactions")
      return
    }

    dispatch(fetchTransactionDetails(transactionId))

    // Set up polling for pending transactions
    const interval = setInterval(() => {
      dispatch(pollTransactionStatus(transactionId))
    }, 5000) // Poll every 5 seconds

    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [dispatch, transactionId, router])

  useEffect(() => {
    // Stop polling if transaction is no longer pending
    if (selectedTransaction && selectedTransaction.status !== TxStatus.PENDING && pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }, [selectedTransaction, pollingInterval])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error])

  const handleShare = () => {
    if (!selectedTransaction) return

    // In a real app, this would generate a shareable receipt
    // For now, we'll just show a toast
    toast({
      title: "Share Receipt",
      description: "This feature will be available soon.",
    })
  }

  const handleNewTransfer = () => {
    router.push("/dashboard/transfer")
  }

  const handleGoHome = () => {
    router.push("/dashboard")
  }

  if (!selectedTransaction) {
    return (
      <div className="container px-4 py-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Clock className="h-12 w-12 text-muted-foreground animate-pulse mb-4" />
        <h2 className="text-xl font-bold mb-2">Loading transaction details...</h2>
        <p className="text-muted-foreground text-center">Please wait while we retrieve your transaction information.</p>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (selectedTransaction.status) {
      case TxStatus.COMPLETED:
        return <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      case TxStatus.REJECTED:
        return <XCircle className="h-16 w-16 text-red-500 mb-4" />
      case TxStatus.PENDING:
      default:
        return <Clock className="h-16 w-16 text-yellow-500 animate-pulse mb-4" />
    }
  }

  const getStatusTitle = () => {
    switch (selectedTransaction.status) {
      case TxStatus.COMPLETED:
        return "Transfer Successful"
      case TxStatus.REJECTED:
        return "Transfer Failed"
      case TxStatus.PENDING:
      default:
        return "Transfer Processing"
    }
  }

  const getStatusDescription = () => {
    switch (selectedTransaction.status) {
      case TxStatus.COMPLETED:
        return "Your transfer has been completed successfully."
      case TxStatus.REJECTED:
        return selectedTransaction.rejectedReason || "Your transfer could not be processed. Please try again."
      case TxStatus.PENDING:
      default:
        return "Your transfer is being processed. This may take a few minutes."
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex flex-col items-center text-center mb-6">
        {getStatusIcon()}
        <h1 className="text-2xl font-bold">{getStatusTitle()}</h1>
        <p className="text-muted-foreground mt-1">{getStatusDescription()}</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(selectedTransaction.amount)}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">Reference Number</p>
            <p className="font-medium">{selectedTransaction.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date & Time</p>
            <p className="font-medium">{formatDate(selectedTransaction.date)}</p>
          </div>

          {selectedTransaction.status === TxStatus.PENDING && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">Estimated processing time: 10-30 minutes</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button onClick={handleShare} variant="outline" className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share Receipt
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleGoHome} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button onClick={handleNewTransfer}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </div>
      </div>
    </div>
  )
}
