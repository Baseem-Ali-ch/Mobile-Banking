import { Skeleton } from "@/components/ui/skeleton"

export function AccountsListSkeleton() {
  return (
    <div className="container px-4 py-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700"
          >
            <div className="p-6 h-[200px] relative">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-4 w-24 bg-white/30 dark:bg-white/10" />
                  <Skeleton className="h-6 w-32 mt-1 bg-white/30 dark:bg-white/10" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-white/30 dark:bg-white/10" />
              </div>

              <div className="mt-6">
                <Skeleton className="h-4 w-20 bg-white/30 dark:bg-white/10" />
                <Skeleton className="h-6 w-48 mt-1 bg-white/30 dark:bg-white/10" />
              </div>

              <div className="mt-6 flex justify-between items-end">
                <div>
                  <Skeleton className="h-4 w-16 bg-white/30 dark:bg-white/10" />
                  <Skeleton className="h-7 w-28 mt-1 bg-white/30 dark:bg-white/10" />
                </div>
                <Skeleton className="h-6 w-16 bg-white/30 dark:bg-white/10" />
              </div>

              {/* Card chip skeleton */}
              <Skeleton className="absolute top-6 right-6 w-10 h-7 rounded-md bg-white/30 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
