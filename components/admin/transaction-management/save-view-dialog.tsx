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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { TransactionStatus, TransactionType } from "@/types"

interface SaveViewDialogProps {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
  filters: any
}

export function SaveViewDialog({ open, onClose, onSave, filters }: SaveViewDialogProps) {
  const [viewName, setViewName] = useState("")

  const handleSave = () => {
    if (viewName.trim()) {
      onSave(viewName.trim())
      setViewName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Current View</DialogTitle>
          <DialogDescription>Save your current filter settings for quick access in the future.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="view-name">View Name</Label>
            <Input
              id="view-name"
              placeholder="Enter a name for this view"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Filters Applied</Label>
            <div className="rounded-md border p-3 text-sm">
              {filters.status.length > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Status:</span>
                  <div className="flex flex-wrap gap-1">
                    {filters.status.map((status: TransactionStatus) => (
                      <Badge key={status} variant="secondary" className="text-xs">
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {filters.type.length > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Type:</span>
                  <div className="flex flex-wrap gap-1">
                    {filters.type.map((type: TransactionType) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {filters.dateRange.from && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Date Range:</span>
                  <span>
                    {new Date(filters.dateRange.from).toLocaleDateString()}
                    {filters.dateRange.to && ` - ${new Date(filters.dateRange.to).toLocaleDateString()}`}
                  </span>
                </div>
              )}
              {(filters.amountRange[0] > 0 || filters.amountRange[1] < 10000) && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Amount:</span>
                  <span>
                    ${filters.amountRange[0]} - ${filters.amountRange[1]}
                  </span>
                </div>
              )}
              {filters.userId && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">User:</span>
                  <span>{filters.userId}</span>
                </div>
              )}
              {filters.accountId && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Account:</span>
                  <span>{filters.accountId}</span>
                </div>
              )}
              {filters.priority.length > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Priority:</span>
                  <div className="flex flex-wrap gap-1">
                    {filters.priority.map((priority: string) => (
                      <Badge key={priority} variant="secondary" className="text-xs capitalize">
                        {priority}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {!filters.status.length &&
                !filters.type.length &&
                !filters.dateRange.from &&
                filters.amountRange[0] === 0 &&
                filters.amountRange[1] === 10000 &&
                !filters.userId &&
                !filters.accountId &&
                !filters.priority.length && <span className="text-muted-foreground">No filters applied</span>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!viewName.trim()}>
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
