import { AccountForm } from "@/components/accounts/account-form"

export default async function EditAccountPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return <AccountForm id={id} />
}
