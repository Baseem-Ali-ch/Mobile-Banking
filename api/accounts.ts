import type { BankAccount, Transaction } from "@/types"

// Mock data for demo purposes
const mockAccounts: BankAccount[] = [
  {
    id: "1",
    userId: "1",
    accountNumber: "1234567890",
    accountName: "Primary Checking",
    accountType: "CHECKING",
    bankName: "Chase",
    routingNumber: "123456789",
    branchName: "Downtown Branch",
    balance: 5280.42,
    currency: "USD",
    isDefault: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "1",
    accountNumber: "0987654321",
    accountName: "Savings Account",
    accountType: "SAVINGS",
    bankName: "Bank of America",
    routingNumber: "987654321",
    branchName: "Main Street Branch",
    balance: 12750.89,
    currency: "USD",
    isDefault: false,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock transactions for demo purposes
const mockTransactions: Record<string, Transaction[]> = {
  "1": [
    {
      id: "tx1",
      userId: "1",
      fromAccountId: "external",
      toAccountId: "1",
      amount: 1500.0,
      currency: "USD",
      description: "Salary Deposit",
      category: "DEPOSIT",
      status: "COMPLETED",
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "tx2",
      userId: "1",
      fromAccountId: "1",
      toAccountId: "external",
      amount: 120.5,
      currency: "USD",
      description: "Grocery Shopping",
      category: "PAYMENT",
      status: "COMPLETED",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "tx3",
      userId: "1",
      fromAccountId: "1",
      toAccountId: "2",
      amount: 500.0,
      currency: "USD",
      description: "Transfer to Savings",
      category: "TRANSFER",
      status: "COMPLETED",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  "2": [
    {
      id: "tx4",
      userId: "1",
      fromAccountId: "1",
      toAccountId: "2",
      amount: 500.0,
      currency: "USD",
      description: "Transfer from Checking",
      category: "TRANSFER",
      status: "COMPLETED",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "tx5",
      userId: "1",
      fromAccountId: "2",
      toAccountId: "external",
      amount: 200.0,
      currency: "USD",
      description: "ATM Withdrawal",
      category: "WITHDRAWAL",
      status: "COMPLETED",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ],
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const accountsApi = {
  getAccounts: async (): Promise<BankAccount[]> => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use mock data with a delay
    await delay(1000)
    return [...mockAccounts]
  },

  getAccount: async (id: string): Promise<BankAccount> => {
    await delay(800)
    const account = mockAccounts.find((acc) => acc.id === id)
    if (!account) {
      throw new Error("Account not found")
    }
    return { ...account }
  },

  addAccount: async (accountData: Partial<BankAccount>): Promise<BankAccount> => {
    await delay(1200)

    // Generate a new ID
    const newId = `acc_${Date.now()}`

    // Create new account
    const newAccount: BankAccount = {
      id: newId,
      userId: accountData.userId || "1",
      accountNumber: accountData.accountNumber || "",
      accountName: accountData.accountName || "",
      accountType: accountData.accountType || "CHECKING",
      bankName: accountData.bankName || "",
      routingNumber: accountData.routingNumber || "",
      branchName: accountData.branchName || "",
      balance: 0, // New accounts start with zero balance
      currency: "USD",
      isDefault: accountData.isDefault || false,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // If this is the first account or it's set as default, update other accounts
    if (newAccount.isDefault) {
      mockAccounts.forEach((acc) => {
        acc.isDefault = false
      })
    }

    // Add to mock data
    mockAccounts.push(newAccount)

    // Initialize empty transactions for this account
    mockTransactions[newId] = []

    return newAccount
  },

  updateAccount: async (id: string, accountData: Partial<BankAccount>): Promise<BankAccount> => {
    await delay(1000)

    const accountIndex = mockAccounts.findIndex((acc) => acc.id === id)
    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    // Update account
    const updatedAccount = {
      ...mockAccounts[accountIndex],
      ...accountData,
      updatedAt: new Date().toISOString(),
    }

    mockAccounts[accountIndex] = updatedAccount

    return updatedAccount
  },

  deleteAccount: async (id: string): Promise<void> => {
    await delay(800)

    const accountIndex = mockAccounts.findIndex((acc) => acc.id === id)
    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    // Remove account
    mockAccounts.splice(accountIndex, 1)

    // Remove transactions
    delete mockTransactions[id]
  },

  setDefaultAccount: async (id: string): Promise<BankAccount> => {
    await delay(800)

    const accountIndex = mockAccounts.findIndex((acc) => acc.id === id)
    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    // Set all accounts to non-default
    mockAccounts.forEach((acc) => {
      acc.isDefault = false
    })

    // Set the specified account as default
    mockAccounts[accountIndex].isDefault = true

    return { ...mockAccounts[accountIndex] }
  },

  getAccountBalance: async (id: string): Promise<{ balance: number }> => {
    await delay(500)

    const account = mockAccounts.find((acc) => acc.id === id)
    if (!account) {
      throw new Error("Account not found")
    }

    return { balance: account.balance }
  },

  getAccountTransactions: async (id: string): Promise<Transaction[]> => {
    await delay(1000)

    // Check if account exists
    const account = mockAccounts.find((acc) => acc.id === id)
    if (!account) {
      throw new Error("Account not found")
    }

    // Return transactions for this account
    return mockTransactions[id] || []
  },
}
