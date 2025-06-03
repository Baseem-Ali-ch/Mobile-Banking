import { WalletTransactionsManagement } from "@/components/admin/wallet-management/wallet-transactions-management"

export default function AdminWalletPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Wallet Management</h1>
      <WalletTransactionsManagement />
    </div>
  )
}
