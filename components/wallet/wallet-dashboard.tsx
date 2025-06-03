"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { getWalletDetails, getWalletTransactions } from "@/store/slices/walletSlice"
import { WalletOverview } from "./wallet-overview"
import { WalletTransactionHistory } from "./wallet-transaction-history"
import { WalletSkeleton } from "./wallet-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, SendIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export function WalletDashboard() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { wallet, isLoading, error } = useAppSelector((state) => state.wallet)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    dispatch(getWalletDetails())
    dispatch(getWalletTransactions())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error])

  const handleRefresh = async () => {
    try {
      await dispatch(getWalletDetails()).unwrap()
      await dispatch(getWalletTransactions()).unwrap()
      toast({
        title: "Refreshed",
        description: "Your wallet information has been updated.",
      })
    } catch (error) {
      // Error is already handled in the error useEffect
    }
  }

  if (isLoading && !wallet) {
    return <WalletSkeleton />
  }

  return (
    <div className="container px-4 py-6 space-y-6 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => router.push("/dashboard/wallet/deposit")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Balance
        </Button>
        <Button
          onClick={() => router.push("/dashboard/wallet/send")}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <SendIcon className="mr-2 h-4 w-4" />
          Send Money
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <WalletOverview />
        </TabsContent>
        <TabsContent value="history">
          <WalletTransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
