import { cn } from "@/lib/utils"

interface BankIconProps {
  bankName: string
  className?: string
}

export function BankIcon({ bankName, className }: BankIconProps) {
  // Function to generate a consistent color based on bank name
  const getBankColor = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
      "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
    ]

    // Simple hash function to pick a color based on the bank name
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  // Get first letter of bank name
  const firstLetter = bankName.charAt(0).toUpperCase()

  // Get color based on bank name
  const colorClass = getBankColor(bankName)

  return (
    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full", colorClass, className)}>
      {firstLetter}
    </div>
  )
}
