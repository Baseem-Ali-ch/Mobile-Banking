"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function TransactionDetailSkeleton() {
  const router = useRouter()

  return (
    <div className="container px-4 py-6 pb-20 max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Transaction Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Transaction Details</CardTitle>
                <CardDescription>Review the transaction information below</CardDescription>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <Skeleton className="h-7 w-28" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date Initiated</p>
                <Skeleton className="h-5 w-48" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transaction Type</p>
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">From Account</p>
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">To Account</p>
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">User Information</p>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Description</p>
              <Skeleton className="h-5 w-3/4" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Category</p>
              <Skeleton className="h-5 w-24" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="w-px h-12" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Approval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>

              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardContent className="flex flex-col gap-3 pt-0">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
