import type { Wallet, WalletTransaction, WalletTransactionStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { api } from "./client";

export interface AddMoneyResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    amount: number;
    location: string;
    description: string;
    userId: string;
    status: WalletTransactionStatus;
    transactionId: any;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

interface TransferMoneyResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    accountId: string;
    amount: number;
    description: string;
    userId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    account: {
      id: string;
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
    };
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

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
    };
    localStorage.setItem("wallet", JSON.stringify(initialWallet));
  }

  // Check if transactions exist in localStorage
  if (!localStorage.getItem("walletTransactions")) {
    localStorage.setItem("walletTransactions", JSON.stringify([]));
  }
};

// Helper function to get wallet from localStorage
const getWalletFromStorage = (): Wallet => {
  initializeWallet();
  const walletData = localStorage.getItem("wallet");
  return walletData ? JSON.parse(walletData) : null;
};

// Helper function to get transactions from localStorage
const getTransactionsFromStorage = (): WalletTransaction[] => {
  initializeWallet();
  const transactionsData = localStorage.getItem("walletTransactions");
  return transactionsData ? JSON.parse(transactionsData) : [];
};

// Helper function to save wallet to localStorage
const saveWalletToStorage = (wallet: Wallet) => {
  localStorage.setItem("wallet", JSON.stringify(wallet));
};

// Helper function to save transactions to localStorage
const saveTransactionsToStorage = (transactions: WalletTransaction[]) => {
  localStorage.setItem("walletTransactions", JSON.stringify(transactions));
};

// Fetch wallet details
export const fetchWalletDetails = async (): Promise<Wallet> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.get('/wallet')
    // return response.data

    // For development, return from localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = getWalletFromStorage();
        resolve(wallet);
      }, 500);
    });
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
};

// Fetch wallet transactions
export const fetchWalletTransactions = async (): Promise<
  WalletTransaction[]
> => {
  try {
    // In a real app, this would be an API call
    // const response = await apiClient.get('/wallet/transactions')
    // return response.data

    // For development, return from localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = getTransactionsFromStorage();
        resolve(transactions);
      }, 500);
    });
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    throw error;
  }
};

// Add balance to wallet
export const addWalletBalance = async (
  amount: number,
  location: string,
  description: string
): Promise<AddMoneyResponse> => {
  const response = await api.post("/add-money/create", {
    amount,
    location,
    description,
  });
  return response;
};

// Send balance from wallet
export const sendWalletBalance = async (
  amount: number,
  bankAccountId: string,
  description: string
): Promise<TransferMoneyResponse> => {
  const response = await api.post("/transfer-money/create", {
    amount,
    bankAccountId,
    description,
  });
  return response;
};

// Update transaction status (for admin use)
export const updateTransactionStatus = async (
  transactionId: string,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED",
  adminNote?: string
): Promise<{
  transaction: WalletTransaction;
  walletUpdated?: boolean;
  newBalance?: number;
}> => {
  try {
    let response;
    
    // Choose the appropriate endpoint based on the status
    switch (status) {
      case "PROCESSING":
        response = await api.put(`/add-money/admin/${transactionId}/processing`, {transactionId});
        break;
      case "COMPLETED":
        response = await api.put(`/add-money/admin/${transactionId}/approve`);
        break;
      case "REJECTED":
        response = await api.put(`/add-money/admin/${transactionId}/reject`, { adminNote });
        break;
      default:
        throw new Error("Invalid status update");
    }
    console.log('respnse', response)
    return response;
  } catch (error) {
    console.error("Error updating transaction status:", error);
    throw error;
  }
};

// Get all pending send transactions (for admin use)
export const getAddMoneyTransactions = async (): Promise<
  AddMoneyResponse[]
> => {
  try {
    const response = await api.get("/add-money/admin/all-transactions")
    return response
  } catch (error) {
    console.error("Error fetching pending send transactions:", error);
    throw error;
  }
};
