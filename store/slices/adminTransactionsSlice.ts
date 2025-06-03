import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { adminApi } from "@/api/admin"
import type { Transaction, TransactionStatus, TransactionType } from "@/types"

export interface TransactionFilter {
  status: TransactionStatus[]
  type: TransactionType[]
  dateRange: {
    from: string | null
    to: string | null
  }
  amountRange: [number, number]
  searchQuery: string
  userId: string | null
  accountId: string | null
  priority: string[]
}

export interface SavedView {
  id: string
  name: string
  filters: TransactionFilter
  createdAt: string
}

export interface AdminTransactionsState {
  transactions: {
    items: Transaction[]
    loading: boolean
    error: string | null
    total: number
  }
  filters: TransactionFilter
  pagination: {
    page: number
    limit: number
    total: number
  }
  sorting: {
    field: string
    direction: "asc" | "desc"
  }
  selectedTransactions: string[]
  savedViews: SavedView[]
  bulkActionInProgress: boolean
  expandedRows: string[]
}

const initialState: AdminTransactionsState = {
  transactions: {
    items: [],
    loading: false,
    error: null,
    total: 0,
  },
  filters: {
    status: [],
    type: [],
    dateRange: {
      from: null,
      to: null,
    },
    amountRange: [0, 10000],
    searchQuery: "",
    userId: null,
    accountId: null,
    priority: [],
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  sorting: {
    field: "createdAt",
    direction: "desc",
  },
  selectedTransactions: [],
  savedViews: [],
  bulkActionInProgress: false,
  expandedRows: [],
}

// Async thunks
export const fetchTransactions = createAsyncThunk(
  "adminTransactions/fetchTransactions",
  async (
    {
      page = 1,
      limit = 10,
      filters,
      sort,
    }: {
      page?: number
      limit?: number
      filters?: TransactionFilter
      sort?: { field: string; direction: "asc" | "desc" }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminApi.getTransactions({
        page,
        limit,
        ...filters,
        sortBy: sort?.field,
        sortDirection: sort?.direction,
      })
      return response
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const fetchSavedViews = createAsyncThunk("adminTransactions/fetchSavedViews", async (_, { rejectWithValue }) => {
  try {
    const response = await adminApi.getSavedTransactionViews()
    return response
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const saveView = createAsyncThunk(
  "adminTransactions/saveView",
  async ({ name, filters }: { name: string; filters: TransactionFilter }, { rejectWithValue }) => {
    try {
      const response = await adminApi.saveTransactionView({ name, filters })
      return response
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const deleteView = createAsyncThunk(
  "adminTransactions/deleteView",
  async (viewId: string, { rejectWithValue }) => {
    try {
      await adminApi.deleteTransactionView(viewId)
      return viewId
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const bulkApproveTransactions = createAsyncThunk(
  "adminTransactions/bulkApproveTransactions",
  async ({ transactionIds, note }: { transactionIds: string[]; note?: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await adminApi.bulkApproveTransactions(transactionIds, note)
      // Refresh the transaction list after bulk action
      dispatch(fetchTransactions({}))
      return response
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const bulkRejectTransactions = createAsyncThunk(
  "adminTransactions/bulkRejectTransactions",
  async (
    { transactionIds, reason, note }: { transactionIds: string[]; reason: string; note?: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await adminApi.bulkRejectTransactions(transactionIds, reason, note)
      // Refresh the transaction list after bulk action
      dispatch(fetchTransactions({}))
      return response
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const addNoteToTransactions = createAsyncThunk(
  "adminTransactions/addNoteToTransactions",
  async ({ transactionIds, note }: { transactionIds: string[]; note: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await adminApi.addNoteToTransactions(transactionIds, note)
      // Refresh the transaction list after bulk action
      dispatch(fetchTransactions({}))
      return response
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const exportTransactions = createAsyncThunk(
  "adminTransactions/exportTransactions",
  async (
    { transactionIds, format }: { transactionIds: string[]; format: "csv" | "pdf" | "excel" },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminApi.exportTransactions(transactionIds, format)
      return response
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

const adminTransactionsSlice = createSlice({
  name: "adminTransactions",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TransactionFilter>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page when filters change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.page = 1 // Reset to first page when limit changes
    },
    setSorting: (state, action: PayloadAction<{ field: string; direction: "asc" | "desc" }>) => {
      state.sorting = action.payload
    },
    toggleSortDirection: (state) => {
      state.sorting.direction = state.sorting.direction === "asc" ? "desc" : "asc"
    },
    selectTransaction: (state, action: PayloadAction<string>) => {
      if (!state.selectedTransactions.includes(action.payload)) {
        state.selectedTransactions.push(action.payload)
      }
    },
    deselectTransaction: (state, action: PayloadAction<string>) => {
      state.selectedTransactions = state.selectedTransactions.filter((id) => id !== action.payload)
    },
    toggleTransactionSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedTransactions.indexOf(action.payload)
      if (index === -1) {
        state.selectedTransactions.push(action.payload)
      } else {
        state.selectedTransactions.splice(index, 1)
      }
    },
    selectAllTransactions: (state) => {
      state.selectedTransactions = state.transactions.items.map((transaction) => transaction.id)
    },
    deselectAllTransactions: (state) => {
      state.selectedTransactions = []
    },
    toggleRowExpansion: (state, action: PayloadAction<string>) => {
      const index = state.expandedRows.indexOf(action.payload)
      if (index === -1) {
        state.expandedRows.push(action.payload)
      } else {
        state.expandedRows.splice(index, 1)
      }
    },
    collapseAllRows: (state) => {
      state.expandedRows = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.transactions.loading = true
        state.transactions.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions.items = action.payload.items
        state.pagination.total = action.payload.total
        state.transactions.loading = false
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactions.loading = false
        state.transactions.error = action.payload as string
      })
      // Fetch saved views
      .addCase(fetchSavedViews.fulfilled, (state, action) => {
        state.savedViews = action.payload
      })
      // Save view
      .addCase(saveView.fulfilled, (state, action) => {
        state.savedViews.push(action.payload)
      })
      // Delete view
      .addCase(deleteView.fulfilled, (state, action) => {
        state.savedViews = state.savedViews.filter((view) => view.id !== action.payload)
      })
      // Bulk actions
      .addCase(bulkApproveTransactions.pending, (state) => {
        state.bulkActionInProgress = true
      })
      .addCase(bulkApproveTransactions.fulfilled, (state) => {
        state.bulkActionInProgress = false
        state.selectedTransactions = []
      })
      .addCase(bulkApproveTransactions.rejected, (state) => {
        state.bulkActionInProgress = false
      })
      .addCase(bulkRejectTransactions.pending, (state) => {
        state.bulkActionInProgress = true
      })
      .addCase(bulkRejectTransactions.fulfilled, (state) => {
        state.bulkActionInProgress = false
        state.selectedTransactions = []
      })
      .addCase(bulkRejectTransactions.rejected, (state) => {
        state.bulkActionInProgress = false
      })
      .addCase(addNoteToTransactions.pending, (state) => {
        state.bulkActionInProgress = true
      })
      .addCase(addNoteToTransactions.fulfilled, (state) => {
        state.bulkActionInProgress = false
        state.selectedTransactions = []
      })
      .addCase(addNoteToTransactions.rejected, (state) => {
        state.bulkActionInProgress = false
      })
  },
})

export const {
  setFilters,
  resetFilters,
  setPage,
  setLimit,
  setSorting,
  toggleSortDirection,
  selectTransaction,
  deselectTransaction,
  toggleTransactionSelection,
  selectAllTransactions,
  deselectAllTransactions,
  toggleRowExpansion,
  collapseAllRows,
} = adminTransactionsSlice.actions

export default adminTransactionsSlice.reducer
