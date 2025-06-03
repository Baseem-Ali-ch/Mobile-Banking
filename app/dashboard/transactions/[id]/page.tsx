import { TransactionDetails } from "@/components/transactions/transaction-details"

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  return <TransactionDetails id={params.id} />
}
