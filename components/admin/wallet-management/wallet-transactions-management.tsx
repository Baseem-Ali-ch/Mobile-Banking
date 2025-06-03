"use client"

import { useState, useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { updateTransactionStatus, addNotification } from "@/store/slices/walletSlice"
import { getPendingSendTransactions, updateTransactionStatus as apiUpdateTransactionStatus } from "@/api/wallet"
import type { WalletTransaction } from "@/types"
import { formatCurrency } from "@/lib/currency-utils"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"

export function WalletTransactionsManagement() {
  const dispatch = useAppDispatch()
  const [pendingTransactions, setPendingTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<"PENDING" | "COMPLETED" | "REJECTED">("PENDING")
  const [adminNote, setAdminNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchPendingTransactions = async () => {
    setIsLoading(true)
    try {
      const transactions = await getPendingSendTransactions()
      setPendingTransactions(transactions)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch pending transactions",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingTransactions()
  }, [])

  const handleStatusChange = async () => {
    if (!selectedTransaction) return

    setIsUpdating(true)
    try {
      const result = await apiUpdateTransactionStatus(selectedTransaction.id, newStatus, adminNote)

      // Update the transaction in the local state
      setPendingTransactions((prev) => prev.filter((tx) => tx.id !== selectedTransaction.id))

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
          ? `Your send request of ${formatCurrency(selectedTransaction.amount, selectedTransaction.currency)} has been approved.`
          : `Your send request of ${formatCurrency(selectedTransaction.amount, selectedTransaction.currency)} has been rejected.${adminNote ? ` Reason: ${adminNote}` : ""}`

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

      toast({
        title: "Status Updated",
        description: `Transaction status has been updated to ${newStatus.toLowerCase()}.`,
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
    setNewStatus(transaction.status)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pending Send Requests</h2>
        <Button variant="outline" size="sm" onClick={fetchPendingTransactions} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Requests Awaiting Approval</CardTitle>
          <CardDescription>Review and manage pending send requests from users</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pendingTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending send requests found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.reference}</TableCell>
                    <TableCell>{transaction.userId}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount, transaction.currency)}</TableCell>
                    <TableCell>{transaction.bankAccountId}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openStatusDialog(transaction)}>
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
          <p>
            Approved send requests will be processed and funds will be deducted from the user's wallet. Rejected
            requests will be cancelled.
          </p>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Transaction Status</DialogTitle>
            <DialogDescription>Change the status of this send request and provide an optional note.</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Reference</p>
                  <p className="font-medium">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium">{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedTransaction.date).toLocaleString()}</p>
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
