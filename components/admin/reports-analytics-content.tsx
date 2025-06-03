"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchKpiData,
  fetchTransactionVolumeData,
  fetchUserGrowthData,
  fetchTransactionPatternData,
  setDateRange,
} from "@/store/slices/reportsSlice"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KpiDashboard } from "./reports/kpi-dashboard"
import { TransactionVolumeChart } from "./reports/transaction-volume-chart"
import { UserGrowthChart } from "./reports/user-growth-chart"
import { TransactionPatterns } from "./reports/transaction-patterns"
import { SystemPerformance } from "./reports/system-performance"
import { ReportsSkeleton } from "./reports/reports-skeleton"

export function ReportsAnalyticsContent() {
  const dispatch = useAppDispatch()
  const { dateRange } = useAppSelector((state) => state.reports)
  const kpiLoading = useAppSelector((state) => state.reports.kpi.loading)
  const transactionVolumeLoading = useAppSelector((state) => state.reports.transactionVolume.loading)
  const userGrowthLoading = useAppSelector((state) => state.reports.userGrowth.loading)
  const transactionPatternsLoading = useAppSelector((state) => state.reports.transactionPatterns.loading)

  const isLoading = kpiLoading || transactionVolumeLoading || userGrowthLoading || transactionPatternsLoading

  useEffect(() => {
    // Fetch all data when component mounts or date range changes
    dispatch(fetchKpiData(dateRange))
    dispatch(fetchTransactionVolumeData(dateRange))
    dispatch(fetchUserGrowthData(dateRange))
    dispatch(fetchTransactionPatternData(dateRange))
  }, [dispatch, dateRange])

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    dispatch(
      setDateRange({
        startDate: range.from.toISOString().split("T")[0],
        endDate: range.to.toISOString().split("T")[0],
      }),
    )
  }

  if (isLoading) {
    return <ReportsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into system performance and transaction patterns.
          </p>
        </div>
        <DatePickerWithRange
          date={{
            from: new Date(dateRange.startDate),
            to: new Date(dateRange.endDate),
          }}
          setDate={(range) => {
            if (range?.from && range?.to) {
              handleDateRangeChange({ from: range.from, to: range.to })
            }
          }}
        />
      </div>

      <KpiDashboard />

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="transactions">Transaction Volume</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="patterns">Transaction Patterns</TabsTrigger>
          <TabsTrigger value="system">System Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="space-y-4">
          <TransactionVolumeChart />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <UserGrowthChart />
        </TabsContent>
        <TabsContent value="patterns" className="space-y-4">
          <TransactionPatterns />
        </TabsContent>
        <TabsContent value="system" className="space-y-4">
          <SystemPerformance />
        </TabsContent>
      </Tabs>
    </div>
  )
}
