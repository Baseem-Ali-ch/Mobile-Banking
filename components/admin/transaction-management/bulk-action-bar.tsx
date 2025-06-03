"use client"

import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BulkActionBarProps {
  selectedCount: number
  onApprove: () => void
  onReject: () => void
  onAddNote: () => void
  onExport: () => void
  onClearSelection: () => void
}

export function BulkActionBar({
  selectedCount,
  onApprove,
  onReject,
  onAddNote,
  onExport,
  onClearSelection,
}: BulkActionBarProps) {
  return (
    <Card className="bg-muted">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span className="font-medium">{selectedCount} transactions selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
              onClick={onApprove}
            >
              Approve Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
              onClick={onReject}
            >
              Reject Selected
            </Button>
            <Button size="sm" variant="outline" onClick={onAddNote}>
              Add Note
            </Button>
            <Button size="sm" variant="outline" onClick={onExport}>
              Export Selected
            </Button>
            <Button size="sm" variant="ghost" onClick={onClearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
