"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminStatsOverview({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Overview</CardTitle>
        <CardDescription>Key metrics and system performance indicators.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="daily" className="space-y-4 pt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="h-[200px] w-full bg-muted/30">
                    {/* This would be a chart in a real app */}
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-muted-foreground">Chart: Daily Transaction Volume</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">New Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">+24</div>
                      <p className="text-xs text-muted-foreground">+15% from yesterday</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">+145</div>
                      <p className="text-xs text-muted-foreground">+5% from yesterday</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">$12,423</div>
                      <p className="text-xs text-muted-foreground">+18% from yesterday</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="weekly" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="h-[200px] w-full bg-muted/30">
                  {/* This would be a chart in a real app */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">Chart: Weekly Transaction Volume</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">New Users</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">+142</div>
                    <p className="text-xs text-muted-foreground">+8% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">+984</div>
                    <p className="text-xs text-muted-foreground">+12% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$84,348</div>
                    <p className="text-xs text-muted-foreground">+10% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">+2,573</div>
                    <p className="text-xs text-muted-foreground">+5% from last week</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="h-[200px] w-full bg-muted/30">
                  {/* This would be a chart in a real app */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">Chart: Monthly Transaction Volume</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">New Users</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">+584</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">+4,892</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">$358,942</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">+12,573</div>
                    <p className="text-xs text-muted-foreground">+18% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
