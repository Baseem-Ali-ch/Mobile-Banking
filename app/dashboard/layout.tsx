import type React from "react"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { redirect } from "next/navigation"
import { WalletNotifications } from "@/components/wallet/wallet-notifications"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-4 right-4 z-50">
        <WalletNotifications />
      </div>
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  )
}
