"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { depositToWallet } from "@/store/slices/walletSlice"
import { formatCurrency } from "@/lib/currency-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function WalletDepositForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { wallet, isLoading } = useAppSelector((state) => state.wallet)

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<{ amount?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { amount?: string } = {}

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})

    try {
      // Process the deposit
      await dispatch(
        depositToWallet({
          amount: Number(amount),
          description: description || "Wallet deposit",
        }),
      ).unwrap()

      // Show success message
      toast({
        title: "Deposit Successful",
        description: `${formatCurrency(Number(amount), wallet?.currency || "USD")} has been added to your wallet.`,
        variant: "default",
      })

      // Redirect to wallet page
      router.push("/dashboard/wallet")
    } catch (error) {
      // Show error message
      toast({
        title: "Deposit Failed",
        description: (error as Error).message || "An error occurred while processing your deposit.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2 p-0 h-8 w-8" onClick={() => router.push("/dashboard/wallet")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add Balance</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Funds to Wallet</CardTitle>
          <CardDescription>Instantly add money to your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {wallet?.currency === "USD"
                      ? "$"
                      : wallet?.currency === "EUR"
                        ? "€"
                        : wallet?.currency === "GBP"
                          ? "£"
                          : wallet?.currency === "SAR"
                            ? "﷼"
                            : "$"}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a note for this deposit"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Add Funds"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-muted-foreground border-t pt-4">
          <p className="mb-2">
            <strong>Note:</strong> Funds will be available in your wallet immediately.
          </p>
          <p>By proceeding, you agree to our terms and conditions regarding wallet usage.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
