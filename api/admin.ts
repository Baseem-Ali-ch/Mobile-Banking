import { api } from "./client"
import type { Transaction, User, UserStatus } from "@/types"
import type { TransactionFilter } from "@/store/slices/adminTransactionsSlice"
import type { TransactionWorkflow, AuditLogEntry } from "@/store/slices/settingsSlice"

// Mock data for roles and permissions
const mockRoles = [
  {
    id: "role-1",
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: [
      { id: "perm-1", name: "View Users", description: "Can view user profiles", category: "User Management" },
      { id: "perm-2", name: "Edit Users", description: "Can edit user profiles", category: "User Management" },
      { id: "perm-3", name: "Delete Users", description: "Can delete users", category: "User Management" },
      { id: "perm-4", name: "Approve Transactions", description: "Can approve transactions", category: "Transactions" },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "role-2",
    name: "Manager",
    description: "Can manage users and approve transactions",
    permissions: [
      { id: "perm-1", name: "View Users", description: "Can view user profiles", category: "User Management" },
      { id: "perm-2", name: "Edit Users", description: "Can edit user profiles", category: "User Management" },
      { id: "perm-4", name: "Approve Transactions", description: "Can approve transactions", category: "Transactions" },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "role-3",
    name: "Viewer",
    description: "Read-only access to the system",
    permissions: [
      { id: "perm-1", name: "View Users", description: "Can view user profiles", category: "User Management" },
      { id: "perm-5", name: "View Transactions", description: "Can view transactions", category: "Transactions" },
    ],
    updatedAt: new Date().toISOString(),
  },
]

const mockPermissions = [
  { id: "perm-1", name: "View Users", description: "Can view user profiles", category: "User Management" },
  { id: "perm-2", name: "Edit Users", description: "Can edit user profiles", category: "User Management" },
  { id: "perm-3", name: "Delete Users", description: "Can delete users", category: "User Management" },
  { id: "perm-4", name: "Approve Transactions", description: "Can approve transactions", category: "Transactions" },
  { id: "perm-5", name: "View Transactions", description: "Can view transactions", category: "Transactions" },
  { id: "perm-6", name: "Edit Transactions", description: "Can edit transactions", category: "Transactions" },
  { id: "perm-7", name: "Delete Transactions", description: "Can delete transactions", category: "Transactions" },
  { id: "perm-8", name: "View Reports", description: "Can view reports", category: "Reports" },
  { id: "perm-9", name: "Generate Reports", description: "Can generate new reports", category: "Reports" },
  { id: "perm-10", name: "System Settings", description: "Can modify system settings", category: "Settings" },
  { id: "perm-11", name: "Audit Logs", description: "Can view audit logs", category: "Security" },
  { id: "perm-12", name: "Security Settings", description: "Can modify security settings", category: "Security" },
]

const mockAdminUsers = [
  {
    id: "admin-1",
    name: "John Admin",
    email: "john.admin@example.com",
    role: mockRoles[0],
    status: "active",
    lastActive: new Date().toISOString(),
  },
  {
    id: "admin-2",
    name: "Sarah Manager",
    email: "sarah.manager@example.com",
    role: mockRoles[1],
    status: "active",
    lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "admin-3",
    name: "Tom Viewer",
    email: "tom.viewer@example.com",
    role: mockRoles[2],
    status: "inactive",
    lastActive: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
  },
]

// Mock transaction workflows
const mockTransactionWorkflows: TransactionWorkflow[] = [
  {
    id: "workflow-1",
    name: "High Value Transactions",
    description: "Workflow for transactions above $10,000",
    amountThreshold: 10000,
    requiresApproval: true,
    autoApprovalCriteria: {
      trustedAccountsOnly: true,
      maxAmount: 5000,
      userVerificationLevel: ["verified"],
    },
    approvalRoles: ["role-1", "role-2"],
    expirationHours: 24,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: "workflow-2",
    name: "Standard Transactions",
    description: "Workflow for regular transactions",
    amountThreshold: 1000,
    requiresApproval: false,
    autoApprovalCriteria: {
      trustedAccountsOnly: false,
      maxAmount: 1000,
      userVerificationLevel: ["verified", "pending"],
    },
    approvalRoles: [],
    expirationHours: 48,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
  },
  {
    id: "workflow-3",
    name: "International Transfers",
    description: "Workflow for international money transfers",
    amountThreshold: 5000,
    requiresApproval: true,
    autoApprovalCriteria: {
      trustedAccountsOnly: true,
      maxAmount: 2000,
      userVerificationLevel: ["verified"],
    },
    approvalRoles: ["role-1"],
    expirationHours: 72,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
]

// Mock audit logs
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "log-1",
    action: "update",
    entityType: "role",
    entityId: "role-1",
    performedBy: {
      id: "admin-1",
      name: "John Admin",
      role: "Administrator",
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    changes: {
      permissions: {
        before: ["perm-1", "perm-2", "perm-3"],
        after: ["perm-1", "perm-2", "perm-3", "perm-4"],
      },
    },
  },
  {
    id: "log-2",
    action: "create",
    entityType: "workflow",
    entityId: "workflow-3",
    performedBy: {
      id: "admin-1",
      name: "John Admin",
      role: "Administrator",
    },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    changes: {
      workflow: {
        before: null,
        after: {
          name: "International Transfers",
          description: "Workflow for international money transfers",
          amountThreshold: 5000,
          requiresApproval: true,
        },
      },
    },
  },
  {
    id: "log-3",
    action: "delete",
    entityType: "user",
    entityId: "user-5",
    performedBy: {
      id: "admin-2",
      name: "Sarah Manager",
      role: "Manager",
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    changes: {
      user: {
        before: {
          id: "user-5",
          name: "Deleted User",
          email: "deleted@example.com",
        },
        after: null,
      },
    },
  },
  {
    id: "log-4",
    action: "update",
    entityType: "settings",
    entityId: "system-settings",
    performedBy: {
      id: "admin-1",
      name: "John Admin",
      role: "Administrator",
    },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    changes: {
      maxTransactionAmount: {
        before: 10000,
        after: 50000,
      },
      requireTwoFactorForLargeTransactions: {
        before: false,
        after: true,
      },
    },
  },
  {
    id: "log-5",
    action: "create",
    entityType: "role",
    entityId: "role-3",
    performedBy: {
      id: "admin-1",
      name: "John Admin",
      role: "Administrator",
    },
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    changes: {
      role: {
        before: null,
        after: {
          name: "Viewer",
          description: "Read-only access to the system",
          permissions: ["perm-1", "perm-5"],
        },
      },
    },
  },
]

// Generate more mock audit logs for pagination testing
for (let i = 6; i <= 50; i++) {
  const daysAgo = Math.floor(Math.random() * 30) + 1 // 1-30 days ago
  const actions = ["create", "update", "delete", "view"]
  const entityTypes = ["role", "workflow", "user", "settings", "transaction", "permission"]

  mockAuditLogs.push({
    id: `log-${i}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    entityType: entityTypes[Math.floor(Math.random() * entityTypes.length)],
    entityId: `entity-${Math.floor(Math.random() * 100) + 1}`,
    performedBy: {
      id: mockAdminUsers[Math.floor(Math.random() * mockAdminUsers.length)].id,
      name: mockAdminUsers[Math.floor(Math.random() * mockAdminUsers.length)].name,
      role: mockRoles[Math.floor(Math.random() * mockRoles.length)].name,
    },
    timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255) + 1}`,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    changes: {
      field: {
        before: `old-value-${i}`,
        after: `new-value-${i}`,
      },
    },
  })
}

interface UserResponse {
  status: string
  message: string
  data: {
    users: User[]
    pagination: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
}

interface PortalUpdateResponse {
  status: string
  message: string
  data: {
    user: User
  }
}

export interface BulkPortalAccessResponse {
  status: string;
  message: string;
  data: {
    updatedUsers: User[];
    totalUpdated: number;
    totalRequested: number;
    errors: any;
  };
}

export const adminApi = {
  // System settings
  getSystemSettings: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      transactionApprovalThreshold: 10000,
      requireTwoFactorForLargeTransactions: true,
      maxDailyWithdrawalLimit: 5000,
      maxTransactionAmount: 50000,
      auditLogRetentionDays: 90,
      passwordExpiryDays: 90,
      sessionTimeoutMinutes: 30,
      allowedLoginAttempts: 5,
      accountLockoutDurationMinutes: 30,
    }
  },

  updateSystemSettings: async (settings: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    return settings
  },

  // Roles and permissions
  getRolesAndPermissions: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      roles: mockRoles,
      permissions: mockPermissions,
    }
  },

  updateRolePermissions: async (roleId: string, permissions: string[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const role = mockRoles.find((r) => r.id === roleId)
    if (!role) {
      throw new Error("Role not found")
    }

    const updatedPermissions = permissions.map((permId) => {
      const perm = mockPermissions.find((p) => p.id === permId)
      if (!perm) {
        throw new Error(`Permission ${permId} not found`)
      }
      return perm
    })

    const updatedRole = {
      ...role,
      permissions: updatedPermissions,
      updatedAt: new Date().toISOString(),
    }

    // Update the mock data
    const roleIndex = mockRoles.findIndex((r) => r.id === roleId)
    if (roleIndex !== -1) {
      mockRoles[roleIndex] = updatedRole
    }

    return updatedRole
  },

  // Role management
  createRole: async (roleData: { name: string; description: string; permissions: string[] }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newRole = {
      id: `role-${mockRoles.length + 1}`,
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions.map((permId) => {
        const perm = mockPermissions.find((p) => p.id === permId)
        if (!perm) {
          throw new Error(`Permission ${permId} not found`)
        }
        return perm
      }),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock data
    mockRoles.push(newRole)

    return newRole
  },

  updateRole: async (roleId: string, roleData: { name: string; description: string; permissions: string[] }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const roleIndex = mockRoles.findIndex((r) => r.id === roleId)
    if (roleIndex === -1) {
      throw new Error("Role not found")
    }

    const updatedRole = {
      ...mockRoles[roleIndex],
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions.map((permId) => {
        const perm = mockPermissions.find((p) => p.id === permId)
        if (!perm) {
          throw new Error(`Permission ${permId} not found`)
        }
        return perm
      }),
      updatedAt: new Date().toISOString(),
    }

    // Update mock data
    mockRoles[roleIndex] = updatedRole

    return updatedRole
  },

  deleteRole: async (roleId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const roleIndex = mockRoles.findIndex((r) => r.id === roleId)
    if (roleIndex === -1) {
      throw new Error("Role not found")
    }

    // Remove from mock data
    mockRoles.splice(roleIndex, 1)

    return roleId
  },

  updateAdminUser: async (userId: string, userData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userIndex = mockAdminUsers.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // If updating role
    if (userData.role && userData.role.id) {
      const role = mockRoles.find((r) => r.id === userData.role.id)
      if (!role) {
        throw new Error("Role not found")
      }
      userData.role = role
    }

    const updatedUser = {
      ...mockAdminUsers[userIndex],
      ...userData,
      lastActive: new Date().toISOString(),
    }

    // Update mock data
    mockAdminUsers[userIndex] = updatedUser

    return updatedUser
  },

  // Transaction workflow management
  getTransactionWorkflows: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockTransactionWorkflows
  },

  createTransactionWorkflow: async (workflowData: Omit<TransactionWorkflow, "id" | "createdAt" | "updatedAt">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newWorkflow: TransactionWorkflow = {
      id: `workflow-${mockTransactionWorkflows.length + 1}`,
      ...workflowData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock data
    mockTransactionWorkflows.push(newWorkflow)

    return newWorkflow
  },

  updateTransactionWorkflow: async (
    id: string,
    workflowData: Omit<TransactionWorkflow, "id" | "createdAt" | "updatedAt">,
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const workflowIndex = mockTransactionWorkflows.findIndex((w) => w.id === id)
    if (workflowIndex === -1) {
      throw new Error("Workflow not found")
    }

    const updatedWorkflow: TransactionWorkflow = {
      ...mockTransactionWorkflows[workflowIndex],
      ...workflowData,
      updatedAt: new Date().toISOString(),
    }

    // Update mock data
    mockTransactionWorkflows[workflowIndex] = updatedWorkflow

    return updatedWorkflow
  },

  deleteTransactionWorkflow: async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const workflowIndex = mockTransactionWorkflows.findIndex((w) => w.id === id)
    if (workflowIndex === -1) {
      throw new Error("Workflow not found")
    }

    // Remove from mock data
    mockTransactionWorkflows.splice(workflowIndex, 1)

    return id
  },

  // Audit logs management
  getAuditLogs: async (page = 1, limit = 10, filters: Record<string, any> = {}) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Apply filters
    let filteredLogs = [...mockAuditLogs]

    if (filters.entityType) {
      filteredLogs = filteredLogs.filter((log) => log.entityType === filters.entityType)
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter((log) => log.action === filters.action)
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate).getTime()
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp).getTime() >= startDate)
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate).getTime()
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp).getTime() <= endDate)
    }

    if (filters.userId) {
      filteredLogs = filteredLogs.filter((log) => log.performedBy.id === filters.userId)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.entityType.toLowerCase().includes(searchLower) ||
          log.entityId.toLowerCase().includes(searchLower) ||
          log.performedBy.name.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower),
      )
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

    return {
      items: paginatedLogs,
      page,
      limit,
      total: filteredLogs.length,
    }
  },

  revertChange: async (logId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const log = mockAuditLogs.find((l) => l.id === logId)
    if (!log) {
      throw new Error("Audit log not found")
    }

    // In a real implementation, this would revert the change based on the log data
    // For now, we'll just return a success message
    return {
      success: true,
      message: `Change ${logId} has been reverted successfully`,
      revertedLog: log,
    }
  },

  // User management
  getAdminUsers: async (params: { page: number; limit: number; role?: string } = { page: 1, limit: 10, role: "USER" }): Promise<UserResponse> => {
    const { page, limit, role } = params
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(role && { role })
    })
    return api.get(`https://aq-pay.mcodevbytes.in/api/auth/users?${queryParams.toString()}`)
  },

  updateUserPortalAccess: async (userId: string, isPortalAccess: boolean): Promise<PortalUpdateResponse> => {
    const response = await api.put(`https://aq-pay.mcodevbytes.in/api/auth/users/${userId}/portal-access`, { isPortalAccess })
    return response
  },

  async bulkUpdateUserPortalAccess(userIds: string[], isPortalAccess: boolean): Promise<BulkPortalAccessResponse> {
    const response = await api.post<{ data: BulkPortalAccessResponse }>('https://aq-pay.mcodevbytes.in/api/auth/bulk-approve-portal-access', { userIds, isPortalAccess });
    return response.data;
  },

  // New transaction management methods
  getTransactions: (params: {
    page: number
    limit: number
    sortBy?: string
    sortDirection?: "asc" | "desc"
    status?: string[]
    type?: string[]
    dateFrom?: string
    dateTo?: string
    minAmount?: number
    maxAmount?: number
    searchQuery?: string
    userId?: string
    accountId?: string
    priority?: string[]
  }): Promise<{
    items: Transaction[]
    page: number
    limit: number
    total: number
  }> => {
    return api.get("/admin/transactions", { params })
  },

  getSavedTransactionViews: (): Promise<any[]> => {
    return api.get("/admin/transactions/saved-views")
  },

  saveTransactionView: (data: { name: string; filters: TransactionFilter }): Promise<any> => {
    return api.post("/admin/transactions/saved-views", data)
  },

  deleteTransactionView: (viewId: string): Promise<void> => {
    return api.delete(`/admin/transactions/saved-views/${viewId}`)
  },

  bulkApproveTransactions: (transactionIds: string[], note?: string): Promise<any> => {
    return api.post("/admin/transactions/bulk-approve", { transactionIds, note })
  },

  bulkRejectTransactions: (transactionIds: string[], reason: string, note?: string): Promise<any> => {
    return api.post("/admin/transactions/bulk-reject", { transactionIds, reason, note })
  },

  addNoteToTransactions: (transactionIds: string[], note: string): Promise<any> => {
    return api.post("/admin/transactions/add-note", { transactionIds, note })
  },

  exportTransactions: (transactionIds: string[], format: "csv" | "pdf" | "excel"): Promise<{ url: string }> => {
    return api.post("/admin/transactions/export", { transactionIds, format })
  },
}
