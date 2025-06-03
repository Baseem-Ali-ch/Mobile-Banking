import { NewTransactionForm } from "@/components/transactions/new-transaction-form"

export default function NewTransactionPage({
  searchParams,
}: {
  searchParams: { fromAccount?: string }
}) {
  return <NewTransactionForm preselectedAccountId={searchParams.fromAccount} />
}
