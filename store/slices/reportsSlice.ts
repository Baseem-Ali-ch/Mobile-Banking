import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { adminApi } from "@/api/admin"

// Define types for our reports data
export interface KpiData {
  transactionVolume: {
    daily: number
    weekly: number
    monthly: number
    yearToDate: number
  }
  averageApprovalTime: {
    current: number // in minutes
    previousPeriod: number
    percentChange: number
  }
  rejectionRate: {
    current: number // percentage
    previousPeriod: number
    percentChange: number
  }
  userGrowth: {
    daily: number
    weekly: number
    monthly: number
    percentChange: number
  }
  systemPerformance: {
    uptime: number // percentage
    responseTime: number // in ms
    errorRate: number // percentage
  }
}

export interface TransactionVolumeData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
  }[]
}

export interface UserGrowthData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
  }[]
}

export interface TransactionPatternData {
  byCategory: {
    labels: string[]
    data: number[]
  }
  byTimeOfDay: {
    labels: string[]
    data: number[]
  }
  byDayOfWeek: {
    labels: string[]
    data: number[]
  }
}

export interface ReportsState {
  kpi: {
    data: KpiData | null
    loading: boolean
    error: string | null
  }
  transactionVolume: {
    data: TransactionVolumeData | null
    loading: boolean
    error: string | null
  }
  userGrowth: {
    data: UserGrowthData | null
    loading: boolean
    error: string | null
  }
  transactionPatterns: {
    data: TransactionPatternData | null
    loading: boolean
    error: string | null
  }
  dateRange: {
    startDate: string
    endDate: string
  }
}

// Initial state
const initialState: ReportsState = {
  kpi: {
    data: null,
    loading: false,
    error: null,
  },
  transactionVolume: {
    data: null,
    loading: false,
    error: null,
  },
  userGrowth: {
    data: null,
    loading: false,
    error: null,
  },
  transactionPatterns: {
    data: null,
    loading: false,
    error: null,
  },
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  },
}

// Async thunks
export const fetchKpiData = createAsyncThunk(
  "reports/fetchKpiData",
  async (dateRange: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      // In a real app, we would pass the date range to the API
      const response = await adminApi.getSystemStats()
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch KPI data")
    }
  },
)

export const fetchTransactionVolumeData = createAsyncThunk(
  "reports/fetchTransactionVolumeData",
  async (dateRange: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      // Mock API call - in a real app, we would call an actual endpoint
      // const response = await adminApi.getTransactionVolumeData(dateRange)

      // Simulating API response for demo purposes
      const response = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Completed",
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 85, 90],
          },
          {
            label: "Pending",
            data: [28, 48, 40, 19, 86, 27, 90, 35, 40, 45, 50, 55],
          },
          {
            label: "Failed",
            data: [10, 15, 8, 12, 7, 11, 5, 8, 10, 12, 15, 10],
          },
        ],
      }
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch transaction volume data")
    }
  },
)

export const fetchUserGrowthData = createAsyncThunk(
  "reports/fetchUserGrowthData",
  async (dateRange: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      const response = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "New Users",
            data: [30, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
          },
          {
            label: "Active Users",
            data: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320],
          },
        ],
      }
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch user growth data")
    }
  },
)

export const fetchTransactionPatternData = createAsyncThunk(
  "reports/fetchTransactionPatternData",
  async (dateRange: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      const response = {
        byCategory: {
          labels: ["Transfer", "Payment", "Deposit", "Withdrawal", "Fee", "Refund", "Other"],
          data: [40, 25, 15, 10, 5, 3, 2],
        },
        byTimeOfDay: {
          labels: ["12am-4am", "4am-8am", "8am-12pm", "12pm-4pm", "4pm-8pm", "8pm-12am"],
          data: [5, 10, 30, 25, 20, 10],
        },
        byDayOfWeek: {
          labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          data: [15, 20, 18, 17, 25, 10, 5],
        },
      }
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch transaction pattern data")
    }
  },
)

// Create the slice
const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.dateRange = action.payload
    },
  },
  extraReducers: (builder) => {
    // KPI data
    builder
      .addCase(fetchKpiData.pending, (state) => {
        state.kpi.loading = true
        state.kpi.error = null
      })
      .addCase(fetchKpiData.fulfilled, (state, action) => {
        state.kpi.loading = false
        state.kpi.data = action.payload
      })
      .addCase(fetchKpiData.rejected, (state, action) => {
        state.kpi.loading = false
        state.kpi.error = action.payload as string
      })

    // Transaction volume data
    builder
      .addCase(fetchTransactionVolumeData.pending, (state) => {
        state.transactionVolume.loading = true
        state.transactionVolume.error = null
      })
      .addCase(fetchTransactionVolumeData.fulfilled, (state, action) => {
        state.transactionVolume.loading = false
        state.transactionVolume.data = action.payload
      })
      .addCase(fetchTransactionVolumeData.rejected, (state, action) => {
        state.transactionVolume.loading = false
        state.transactionVolume.error = action.payload as string
      })

    // User growth data
    builder
      .addCase(fetchUserGrowthData.pending, (state) => {
        state.userGrowth.loading = true
        state.userGrowth.error = null
      })
      .addCase(fetchUserGrowthData.fulfilled, (state, action) => {
        state.userGrowth.loading = false
        state.userGrowth.data = action.payload
      })
      .addCase(fetchUserGrowthData.rejected, (state, action) => {
        state.userGrowth.loading = false
        state.userGrowth.error = action.payload as string
      })

    // Transaction pattern data
    builder
      .addCase(fetchTransactionPatternData.pending, (state) => {
        state.transactionPatterns.loading = true
        state.transactionPatterns.error = null
      })
      .addCase(fetchTransactionPatternData.fulfilled, (state, action) => {
        state.transactionPatterns.loading = false
        state.transactionPatterns.data = action.payload
      })
      .addCase(fetchTransactionPatternData.rejected, (state, action) => {
        state.transactionPatterns.loading = false
        state.transactionPatterns.error = action.payload as string
      })
  },
})

export const { setDateRange } = reportsSlice.actions
export default reportsSlice.reducer
