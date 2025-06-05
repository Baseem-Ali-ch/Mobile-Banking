import { type Transaction, TransactionStatus, TransactionType, TransactionCategory } from "@/types"
import { api } from "./client"

export interface TransactionResponse {
  success: boolean
  data: {
    transactions: Transaction[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// Helper function to get account details
const getAccountDetails = async (accountId: string) => {
  // In a real app, this would be an API call to get account details
  // For demo purposes, we'll use mock data
  if (accountId === "1") {
    return {
      name: "Primary Checking",
      number: "1234567890",
    }
  } else if (accountId === "2") {
    return {
      name: "Savings Account",
      number: "0987654321",
    }
  }
  return null
}

export const transactionsApi = {
  async getTransactions(): Promise<TransactionResponse> {
    const response = await api.get('/transactions/admin/all-transactions')
    console.log(response)
    return response
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`)
    return response.data
    return { ...transaction }
  },

  createTransaction: async (transactionData: Partial<Transaction>): Promise<Transaction> => {
    await delay(1500)

    // Generate a transaction ID
    const transactionId = `TX${Date.now().toString().slice(-9)}`

    // Get account details
    let fromAccountDetails = null
    let toAccountDetails = null

    if (transactionData.fromAccountId && transactionData.fromAccountId !== "external") {
      fromAccountDetails = await getAccountDetails(transactionData.fromAccountId)
    }

    if (transactionData.toAccountId && transactionData.toAccountId !== "external") {
      toAccountDetails = await getAccountDetails(transactionData.toAccountId)
    }

    // Determine transaction type
    let type = TransactionType.PAYMENT
    if (transactionData.fromAccountId === "external") {
      type = TransactionType.DEPOSIT
    } else if (transactionData.category === TransactionCategory.WITHDRAWAL) {
      type = TransactionType.WITHDRAWAL
    } else if (transactionData.category === TransactionCategory.TRANSFER) {
      type = TransactionType.TRANSFER
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: transactionId,
      userId: transactionData.userId || "1",
      fromAccountId: transactionData.fromAccountId || "",
      fromAccountName: fromAccountDetails?.name || transactionData.fromAccountName || "",
      fromAccountNumber: fromAccountDetails?.number || transactionData.fromAccountNumber || "",
      toAccountId: transactionData.toAccountId || "",
      toAccountName: toAccountDetails?.name || transactionData.toAccountName || "",
      toAccountNumber: toAccountDetails?.number || transactionData.toAccountNumber || "",
      amount: transactionData.amount || 0,
      currency: "USD",
      description: transactionData.description || "",
      category: transactionData.category || TransactionCategory.PAYMENT,
      status: TransactionStatus.PENDING,
      type,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock data
    mockTransactions.unshift(newTransaction)

    // Simulate transaction processing
    // In a real app, this would be handled by a backend process
    setTimeout(() => {
      const index = mockTransactions.findIndex((tx) => tx.id === transactionId)
      if (index !== -1) {
        // 80% chance of success, 20% chance of rejection
        const success = Math.random() < 0.8
        mockTransactions[index] = {
          ...mockTransactions[index],
          status: success ? TransactionStatus.COMPLETED : TransactionStatus.REJECTED,
          rejectedReason: success ? undefined : "Transaction rejected by the receiving bank",
          updatedAt: new Date().toISOString(),
        }
      }
    }, 30000) // Simulate 30 seconds processing time

    return newTransaction
  },

  approveTransaction: async (id: string): Promise<Transaction> => {
    const response = await api.put(`/add-money/admin/${id}/approve`)
    return response
  },

  rejectTransaction: async (id: string, reason: string): Promise<Transaction> => {
    const response = await api.put(`/add-money/admin/${id}/reject`, { reason })
    return response
  },

  processTransaction: async (id: string, transactionId: string): Promise<Transaction> => {
    const response = await api.put(`/add-money/admin/${id}/processing`, {transactionId})
    return response
  },

  getTransactionHistory: async (filters?: any): Promise<Transaction[]> => {
    await delay(1000)
    return mockTransactions

    // Only pending transactions can be cancelled
    if (mockTransactions[index].status !== TransactionStatus.PENDING) {
      throw new Error("Only pending transactions can be cancelled")
    }

    mockTransactions[index] = {
      ...mockTransactions[index],
      status: TransactionStatus.CANCELLED,
      updatedAt: new Date().toISOString(),
    }

    return mockTransactions[index]
  },

  getTransactionHistory: async (filters?: any): Promise<Transaction[]> => {
    await delay(1000)
    return mockTransactions
  },
}
