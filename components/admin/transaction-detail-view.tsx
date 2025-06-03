"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTransactionDetails, updateTransactionStatus } from "@/store/slices/transactionsSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/currency-utils"
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import type { TransactionStatus } from "@/types"

interface TransactionDetailViewProps {
  transactionId: string
}

export function TransactionDetailView({ transactionId }: TransactionDetailViewProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedTransaction, isLoading, error } = useAppSelector((state) => state.transactions)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [statusToUpdate, setStatusToUpdate] = useState<TransactionStatus | null>(null)

  // Fetch transaction details in useEffect instead of during render
  useEffect(() => {
    if (!selectedTransaction && !isLoading && !error) {
      dispatch(fetchTransactionDetails(transactionId))
    }
  }, [dispatch, transactionId, selectedTransaction, isLoading, error])

  const handleStatusUpdate = (status: TransactionStatus) => {
    setStatusToUpdate(status)
    setConfirmDialogOpen(true)
  }

  const confirmStatusUpdate = () => {
    if (statusToUpdate && selectedTransaction) {
      dispatch(
        updateTransactionStatus({
          id: selectedTransaction.id,
          status: statusToUpdate,
        }),
      )
    }
    setConfirmDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "FAILED":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "PROCESSING":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusActionText = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return "approve"
      case "REJECTED":
        return "reject"
      case "PENDING":
        return "mark as pending"
      default:
        return "update"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p>Loading transaction details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <AlertTriangle className="mb-2 h-8 w-8 text-red-500" />
        <p className="mb-2 text-lg font-medium">Error loading transaction</p>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  if (!selectedTransaction) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="mb-2 text-lg font-medium">Transaction not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
        <h1 className="text-2xl font-bold">Transaction Details</h1>
        <p className="text-muted-foreground">View and manage transaction #{selectedTransaction.id.slice(0, 8)}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transaction Information</span>
                {getStatusBadge(selectedTransaction.status)}
              </CardTitle>
              <CardDescription>Created on {new Date(selectedTransaction.date).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                  <p className="font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-xl font-bold">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p>{selectedTransaction.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{selectedTransaction.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p>{selectedTransaction.type}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">From Account</p>
                  <p className="font-mono">{selectedTransaction.fromAccountId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">To Account</p>
                  <p className="font-mono">{selectedTransaction.toAccountId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Transaction Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Transaction Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTransaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedTransaction.status === "PROCESSING" && (
                  <div className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">Transaction is being processed</p>
                    </div>
                  </div>
                )}

                {selectedTransaction.status === "COMPLETED" && (
                  <div className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed</p>
                      <p className="text-sm text-muted-foreground">Transaction was successfully completed</p>
                    </div>
                  </div>
                )}

                {selectedTransaction.status === "REJECTED" && (
                  <div className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Rejected</p>
                      <p className="text-sm text-muted-foreground">Transaction was rejected</p>
                    </div>
                  </div>
                )}

                {selectedTransaction.status === "FAILED" && (
                  <div className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Failed</p>
                      <p className="text-sm text-muted-foreground">Transaction failed to process</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage this transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={selectedTransaction.status === "COMPLETED"}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </Button>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={selectedTransaction.status === "REJECTED"}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Transaction
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleStatusUpdate("PENDING")}
                disabled={selectedTransaction.status === "PENDING"}
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark as Pending
              </Button>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/admin/transactions")}>
                Back to All Transactions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {getStatusActionText(statusToUpdate as TransactionStatus)} this transaction? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
