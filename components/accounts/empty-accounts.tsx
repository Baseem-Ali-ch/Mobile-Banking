"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyAccountsProps {
  onAddAccount: () => void
}

export function EmptyAccounts({ onAddAccount }: EmptyAccountsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-full max-w-md mx-auto">
        <div className="relative mx-auto mb-8">
          {/* Empty card illustration */}
          <div className="w-64 h-40 mx-auto rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 shadow-md transform -rotate-6"></div>
          <div className="w-64 h-40 mx-auto rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 shadow-md absolute top-4 left-1/2 -translate-x-1/2"></div>
          <div className="w-64 h-40 mx-auto rounded-xl bg-gradient-to-r from-primary/70 to-primary/50 shadow-md absolute top-8 left-1/2 -translate-x-1/2 transform rotate-6 flex items-center justify-center">
            <PlusIcon className="h-12 w-12 text-white opacity-70" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">No accounts yet</h3>
        <p className="text-muted-foreground mb-6">Add your first bank account to start managing your finances.</p>

        <Button onClick={onAddAccount} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          <span>Add Your First Account</span>
        </Button>
      </div>
    </div>
  )
}
