"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, FileText, Home, Lock, Settings, Shield, Users, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Home",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: CreditCard,
  },
  {
    title: "Wallet Management",
    href: "/admin/wallet",
    icon: Wallet,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
  },
  {
    title: "Access Control",
    href: "/admin/access-control",
    icon: Lock,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r bg-background shadow-sm">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6" />
          <span>Admin Portal</span>
        </Link>
      </div>
      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/admin/dashboard" && pathname === "/admin") ||
              (link.href === "/admin/transactions" && pathname.startsWith("/admin/transactions/")) ||
              (link.href === "/admin/wallet" && pathname.startsWith("/admin/wallet/"))
            return (
              <Button
                key={link.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("justify-start", isActive && "bg-secondary font-medium")}
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-5 w-5" />
                  {link.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
