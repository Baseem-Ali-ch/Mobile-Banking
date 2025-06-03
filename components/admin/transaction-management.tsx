"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Plus,
  Save,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { format, subDays } from "date-fns"
import { formatCurrency } from "@/lib/currency-utils"
import { cn } from "@/lib/utils"

// Mock data for transactions
const transactions = [
  {
    id: "TRX-78945",
    userId: "USR-12345",
    userName: "John Smith",
    amount: 1250.0,
    fromAccount: "4589-XXXX-XXXX-1234",
    toAccount: "7856-XXXX-XXXX-5678",
    dateTime: "2023-05-15T10:30:00Z",
    status: "COMPLETED",
    type: "TRANSFER",
    priority: "normal",
    description: "Monthly transfer to savings account",
    processingTime: 2.3, // in seconds
  },
  {
    id: "TRX-78946",
    userId: "USR-23456",
    userName: "Sarah Johnson",
    amount: 450.75,
    fromAccount: "1234-XXXX-XXXX-5678",
    toAccount: "9876-XXXX-XXXX-5432",
    dateTime: "2023-05-15T09:45:00Z",
    status: "PENDING",
    type: "PAYMENT",
    priority: "high",
    description: "Utility bill payment",
    processingTime: null,
  },
  {
    id: "TRX-78947",
    userId: "USR-34567",
    userName: "Michael Brown",
    amount: 2000.0,
    fromAccount: "5678-XXXX-XXXX-9012",
    toAccount: "3456-XXXX-XXXX-7890",
    dateTime: "2023-05-15T08:15:00Z",
    status: "COMPLETED",
    type: "DEPOSIT",
    priority: "normal",
    description: "Salary deposit",
    processingTime: 1.8,
  },
  {
    id: "TRX-78948",
    userId: "USR-45678",
    userName: "Emily Davis",
    amount: 300.0,
    fromAccount: "9012-XXXX-XXXX-3456",
    toAccount: "7890-XXXX-XXXX-1234",
    dateTime: "2023-05-14T16:20:00Z",
    status: "FAILED",
    type: "WITHDRAWAL",
    priority: "normal",
    description: "ATM withdrawal",
    processingTime: 4.2,
  },
  {
    id: "TRX-78949",
    userId: "USR-56789",
    userName: "Robert Wilson",
    amount: 750.0,
    fromAccount: "3456-XXXX-XXXX-7890",
    toAccount: "1234-XXXX-XXXX-5678",
    dateTime: "2023-05-14T14:10:00Z",
    status: "PENDING",
    type: "TRANSFER",
    priority: "normal",
    description: "Transfer to checking account",
    processingTime: null,
  },
  {
    id: "TRX-78950",
    userId: "USR-67890",
    userName: "Jennifer Lee",
    amount: 1500.0,
    fromAccount: "7890-XXXX-XXXX-1234",
    toAccount: "5678-XXXX-XXXX-9012",
    dateTime: "2023-05-14T11:30:00Z",
    status: "COMPLETED",
    type: "TRANSFER",
    priority: "normal",
    description: "Investment account funding",
    processingTime: 2.1,
  },
  {
    id: "TRX-78951",
    userId: "USR-78901",
    userName: "David Martinez",
    amount: 950.25,
    fromAccount: "1234-XXXX-XXXX-5678",
    toAccount: "9012-XXXX-XXXX-3456",
    dateTime: "2023-05-14T10:15:00Z",
    status: "COMPLETED",
    type: "PAYMENT",
    priority: "normal",
    description: "Mortgage payment",
    processingTime: 2.5,
  },
  {
    id: "TRX-78952",
    userId: "USR-89012",
    userName: "Lisa Anderson",
    amount: 2500.0,
    fromAccount: "5678-XXXX-XXXX-9012",
    toAccount: "3456-XXXX-XXXX-7890",
    dateTime: "2023-05-14T09:45:00Z",
    status: "PENDING",
    type: "TRANSFER",
    priority: "high",
    description: "Large transfer - needs review",
    processingTime: null,
  },
  {
    id: "TRX-78953",
    userId: "USR-90123",
    userName: "James Taylor",
    amount: 350.0,
    fromAccount: "9012-XXXX-XXXX-3456",
    toAccount: "7890-XXXX-XXXX-1234",
    dateTime: "2023-05-13T16:30:00Z",
    status: "FAILED",
    type: "PAYMENT",
    priority: "normal",
    description: "Insurance payment - insufficient funds",
    processingTime: 3.0,
  },
  {
    id: "TRX-78954",
    userId: "USR-01234",
    userName: "Patricia White",
    amount: 800.0,
    fromAccount: "3456-XXXX-XXXX-7890",
    toAccount: "1234-XXXX-XXXX-5678",
    dateTime: "2023-05-13T14:20:00Z",
    status: "COMPLETED",
    type: "TRANSFER",
    priority: "normal",
    description: "Transfer to joint account",
    processingTime: 1.9,
  },
  {
    id: "TRX-78955",
    userId: "USR-12345",
    userName: "John Smith",
    amount: 1200.0,
    fromAccount: "7890-XXXX-XXXX-1234",
    toAccount: "5678-XXXX-XXXX-9012",
    dateTime: "2023-05-13T11:10:00Z",
    status: "COMPLETED",
    type: "DEPOSIT",
    priority: "normal",
    description: "Check deposit",
    processingTime: 2.2,
  },
  {
    id: "TRX-78956",
    userId: "USR-23456",
    userName: "Sarah Johnson",
    amount: 600.5,
    fromAccount: "1234-XXXX-XXXX-5678",
    toAccount: "9012-XXXX-XXXX-3456",
    dateTime: "2023-05-13T10:05:00Z",
    status: "PENDING",
    type: "PAYMENT",
    priority: "normal",
    description: "Credit card payment",
    processingTime: null,
  },
  {
    id: "TRX-78957",
    userId: "USR-34567",
    userName: "Michael Brown",
    amount: 1800.0,
    fromAccount: "5678-XXXX-XXXX-9012",
    toAccount: "3456-XXXX-XXXX-7890",
    dateTime: "2023-05-13T09:30:00Z",
    status: "COMPLETED",
    type: "TRANSFER",
    priority: "normal",
    description: "Transfer to investment account",
    processingTime: 2.0,
  },
  {
    id: "TRX-78958",
    userId: "USR-45678",
    userName: "Emily Davis",
    amount: 400.0,
    fromAccount: "9012-XXXX-XXXX-3456",
    toAccount: "7890-XXXX-XXXX-1234",
    dateTime: "2023-05-12T16:45:00Z",
    status: "FAILED",
    type: "WITHDRAWAL",
    priority: "normal",
    description: "ATM withdrawal - card expired",
    processingTime: 3.5,
  },
  {
    id: "TRX-78959",
    userId: "USR-56789",
    userName: "Robert Wilson",
    amount: 950.0,
    fromAccount: "3456-XXXX-XXXX-7890",
    toAccount: "1234-XXXX-XXXX-5678",
    dateTime: "2023-05-12T14:35:00Z",
    status: "COMPLETED",
    type: "TRANSFER",
    priority: "normal",
    description: "Regular monthly transfer",
    processingTime: 1.7,
  },
]

