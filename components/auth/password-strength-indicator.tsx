interface PasswordStrengthIndicatorProps {
  strength: number
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const getStrengthLabel = () => {
    if (strength < 30) return { text: "Weak", color: "bg-red-500" }
    if (strength < 60) return { text: "Fair", color: "bg-yellow-500" }
    if (strength < 80) return { text: "Good", color: "bg-blue-500" }
    return { text: "Strong", color: "bg-green-500" }
  }

  const { text, color } = getStrengthLabel()

  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between text-xs">
        <span>Password strength:</span>
        <span>{text}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div className={`h-full rounded-full ${color} transition-all duration-300`} style={{ width: `${strength}%` }} />
      </div>
    </div>
  )
}
