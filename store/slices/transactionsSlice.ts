import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { transactionsApi } from "@/api/transactions"
import type { Transaction, TransactionStatus } from "@/types"

interface TransactionDraft {
  fromAccountId: string
  toAccountId: string
  newAccount?: {
    accountNumber?: string
    accountHolderName?: string
    bankName?: string
    routingNumber?: string
  }
  amount: number
  description: string
  category: string
}

interface TransactionFilters {
  status: TransactionStatus | null
  accountId: string | null
  dateRange: {
    from: string | null
    to: string | null
  }
  searchTerm: string | null
}

interface TransactionsState {
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  selectedTransaction: Transaction | null
  transactionDraft: TransactionDraft | null
  filters: TransactionFilters
  isLoading: boolean
  error: string | null
}

const initialState: TransactionsState = {
  transactions: [],
  filteredTransactions: [],
  selectedTransaction: null,
  transactionDraft: null,
  filters: {
    status: null,
    accountId: null,
    dateRange: {
      from: null,
      to: null,
    },
    searchTerm: null,
  },
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async (_, { rejectWithValue }) => {
  try {
    const response = await transactionsApi.getTransactions()
    return response
  } catch (error) {
    return rejectWithValue("Failed to fetch transactions")
  }
})

export const fetchTransactionDetails = createAsyncThunk(
  "transactions/fetchTransactionDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getTransaction(id)
      return response
    } catch (error) {
      return rejectWithValue("Failed to fetch transaction details")
    }
  },
)

export const initiateTransaction = createAsyncThunk(
  "transactions/initiateTransaction",
  async (transactionData: Partial<Transaction>, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.createTransaction(transactionData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to initiate transaction")
    }
  },
)

export const confirmTransaction = createAsyncThunk(
  "transactions/confirmTransaction",
  async (
    {
      fromAccountId,
      toAccountId,
      newAccount,
      amount,
      description,
      category,
      saveNewAccount,
    }: TransactionDraft & { saveNewAccount?: boolean },
    { rejectWithValue },
  ) => {
    try {
      // If it's a new account and we want to save it, create the account first
      let destinationAccountId = toAccountId
      if (toAccountId === "new" && newAccount && saveNewAccount) {
        // In a real app, we would call an API to create the account
        // For now, we'll just simulate it
        console.log("Saving new account:", newAccount)
        // Simulate a new account ID
        destinationAccountId = `new_${Date.now()}`
      }

      // Create the transaction
      const response = await transactionsApi.createTransaction({
        fromAccountId,
        toAccountId: destinationAccountId,
        amount,
        description,
        category,
      })

      return response
    } catch (error) {
      return rejectWithValue("Failed to confirm transaction")
    }
  },
)

export const retryTransaction = createAsyncThunk(
  "transactions/retryTransaction",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { transactions: TransactionsState }
      const transaction = state.transactions.selectedTransaction

      if (!transaction) {
        return rejectWithValue("Transaction not found")
      }

      // Create a new transaction with the same details
      const response = await transactionsApi.createTransaction({
        fromAccountId: transaction.fromAccountId,
        toAccountId: transaction.toAccountId,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
      })

      return response
    } catch (error) {
      return rejectWithValue("Failed to retry transaction")
    }
  },
)

export const cancelTransaction = createAsyncThunk(
  "transactions/cancelTransaction",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.cancelTransaction(id)
      return response
    } catch (error) {
      return rejectWithValue("Failed to cancel transaction")
    }
  },
)

export const pollTransactionStatus = createAsyncThunk(
  "transactions/pollTransactionStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.getTransaction(id)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update transaction status")
    }
  },
)