// Mock data for users
const users = [
  { id: "USR-12345", name: "John Smith" },
  { id: "USR-23456", name: "Sarah Johnson" },
  { id: "USR-34567", name: "Michael Brown" },
  { id: "USR-45678", name: "Emily Davis" },
  { id: "USR-56789", name: "Robert Wilson" },
  { id: "USR-67890", name: "Jennifer Lee" },
  { id: "USR-78901", name: "David Martinez" },
  { id: "USR-89012", name: "Lisa Anderson" },
  { id: "USR-90123", name: "James Taylor" },
  { id: "USR-01234", name: "Patricia White" },
]

// Mock data for saved views
const savedViews = [
  { id: "view-1", name: "Pending High Value", filters: { status: ["PENDING"], minAmount: 1000 } },
  { id: "view-2", name: "Failed Transactions", filters: { status: ["FAILED"] } },
  { id: "view-3", name: "Today's Completed", filters: { status: ["COMPLETED"], dateRange: "today" } },
]

// Date range presets
const dateRangePresets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last7days" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This month", value: "thismonth" },
  { label: "Last month", value: "lastmonth" },
  { label: "Custom range", value: "custom" },
]

export function TransactionManagement() {
  const router = useRouter()
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>("dateTime")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [bulkActionType, setBulkActionType] = useState<"approve" | "reject" | "note" | null>(null)
  const [bulkActionNote, setBulkActionNote] = useState("")
  const [bulkRejectReason, setBulkRejectReason] = useState("")

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [dateRangeType, setDateRangeType] = useState("last7days")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 5000])
  const [userFilter, setUserFilter] = useState<string>("")
  const [accountFilter, setAccountFilter] = useState<string>("")
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Chart view state
  const [chartView, setChartView] = useState<"daily" | "weekly" | "monthly">("daily")

  // Apply date range preset
  useEffect(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    switch (dateRangeType) {
      case "today":
        setDateRange({
          from: new Date(today.setHours(0, 0, 0, 0)),
          to: today,
        })
        break
      case "yesterday":
        setDateRange({
          from: yesterday,
          to: new Date(yesterday.setHours(23, 59, 59, 999)),
        })
        break
      case "last7days":
        setDateRange({
          from: subDays(today, 7),
          to: today,
        })
        break
      case "last30days":
        setDateRange({
          from: subDays(today, 30),
          to: today,
        })
        break
      case "thismonth":
        setDateRange({
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: today,
        })
        break
      case "lastmonth":
        setDateRange({
          from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          to: new Date(today.getFullYear(), today.getMonth(), 0),
        })
        break
      case "custom":
        // Don't change the date range for custom
        break
    }
  }, [dateRangeType])

  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by status
    if (statusFilter.length > 0 && !statusFilter.includes(transaction.status)) {
      return false
    }

    // Filter by type
    if (typeFilter.length > 0 && !typeFilter.includes(transaction.type)) {
      return false
    }

    // Filter by priority
    if (priorityFilter.length > 0 && !priorityFilter.includes(transaction.priority)) {
      return false
    }

    // Filter by date range
    if (dateRange.from && new Date(transaction.dateTime) < dateRange.from) {
      return false
    }
    if (dateRange.to) {
      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)
      if (new Date(transaction.dateTime) > endDate) {
        return false
      }
    }

    // Filter by amount range
    if (transaction.amount < amountRange[0] || transaction.amount > amountRange[1]) {
      return false
    }

    // Filter by user
    if (userFilter && transaction.userId !== userFilter) {
      return false
    }

    // Filter by account number
    if (accountFilter) {
      const accountFilterLower = accountFilter.toLowerCase()
      if (
        !transaction.fromAccount.toLowerCase().includes(accountFilterLower) &&
        !transaction.toAccount.toLowerCase().includes(accountFilterLower)
      ) {
        return false
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        transaction.id.toLowerCase().includes(query) ||
        transaction.userName.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.fromAccount.toLowerCase().includes(query) ||
        transaction.toAccount.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a]
    let bValue = b[sortField as keyof typeof b]

    // Handle null values
    if (aValue === null) return sortDirection === "asc" ? -1 : 1
    if (bValue === null) return sortDirection === "asc" ? 1 : -1

    // Convert to comparable types if needed
    if (sortField === "dateTime") {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  // Handle checkbox selection
  const toggleSelection = (id: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((transactionId) => transactionId !== id) : [...prev, id],
    )
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(paginatedTransactions.map((t) => t.id))
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset filters
  const resetFilters = () => {
    setStatusFilter([])
    setTypeFilter([])
    setDateRangeType("last7days")
    setDateRange({
      from: subDays(new Date(), 7),
      to: new Date(),
    })
    setAmountRange([0, 5000])
    setUserFilter("")
    setAccountFilter("")
    setPriorityFilter([])
    setSearchQuery("")
    setCurrentPage(1)
  }

  // Apply saved view
  const applySavedView = (viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId)
    if (view) {
      // In a real app, this would apply the saved filters
      toast({
        title: "View Applied",
        description: `Applied saved view: ${view.name}`,
      })
    }
  }

  // Save current view
  const saveCurrentView = () => {
    if (!newViewName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a name for this view",
      })
      return
    }

    // In a real app, this would save the current filters
    toast({
      title: "View Saved",
      description: `Saved view: ${newViewName}`,
    })
    setSaveViewDialogOpen(false)
    setNewViewName("")
  }

  // Handle bulk actions
  const handleBulkAction = (action: "approve" | "reject" | "note" | "export") => {
    if (selectedTransactions.length === 0) {
      toast({
        variant: "destructive",
        title: "No Transactions Selected",
        description: "Please select at least one transaction to perform this action.",
      })
      return
    }

    if (action === "export") {
      // In a real app, this would trigger an export
      toast({
        title: "Exporting Transactions",
        description: `Exporting ${selectedTransactions.length} transactions`,
      })
      return
    }

    setBulkActionType(action === "export" ? null : action)
    setBulkActionDialogOpen(true)
  }

  // Confirm bulk action
  const confirmBulkAction = () => {
    // In a real app, this would perform the actual bulk action
    toast({
      title: "Bulk Action Completed",
      description: `${bulkActionType === "approve" ? "Approved" : bulkActionType === "reject" ? "Rejected" : "Added note to"} ${selectedTransactions.length} transactions`,
    })
    setBulkActionDialogOpen(false)
    setBulkActionType(null)
    setBulkActionNote("")
    setBulkRejectReason("")
    setSelectedTransactions([])
  }

  // Handle transaction click
  const handleTransactionClick = (id: string) => {
    router.push(`/admin/transactions/${id}`)
  }

  // Calculate stats
  const totalTransactions = filteredTransactions.length
  const completedTransactions = filteredTransactions.filter((t) => t.status === "COMPLETED").length
  const pendingTransactions = filteredTransactions.filter((t) => t.status === "PENDING").length
  const failedTransactions = filteredTransactions.filter((t) => t.status === "FAILED").length

  const successRate = totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0

  const processingTimes = filteredTransactions
    .filter((t) => t.processingTime !== null)
    .map((t) => t.processingTime as number)

  const averageProcessingTime =
    processingTimes.length > 0 ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
          <p className="text-muted-foreground">Advanced transaction monitoring and management</p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Saved Views
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Saved Views</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {savedViews.map((view) => (
                <DropdownMenuItem key={view.id} onClick={() => applySavedView(view.id)}>
                  {view.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSaveViewDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Save Current View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showFilterPanel ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilterPanel ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">In selected date range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${successRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                Completed: {completedTransactions}
              </div>
              <div className="text-sm">
                <span className="inline-block h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                Pending: {pendingTransactions}
              </div>
              <div className="text-sm">
                <span className="inline-block h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                Failed: {failedTransactions}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProcessingTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">For completed transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filter Panel */}
      {showFilterPanel && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
            <CardDescription>Refine your transaction view with multiple filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Transaction Status</Label>
                <div className="flex flex-wrap gap-2">
                  {["PENDING", "COMPLETED", "FAILED"].map((status) => (
                    <Badge
                      key={status}
                      variant={statusFilter.includes(status) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer",
                        status === "PENDING" && statusFilter.includes(status) && "bg-yellow-500 hover:bg-yellow-600",
                        status === "COMPLETED" && statusFilter.includes(status) && "bg-green-500 hover:bg-green-600",
                        status === "FAILED" && statusFilter.includes(status) && "bg-red-500 hover:bg-red-600",
                      )}
                      onClick={() => {
                        setStatusFilter((prev) =>
                          prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
                        )
                      }}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["TRANSFER", "PAYMENT", "DEPOSIT", "WITHDRAWAL"].map((type) => (
                    <Badge
                      key={type}
                      variant={typeFilter.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setTypeFilter((prev) =>
                          prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
                        )
                      }}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {["high", "normal", "low"].map((priority) => (
                    <Badge
                      key={priority}
                      variant={priorityFilter.includes(priority) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer",
                        priority === "high" && priorityFilter.includes(priority) && "bg-red-500 hover:bg-red-600",
                        priority === "normal" && priorityFilter.includes(priority) && "bg-blue-500 hover:bg-blue-600",
                        priority === "low" && priorityFilter.includes(priority) && "bg-green-500 hover:bg-green-600",
                      )}
                      onClick={() => {
                        setPriorityFilter((prev) =>
                          prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
                        )
                      }}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRangeType} onValueChange={setDateRangeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangePresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {dateRangeType === "custom" && (
                  <div className="pt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            "Select date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Amount Range (${amountRange[0]} - ${amountRange[1]})
                </Label>
                <Slider
                  value={amountRange}
                  min={0}
                  max={5000}
                  step={100}
                  onValueChange={setAmountRange}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>User</Label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Users</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  placeholder="Search by account number"
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button onClick={() => setShowFilterPanel(false)}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedTransactions.length > 0 && (
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedTransactions.length} transactions selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                  Approve Selected
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("reject")}>
                  Reject Selected
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("note")}>
                  Add Note
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                  Export Selected
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedTransactions([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        paginatedTransactions.length > 0 && selectedTransactions.length === paginatedTransactions.length
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSortChange("id")}>
                    <div className="flex items-center">
                      ID
                      {sortField === "id" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4 opacity-0" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("userName")}>
                    <div className="flex items-center">
                      User
                      {sortField === "userName" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4 opacity-0" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("amount")}>
                    <div className="flex items-center">
                      Amount
                      {sortField === "amount" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4 opacity-0" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">From/To</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("dateTime")}>
                    <div className="flex items-center">
                      Date/Time
                      {sortField === "dateTime" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4 opacity-0" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("status")}>
                    <div className="flex items-center">
                      Status
                      {sortField === "status" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4 opacity-0" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSortChange("type")}>
                    <div className="flex items-center">
                      Type
                      {sortField === "type" ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="ml-1 h-4 w-4 opacity-0" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <>
                      <TableRow
                        key={transaction.id}
                        className={cn(
                          "cursor-pointer hover:bg-muted/50",
                          transaction.priority === "high" && "bg-red-50 dark:bg-red-950/20",
                          expandedRows.includes(transaction.id) && "bg-muted",
                        )}
                      >
                        <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedTransactions.includes(transaction.id)}
                            onCheckedChange={() => toggleSelection(transaction.id)}
                            aria-label={`Select transaction ${transaction.id}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium" onClick={() => handleTransactionClick(transaction.id)}>
                          {transaction.id}
                        </TableCell>
                        <TableCell onClick={() => handleTransactionClick(transaction.id)}>
                          {transaction.userName}
                        </TableCell>
                        <TableCell onClick={() => handleTransactionClick(transaction.id)}>
                          {formatCurrency(transaction.amount, "USD")}
                        </TableCell>
                        <TableCell
                          className="hidden md:table-cell"
                          onClick={() => handleTransactionClick(transaction.id)}
                        >
                          <div className="text-xs">
                            <div>From: {transaction.fromAccount}</div>
                            <div>To: {transaction.toAccount}</div>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handleTransactionClick(transaction.id)}>
                          {new Date(transaction.dateTime).toLocaleString()}
                        </TableCell>
                        <TableCell onClick={() => handleTransactionClick(transaction.id)}>
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
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="hidden md:table-cell"
                          onClick={() => handleTransactionClick(transaction.id)}
                        >
                          {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
                        </TableCell>
                        <TableCell className="p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleRowExpansion(transaction.id)
                            }}
                          >
                            {expandedRows.includes(transaction.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(transaction.id) && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={9} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Transaction Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">User ID:</span>
                                    <span className="col-span-2">{transaction.userId}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Description:</span>
                                    <span className="col-span-2">{transaction.description}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Priority:</span>
                                    <span className="col-span-2 capitalize">{transaction.priority}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Processing Time:</span>
                                    <span className="col-span-2">
                                      {transaction.processingTime !== null
                                        ? `${transaction.processingTime}s`
                                        : "Pending"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Quick Actions</h4>
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" onClick={() => handleTransactionClick(transaction.id)}>
                                    View Details
                                  </Button>
                                  {transaction.status === "PENDING" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                                        onClick={() => {
                                          setBulkActionType("approve")
                                          setSelectedTransactions([transaction.id])
                                          setBulkActionDialogOpen(true)
                                        }}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                                        onClick={() => {
                                          setBulkActionType("reject")
                                          setSelectedTransactions([transaction.id])
                                          setBulkActionDialogOpen(true)
                                        }}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setBulkActionType("note")
                                      setSelectedTransactions([transaction.id])
                                      setBulkActionDialogOpen(true)
                                    }}
                                  >
                                    Add Note
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No transactions found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}{" "}
                transactions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Tabs value={chartView} onValueChange={(value) => setChartView(value as any)}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-3">Transaction Volume</h3>
              <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Transaction volume chart would appear here</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Success/Fail Ratio</h3>
              <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Success/fail ratio chart would appear here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Processing Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Processing Tools</CardTitle>
          <CardDescription>Configure automated transaction processing rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Schedule Reviews</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="schedule-daily">Daily Review</Label>
                <Switch id="schedule-daily" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="schedule-high-value">High Value Transactions</Label>
                <Switch id="schedule-high-value" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="schedule-suspicious">Suspicious Activity</Label>
                <Switch id="schedule-suspicious" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Transaction Priorities</h3>
              <div className="space-y-2">
                <Label>High Priority Threshold</Label>
                <div className="flex items-center gap-2">
                  <span>$</span>
                  <Input type="number" defaultValue="1000" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Transactions above this amount will be marked as high priority
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Label htmlFor="priority-international">Flag International</Label>
                <Switch id="priority-international" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Automatic Approvals</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-trusted">Trusted Accounts</Label>
                <Switch id="auto-trusted" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-small">Small Transactions</Label>
                <Switch id="auto-small" />
              </div>
              <div className="space-y-2 mt-4">
                <Label>Small Transaction Threshold</Label>
                <div className="flex items-center gap-2">
                  <span>$</span>
                  <Input type="number" defaultValue="100" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save View Dialog */}
      <Dialog open={saveViewDialogOpen} onOpenChange={setSaveViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current View</DialogTitle>
            <DialogDescription>Save your current filter settings for quick access in the future.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="view-name">View Name</Label>
              <Input
                id="view-name"
                placeholder="Enter a name for this view"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Filters Applied</Label>
              <div className="rounded-md border p-3 text-sm">
                {statusFilter.length > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Status:</span>
                    <div className="flex flex-wrap gap-1">
                      {statusFilter.map((status) => (
                        <Badge key={status} variant="secondary" className="text-xs">
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {typeFilter.length > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Type:</span>
                    <div className="flex flex-wrap gap-1">
                      {typeFilter.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {dateRange.from && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Date Range:</span>
                    <span>
                      {format(dateRange.from, "LLL dd, y")}
                      {dateRange.to && ` - ${format(dateRange.to, "LLL dd, y")}`}
                    </span>
                  </div>
                )}
                {(amountRange[0] > 0 || amountRange[1] < 5000) && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Amount:</span>
                    <span>
                      ${amountRange[0]} - ${amountRange[1]}
                    </span>
                  </div>
                )}
                {userFilter && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">User:</span>
                    <span>{users.find((u) => u.id === userFilter)?.name || userFilter}</span>
                  </div>
                )}
                {accountFilter && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Account:</span>
                    <span>{accountFilter}</span>
                  </div>
                )}
                {priorityFilter.length > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Priority:</span>
                    <div className="flex flex-wrap gap-1">
                      {priorityFilter.map((priority) => (
                        <Badge key={priority} variant="secondary" className="text-xs capitalize">
                          {priority}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {!statusFilter.length &&
                  !typeFilter.length &&
                  !dateRange.from &&
                  amountRange[0] === 0 &&
                  amountRange[1] === 5000 &&
                  !userFilter &&
                  !accountFilter &&
                  !priorityFilter.length && <span className="text-muted-foreground">No filters applied</span>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveViewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCurrentView}>Save View</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkActionType === "approve"
                ? "Approve Transactions"
                : bulkActionType === "reject"
                  ? "Reject Transactions"
                  : "Add Note to Transactions"}
            </DialogTitle>
            <DialogDescription>
              {bulkActionType === "approve"
                ? "Approve the selected transactions"
                : bulkActionType === "reject"
                  ? "Reject the selected transactions"
                  : "Add a note to the selected transactions"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <div className="font-medium mb-2">Selected Transactions ({selectedTransactions.length})</div>
              <div className="max-h-32 overflow-y-auto rounded-md border p-2">
                {selectedTransactions.map((id) => {
                  const transaction = transactions.find((t) => t.id === id)
                  return (
                    <div key={id} className="flex items-center justify-between py-1 text-sm">
                      <span>{id}</span>
                      <span>{transaction ? formatCurrency(transaction.amount, "USD") : ""}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {bulkActionType === "reject" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rejection Reason</Label>
                  <Select value={bulkRejectReason} onValueChange={setBulkRejectReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insufficient_funds">Insufficient Funds</SelectItem>
                      <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                      <SelectItem value="invalid_account_information">Invalid Account Information</SelectItem>
                      <SelectItem value="exceeds_transaction_limit">Exceeds Transaction Limit</SelectItem>
                      <SelectItem value="duplicate_transaction">Duplicate Transaction</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(bulkActionType === "note" || bulkActionType === "reject") && (
              <div className="space-y-2 mt-4">
                <Label>{bulkActionType === "note" ? "Note" : "Additional Comments"}</Label>
                <Textarea
                  placeholder={
                    bulkActionType === "note"
                      ? "Enter a note for these transactions"
                      : "Provide additional details about the rejection"
                  }
                  value={bulkActionNote}
                  onChange={(e) => setBulkActionNote(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              <Checkbox id="notify-users" defaultChecked />
              <Label htmlFor="notify-users">Notify affected users</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={bulkActionType === "reject" ? "destructive" : "default"}
              onClick={confirmBulkAction}
              disabled={bulkActionType === "reject" && !bulkRejectReason}
            >
              {bulkActionType === "approve"
                ? "Approve Transactions"
                : bulkActionType === "reject"
                  ? "Reject Transactions"
                  : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
