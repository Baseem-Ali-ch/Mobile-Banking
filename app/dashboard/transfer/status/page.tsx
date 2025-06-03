import { TransactionStatus } from "@/components/transactions/transaction-status"

export default function TransactionStatusPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  return <TransactionStatus transactionId={searchParams.id} />
}
