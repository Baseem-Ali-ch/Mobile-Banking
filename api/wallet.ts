import type { Wallet, WalletTransaction } from "@/types"
import { v4 as uuidv4 } from "uuid"

// Initialize localStorage with default wallet if it doesn't exist
const initializeWallet = () => {
  // Check if wallet exists in localStorage
  if (!localStorage.getItem("wallet")) {
    const initialWallet: Wallet = {
      id: "wallet-1",
      userId: "user-1",
      balance: 0, // Start with zero balance
      currency: "USD",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem("wallet", JSON.stringify(initialWallet))
  }

  // Check if transactions exist in localStorage
  if (!localStorage.getItem("walletTransactions")) {
    localStorage.setItem("walletTransactions", JSON.stringify([]))
  }
}

// Helper function to get wallet from localStorage
const getWalletFromStorage = (): Wallet => {
  initializeWallet()
  const walletData = localStorage.getItem("wallet")
  return walletData ? JSON.parse(walletData) : null
}

// Helper function to get transactions from localStorage
const getTransactionsFromStorage = (): WalletTransaction[] => {
  initializeWallet()
  const transactionsData = localStorage.getItem("walletTransactions")
  return transactionsData ? JSON.parse(transactionsData) : []
}

// Helper function to save wallet to localStorage
const saveWalletToStorage = (wallet: Wallet) => {
  localStorage.setItem("wallet", JSON.stringify(wallet))
}

// Helper function to save transactions to localStorage
const saveTransactionsToStorage = (transactions: WalletTransaction[]) => {
  localStorage.setItem("walletTransactions", JSON.stringify(transactions))
}

// Fetch wallet details
export const fetchWalletDetails = async (): Promise<Wallet> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.get('/wallet')
    // return response.data

    // For development, return from localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = getWalletFromStorage()
        resolve(wallet)
      }, 500)
    })
  } catch (error) {
    console.error("Error fetching wallet details:", error)
    throw error
  }
}

// Fetch wallet transactions
export const fetchWalletTransactions = async (): Promise<WalletTransaction[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.get('/wallet/transactions')
    // return response.data

    // For development, return from localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = getTransactionsFromStorage()
        resolve(transactions)
      }, 500)
    })
  } catch (error) {
    console.error("Error fetching wallet transactions:", error)
    throw error
  }
}

// Add balance to wallet
export const addWalletBalance = async (
  amount: number,
  description: string,
): Promise<{ newBalance: number; transaction: WalletTransaction }> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.post('/wallet/deposit', { amount, description })
    // return response.data

    // For development, use localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get current wallet and transactions
        const wallet = getWalletFromStorage()
        const transactions = getTransactionsFromStorage()

        // Calculate new balance
        const newBalance = wallet.balance + amount

        // Update wallet
        const updatedWallet = {
          ...wallet,
          balance: newBalance,
          updatedAt: new Date().toISOString(),
        }

        // Create new transaction
        const newTransaction: WalletTransaction = {
          id: uuidv4(),
          walletId: wallet.id,
          userId: wallet.userId,
          amount,
          currency: wallet.currency,
          type: "DEPOSIT",
          status: "COMPLETED",
          description,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Add transaction to list
        const updatedTransactions = [newTransaction, ...transactions]

        // Save to localStorage
        saveWalletToStorage(updatedWallet)
        saveTransactionsToStorage(updatedTransactions)

        resolve({
          newBalance,
          transaction: newTransaction,
        })
      }, 1000)
    })
  } catch (error) {
    console.error("Error adding balance to wallet:", error)
    throw error
  }
}

// Send balance from wallet
export const sendWalletBalance = async (
  amount: number,
  bankAccountId: string,
  description: string,
): Promise<{ transaction: WalletTransaction }> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.post('/wallet/send', { amount, bankAccountId, description })
    // return response.data

    // For development, use localStorage
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get current wallet and transactions
        const wallet = getWalletFromStorage()
        const transactions = getTransactionsFromStorage()

        if (amount > wallet.balance) {
          reject(new Error("Insufficient funds"))
          return
        }

        const fee = amount * 0.0025 // 0.25% fee
        const totalAmount = amount + fee

        if (totalAmount > wallet.balance) {
          reject(new Error("Insufficient funds to cover send amount and fees"))
          return
        }

        // Create a pending transaction (don't update balance yet)
        const newTransaction: WalletTransaction = {
          id: uuidv4(),
          walletId: wallet.id,
          userId: wallet.userId,
          amount,
          currency: wallet.currency,
          type: "WITHDRAWAL",
          status: "PENDING", // Start as pending
          description,
          reference: `REF${Math.floor(Math.random() * 1000000)}`,
          fee,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          bankAccountId, // Store the bank account ID
        }

        // Add transaction to list
        const updatedTransactions = [newTransaction, ...transactions]

        // Save to localStorage (don't update wallet balance yet)
        saveTransactionsToStorage(updatedTransactions)

        resolve({
          transaction: newTransaction,
        })
      }, 1000)
    })
  } catch (error) {
    console.error("Error sending balance from wallet:", error)
    throw error
  }
}

// Update transaction status (for admin use)
export const updateTransactionStatus = async (
  transactionId: string,
  status: "PENDING" | "COMPLETED" | "REJECTED",
  adminNote?: string,
): Promise<{ transaction: WalletTransaction; walletUpdated?: boolean; newBalance?: number }> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.post(`/admin/wallet/transactions/${transactionId}/status`, { status, adminNote })
    // return response.data

    // For development, use localStorage
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get current wallet and transactions
        const wallet = getWalletFromStorage()
        const transactions = getTransactionsFromStorage()

        // Find the transaction
        const transaction = transactions.find((t) => t.id === transactionId)
        if (!transaction) {
          reject(new Error("Transaction not found"))
          return
        }

        // Update transaction status
        const updatedTransaction = {
          ...transaction,
          status,
          updatedAt: new Date().toISOString(),
          adminNote: adminNote || transaction.adminNote,
        }

        // Replace the transaction in the array
        const updatedTransactions = transactions.map((t) => (t.id === transactionId ? updatedTransaction : t))

        let walletUpdated = false
        let newBalance = wallet.balance

        // If completing a withdrawal, update the wallet balance
        if (status === "COMPLETED" && updatedTransaction.type === "WITHDRAWAL" && transaction.status !== "COMPLETED") {
          const totalAmount = updatedTransaction.amount + (updatedTransaction.fee || 0)
          newBalance = wallet.balance - totalAmount

          // Update wallet
          const updatedWallet = {
            ...wallet,
            balance: newBalance,
            updatedAt: new Date().toISOString(),
          }

          // Save updated wallet
          saveWalletToStorage(updatedWallet)
          walletUpdated = true
        }

        // Save updated transactions
        saveTransactionsToStorage(updatedTransactions)

        resolve({
          transaction: updatedTransaction,
          walletUpdated,
          newBalance: walletUpdated ? newBalance : undefined,
        })
      }, 1000)
    })
  } catch (error) {
    console.error("Error updating transaction status:", error)
    throw error
  }
}

// Get all pending send transactions (for admin use)
export const getPendingSendTransactions = async (): Promise<WalletTransaction[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.get('/admin/wallet/transactions/pending')
    // return response.data

    // For development, use localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = getTransactionsFromStorage()
        const pendingTransactions = transactions.filter((t) => t.status === "PENDING" && t.type === "WITHDRAWAL")
        resolve(pendingTransactions)
      }, 500)
    })
  } catch (error) {
    console.error("Error fetching pending send transactions:", error)
    throw error
  }
}
