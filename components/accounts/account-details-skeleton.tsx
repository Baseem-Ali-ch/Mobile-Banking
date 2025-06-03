import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function AccountDetailsSkeleton() {
  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-7 w-40" />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-4">
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-8 w-36" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <div className="flex w-full gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </CardFooter>
        </Card>

        <div>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
