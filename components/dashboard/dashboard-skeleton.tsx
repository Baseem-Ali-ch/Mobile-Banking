import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="container px-4 py-6 space-y-6 pb-20">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Account overview skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-40" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-3 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent transactions skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>

        <Card>
          <CardHeader className="px-4 py-3 border-b">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-3 flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
