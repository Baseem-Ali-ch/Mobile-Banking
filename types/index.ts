// User related types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profileImage?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  dateOfBirth?: string
  createdAt: string
  lastLogin: string
  twoFactorEnabled: boolean
  notificationPreferences: {
    transactions: boolean
    balanceUpdates: boolean
    securityAlerts: boolean
    marketing: boolean
  }
  appPreferences: {
    language: string
    theme: string
    defaultCurrency: string
    defaultAccountId?: string
  }
  verificationStatus: "unverified" | "pending" | "under_review" | "verified" | "rejected"
  verificationDocuments: Array<{
    type: string
    status: "pending" | "under_review" | "verified" | "rejected"
    uploadedAt: string
  }>
  status: UserStatus
  role: string
  linkedAccounts?: number
  transactionCount?: number
  transactionVolume?: number
  riskLevel?: string
  kycStatus?: string
  lastActivity?: string
  notes?: string
  [key: string]: any // Allow for dynamic access to properties
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

// Bank Account related types
export interface BankAccount {
  id: string
  userId: string
  accountNumber: string
  accountName?: string
  accountHolderName?: string
  accountType?: AccountType
  bankName?: string
  routingNumber?: string
  ifscCode: string
  branchName?: string
  balance?: number
  currency?: string
  isDefault?: boolean
  status?: AccountStatus
  createdAt?: string
  updatedAt?: string
}

export enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  CREDIT = "CREDIT",
  INVESTMENT = "INVESTMENT",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  CLOSED = "CLOSED",
}

// Transaction related types
export interface Transaction {
  id: string
  userId: string
  fromAccountId: string
  fromAccountName?: string
  fromAccountNumber?: string
  fromIfscCode?: string
  toAccountId: string
  toAccountName?: string
  toAccountNumber?: string
  toIfscCode?: string
  amount: number
  currency: string
  description: string
  category?: TransactionCategory
  status: TransactionStatus
  type: TransactionType
  date: string
  approvedBy?: string
  approvedAt?: string
  rejectedReason?: string
  createdAt: string
  updatedAt: string
}

export enum TransactionCategory {
  TRANSFER = "TRANSFER",
  PAYMENT = "PAYMENT",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  FEE = "FEE",
  REFUND = "REFUND",
  OTHER = "OTHER",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  PAYMENT = "PAYMENT",
  TRANSFER = "TRANSFER",
  WITHDRAWAL = "WITHDRAWAL",
}

// Notification related types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  ACCOUNT = "ACCOUNT",
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
}

// Profile related types
export interface ProfilePreferences {
  notifications: {
    transactionAlerts: boolean
    balanceUpdates: boolean
    securityAlerts: boolean
    marketingCommunications: boolean
  }
  app: {
    language: string
    theme: string
    currency: string
    defaultAccountId: string
  }
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  lastPasswordChange: string
  loginHistory: LoginHistoryItem[]
}

export interface LoginHistoryItem {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  date: string
  current: boolean
}

export interface VerificationDocument {
  id: string
  type: string
  status: string
  uploadedAt: string
  verifiedAt?: string
  rejectedReason?: string
  fileUrl?: string
}

// Wallet related types
export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  status: WalletStatus
  createdAt: string
  updatedAt: string
}

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

export interface WalletTransaction {
  id: string
  walletId: string
  userId: string
  amount: number
  currency: string
  type: WalletTransactionType
  status: WalletTransactionStatus
  description: string
  paymentMethod?: PaymentMethod
  reference?: string
  fee?: number
  date: string
  createdAt: string
  updatedAt: string
}

export enum WalletTransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  FEE = "FEE",
  REFUND = "REFUND",
}

export enum WalletTransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
  CRYPTO = "CRYPTO",
  OTHER = "OTHER",
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password: string; 
  phoneNumber?: string;
}