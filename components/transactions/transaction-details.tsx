"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTransactionDetails, retryTransaction, cancelTransaction } from "@/store/slices/transactionsSlice"
import { ArrowLeft, Share2, RefreshCw, XCircle, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { TransactionDetailsSkeleton } from "@/components/transactions/transaction-details-skeleton"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currency-utils"
import { TransactionStatus, TransactionType } from "@/types"

interface TransactionDetailsProps {
  id: string
}

export function TransactionDetails({ id }: TransactionDetailsProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedTransaction, isLoading, error } = useAppSelector((state) => state.transactions)
  const { currency } = useAppSelector((state) => state.settings)

  useEffect(() => {
    dispatch(fetchTransactionDetails(id))
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

  const handleRetry = async () => {
    if (!selectedTransaction) return

    try {
      await dispatch(retryTransaction(selectedTransaction.id)).unwrap()
      toast({
        title: "Transaction Retried",
        description: "Your transaction has been resubmitted for processing.",
      })
      router.push(`/dashboard/transfer/status?id=${selectedTransaction.id}`)
    } catch (error) {
      // Error is already handled in the error useEffect
    }
  }

  const handleCancel = async () => {
    if (!selectedTransaction) return

    try {
      await dispatch(cancelTransaction(selectedTransaction.id)).unwrap()
      toast({
        title: "Transaction Cancelled",
        description: "Your transaction has been cancelled successfully.",
      })
      // Refresh the transaction details
      dispatch(fetchTransactionDetails(id))
    } catch (error) {
      // Error is already handled in the error useEffect
    }
  }

  const handleShare = () => {
    if (!selectedTransaction) return

    // In a real app, this would generate a shareable receipt
    // For now, we'll just show a toast
    toast({
      title: "Share Receipt",
      description: "This feature will be available soon.",
    })
  }

  const handleDownload = () => {
    if (!selectedTransaction) return

    // In a real app, this would download a receipt
    // For now, we'll just show a toast
    toast({
      title: "Download Receipt",
      description: "This feature will be available soon.",
    })
  }

  if (isLoading || !selectedTransaction) {
    return <TransactionDetailsSkeleton />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date)
  }

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case TransactionStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-500" />
      case TransactionStatus.CANCELLED:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
      case TransactionStatus.PENDING:
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
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
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Transaction Details</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    selectedTransaction.type === TransactionType.DEPOSIT
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {selectedTransaction.type === TransactionType.DEPOSIT ? "+" : "-"}
                  {formatCurrency(selectedTransaction.amount, currency)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedTransaction.status)}
                {getStatusBadge(selectedTransaction.status)}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium">{selectedTransaction.fromAccountName || "External Account"}</p>
              {selectedTransaction.fromAccountId !== "external" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    •••• {selectedTransaction.fromAccountNumber?.slice(-4) || ""}
                  </p>
                  {selectedTransaction.fromIfscCode && (
                    <p className="text-sm text-muted-foreground font-mono">IFSC: {selectedTransaction.fromIfscCode}</p>
                  )}
                </>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium">{selectedTransaction.toAccountName || "External Account"}</p>
              {selectedTransaction.toAccountId !== "external" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    •••• {selectedTransaction.toAccountNumber?.slice(-4) || ""}
                  </p>
                  {selectedTransaction.toIfscCode && (
                    <p className="text-sm text-muted-foreground font-mono">IFSC: {selectedTransaction.toIfscCode}</p>
                  )}
                </>
              )}
            </div>

            {selectedTransaction.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{selectedTransaction.category}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="font-medium">{selectedTransaction.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{formatDate(selectedTransaction.date)}</p>
            </div>

            {selectedTransaction.status === TransactionStatus.REJECTED && selectedTransaction.rejectedReason && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">Reason for Rejection</p>
                <p className="text-sm text-red-700 dark:text-red-200 mt-1">{selectedTransaction.rejectedReason}</p>
              </div>
            )}

            {selectedTransaction.status === TransactionStatus.PENDING && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  This transaction is being processed and may take up to 30 minutes to complete.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium">Transaction Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Transaction Initiated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
              </div>

              {selectedTransaction.status !== TransactionStatus.PENDING && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(selectedTransaction.status)}</div>
                  <div>
                    <p className="font-medium">
                      {selectedTransaction.status === TransactionStatus.COMPLETED
                        ? "Transaction Completed"
                        : selectedTransaction.status === TransactionStatus.REJECTED
                          ? "Transaction Rejected"
                          : "Transaction Cancelled"}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedTransaction.updatedAt)}</p>
                  </div>
                </div>
              )}

              {selectedTransaction.status === TransactionStatus.PENDING && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">Transaction is being processed</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>

          {selectedTransaction.status === TransactionStatus.REJECTED && (
            <Button onClick={handleRetry} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Transaction
            </Button>
          )}

          {selectedTransaction.status === TransactionStatus.PENDING && (
            <Button onClick={handleCancel} variant="destructive" className="w-full gap-2">
              <XCircle className="h-4 w-4" />
              Cancel Transaction
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
