import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { adminApi } from "@/api/admin"
import type { User, UserStatus } from "@/types"

// Types
export interface BankAccount {
  id: string
  userId: string
  accountNumber: string
  accountName: string
  accountType: string
  bankName: string
  routingNumber: string
  balance: number
  currency: string
  isDefault: boolean
  status: string
  verificationStatus: string
  verificationDate: string | null
  verifiedBy: string | null
  documents: {
    id: string
    type: string
    uploadedAt: string
    status: string
    fileUrl: string
  }[]
}

export interface ActivityLogEntry {
  id: string
  userId: string
  action: string
  details: string
  ipAddress: string
  location: string
  timestamp: string
}

export interface UserNote {
  id: string
  userId: string
  content: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface UserFilters {
  searchTerm: string
  statusFilter: string
  activityFilter: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

interface UserManagementState {
  users: {
    items: User[]
    filteredItems: User[]
    loading: boolean
    error: string | null
    pagination: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
  selectedUsers: string[]
  selectedUser: User | null
  userBankAccounts: {
    items: BankAccount[]
    loading: boolean
    error: string | null
  }
  userActivityLog: {
    items: ActivityLogEntry[]
    loading: boolean
    error: string | null
  }
  userNotes: {
    items: UserNote[]
    loading: boolean
    error: string | null
  }
  filters: UserFilters
  isDetailPanelOpen: boolean
  isAddUserDialogOpen: boolean
  isBulkActionDialogOpen: boolean
  bulkAction: string
  sortConfig: {
    key: string
    direction: "ascending" | "descending"
  } | null
}

const initialState: UserManagementState = {
  users: {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 1
    }
  },
  selectedUsers: [],
  selectedUser: null,
  userBankAccounts: {
    items: [],
    loading: false,
    error: null,
  },
  userActivityLog: {
    items: [],
    loading: false,
    error: null,
  },
  userNotes: {
    items: [],
    loading: false,
    error: null,
  },
  filters: {
    searchTerm: "",
    statusFilter: "all",
    activityFilter: "all",
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date(),
    },
  },
  isDetailPanelOpen: false,
  isAddUserDialogOpen: false,
  isBulkActionDialogOpen: false,
  bulkAction: "",
  sortConfig: null,
}

// Async thunks
export const fetchUsers = createAsyncThunk(
  "userManagement/fetchUsers",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await adminApi.getAdminUsers({ page, limit })
    return response
  }
)

export const fetchUserBankAccounts = createAsyncThunk(
  "userManagement/fetchUserBankAccounts",
  async (userId: string) => {
    const response = await adminApi.getUserBankAccounts(userId)
    return response
  },
)

export const fetchUserActivityLog = createAsyncThunk("userManagement/fetchUserActivityLog", async (userId: string) => {
  const response = await adminApi.getUserActivityLog(userId)
  return response
})

export const fetchUserNotes = createAsyncThunk("userManagement/fetchUserNotes", async (userId: string) => {
  const response = await adminApi.getUserNotes(userId)
  return response
})

export const updateUserStatus = createAsyncThunk(
  "userManagement/updateUserStatus",
  async ({ userId, status, reason }: { userId: string; status: UserStatus; reason?: string }) => {
    const response = await adminApi.updateUserStatus(userId, status, reason)
    return response
  },
)

export const updateUserNote = createAsyncThunk(
  "userManagement/updateUserNote",
  async ({ userId, notes }: { userId: string; notes: string }) => {
    const response = await adminApi.updateUserNotes(userId, notes)
    return { userId, notes }
  },
)

export const verifyBankAccount = createAsyncThunk(
  "userManagement/verifyBankAccount",
  async ({
    accountId,
    action,
    reason,
  }: {
    accountId: string
    action: "approve" | "reject"
    reason?: string
  }) => {
    const response = await adminApi.verifyBankAccount(accountId, { action, reason })
    return response
  },
)

export const bulkUpdateUserStatus = createAsyncThunk(
  "userManagement/bulkUpdateUserStatus",
  async ({
    userIds,
    status,
    reason,
  }: {
    userIds: string[]
    status: UserStatus
    reason?: string
  }) => {
    await adminApi.bulkUpdateUserStatus(userIds, status, reason)
    return { userIds, status }
  },
)

