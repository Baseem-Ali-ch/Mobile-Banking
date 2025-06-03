"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchDashboardData, pollTransactionStatus } from "@/store/slices/dashboardSlice"
import { getWalletDetails } from "@/store/slices/walletSlice"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"
import { toast } from "@/components/ui/use-toast"
import { DashboardWalletOverview } from "@/components/dashboard/dashboard-wallet-overview"

export function DashboardContent() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.dashboard)
  const { wallet, isLoading: isWalletLoading } = useAppSelector((state) => state.wallet)

  useEffect(() => {
    dispatch(fetchDashboardData())
    dispatch(getWalletDetails())

    // Set up polling for transaction status updates
    const pollingInterval = setInterval(() => {
      dispatch(pollTransactionStatus())
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(pollingInterval)
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
      await dispatch(fetchDashboardData()).unwrap()
      await dispatch(getWalletDetails()).unwrap()
    } catch (error) {
      // Error is already handled in the error useEffect
    }
  }

  if ((isLoading || isWalletLoading) && !error) {
    return <DashboardSkeleton />
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="container px-4 py-6 space-y-6 pb-20">
        <DashboardHeader />
        <DashboardWalletOverview />
        <RecentTransactions />
        <QuickActions />
      </div>
    </PullToRefresh>
  )
}
