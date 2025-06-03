import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WalletSkeleton() {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <Skeleton className="h-8 w-40 mb-6" />

      <div className="flex justify-between mb-6">
        <Skeleton className="h-10 w-[48%]" />
        <Skeleton className="h-10 w-[48%]" />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" disabled>
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" disabled>
            Transaction History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-40 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
