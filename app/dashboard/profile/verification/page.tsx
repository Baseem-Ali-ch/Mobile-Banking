import { IdentityVerification } from "@/components/profile/identity-verification"

export default function VerificationPage() {
  return (
    <div className="container px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
      <div className="mt-6">
        <IdentityVerification />
      </div>
    </div>
  )
}
