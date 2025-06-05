"use client"

import { useState, useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { updateTransactionStatus, addNotification } from "@/store/slices/walletSlice"
import { AddMoneyResponse, updateTransactionStatus as apiUpdateTransactionStatus, getAddMoneyTransactions } from "@/api/wallet"
import type { WalletTransaction } from "@/types"
import { formatCurrency } from "@/lib/currency-utils"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"
import { TransactionTable } from "@/components/admin/transaction-management/transaction-table"
import { useAlert } from "@/components/ui/alert-component"

export function WalletTransactionsManagement() {
  const dispatch = useAppDispatch()
  const {showAlert} = useAlert()
  const [allTransactions, setAllTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<"PENDING" | "COMPLETED" | "REJECTED">("PENDING")
  const [adminNote, setAdminNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Group transactions by status and organize them in the specified order
  const groupedTransactions = {
    PENDING: allTransactions.filter(tx => tx.status === "PENDING"),
    PROCESSING: allTransactions.filter(tx => tx.status === "PROCESSING"),
    REJECTED: allTransactions.filter(tx => tx.status === "REJECTED"),
    COMPLETED: allTransactions.filter(tx => tx.status === "COMPLETED")
  }

  // Create organized transaction list with section headers
  const organizedTransactions = [
    ...groupedTransactions.PENDING.map((tx, index) => ({
      ...tx,
      isFirstInSection: index === 0,
      sectionTitle: "Pending Transactions",
      sectionCount: groupedTransactions.PENDING.length,
      statusColor: "blue"
    })),
    ...groupedTransactions.PROCESSING.map((tx, index) => ({
      ...tx,
      isFirstInSection: index === 0,
      sectionTitle: "Processing Transactions",
      sectionCount: groupedTransactions.PROCESSING.length,
      statusColor: "yellow"
    })),
    ...groupedTransactions.REJECTED.map((tx, index) => ({
      ...tx,
      isFirstInSection: index === 0,
      sectionTitle: "Rejected Transactions",
      sectionCount: groupedTransactions.REJECTED.length,
      statusColor: "red"
    })),
    ...groupedTransactions.COMPLETED.map((tx, index) => ({
      ...tx,
      isFirstInSection: index === 0,
      sectionTitle: "Completed Transactions",
      sectionCount: groupedTransactions.COMPLETED.length,
      statusColor: "green"
    }))
  ]

  const totalPages = Math.ceil(organizedTransactions.length / itemsPerPage)

  const fetchAllTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await getAddMoneyTransactions()
      console.log('respns', response)
      const transactions = response.data.transactions
      console.log('transaction', transactions)
      setAllTransactions(transactions)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transactions",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllTransactions()
  }, [])

  const handleStatusChange = async () => {
    if (!selectedTransaction) return

    setIsUpdating(true)
    try {
      const result = await apiUpdateTransactionStatus(selectedTransaction.id, newStatus, adminNote)
      console.log('result', result)
      // Update the transaction in the local state
      setAllTransactions((prev) => 
        prev.map((tx) => 
          tx.id === selectedTransaction.id 
            ? { ...tx, status: newStatus, adminNote }
            : tx
        )
      )

      // Update the transaction in the Redux store
      dispatch(
        updateTransactionStatus({
          transactionId: selectedTransaction.id,
          status: newStatus,
          adminNote,
        }),
      )

      // Add a notification for the user
      const notificationMessage =
        newStatus === "COMPLETED"
          ? `Your send request of ${formatCurrency(selectedTransaction.amount, "USD")} has been approved.`
          : `Your send request of ${formatCurrency(selectedTransaction.amount, "USD")} has been rejected.${adminNote ? ` Reason: ${adminNote}` : ""}`

      dispatch(
        addNotification({
          id: uuidv4(),
          transactionId: selectedTransaction.id,
          message: notificationMessage,
          status: "unread",
          createdAt: new Date().toISOString(),
          type: newStatus === "COMPLETED" ? "success" : "error",
        }),
      )

      showAlert({
        type: 'success',
        title: "Status Updated",
        description:`Transaction status has been updated to ${newStatus.toLowerCase()}.`,
      })

      setIsDialogOpen(false)
      setAdminNote("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update transaction status",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const openStatusDialog = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction)
    setNewStatus(transaction.status as any)
    setIsDialogOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transaction Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {groupedTransactions.PENDING.length} pending • {groupedTransactions.PROCESSING.length} processing • {groupedTransactions.REJECTED.length} rejected • {groupedTransactions.COMPLETED.length} completed
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAllTransactions} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Money Transactions</CardTitle>
          <CardDescription>Organized view: Pending → Processing → Rejected → Completed transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={organizedTransactions}
            isLoading={isLoading}
            onViewTransaction={(transaction) => {
              setSelectedTransaction(transaction)
              setIsDialogOpen(true)
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showSectionHeaders={true}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Transaction Status</DialogTitle>
            <DialogDescription>
              Update the status of this transaction. Please provide a reason if rejecting.
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Reference</p>
                  <p className="font-medium">{selectedTransaction.transactionId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(selectedTransaction.amount, "USD")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium">{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedTransaction.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as any)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="PROCESSING">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                        Processing
                      </div>
                    </SelectItem>
                    <SelectItem value="COMPLETED">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Approve
                      </div>
                    </SelectItem>
                    <SelectItem value="REJECTED">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                        Reject
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNote">Admin Note (Optional)</Label>
                <Textarea
                  id="adminNote"
                  placeholder="Add a note about this decision"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}