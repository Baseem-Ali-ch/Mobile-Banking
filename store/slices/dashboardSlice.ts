import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { TransactionStatus, TransactionType } from "@/types"

interface AccountStatus {
  id: string
  name: string
  accountNumber: string
  balance: number
  status: string
}

interface RecentTransaction {
  id: string
  description: string
  amount: number
  date: string
  status: TransactionStatus
  type: TransactionType
  accountName: string
  accountId: string
}

interface DashboardState {
  totalBalance: number
  pendingAmount: number
  completedAmount: number
  rejectedAmount: number
  accountStatuses: AccountStatus[]
  recentTransactions: RecentTransaction[]
  unreadNotifications: number
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: DashboardState = {
  totalBalance: 0,
  pendingAmount: 0,
  completedAmount: 0,
  rejectedAmount: 0,
  accountStatuses: [],
  recentTransactions: [],
  unreadNotifications: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
}

// Async thunks
export const fetchDashboardData = createAsyncThunk("dashboard/fetchData", async (_, { rejectWithValue }) => {
  try {
    // In a real app, you would make API calls to fetch the dashboard data
    // For this example, we'll simulate API calls with a delay

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock data that would come from the API
    return {
      totalBalance: 12580.42,
      pendingAmount: 450.75,
      completedAmount: 8750.25,
      rejectedAmount: 120.5,
      accountStatuses: [
        {
          id: "1",
          name: "Main Checking",
          accountNumber: "****4567",
          balance: 5280.42,
          status: "ACTIVE",
        },
        {
          id: "2",
          name: "Savings",
          accountNumber: "****7890",
          balance: 7300.0,
          status: "ACTIVE",
        },
      ],
      recentTransactions: [
        {
          id: "tx1",
          description: "Salary Deposit",
          amount: 3500.0,
          date: new Date().toISOString(),
          status: TransactionStatus.COMPLETED,
          type: TransactionType.DEPOSIT,
          accountName: "Main Checking",
          accountId: "1",
        },
        {
          id: "tx2",
          description: "Grocery Shopping",
          amount: 120.5,
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          status: TransactionStatus.COMPLETED,
          type: TransactionType.PAYMENT,
          accountName: "Main Checking",
          accountId: "1",
        },
        {
          id: "tx3",
          description: "Online Purchase",
          amount: 89.99,
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          status: TransactionStatus.PENDING,
          type: TransactionType.PAYMENT,
          accountName: "Main Checking",
          accountId: "1",
        },
        {
          id: "tx4",
          description: "Transfer to Savings",
          amount: 500.0,
          date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          status: TransactionStatus.COMPLETED,
          type: TransactionType.PAYMENT,
          accountName: "Main Checking",
          accountId: "1",
        },
        {
          id: "tx5",
          description: "Subscription",
          amount: 15.99,
          date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          status: TransactionStatus.REJECTED,
          type: TransactionType.PAYMENT,
          accountName: "Main Checking",
          accountId: "1",
        },
      ],
      unreadNotifications: 3,
    }
  } catch (error) {
    return rejectWithValue("Failed to fetch dashboard data. Please try again.")
  }
})

export const pollTransactionStatus = createAsyncThunk(
  "dashboard/pollTransactionStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { dashboard: DashboardState }
      const pendingTransactions = state.dashboard.recentTransactions.filter(
        (tx) => tx.status === TransactionStatus.PENDING,
      )

      if (pendingTransactions.length === 0) {
        return { updatedTransactions: [] }
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, you would check the status of pending transactions
      // For this example, we'll randomly update some pending transactions
      const updatedTransactions = pendingTransactions.map((tx) => {
        // Randomly update status (30% chance to update)
        if (Math.random() < 0.3) {
          return {
            ...tx,
            status: Math.random() < 0.8 ? TransactionStatus.COMPLETED : TransactionStatus.REJECTED,
          }
        }
        return tx
      })

      return { updatedTransactions }
    } catch (error) {
      return rejectWithValue("Failed to update transaction status.")
    }
  },
)

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
    markNotificationsAsRead: (state) => {
      state.unreadNotifications = 0
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard data
    builder.addCase(fetchDashboardData.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.isLoading = false
      state.totalBalance = action.payload.totalBalance
      state.pendingAmount = action.payload.pendingAmount
      state.completedAmount = action.payload.completedAmount
      state.rejectedAmount = action.payload.rejectedAmount
      state.accountStatuses = action.payload.accountStatuses
      state.recentTransactions = action.payload.recentTransactions
      state.unreadNotifications = action.payload.unreadNotifications
      state.lastUpdated = new Date().toISOString()
    })
    builder.addCase(fetchDashboardData.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Poll transaction status
    builder.addCase(pollTransactionStatus.fulfilled, (state, action) => {
      const { updatedTransactions } = action.payload

      if (updatedTransactions.length > 0) {
        // Update transactions with new statuses
        state.recentTransactions = state.recentTransactions.map((tx) => {
          const updatedTx = updatedTransactions.find((utx) => utx.id === tx.id)
          return updatedTx || tx
        })

        // Recalculate amounts based on updated statuses
        let pendingAmount = 0
        let completedAmount = 0
        let rejectedAmount = 0

        state.recentTransactions.forEach((tx) => {
          if (tx.type === TransactionType.PAYMENT) {
            if (tx.status === TransactionStatus.PENDING) {
              pendingAmount += tx.amount
            } else if (tx.status === TransactionStatus.COMPLETED) {
              completedAmount += tx.amount
            } else if (tx.status === TransactionStatus.REJECTED) {
              rejectedAmount += tx.amount
            }
          } else if (tx.type === TransactionType.DEPOSIT) {
            if (tx.status === TransactionStatus.COMPLETED) {
              completedAmount += tx.amount
            }
          }
        })

        state.pendingAmount = pendingAmount
        state.completedAmount = completedAmount
        state.rejectedAmount = rejectedAmount
        state.lastUpdated = new Date().toISOString()
      }
    })
  },
})

export const { clearDashboardError, markNotificationsAsRead } = dashboardSlice.actions

export default dashboardSlice.reducer
