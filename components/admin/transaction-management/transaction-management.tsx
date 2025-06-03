"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, RefreshCcw, Download, Plus } from "lucide-react"
import { fetchTransactions } from "@/store/slices/transactionsSlice"
import { TransactionStatus } from "@/types"
import { TransactionList } from "./transaction-list"
import { TransactionFilterDrawer } from "./transaction-filter-drawer"
import { TransactionStats } from "./transaction-stats"

export function TransactionManagement() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { transactions, loading, error } = useAppSelector((state) => state.transactions)

  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Filter transactions based on active tab and search query
  const filteredTransactions = transactions.filter((transaction) => {
    // First filter by tab (status)
    const statusMatch =
      activeTab === "all" ||
      (activeTab === "pending" && transaction.status === TransactionStatus.PENDING) ||
      (activeTab === "rejected" && transaction.status === TransactionStatus.REJECTED)

    // Then filter by search query
    const searchMatch =
      searchQuery === "" ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.fromAccountName && transaction.fromAccountName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.toAccountName && transaction.toAccountName.toLowerCase().includes(searchQuery.toLowerCase()))

    return statusMatch && searchMatch
  })

  // Count transactions by status for badges
  const pendingCount = transactions.filter((t) => t.status === TransactionStatus.PENDING).length
  const rejectedCount = transactions.filter((t) => t.status === TransactionStatus.REJECTED).length
  const totalCount = transactions.length

  useEffect(() => {
    // Fetch transactions on component mount
    dispatch(fetchTransactions())
  }, [dispatch])

  const handleViewTransaction = (id: string) => {
    router.push(`/admin/transactions/${id}`)
  }

  const handleRefresh = () => {
    dispatch(fetchTransactions())
  }

  const handleCreateTransaction = () => {
    router.push("/admin/transactions/new")
  }

  return (
    <div className="container px-4 py-6 space-y-6 pb-24 md:pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaction Management</h1>
          <p className="text-muted-foreground">View and manage all transaction activities</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)} className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm" onClick={handleCreateTransaction} className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      <TransactionStats transactions={transactions} />

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="relative">
                All
                <Badge
                  variant="secondary"
                  className="ml-1 absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {totalCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                <Badge
                  variant="secondary"
                  className="ml-1 absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {pendingCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="relative">
                Rejected
                <Badge
                  variant="secondary"
                  className="ml-1 absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {rejectedCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                error={error}
                onViewTransaction={handleViewTransaction}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                error={error}
                onViewTransaction={handleViewTransaction}
                emptyMessage="No pending transactions found"
              />
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                error={error}
                onViewTransaction={handleViewTransaction}
                emptyMessage="No rejected transactions found"
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      <TransactionFilterDrawer open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  )
}
