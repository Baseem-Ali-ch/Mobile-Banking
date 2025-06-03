"use client"
import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/currency-utils"

const recentTransactions = [
  {
    id: "1",
    type: "TRANSFER",
    amount: 1250.0,
    currency: "USD",
    fromAccount: "John Smith",
    toAccount: "Sarah Johnson",
    status: "COMPLETED",
    date: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    type: "PAYMENT",
    amount: 450.75,
    currency: "USD",
    fromAccount: "Michael Brown",
    toAccount: "Electric Company",
    status: "PENDING",
    date: "2023-05-14T16:45:00Z",
  },
  {
    id: "3",
    type: "DEPOSIT",
    amount: 2000.0,
    currency: "USD",
    fromAccount: "External Bank",
    toAccount: "Emily Davis",
    status: "COMPLETED",
    date: "2023-05-13T09:15:00Z",
  },
  {
    id: "4",
    type: "WITHDRAWAL",
    amount: 300.0,
    currency: "USD",
    fromAccount: "Robert Wilson",
    toAccount: "ATM Withdrawal",
    status: "COMPLETED",
    date: "2023-05-12T14:20:00Z",
  },
  {
    id: "5",
    type: "TRANSFER",
    amount: 750.0,
    currency: "USD",
    fromAccount: "Sarah Johnson",
    toAccount: "John Smith",
    status: "FAILED",
    date: "2023-05-11T11:10:00Z",
  },
]

export function AdminRecentTransactions({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Recent transactions across the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>From / To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            transaction.type === "DEPOSIT" || transaction.type === "TRANSFER"
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          {transaction.type === "DEPOSIT" || transaction.type === "TRANSFER" ? (
                            <ArrowDownLeft
                              className={`h-5 w-5 ${
                                transaction.type === "DEPOSIT" || transaction.type === "TRANSFER"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">ID: {transaction.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.fromAccount}</div>
                      <div className="text-sm text-muted-foreground">to {transaction.toAccount}</div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          transaction.status === "COMPLETED"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : transaction.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : transaction.status === "FAILED"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          {transaction.status === "PENDING" && (
                            <>
                              <DropdownMenuItem>Approve</DropdownMenuItem>
                              <DropdownMenuItem>Reject</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>Export Receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