export const exportUsers = createAsyncThunk(
  "userManagement/exportUsers",
  async ({
    userIds,
    options,
  }: {
    userIds: string[]
    options?: {
      includePersonal?: boolean
      includeAccounts?: boolean
      includeTransactions?: boolean
      includeActivity?: boolean
    }
  }) => {
    const response = await adminApi.exportUsers(userIds, options)
    return response
  },
)

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload
      applyFilters(state)
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.statusFilter = action.payload
      applyFilters(state)
    },
    setActivityFilter: (state, action: PayloadAction<string>) => {
      state.filters.activityFilter = action.payload
      applyFilters(state)
    },
    setDateRange: (state, action: PayloadAction<{ from: Date | undefined; to: Date | undefined }>) => {
      state.filters.dateRange = action.payload
      applyFilters(state)
    },
    resetFilters: (state) => {
      state.filters = {
        searchTerm: "",
        statusFilter: "all",
        activityFilter: "all",
        dateRange: {
          from: new Date(new Date().setDate(new Date().getDate() - 30)),
          to: new Date(),
        },
      }
      applyFilters(state)
    },
    selectUser: (state, action: PayloadAction<string>) => {
      if (state.selectedUsers.includes(action.payload)) {
        state.selectedUsers = state.selectedUsers.filter((id) => id !== action.payload)
      } else {
        state.selectedUsers.push(action.payload)
      }
    },
    selectAllUsers: (state) => {
      if (state.selectedUsers.length === state.users.filteredItems.length) {
        state.selectedUsers = []
      } else {
        state.selectedUsers = state.users.filteredItems.map((user) => user.id)
      }
    },
    clearSelection: (state) => {
      state.selectedUsers = []
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    setDetailPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isDetailPanelOpen = action.payload
    },
    setAddUserDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddUserDialogOpen = action.payload
    },
    setBulkActionDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isBulkActionDialogOpen = action.payload
    },
    setBulkAction: (state, action: PayloadAction<string>) => {
      state.bulkAction = action.payload
    },
    setSortConfig: (state, action: PayloadAction<{ key: string; direction: "ascending" | "descending" } | null>) => {
      state.sortConfig = action.payload
      if (state.sortConfig) {
        const { key, direction } = state.sortConfig
        state.users.filteredItems.sort((a, b) => {
          if (a[key] < b[key]) {
            return direction === "ascending" ? -1 : 1
          }
          if (a[key] > b[key]) {
            return direction === "ascending" ? 1 : -1
          }
          return 0
        })
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true
        state.users.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.items = action.payload.data.users
        state.users.filteredItems = action.payload.data.users
        state.users.loading = false
        state.users.pagination = action.payload.data.pagination
        applyFilters(state)
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false
        state.users.error = action.error.message || "Failed to fetch users"
      })

    // Fetch User Bank Accounts
    builder
      .addCase(fetchUserBankAccounts.pending, (state) => {
        state.userBankAccounts.loading = true
        state.userBankAccounts.error = null
      })
      .addCase(fetchUserBankAccounts.fulfilled, (state, action) => {
        state.userBankAccounts.items = action.payload
        state.userBankAccounts.loading = false
      })
      .addCase(fetchUserBankAccounts.rejected, (state, action) => {
        state.userBankAccounts.loading = false
        state.userBankAccounts.error = action.error.message || "Failed to fetch user bank accounts"
      })

    // Fetch User Activity Log
    builder
      .addCase(fetchUserActivityLog.pending, (state) => {
        state.userActivityLog.loading = true
        state.userActivityLog.error = null
      })
      .addCase(fetchUserActivityLog.fulfilled, (state, action) => {
        state.userActivityLog.items = action.payload
        state.userActivityLog.loading = false
      })
      .addCase(fetchUserActivityLog.rejected, (state, action) => {
        state.userActivityLog.loading = false
        state.userActivityLog.error = action.error.message || "Failed to fetch user activity log"
      })

    // Fetch User Notes
    builder
      .addCase(fetchUserNotes.pending, (state) => {
        state.userNotes.loading = true
        state.userNotes.error = null
      })
      .addCase(fetchUserNotes.fulfilled, (state, action) => {
        state.userNotes.items = action.payload
        state.userNotes.loading = false
      })
      .addCase(fetchUserNotes.rejected, (state, action) => {
        state.userNotes.loading = false
        state.userNotes.error = action.error.message || "Failed to fetch user notes"
      })

    // Update User Status
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      const index = state.users.items.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state.users.items[index] = action.payload
        applyFilters(state)
      }
    })

    // Update User Note
    builder.addCase(updateUserNote.fulfilled, (state, action) => {
      if (state.selectedUser && state.selectedUser.id === action.payload.userId) {
        state.selectedUser.notes = action.payload.notes
      }
    })

    // Bulk Update User Status
    builder.addCase(bulkUpdateUserStatus.fulfilled, (state, action) => {
      const { userIds, status } = action.payload
      state.users.items = state.users.items.map((user) => (userIds.includes(user.id) ? { ...user, status } : user))
      applyFilters(state)
      state.selectedUsers = []
      state.isBulkActionDialogOpen = false
    })
  },
})

// Helper function to apply filters
const applyFilters = (state: UserManagementState) => {
  let result = [...state.users.items]

  // Apply search term filter
  if (state.filters.searchTerm) {
    result = result.filter(
      (user) =>
        user.id.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(state.filters.searchTerm.toLowerCase()),
    )
  }

  // Apply status filter
  if (state.filters.statusFilter !== "all") {
    result = result.filter((user) => user.status === state.filters.statusFilter)
  }

  // Apply activity level filter
  if (state.filters.activityFilter !== "all") {
    result = result.filter((user) => {
      const lastLoginDate = new Date(user.lastLogin)
      const now = new Date()
      const daysSinceLastLogin = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))

      if (state.filters.activityFilter === "Regular") {
        return daysSinceLastLogin <= 7 && user.transactionCount > 10
      } else if (state.filters.activityFilter === "Occasional") {
        return daysSinceLastLogin <= 30
      } else if (state.filters.activityFilter === "Inactive") {
        return daysSinceLastLogin > 30
      }
      return true
    })
  }

  // Apply date range filter
  if (state.filters.dateRange.from && state.filters.dateRange.to) {
    result = result.filter((user) => {
      const createdDate = new Date(user.createdAt)
      return createdDate >= state.filters.dateRange.from! && createdDate <= state.filters.dateRange.to!
    })
  }

  // Apply sorting if configured
  if (state.sortConfig) {
    const { key, direction } = state.sortConfig
    result.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  state.users.filteredItems = result
}

export const {
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
} = userManagementSlice.actions

export default userManagementSlice.reducer
