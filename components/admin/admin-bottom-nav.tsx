"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, FileText, Home, Settings, Users, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Home",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: BarChart3,
  },
   {
    title: "Wallet",
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
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/admin/dashboard" && pathname === "/admin") ||
            (item.href === "/admin/transactions" && pathname.startsWith("/admin/transactions/"))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-full w-full flex-col items-center justify-center space-y-1",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