export const updateTransactionStatus = createAsyncThunk(
  "transactions/updateTransactionStatus",
  async ({ id, status }: { id: string; status: TransactionStatus }, { rejectWithValue }) => {
    try {
      // Call the appropriate API based on the status
      let response
      if (status === "COMPLETED") {
        response = await transactionsApi.approveTransaction(id)
      } else if (status === "REJECTED") {
        response = await transactionsApi.rejectTransaction(id)
      } else if (status === "PENDING") {
        response = await transactionsApi.resetTransaction(id)
      } else {
        return rejectWithValue("Invalid status")
      }
      return response
    } catch (error) {
      return rejectWithValue(`Failed to update transaction status to ${status}`)
    }
  },
)

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionDraft: (state, action: PayloadAction<TransactionDraft>) => {
      state.transactionDraft = action.payload
    },
    clearTransactionDraft: (state) => {
      state.transactionDraft = null
    },
    setStatusFilter: (state, action: PayloadAction<TransactionStatus | null>) => {
      state.filters.status = action.payload
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    },
    setAccountFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.accountId = action.payload
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    },
    setDateRangeFilter: (state, action: PayloadAction<{ from: string | null; to: string | null }>) => {
      state.filters.dateRange = action.payload
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    },
    setSearchTerm: (state, action: PayloadAction<string | null>) => {
      state.filters.searchTerm = action.payload
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    },
    setTransactionFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    },
    resetTransactionFilters: (state) => {
      state.filters = {
        status: null,
        accountId: null,
        dateRange: {
          from: null,
          to: null,
        },
        searchTerm: null,
      }
      state.filteredTransactions = state.transactions
    },
    clearTransactionsFilter: (state) => {
      state.filters = {
        status: null,
        accountId: null,
        dateRange: {
          from: null,
          to: null,
        },
        searchTerm: null,
      }
      state.filteredTransactions = state.transactions
    },
    addTemporaryTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload)
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    },
  },
  extraReducers: (builder) => {
    // Fetch transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.isLoading = false
      state.transactions = action.payload
      state.filteredTransactions = applyFilters(action.payload, state.filters)
    })
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Fetch transaction details
    builder.addCase(fetchTransactionDetails.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchTransactionDetails.fulfilled, (state, action) => {
      state.isLoading = false
      state.selectedTransaction = action.payload
    })
    builder.addCase(fetchTransactionDetails.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Initiate transaction
    builder.addCase(initiateTransaction.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(initiateTransaction.fulfilled, (state, action) => {
      state.isLoading = false
      state.selectedTransaction = action.payload
    })
    builder.addCase(initiateTransaction.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Confirm transaction
    builder.addCase(confirmTransaction.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(confirmTransaction.fulfilled, (state, action) => {
      state.isLoading = false
      state.selectedTransaction = action.payload
      state.transactions.unshift(action.payload)
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
      state.transactionDraft = null
    })
    builder.addCase(confirmTransaction.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Retry transaction
    builder.addCase(retryTransaction.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(retryTransaction.fulfilled, (state, action) => {
      state.isLoading = false
      state.selectedTransaction = action.payload
      state.transactions.unshift(action.payload)
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    })
    builder.addCase(retryTransaction.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Cancel transaction
    builder.addCase(cancelTransaction.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(cancelTransaction.fulfilled, (state, action) => {
      state.isLoading = false
      // Update the transaction in the list
      const index = state.transactions.findIndex((tx) => tx.id === action.payload.id)
      if (index !== -1) {
        state.transactions[index] = action.payload
      }
      // Update the selected transaction
      if (state.selectedTransaction && state.selectedTransaction.id === action.payload.id) {
        state.selectedTransaction = action.payload
      }
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    })
    builder.addCase(cancelTransaction.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Poll transaction status
    builder.addCase(pollTransactionStatus.fulfilled, (state, action) => {
      // Update the transaction in the list
      const index = state.transactions.findIndex((tx) => tx.id === action.payload.id)
      if (index !== -1) {
        state.transactions[index] = action.payload
      }
      // Update the selected transaction
      if (state.selectedTransaction && state.selectedTransaction.id === action.payload.id) {
        state.selectedTransaction = action.payload
      }
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    })

    // Update transaction status
    builder.addCase(updateTransactionStatus.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateTransactionStatus.fulfilled, (state, action) => {
      state.isLoading = false
      // Update the transaction in the list
      const index = state.transactions.findIndex((tx) => tx.id === action.payload.id)
      if (index !== -1) {
        state.transactions[index] = action.payload
      }
      // Update the selected transaction
      if (state.selectedTransaction && state.selectedTransaction.id === action.payload.id) {
        state.selectedTransaction = action.payload
      }
      state.filteredTransactions = applyFilters(state.transactions, state.filters)
    })
    builder.addCase(updateTransactionStatus.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

// Helper function to apply filters
const applyFilters = (transactions: Transaction[], filters: TransactionFilters) => {
  return transactions.filter((tx) => {
    // Status filter
    if (filters.status && tx.status !== filters.status) {
      return false
    }

    // Account filter
    if (filters.accountId && tx.fromAccountId !== filters.accountId && tx.toAccountId !== filters.accountId) {
      return false
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const txDate = new Date(tx.date).getTime()

      if (filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from).getTime()
        if (txDate < fromDate) {
          return false
        }
      }

      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to).getTime()
        if (txDate > toDate) {
          return false
        }
      }
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      const matchesId = tx.id.toLowerCase().includes(searchTerm)
      const matchesDescription = tx.description.toLowerCase().includes(searchTerm)
      const matchesCategory = tx.category.toLowerCase().includes(searchTerm)

      if (!matchesId && !matchesDescription && !matchesCategory) {
        return false
      }
    }

    return true
  })
}

export const {
  setTransactionDraft,
  clearTransactionDraft,
  setStatusFilter,
  setAccountFilter,
  setDateRangeFilter,
  setSearchTerm,
  setTransactionFilters,
  resetTransactionFilters,
  clearTransactionsFilter,
  addTemporaryTransaction,
} = transactionsSlice.actions

export default transactionsSlice.reducer
