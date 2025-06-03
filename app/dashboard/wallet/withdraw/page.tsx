"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WalletWithdrawPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/wallet/send")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Send Money page...</p>
    </div>
  )
}
