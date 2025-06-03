"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransactionBulkActionDialogProps {
  open: boolean
  actionType: "approve" | "reject" | "note" | null
  selectedCount: number
  onClose: () => void
  onConfirm: (data: any) => void
  isLoading: boolean
}

export function TransactionBulkActionDialog({
  open,
  actionType,
  selectedCount,
  onClose,
  onConfirm,
  isLoading,
}: TransactionBulkActionDialogProps) {
  const [note, setNote] = useState("")
  const [reason, setReason] = useState("")
  const [notifyUsers, setNotifyUsers] = useState(true)

  const handleConfirm = () => {
    if (actionType === "reject" && !reason) {
      return // Validation: Require reason for rejection
    }

    onConfirm({
      note,
      reason,
      notifyUsers,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "approve"
              ? "Approve Transactions"
              : actionType === "reject"
                ? "Reject Transactions"
                : "Add Note to Transactions"}
          </DialogTitle>
          <DialogDescription>
            {actionType === "approve"
              ? "Approve the selected transactions"
              : actionType === "reject"
                ? "Reject the selected transactions"
                : "Add a note to the selected transactions"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <div className="font-medium mb-2">Selected Transactions ({selectedCount})</div>
          </div>

          {actionType === "reject" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insufficient_funds">Insufficient Funds</SelectItem>
                    <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                    <SelectItem value="invalid_account_information">Invalid Account Information</SelectItem>
                    <SelectItem value="exceeds_transaction_limit">Exceeds Transaction Limit</SelectItem>
                    <SelectItem value="duplicate_transaction">Duplicate Transaction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2 mt-4">
            <Label>{actionType === "note" ? "Note" : "Additional Comments"}</Label>
            <Textarea
              placeholder={actionType === "note" ? "Enter a note for these transactions" : "Provide additional details"}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              id="notify-users"
              checked={notifyUsers}
              onCheckedChange={(checked) => setNotifyUsers(!!checked)}
            />
            <Label htmlFor="notify-users">Notify affected users</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={actionType === "reject" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading || (actionType === "reject" && !reason)}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                {actionType === "approve"
                  ? "Approve Transactions"
                  : actionType === "reject"
                    ? "Reject Transactions"
                    : "Add Note"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
