"use client"

import { useState, useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { addNotification } from "@/store/slices/walletSlice"
import { updateTransactionStatus as apiUpdateTransactionStatus, getAddMoneyTransactions } from "@/api/wallet"
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
import { updateTransactionStatus } from "@/store/slices/transactionsSlice"

export function WalletTransactionsManagement() {
  const dispatch = useAppDispatch()
  const { showAlert } = useAlert()
  const [allTransactions, setAllTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<"PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED">()
  const [adminNote, setAdminNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [transactionId, setTransactionId] = useState("")
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isProcessingStatus, setIsProcessingStatus] = useState(false)

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
      const transactions = response.data.transactions
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

  const handleTransactionIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transactionId) return

    try {
      setIsTransactionModalOpen(false)
      setIsDialogOpen(true)
      setNewStatus("PROCESSING")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to store transaction ID",
      })
    }
  }

  const handleProcessClick = () => {
    setIsTransactionModalOpen(true)
  }

  const handleStatusChange = async () => {
    if (!transactionId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a transaction ID",
      })
      return
    }

    try {
      setIsUpdating(true)
      const result = await dispatch(updateTransactionStatus({
        id: selectedTransaction?.id,
        transactionId,
        status: newStatus as any,
        adminNote: adminNote || ""
      }))
      
      if (newStatus === "PROCESSING") {
        setIsProcessingStatus(true)
      }
      
      await fetchAllTransactions()
      showAlert({
        type: 'success',
        title: "Success",
        description: (result.payload as any)?.message || "Transaction status updated successfully",
      })

      setIsDialogOpen(false)
      setAdminNote("")
      setTransactionId("")
    } catch (error) {
      showAlert({
        type: "error",
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
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Transaction ID</DialogTitle>
            <DialogDescription>
              Please enter the transaction ID to update its status to Processing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransactionIdSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transactionId" className="text-center">
                  Transaction ID
                </Label>
                <input
                  id="transactionId"
                  value={transactionId}
                  placeholder="Enter transaction id"
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="col-span-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <DialogDescription>
              Follow this format: TXN_20240115_001
            </DialogDescription>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                <Select value={newStatus} onValueChange={(value) => {
                  setNewStatus(value as any)
                  if (value === "PROCESSING") {
                    handleProcessClick()
                  }
                }}>
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

              {newStatus === "REJECTED" && (
                <div className="space-y-2">
                  <Label htmlFor="adminNote">Reason for rejection</Label>
                  <Textarea
                    id="adminNote"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Please provide a reason for rejecting this transaction..."
                  />
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChange} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </div>
  )
}