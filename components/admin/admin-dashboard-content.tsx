"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowDownLeft,
  BarChart3,
  CheckCircle,
  CreditCard,
  DollarSign,
  Users,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency-utils"
import { AdminRecentTransactions } from "./admin-recent-transactions"
import { AdminRecentUsers } from "./admin-recent-users"
import { AdminActivityLog } from "./admin-activity-log"
import { AdminStatsOverview } from "./admin-stats-overview"

// Mock data for transactions
const transactions = [
  {
    id: "TRX-78945",
    userName: "John Smith",
    amount: 1250.0,
    fromAccount: "4589-XXXX-XXXX-1234",
    toAccount: "7856-XXXX-XXXX-5678",
    dateTime: "2023-05-15T10:30:00Z",
    status: "COMPLETED",
  },
  {
    id: "TRX-78946",
    userName: "Sarah Johnson",
    amount: 450.75,
    fromAccount: "1234-XXXX-XXXX-5678",
    toAccount: "9876-XXXX-XXXX-5432",
    dateTime: "2023-05-15T09:45:00Z",
    status: "PENDING",
    urgent: true,
  },
  {
    id: "TRX-78947",
    userName: "Michael Brown",
    amount: 2000.0,
    fromAccount: "5678-XXXX-XXXX-9012",
    toAccount: "3456-XXXX-XXXX-7890",
    dateTime: "2023-05-15T08:15:00Z",
    status: "COMPLETED",
  },
  {
    id: "TRX-78948",
    userName: "Emily Davis",
    amount: 300.0,
    fromAccount: "9012-XXXX-XXXX-3456",
    toAccount: "7890-XXXX-XXXX-1234",
    dateTime: "2023-05-14T16:20:00Z",
    status: "FAILED",
  },
  {
    id: "TRX-78949",
    userName: "Robert Wilson",
    amount: 750.0,
    fromAccount: "3456-XXXX-XXXX-7890",
    toAccount: "1234-XXXX-XXXX-5678",
    dateTime: "2023-05-14T14:10:00Z",
    status: "PENDING",
  },
]

// Calculate metrics
const pendingTransactions = transactions.filter((t) => t.status === "PENDING").length
const urgentTransactions = transactions.filter((t) => t.status === "PENDING" && t.urgent).length
const completedToday = transactions.filter((t) => {
  const today = new Date().toISOString().split("T")[0]
  return t.status === "COMPLETED" && t.dateTime.startsWith(today)
}).length
const failedLast24Hours = transactions.filter((t) => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime()
  return t.status === "FAILED" && new Date(t.dateTime).getTime() > yesterday
}).length
const activeUsers = 573 // Mock data

export function AdminDashboardContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Handle transaction click
  const handleTransactionClick = (id: string) => {
    router.push(`/admin/transactions/${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of system performance and recent activities.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-yellow-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <div className="flex items-center space-x-1">
              {urgentTransactions > 0 && (
                <Badge variant="destructive" className="mr-2">
                  {urgentTransactions} Urgent
                </Badge>
              )}
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">Awaiting review or approval</p>
            <Button
              variant="link"
              className="px-0 text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
              onClick={() => router.push("/admin/transactions?status=PENDING")}
            >
              View all pending
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground">Successfully processed today</p>
            <Button
              variant="link"
              className="px-0 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              onClick={() => router.push("/admin/transactions?status=COMPLETED")}
            >
              View completed
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed (24h)</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedLast24Hours}</div>
            <p className="text-xs text-muted-foreground">Failed in the last 24 hours</p>
            <Button
              variant="link"
              className="px-0 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => router.push("/admin/transactions?status=FAILED")}
            >
              View failed
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active on platform</p>
            <Button
              variant="link"
              className="px-0 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => router.push("/admin/users")}
            >
              View all users
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,592</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5% from last hour</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                onClick={() => handleTransactionClick(transaction.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      transaction.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : transaction.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.status === "COMPLETED" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : transaction.status === "PENDING" ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transaction.id}</p>
                    <p className="text-xs text-muted-foreground">{transaction.userName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(transaction.amount, "USD")}</p>
                  <p className="text-xs text-muted-foreground">{new Date(transaction.dateTime).toLocaleString()}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    transaction.status === "COMPLETED"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : transaction.status === "PENDING"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                  {transaction.urgent && transaction.status === "PENDING" && " ⚠️"}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => router.push("/admin/transactions")}>
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <AdminStatsOverview isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <AdminRecentUsers isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <AdminRecentTransactions isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <AdminActivityLog isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
