"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  PenSquare,
  RefreshCcw,
  Search,
  UserPlus,
  X,
  Mail,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { UserStatus, type User } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchUserBankAccounts,
  fetchUserActivityLog,
  setSearchTerm,
  setStatusFilter,
  setActivityFilter,
  setDateRange,
  resetFilters,
  selectUser,
  selectAllUsers,
  clearSelection,
  setSelectedUser,
  setDetailPanelOpen,
  setAddUserDialogOpen,
  setBulkActionDialogOpen,
  setBulkAction,
  setSortConfig,
  bulkUpdateUserStatus,
  exportUsers,
  updateUserStatus,
  fetchUsers,
} from "@/store/slices/userManagementSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { subDays } from "date-fns"
import { createAsyncThunk } from "@reduxjs/toolkit"

// Mock data for users
const mockUsers: User[] = [
  {
    id: "USR001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "+1234567890",
    createdAt: "2023-01-15T10:30:00Z",
    lastLogin: "2023-05-20T14:45:00Z",
    twoFactorEnabled: true,
    notificationPreferences: {
      transactions: true,
      balanceUpdates: true,
      securityAlerts: true,
      marketing: false,
    },
    appPreferences: {
      language: "en",
      theme: "light",
      defaultCurrency: "USD",
    },
    verificationStatus: "verified",
    verificationDocuments: [
      {
        type: "ID",
        status: "verified",
        uploadedAt: "2023-01-16T11:20:00Z",
      },
      {
        type: "Address",
        status: "verified",
        uploadedAt: "2023-01-16T11:25:00Z",
      },
    ],
    status: UserStatus.ACTIVE,
    role: "USER",
    linkedAccounts: 3,
    transactionCount: 47,
    transactionVolume: 15420.5,
    riskLevel: "low",
    kycStatus: "complete",
    lastActivity: "2023-05-20T14:45:00Z",
    notes: "Regular user with good standing.",
  },
  {
    id: "USR002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phoneNumber: "+1987654321",
    createdAt: "2023-02-10T09:15:00Z",
    lastLogin: "2023-05-19T16:30:00Z",
    twoFactorEnabled: false,
    notificationPreferences: {
      transactions: true,
      balanceUpdates: false,
      securityAlerts: true,
      marketing: true,
    },
    appPreferences: {
      language: "en",
      theme: "dark",
      defaultCurrency: "EUR",
    },
    verificationStatus: "pending",
    verificationDocuments: [
      {
        type: "ID",
        status: "pending",
        uploadedAt: "2023-02-11T10:05:00Z",
      },
    ],
    status: UserStatus.ACTIVE,
    role: "USER",
    linkedAccounts: 1,
    transactionCount: 12,
    transactionVolume: 3250.75,
    riskLevel: "medium",
    kycStatus: "partial",
    lastActivity: "2023-05-19T16:30:00Z",
    notes: "",
  },
  {
    id: "USR003",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    phoneNumber: "+1122334455",
    createdAt: "2023-03-05T14:20:00Z",
    lastLogin: "2023-04-10T11:25:00Z",
    twoFactorEnabled: true,
    notificationPreferences: {
      transactions: true,
      balanceUpdates: true,
      securityAlerts: true,
      marketing: false,
    },
    appPreferences: {
      language: "en",
      theme: "light",
      defaultCurrency: "USD",
    },
    verificationStatus: "verified",
    verificationDocuments: [
      {
        type: "ID",
        status: "verified",
        uploadedAt: "2023-03-06T09:40:00Z",
      },
      {
        type: "Address",
        status: "verified",
        uploadedAt: "2023-03-06T09:45:00Z",
      },
    ],
    status: UserStatus.SUSPENDED,
    role: "USER",
    linkedAccounts: 2,
    transactionCount: 28,
    transactionVolume: 9870.25,
    riskLevel: "high",
    kycStatus: "complete",
    lastActivity: "2023-04-10T11:25:00Z",
    notes: "Account suspended due to suspicious activity on April 10, 2023.",
  },
  {
    id: "USR004",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phoneNumber: "+1567890123",
    createdAt: "2023-04-20T08:50:00Z",
    lastLogin: "2023-05-21T10:15:00Z",
    twoFactorEnabled: false,
    notificationPreferences: {
      transactions: true,
      balanceUpdates: false,
      securityAlerts: true,
      marketing: false,
    },
    appPreferences: {
      language: "en",
      theme: "light",
      defaultCurrency: "GBP",
    },
    verificationStatus: "under_review",
    verificationDocuments: [
      {
        type: "ID",
        status: "under_review",
        uploadedAt: "2023-04-21T09:30:00Z",
      },
      {
        type: "Address",
        status: "under_review",
        uploadedAt: "2023-04-21T09:35:00Z",
      },
    ],
    status: UserStatus.ACTIVE,
    role: "USER",
    linkedAccounts: 1,
    transactionCount: 5,
    transactionVolume: 1200.0,
    riskLevel: "low",
    kycStatus: "pending",
    lastActivity: "2023-05-21T10:15:00Z",
    notes: "",
  },
  {
    id: "USR005",
    firstName: "Robert",
    lastName: "Wilson",
    email: "robert.wilson@example.com",
    phoneNumber: "+1345678901",
    createdAt: "2023-01-05T11:40:00Z",
    lastLogin: "2023-03-15T13:20:00Z",
    twoFactorEnabled: true,
    notificationPreferences: {
      transactions: true,
      balanceUpdates: true,
      securityAlerts: true,
      marketing: true,
    },
    appPreferences: {
      language: "en",
      theme: "dark",
      defaultCurrency: "USD",
    },
    verificationStatus: "rejected",
    verificationDocuments: [
      {
        type: "ID",
        status: "rejected",
        uploadedAt: "2023-01-06T12:10:00Z",
      },
    ],
    status: UserStatus.INACTIVE,
    role: "USER",
    linkedAccounts: 0,
    transactionCount: 0,
    transactionVolume: 0,
    riskLevel: "unknown",
    kycStatus: "failed",
    lastActivity: "2023-03-15T13:20:00Z",
    notes: "Verification rejected due to document quality issues.",
  },
]



