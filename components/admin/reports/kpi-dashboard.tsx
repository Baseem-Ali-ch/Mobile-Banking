"use client"

import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, ClockIcon, PercentIcon, TrendingUpIcon, UsersIcon } from "lucide-react"

export function KpiDashboard() {
  const { data } = useAppSelector((state) => state.reports.kpi)

  // Mock data for demonstration
  const mockData = {
    transactionVolume: {
      daily: 1250,
      weekly: 8750,
      monthly: 37500,
      yearToDate: 450000,
    },
    averageApprovalTime: {
      current: 12.5, // in minutes
      previousPeriod: 15.2,
      percentChange: -17.8,
    },
    rejectionRate: {
      current: 4.2, // percentage
      previousPeriod: 5.8,
      percentChange: -27.6,
    },
    userGrowth: {
      daily: 24,
      weekly: 168,
      monthly: 720,
      percentChange: 12.5,
    },
    systemPerformance: {
      uptime: 99.98, // percentage
      responseTime: 245, // in ms
      errorRate: 0.02, // percentage
    },
  }

  // Use real data if available, otherwise use mock data
  const kpiData = data || mockData

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.transactionVolume.daily.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Daily</p>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-muted-foreground">MTD: {kpiData.transactionVolume.monthly.toLocaleString()}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-muted-foreground">YTD: {kpiData.transactionVolume.yearToDate.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Approval Time</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.averageApprovalTime.current.toFixed(1)} min</div>
          <div className="mt-2 flex items-center text-xs">
            {kpiData.averageApprovalTime.percentChange < 0 ? (
              <div className="flex items-center text-green-500">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {Math.abs(kpiData.averageApprovalTime.percentChange).toFixed(1)}% from last period
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {kpiData.averageApprovalTime.percentChange.toFixed(1)}% from last period
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejection Rate</CardTitle>
          <PercentIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.rejectionRate.current.toFixed(1)}%</div>
          <div className="mt-2 flex items-center text-xs">
            {kpiData.rejectionRate.percentChange < 0 ? (
              <div className="flex items-center text-green-500">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {Math.abs(kpiData.rejectionRate.percentChange).toFixed(1)}% from last period
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {kpiData.rejectionRate.percentChange.toFixed(1)}% from last period
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Growth</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{kpiData.userGrowth.daily}</div>
          <p className="text-xs text-muted-foreground">New users today</p>
          <div className="mt-2 flex items-center text-xs">
            <div className="flex items-center text-green-500">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              {kpiData.userGrowth.percentChange.toFixed(1)}% from last period
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Performance</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.systemPerformance.uptime.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">Uptime</p>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-muted-foreground">
              Response: {kpiData.systemPerformance.responseTime}ms • Error: {kpiData.systemPerformance.errorRate}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
