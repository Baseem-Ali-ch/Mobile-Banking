import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TransactionDetailsSkeleton() {
  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-7 w-48" />
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            <Separator />

            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>

            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>

            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-48" />
            </div>

            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>

            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-40" />
            </div>

            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-48" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
