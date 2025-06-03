"use client"
import { Clock, User, CreditCard, Settings, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const activityLog = [
  {
    id: "1",
    user: "Admin User",
    action: "Logged in",
    resource: "System",
    timestamp: "2023-05-15T14:30:00Z",
    icon: User,
  },
  {
    id: "2",
    user: "Admin User",
    action: "Approved transaction",
    resource: "Transaction #12345",
    timestamp: "2023-05-15T14:35:00Z",
    icon: CreditCard,
  },
  {
    id: "3",
    user: "Admin User",
    action: "Updated user profile",
    resource: "User: john.smith@example.com",
    timestamp: "2023-05-15T14:40:00Z",
    icon: User,
  },
  {
    id: "4",
    user: "Admin User",
    action: "Changed system settings",
    resource: "System Settings",
    timestamp: "2023-05-15T15:00:00Z",
    icon: Settings,
  },
  {
    id: "5",
    user: "Admin User",
    action: "Modified permissions",
    resource: "Role: Transaction Admin",
    timestamp: "2023-05-15T15:15:00Z",
    icon: Shield,
  },
]

export function AdminActivityLog({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent administrative activities in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {activityLog.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <activity.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.user} <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.resource}</p>
                  <div className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(activity.timestamp).toLocaleTimeString()} on{" "}
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
