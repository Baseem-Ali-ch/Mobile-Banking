"use client"

import { Save, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SavedViewsManagerProps {
  savedViews: any[]
  onApplyView: (viewId: string) => void
  onDeleteView: (viewId: string) => void
  onSaveCurrentView: () => void
}

export function SavedViewsManager({
  savedViews,
  onApplyView,
  onDeleteView,
  onSaveCurrentView,
}: SavedViewsManagerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Saved Views
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Saved Views</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {savedViews.length > 0 ? (
          savedViews.map((view) => (
            <DropdownMenuItem key={view.id} className="flex justify-between items-center">
              <span className="flex-1 cursor-pointer" onClick={() => onApplyView(view.id)}>
                {view.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteView(view.id)
                }}
              >
                <Trash className="h-3.5 w-3.5" />
                <span className="sr-only">Delete view</span>
              </Button>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No saved views</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSaveCurrentView}>
          <Plus className="mr-2 h-4 w-4" />
          Save Current View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
