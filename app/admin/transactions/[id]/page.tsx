"use client"

import { TransactionDetailView } from "@/components/admin/transaction-detail-view"

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  return <TransactionDetailView transactionId={params.id} />
}
