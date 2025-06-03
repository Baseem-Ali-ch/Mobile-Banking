import { AccountDetails } from "@/components/accounts/account-details"

export default function AccountDetailsPage({ params }: { params: { id: string } }) {
  return <AccountDetails id={params.id} />
}
