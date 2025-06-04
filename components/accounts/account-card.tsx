"use client"

import type React from "react"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BankAccount } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface AccountCardProps {
  account: BankAccount
  onClick?: () => void
}

export function AccountCard({ account, onClick }: AccountCardProps) {

  const formatAccountNumber = (accountNumber: string) => {
    // Show only last 4 digits
    return `•••• •••• •••• ${accountNumber.slice(-4)}`
  }

  const formatIfsc = (ifsc: string) => {
    // Show only last 3 digits
    return `•••• •••• ${ifsc.slice(-3)}`
  }


  // Generate a gradient based on the bank name for visual variety
  const getCardGradient = () => {
    const gradients = [
      "bg-gradient-to-r from-blue-600 to-blue-400",
      "bg-gradient-to-r from-purple-600 to-purple-400",
      "bg-gradient-to-r from-emerald-600 to-emerald-400",
      "bg-gradient-to-r from-rose-600 to-rose-400",
      "bg-gradient-to-r from-amber-600 to-amber-400",
    ]

    // Use a hash of the bank name to select a consistent gradient
    const randomIndex = Math.floor(Math.random() * gradients.length)
    return gradients[randomIndex]
  }

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl",
        getCardGradient(),
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <div className="p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg mt-1">{account.accountHolderName}</h3>
            <p className="text-sm opacity-80">{formatIfsc(account.ifscCode)}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm opacity-80">Card Number</p>
          <p className="font-mono text-lg tracking-wider">{formatAccountNumber(account.accountNumber)}</p>
        </div>

        <div className="mt-6 flex justify-end items-end">
          {account.isDefault && <div className="bg-white/20 px-2 py-1 rounded text-xs font-medium">Default</div>}
        </div>

        {/* Card chip design */}
        <div className="absolute top-6 right-6 w-10 h-7 bg-yellow-300/80 rounded-md border border-yellow-400/50"></div>
      </div>
    </div>
  )
}