// Status badge component
const StatusBadge = ({ status }: { status: UserStatus }) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">Active</Badge>
    case UserStatus.INACTIVE:
    case UserStatus.SUSPENDED:
      return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">{status === UserStatus.INACTIVE ? 'Inactive' : 'Suspended'}</Badge>
    default:
      return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">Unknown</Badge>
  }
}

// Activity level badge component
const ActivityLevelBadge = ({ level }: { level: string }) => {
  switch (level) {
    case "Regular":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Regular
        </Badge>
      )
    case "Occasional":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Occasional
        </Badge>
      )
    case "Inactive":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Inactive
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

// Activity level calculation
// const getActivityLevel = (user: User) => {
//   const lastLoginDate = new Date(user.lastLogin)
//   const now = new Date()
//   const daysSinceLastLogin = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))

//   if (daysSinceLastLogin <= 7 && user.transactionCount > 10) {
//     return "Regular"
//   } else if (daysSinceLastLogin <= 30) {
//     return "Occasional"
//   } else {
//     return "Inactive"
//   }
// }

export function UserManagement() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Local state to handle the case where Redux state might not be initialized yet
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUserState] = useState<User | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpenState] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpenState] = useState(false)
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpenState] = useState(false)
  const [bulkAction, setBulkActionState] = useState("")
  const [sortConfig, setSortConfigState] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [searchTerm, setSearchTermState] = useState("")
  const [statusFilter, setStatusFilterState] = useState("all")
  const [activityFilter, setActivityFilterState] = useState("all")
  const [dateRange, setDateRangeState] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Try to get state from Redux, but use local state as fallback
  const userManagementState = useAppSelector((state) => state.userManagement)

  // Fetch users on component mount
  const fetchData = async (page: number = currentPage) => {
    try {
      setLoading(true);
      const result = await dispatch(fetchUsers({ page, limit: 10 })).unwrap();
      // Handle success if needed
      if (result.data) {
        setUsers(result.data.users);
        setTotalPages(result.data.pagination.pages);
        setTotalItems(result.data.pagination.total);
      }
    } catch (error) {
      // Handle error if needed
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  // Apply filters when filter state changes
  useEffect(() => {
    let result = [...users]

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter)
    }

    // Apply activity level filter
    if (activityFilter !== "all") {
      result = result.filter((user) => getActivityLevel(user) === activityFilter)
    }

    // Apply date range filter
    if (dateRange?.from && dateRange?.to) {
      result = result.filter((user) => {
        const createdDate = new Date(user.createdAt)
        return createdDate >= dateRange.from! && createdDate <= dateRange.to!
      })
    }

    // Apply sorting if configured
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredUsers(result)
  }, [users, searchTerm, statusFilter, activityFilter, dateRange, sortConfig])

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfigState({ key, direction })

    // If Redux is available, also update Redux state
    if (userManagementState) {
      dispatch(setSortConfig({ key, direction }))
    }
  }

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }

    // If Redux is available, also update Redux state
    if (userManagementState) {
      dispatch(selectUser(userId))
    }
  }

  // Handle select all users
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }

    // If Redux is available, also update Redux state
    if (userManagementState) {
      dispatch(selectAllUsers())
    }
  }

  // Handle view user details
  const handleViewUserDetails = (user: User) => {
    setSelectedUserState(user)
    setIsDetailPanelOpenState(true)

    // If Redux is available, also update Redux state
    if (userManagementState) {
      dispatch(setSelectedUser(user))
      dispatch(fetchUserBankAccounts(user.id))
      dispatch(fetchUserActivityLog(user.id))
      dispatch(setDetailPanelOpen(true))
    }
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    // Navigate to edit user page
    router.push(`/admin/users/${user.id}/edit`)
  }

  // Handle toggle user status
  const handleToggleUserStatus = (user: User) => {
    // Update local state
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, status: u.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE }
        : u,
    )
    setUsers(updatedUsers)

    // If Redux is available, also update Redux state
    if (userManagementState) {
      dispatch(
        updateUserStatus({
          userId: user.id,
          status: user.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE,
        }),
      )
    }
  }

  // Handle view user transactions
  const handleViewUserTransactions = (user: User) => {
    // Navigate to transactions page with user filter
    router.push(`/admin/transactions?userId=${user.id}`)
  }

  // Handle bulk action
  const handleBulkAction = () => {
    if (bulkAction === "export") {
      // Handle export
      console.log("Exporting users:", selectedUsers)
      setIsBulkActionDialogOpenState(false)
      setSelectedUsers([])

      // If Redux is available, also update Redux state
      if (userManagementState) {
        dispatch(
          exportUsers({
            userIds: selectedUsers,
            options: {
              includePersonal: true,
              includeAccounts: true,
              includeTransactions: true,
              includeActivity: true,
            },
          }),
        )
        dispatch(setBulkActionDialogOpen(false))
        dispatch(clearSelection())
      }
    } else if (bulkAction === "activate" || bulkAction === "suspend") {
      // Update local state
      const updatedUsers = users.map((user) =>
        selectedUsers.includes(user.id)
          ? { ...user, status: bulkAction === "activate" ? UserStatus.ACTIVE : UserStatus.SUSPENDED }
          : user,
      )
      setUsers(updatedUsers)
      setIsBulkActionDialogOpenState(false)
      setSelectedUsers([])

      // If Redux is available, also update Redux state
      if (userManagementState) {
        dispatch(
          bulkUpdateUserStatus({
            userIds: selectedUsers,
            status: bulkAction === "activate" ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
          }),
        )
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View and manage all registered users in the system.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedUsers([])
              if (userManagementState) dispatch(clearSelection())
            }}
            disabled={selectedUsers.length === 0}
          >
            <X className="mr-2 h-4 w-4" />
            Clear Selection
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setBulkActionState("export")
              setIsBulkActionDialogOpenState(true)
              if (userManagementState) {
                dispatch(setBulkAction("export"))
                dispatch(setBulkActionDialogOpen(true))
              }
            }}
            disabled={selectedUsers.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={selectedUsers.length === 0}>
                Bulk Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions for {selectedUsers.length} users</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setBulkActionState("activate")
                  setIsBulkActionDialogOpenState(true)
                  if (userManagementState) {
                    dispatch(setBulkAction("activate"))
                    dispatch(setBulkActionDialogOpen(true))
                  }
                }}
              >
                Activate Users
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setBulkActionState("suspend")
                  setIsBulkActionDialogOpenState(true)
                  if (userManagementState) {
                    dispatch(setBulkAction("suspend"))
                    dispatch(setBulkActionDialogOpen(true))
                  }
                }}
                className="text-red-600"
              >
                Suspend Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => {
              setIsAddUserDialogOpenState(true)
              if (userManagementState) dispatch(setAddUserDialogOpen(true))
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-users" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="active-users">Active Users</TabsTrigger>
          <TabsTrigger value="pending-verification">Pending Verification</TabsTrigger>
          <TabsTrigger value="suspended-users">Suspended Users</TabsTrigger>
        </TabsList>

        <TabsContent value="all-users">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>User Filters</CardTitle>
              <CardDescription>Filter users by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Name, Email, or ID..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTermState(e.target.value)
                        if (userManagementState) dispatch(setSearchTerm(e.target.value))
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilterState(value)
                      if (userManagementState) dispatch(setStatusFilter(value))
                    }}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select
                    value={activityFilter}
                    onValueChange={(value) => {
                      setActivityFilterState(value)
                      if (userManagementState) dispatch(setActivityFilter(value))
                    }}
                  >
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activity Levels</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Occasional">Occasional</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Registration Date</Label>
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={(range) => {
                      setDateRangeState(range)
                      if (userManagementState) dispatch(setDateRange(range))
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTermState("")
                    setStatusFilterState("all")
                    setActivityFilterState("all")
                    setDateRangeState({
                      from: subDays(new Date(), 30),
                      to: new Date(),
                    })
                    if (userManagementState) dispatch(resetFilters())
                  }}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
                <Button>
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    {loading ? "Loading users..." : `Showing ${filteredUsers.length} of ${users.length} users`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="10">
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <ScrollArea className="h-[600px] w-full">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                              onCheckedChange={handleSelectAllUsers}
                              aria-label="Select all users"
                            />
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => requestSort("lastName")}>
                            <div className="flex items-center space-x-1">
                              <span>Full Name</span>
                              {sortConfig?.key === "lastName" ? (
                                <ArrowUpDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-30" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => requestSort("email")}>
                            <div className="flex items-center space-x-1">
                              <span>Email</span>
                              {sortConfig?.key === "email" ? (
                                <ArrowUpDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-30" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => requestSort("createdAt")}>
                            <div className="flex items-center space-x-1">
                              <span>Registration Date</span>
                              {sortConfig?.key === "createdAt" ? (
                                <ArrowUpDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-30" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => requestSort("status")}>
                            <div className="flex items-center space-x-1">
                              <span>Status</span>
                              {sortConfig?.key === "status" ? (
                                <ArrowUpDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-30" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          // Loading skeleton
                          Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Skeleton className="h-4 w-4" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-6 w-16" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-8" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-8 w-20 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Search className="h-12 w-12 mb-2 opacity-20" />
                                <h3 className="font-medium text-lg">No users found</h3>
                                <p>Try adjusting your search or filter criteria</p>
                                <Button
                                  variant="link"
                                  onClick={() => {
                                    setSearchTermState("")
                                    setStatusFilterState("all")
                                    setActivityFilterState("all")
                                    setDateRangeState({
                                      from: subDays(new Date(), 30),
                                      to: new Date(),
                                    })
                                    if (userManagementState) dispatch(resetFilters())
                                  }}
                                >
                                  Reset all filters
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => {
                            // const activityLevel = getActivityLevel(user)
                            return (
                              <TableRow
                                key={user.id}
                                className={user.status === UserStatus.SUSPENDED ? "bg-red-50 dark:bg-red-950/10" : ""}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={() => handleUserSelect(user.id)}
                                    aria-label={`Select ${user.firstName} ${user.lastName}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>
                                      {user.firstName} {user.lastName}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.createdAt ? formatDate(user.createdAt) : "N/A"}</TableCell>
                                <TableCell>
                                  <StatusBadge status={user.isPortalAccess ? UserStatus.ACTIVE : UserStatus.INACTIVE} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleViewUserDetails(user)}
                                      title="View Details"
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View Details</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditUser(user)}
                                      title="Edit User"
                                    >
                                      <PenSquare className="h-4 w-4" />
                                      <span className="sr-only">Edit User</span>
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">More Options</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleViewUserTransactions(user)}>
                                          View Transactions
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                                          {user.status === UserStatus.ACTIVE ? "Suspend User" : "Activate User"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Mail className="mr-2 h-4 w-4" />
                                          Contact User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>Impersonate User</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>

              {/* pagination */}
              <div className="flex items-center justify-between py-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {totalItems} users
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Page</span>
                    <span className="font-medium">{currentPage}</span>
                    <span className="text-sm">of</span>
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-users">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <h3 className="text-lg font-medium">Active Users View</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This tab will show only active users with additional metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-verification">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <h3 className="text-lg font-medium">Pending Verification View</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This tab will show users with pending verification documents.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended-users">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <h3 className="text-lg font-medium">Suspended Users View</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This tab will show suspended users with suspension reasons.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Panel */}
      {selectedUser && (
        <Dialog open={isDetailPanelOpen} onOpenChange={(open) => setIsDetailPanelOpenState(open)}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Viewing details for {selectedUser.firstName} {selectedUser.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="font-medium">User ID:</span> {selectedUser.id}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span> {selectedUser.firstName} {selectedUser.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedUser.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedUser.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> <StatusBadge status={selectedUser.status} />
                    </div>
                    <div>
                      <span className="font-medium">Registration Date:</span> {formatDate(selectedUser.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span> {formatDate(selectedUser.lastLogin)}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="font-medium">Linked Accounts:</span> {selectedUser.linkedAccounts}
                    </div>
                    <div>
                      <span className="font-medium">Transaction Count:</span> {selectedUser.transactionCount}
                    </div>
                    <div>
                      <span className="font-medium">Transaction Volume:</span> $
                      {selectedUser.transactionVolume?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Risk Level:</span> {selectedUser.riskLevel}
                    </div>
                    <div>
                      <span className="font-medium">KYC Status:</span> {selectedUser.kycStatus}
                    </div>
                    <div>
                      <span className="font-medium">2FA Enabled:</span> {selectedUser.twoFactorEnabled ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Notes</h3>
                <Textarea
                  className="mt-2"
                  placeholder="Add notes about this user..."
                  value={selectedUser.notes || ""}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailPanelOpenState(false)}>
                Close
              </Button>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={(open) => setIsAddUserDialogOpenState(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. The user will receive an email to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="First Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Last Name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Phone Number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="USER">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Regular User</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpenState(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={isBulkActionDialogOpen} onOpenChange={(open) => setIsBulkActionDialogOpenState(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {bulkAction === "export"
                ? "Export Users"
                : bulkAction === "activate"
                  ? "Activate Users"
                  : "Suspend Users"}
            </DialogTitle>
            <DialogDescription>
              {bulkAction === "export"
                ? "Export data for the selected users."
                : bulkAction === "activate"
                  ? "Activate the selected users. This will allow them to log in and use the system."
                  : "Suspend the selected users. This will prevent them from logging in."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {bulkAction === "export" ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="export-personal" defaultChecked />
                  <Label htmlFor="export-personal">Personal Information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export-accounts" defaultChecked />
                  <Label htmlFor="export-accounts">Bank Accounts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export-transactions" defaultChecked />
                  <Label htmlFor="export-transactions">Transaction History</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export-activity" defaultChecked />
                  <Label htmlFor="export-activity">Activity Log</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="action-reason">Reason</Label>
                  <Textarea id="action-reason" placeholder="Enter reason for this action..." />
                  <p className="text-sm text-muted-foreground">
                    This reason will be recorded in the audit log and may be visible to the user.
                  </p>
                </div>
                {bulkAction === "suspend" && (
                  <div className="rounded-md bg-red-50 p-4 dark:bg-red-950/20">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Warning</h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <p>
                            Suspending users will immediately prevent them from accessing the system and may interrupt
                            any ongoing operations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionDialogOpenState(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAction} variant={bulkAction === "suspend" ? "destructive" : "default"}>
              {bulkAction === "export" ? "Export" : bulkAction === "activate" ? "Activate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
