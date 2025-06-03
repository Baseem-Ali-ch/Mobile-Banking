import { type Transaction, TransactionStatus, TransactionType, TransactionCategory } from "@/types"

// Mock data for demo purposes
const mockTransactions: Transaction[] = [
  {
    id: "TX123456789",
    userId: "1",
    fromAccountId: "1",
    fromAccountName: "Primary Checking",
    fromAccountNumber: "1234567890",
    toAccountId: "external",
    toAccountName: "John Smith",
    toAccountNumber: "9876543210",
    amount: 150.75,
    currency: "USD",
    description: "Rent payment",
    category: TransactionCategory.PAYMENT,
    status: TransactionStatus.COMPLETED,
    type: TransactionType.PAYMENT,
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "TX987654321",
    userId: "1",
    fromAccountId: "external",
    fromAccountName: "Employer Inc.",
    fromAccountNumber: "5555555555",
    toAccountId: "1",
    toAccountName: "Primary Checking",
    toAccountNumber: "1234567890",
    amount: 2500.0,
    currency: "USD",
    description: "Salary deposit",
    category: TransactionCategory.DEPOSIT,
    status: TransactionStatus.COMPLETED,
    type: TransactionType.DEPOSIT,
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "TX456789123",
    userId: "1",
    fromAccountId: "1",
    fromAccountName: "Primary Checking",
    fromAccountNumber: "1234567890",
    toAccountId: "2",
    toAccountName: "Savings Account",
    toAccountNumber: "0987654321",
    amount: 500.0,
    currency: "USD",
    description: "Monthly savings transfer",
    category: TransactionCategory.TRANSFER,
    status: TransactionStatus.COMPLETED,
    type: TransactionType.TRANSFER,
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "TX789123456",
    userId: "1",
    fromAccountId: "1",
    fromAccountName: "Primary Checking",
    fromAccountNumber: "1234567890",
    toAccountId: "external",
    toAccountName: "Netflix",
    toAccountNumber: "1122334455",
    amount: 14.99,
    currency: "USD",
    description: "Netflix subscription",
    category: TransactionCategory.PAYMENT,
    status: TransactionStatus.PENDING,
    type: TransactionType.PAYMENT,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "TX321654987",
    userId: "1",
    fromAccountId: "1",
    fromAccountName: "Primary Checking",
    fromAccountNumber: "1234567890",
    toAccountId: "external",
    toAccountName: "Amazon",
    toAccountNumber: "9988776655",
    amount: 79.99,
    currency: "USD",
    description: "Online purchase",
    category: TransactionCategory.PAYMENT,
    status: TransactionStatus.REJECTED,
    type: TransactionType.PAYMENT,
    rejectedReason: "Insufficient funds in the account",
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
]

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
  getTransactions: async (): Promise<Transaction[]> => {
    await delay(1000)
    return [...mockTransactions]
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    await delay(800)
    const transaction = mockTransactions.find((tx) => tx.id === id)
    if (!transaction) {
      throw new Error("Transaction not found")
    }
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
    await delay(1000)
    const index = mockTransactions.findIndex((tx) => tx.id === id)
    if (index === -1) {
      throw new Error("Transaction not found")
    }

    mockTransactions[index] = {
      ...mockTransactions[index],
      status: TransactionStatus.COMPLETED,
      updatedAt: new Date().toISOString(),
    }

    return mockTransactions[index]
  },

  rejectTransaction: async (id: string, reason: string): Promise<Transaction> => {
    await delay(1000)
    const index = mockTransactions.findIndex((tx) => tx.id === id)
    if (index === -1) {
      throw new Error("Transaction not found")
    }

    mockTransactions[index] = {
      ...mockTransactions[index],
      status: TransactionStatus.REJECTED,
      rejectedReason: reason,
      updatedAt: new Date().toISOString(),
    }

    return mockTransactions[index]
  },

  cancelTransaction: async (id: string): Promise<Transaction> => {
    await delay(1000)
    const index = mockTransactions.findIndex((tx) => tx.id === id)
    if (index === -1) {
      throw new Error("Transaction not found")
    }

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
