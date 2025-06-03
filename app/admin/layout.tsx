import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-0 pb-16 md:ml-64 md:pb-0">
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>
      <AdminBottomNav />
    </div>
  )
}
