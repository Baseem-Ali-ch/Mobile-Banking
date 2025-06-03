"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTransactions } from "@/store/slices/transactionsSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, Search, RefreshCw } from "lucide-react"
import { TransactionTable } from "@/components/admin/transaction-management/transaction-table"
import { TransactionFilterDrawer } from "@/components/admin/transaction-management/transaction-filter-drawer"
import { TransactionStats } from "@/components/admin/transaction-management/transaction-stats"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/types"

export default function TransactionsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { transactions, filteredTransactions, isLoading } = useAppSelector((state) => state.transactions)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const pendingTransactions = filteredTransactions.filter((transaction) => transaction.status === "PENDING")

  const rejectedTransactions = filteredTransactions.filter((transaction) => transaction.status === "REJECTED")

  const handleViewTransaction = (transaction: Transaction) => {
    router.push(`/admin/transactions/${transaction.id}`)
  }

  const handleRefresh = () => {
    dispatch(fetchTransactions())
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaction Management</h1>
          <p className="text-muted-foreground">View and manage all transactions</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <TransactionStats />

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All Transactions
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{filteredTransactions.length}</span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                  {pendingTransactions.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
                  {rejectedTransactions.length}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <TransactionTable
                transactions={filteredTransactions}
                isLoading={isLoading}
                onViewTransaction={handleViewTransaction}
              />
            </TabsContent>
            <TabsContent value="pending">
              <TransactionTable
                transactions={pendingTransactions}
                isLoading={isLoading}
                onViewTransaction={handleViewTransaction}
              />
            </TabsContent>
            <TabsContent value="rejected">
              <TransactionTable
                transactions={rejectedTransactions}
                isLoading={isLoading}
                onViewTransaction={handleViewTransaction}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TransactionFilterDrawer open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  )
}
