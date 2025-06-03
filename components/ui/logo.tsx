import { CircleDollarSign } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-primary p-2 ${className}`}>
      <CircleDollarSign className="h-6 w-6 text-primary-foreground" />
    </div>
  )
}
