"use client"

import { useAppSelector } from "@/store/hooks"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const user = useAppSelector((state) => state.auth.user)
  const { unreadNotifications } = useAppSelector((state) => state.dashboard)

  const currentTime = new Date()
  const hours = currentTime.getHours()

  let greeting = "Good morning"
  if (hours >= 12 && hours < 18) {
    greeting = "Good afternoon"
  } else if (hours >= 18) {
    greeting = "Good evening"
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}, {user?.firstName || "User"}
        </h1>
        <p className="text-muted-foreground text-sm">Welcome to your financial dashboard</p>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unreadNotifications > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            variant="destructive"
          >
            {unreadNotifications > 9 ? "9+" : unreadNotifications}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
    </div>
  )
}
