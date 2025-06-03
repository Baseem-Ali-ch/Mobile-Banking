import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { adminApi } from "@/api/admin"

// Define types
export interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  updatedAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  status: string
  lastActive: string
}

export interface TransactionWorkflow {
  id: string
  name: string
  description: string
  amountThreshold: number
  requiresApproval: boolean
  autoApprovalCriteria: {
    trustedAccountsOnly: boolean
    maxAmount: number
    userVerificationLevel: string[]
  }
  approvalRoles: string[]
  expirationHours: number
  createdAt: string
  updatedAt: string
}

export interface AuditLogEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  performedBy: {
    id: string
    name: string
    role: string
  }
  timestamp: string
  ipAddress: string
  userAgent: string
  changes: Record<string, { before: any; after: any }>
}

interface SettingsState {
  currency: string
  systemSettings: {
    transactionApprovalThreshold: number
    requireTwoFactorForLargeTransactions: boolean
    maxDailyWithdrawalLimit: number
    maxTransactionAmount: number
    auditLogRetentionDays: number
    passwordExpiryDays: number
    sessionTimeoutMinutes: number
    allowedLoginAttempts: number
    accountLockoutDurationMinutes: number
  }
  roles: {
    items: Role[]
    isLoading: boolean
    error: string | null
  }
  permissions: {
    items: Permission[]
    isLoading: boolean
    error: string | null
  }
  adminUsers: {
    items: AdminUser[]
    isLoading: boolean
    error: string | null
  }
  transactionWorkflows: {
    items: TransactionWorkflow[]
    isLoading: boolean
    error: string | null
  }
  auditLogs: {
    items: AuditLogEntry[]
    pagination: {
      page: number
      limit: number
      total: number
    }
    loading: boolean
    error: string | null
  }
  isLoading: boolean
  error: string | null
}

const initialState: SettingsState = {
  currency: "USD",
  systemSettings: {
    transactionApprovalThreshold: 10000,
    requireTwoFactorForLargeTransactions: true,
    maxDailyWithdrawalLimit: 5000,
    maxTransactionAmount: 50000,
    auditLogRetentionDays: 90,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 30,
    allowedLoginAttempts: 5,
    accountLockoutDurationMinutes: 30,
  },
  roles: {
    items: [],
    isLoading: false,
    error: null,
  },
  permissions: {
    items: [],
    isLoading: false,
    error: null,
  },
  adminUsers: {
    items: [],
    isLoading: false,
    error: null,
  },
  transactionWorkflows: {
    items: [],
    isLoading: false,
    error: null,
  },
  auditLogs: {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    loading: false,
    error: null,
  },
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchSystemSettings = createAsyncThunk("settings/fetchSystemSettings", async (_, { rejectWithValue }) => {
  try {
    const response = await adminApi.getSystemSettings()
    return response
  } catch (error) {
    return rejectWithValue("Failed to fetch system settings")
  }
})

export const updateSystemSettings = createAsyncThunk(
  "settings/updateSystemSettings",
  async (settings: any, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateSystemSettings(settings)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update system settings")
    }
  },
)

export const fetchRolesAndPermissions = createAsyncThunk(
  "settings/fetchRolesAndPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getRolesAndPermissions()
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch roles and permissions")
    }
  },
)

export const updateRolePermissions = createAsyncThunk(
  "settings/updateRolePermissions",
  async ({ roleId, permissions }: { roleId: string; permissions: string[] }, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateRolePermissions(roleId, permissions)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update role permissions")
    }
  },
)

// Role management async thunks
export const createRole = createAsyncThunk(
  "settings/createRole",
  async (roleData: { name: string; description: string; permissions: string[] }, { rejectWithValue }) => {
    try {
      const response = await adminApi.createRole(roleData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to create role")
    }
  },
)

export const updateRole = createAsyncThunk(
  "settings/updateRole",
  async (
    { id, roleData }: { id: string; roleData: { name: string; description: string; permissions: string[] } },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminApi.updateRole(id, roleData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update role")
    }
  },
)

export const deleteRole = createAsyncThunk("settings/deleteRole", async (roleId: string, { rejectWithValue }) => {
  try {
    await adminApi.deleteRole(roleId)
    return roleId
  } catch (error) {
    return rejectWithValue("Failed to delete role")
  }
})

export const updateAdminUser = createAsyncThunk(
  "settings/updateAdminUser",
  async ({ id, userData }: { id: string; userData: Partial<AdminUser> }, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateAdminUser(id, userData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update admin user")
    }
  },
)

// Transaction workflow async thunks
export const fetchTransactionWorkflows = createAsyncThunk(
  "settings/fetchTransactionWorkflows",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getTransactionWorkflows()
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch transaction workflows")
    }
  },
)

