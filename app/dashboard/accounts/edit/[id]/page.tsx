import { AccountForm } from "@/components/accounts/account-form"

export default function EditAccountPage({ params }: { params: { id: string } }) {
  return <AccountForm id={params.id} />
}