export const createTransactionWorkflow = createAsyncThunk(
  "settings/createTransactionWorkflow",
  async (workflowData: Omit<TransactionWorkflow, "id" | "createdAt" | "updatedAt">, { rejectWithValue }) => {
    try {
      const response = await adminApi.createTransactionWorkflow(workflowData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to create transaction workflow")
    }
  },
)

export const updateTransactionWorkflow = createAsyncThunk(
  "settings/updateTransactionWorkflow",
  async (
    {
      id,
      workflowData,
    }: {
      id: string
      workflowData: Omit<TransactionWorkflow, "id" | "createdAt" | "updatedAt">
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminApi.updateTransactionWorkflow(id, workflowData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update transaction workflow")
    }
  },
)

export const deleteTransactionWorkflow = createAsyncThunk(
  "settings/deleteTransactionWorkflow",
  async (workflowId: string, { rejectWithValue }) => {
    try {
      await adminApi.deleteTransactionWorkflow(workflowId)
      return workflowId
    } catch (error) {
      return rejectWithValue("Failed to delete transaction workflow")
    }
  },
)

// Audit logs async thunks
export const fetchAuditLogs = createAsyncThunk(
  "settings/fetchAuditLogs",
  async (
    {
      page = 1,
      limit = 10,
      filters = {},
    }: {
      page?: number
      limit?: number
      filters?: Record<string, any>
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminApi.getAuditLogs(page, limit, filters)
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch audit logs")
    }
  },
)

export const revertChange = createAsyncThunk("settings/revertChange", async (logId: string, { rejectWithValue }) => {
  try {
    const response = await adminApi.revertChange(logId)
    return response
  } catch (error) {
    return rejectWithValue("Failed to revert change")
  }
})

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch system settings
    builder.addCase(fetchSystemSettings.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchSystemSettings.fulfilled, (state, action) => {
      state.isLoading = false
      state.systemSettings = action.payload
    })
    builder.addCase(fetchSystemSettings.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Update system settings
    builder.addCase(updateSystemSettings.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateSystemSettings.fulfilled, (state, action) => {
      state.isLoading = false
      state.systemSettings = action.payload
    })
    builder.addCase(updateSystemSettings.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch roles and permissions
    builder.addCase(fetchRolesAndPermissions.pending, (state) => {
      state.roles.isLoading = true
      state.permissions.isLoading = true
      state.error = null
    })
    builder.addCase(fetchRolesAndPermissions.fulfilled, (state, action) => {
      state.roles.isLoading = false
      state.permissions.isLoading = false
      state.roles.items = action.payload.roles
      state.permissions.items = action.payload.permissions
    })
    builder.addCase(fetchRolesAndPermissions.rejected, (state, action) => {
      state.roles.isLoading = false
      state.permissions.isLoading = false
      state.error = action.payload as string
    })

    // Update role permissions
    builder.addCase(updateRolePermissions.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateRolePermissions.fulfilled, (state, action) => {
      state.isLoading = false
      const updatedRole = action.payload
      const roleIndex = state.roles.items.findIndex((role) => role.id === updatedRole.id)
      if (roleIndex !== -1) {
        state.roles.items[roleIndex] = updatedRole
      }
    })
    builder.addCase(updateRolePermissions.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Create role
    builder.addCase(createRole.pending, (state) => {
      state.roles.isLoading = true
      state.roles.error = null
    })
    builder.addCase(createRole.fulfilled, (state, action) => {
      state.roles.isLoading = false
      state.roles.items.push(action.payload)
    })
    builder.addCase(createRole.rejected, (state, action) => {
      state.roles.isLoading = false
      state.roles.error = action.payload as string
    })

    // Update role
    builder.addCase(updateRole.pending, (state) => {
      state.roles.isLoading = true
      state.roles.error = null
    })
    builder.addCase(updateRole.fulfilled, (state, action) => {
      state.roles.isLoading = false
      const updatedRole = action.payload
      const roleIndex = state.roles.items.findIndex((role) => role.id === updatedRole.id)
      if (roleIndex !== -1) {
        state.roles.items[roleIndex] = updatedRole
      }
    })
    builder.addCase(updateRole.rejected, (state, action) => {
      state.roles.isLoading = false
      state.roles.error = action.payload as string
    })

    // Delete role
    builder.addCase(deleteRole.pending, (state) => {
      state.roles.isLoading = true
      state.roles.error = null
    })
    builder.addCase(deleteRole.fulfilled, (state, action) => {
      state.roles.isLoading = false
      state.roles.items = state.roles.items.filter((role) => role.id !== action.payload)
    })
    builder.addCase(deleteRole.rejected, (state, action) => {
      state.roles.isLoading = false
      state.roles.error = action.payload as string
    })

    // Update admin user
    builder.addCase(updateAdminUser.pending, (state) => {
      state.adminUsers.isLoading = true
      state.adminUsers.error = null
    })
    builder.addCase(updateAdminUser.fulfilled, (state, action) => {
      state.adminUsers.isLoading = false
      const updatedUser = action.payload
      const userIndex = state.adminUsers.items.findIndex((user) => user.id === updatedUser.id)
      if (userIndex !== -1) {
        state.adminUsers.items[userIndex] = updatedUser
      }
    })
    builder.addCase(updateAdminUser.rejected, (state, action) => {
      state.adminUsers.isLoading = false
      state.adminUsers.error = action.payload as string
    })

    // Fetch transaction workflows
    builder.addCase(fetchTransactionWorkflows.pending, (state) => {
      state.transactionWorkflows.isLoading = true
      state.transactionWorkflows.error = null
    })
    builder.addCase(fetchTransactionWorkflows.fulfilled, (state, action) => {
      state.transactionWorkflows.isLoading = false
      state.transactionWorkflows.items = action.payload
    })
    builder.addCase(fetchTransactionWorkflows.rejected, (state, action) => {
      state.transactionWorkflows.isLoading = false
      state.transactionWorkflows.error = action.payload as string
    })

    // Create transaction workflow
    builder.addCase(createTransactionWorkflow.pending, (state) => {
      state.transactionWorkflows.isLoading = true
      state.transactionWorkflows.error = null
    })
    builder.addCase(createTransactionWorkflow.fulfilled, (state, action) => {
      state.transactionWorkflows.isLoading = false
      state.transactionWorkflows.items.push(action.payload)
    })
    builder.addCase(createTransactionWorkflow.rejected, (state, action) => {
      state.transactionWorkflows.isLoading = false
      state.transactionWorkflows.error = action.payload as string
    })

    // Update transaction workflow
    builder.addCase(updateTransactionWorkflow.pending, (state) => {
      state.transactionWorkflows.isLoading = true
      state.transactionWorkflows.error = null
    })
    builder.addCase(updateTransactionWorkflow.fulfilled, (state, action) => {
      state.transactionWorkflows.isLoading = false
      const updatedWorkflow = action.payload
      const workflowIndex = state.transactionWorkflows.items.findIndex((workflow) => workflow.id === updatedWorkflow.id)
      if (workflowIndex !== -1) {
        state.transactionWorkflows.items[workflowIndex] = updatedWorkflow
      }
    })
    builder.addCase(updateTransactionWorkflow.rejected, (state, action) => {
      state.transactionWorkflows.isLoading = false
      state.transactionWorkflows.error = action.payload as string
    })

    // Delete transaction workflow
    builder.addCase(deleteTransactionWorkflow.pending, (state) => {
      state.transactionWorkflows.isLoading = true
      state.transactionWorkflows.error = null
    })
    builder.addCase(deleteTransactionWorkflow.fulfilled, (state, action) => {
      state.transactionWorkflows.isLoading = false
      state.transactionWorkflows.items = state.transactionWorkflows.items.filter(
        (workflow) => workflow.id !== action.payload,
      )
    })
    builder.addCase(deleteTransactionWorkflow.rejected, (state, action) => {
      state.transactionWorkflows.isLoading = false
      state.transactionWorkflows.error = action.payload as string
    })

    // Fetch audit logs
    builder.addCase(fetchAuditLogs.pending, (state) => {
      state.auditLogs.loading = true
      state.auditLogs.error = null
    })
    builder.addCase(fetchAuditLogs.fulfilled, (state, action) => {
      state.auditLogs.loading = false
      state.auditLogs.items = action.payload.items
      state.auditLogs.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
      }
    })
    builder.addCase(fetchAuditLogs.rejected, (state, action) => {
      state.auditLogs.loading = false
      state.auditLogs.error = action.payload as string
    })

    // Revert change
    builder.addCase(revertChange.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(revertChange.fulfilled, (state) => {
      state.isLoading = false
      // The actual update of audit logs will happen when fetchAuditLogs is called again
    })
    builder.addCase(revertChange.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

export const { setCurrency } = settingsSlice.actions

export default settingsSlice.reducer
