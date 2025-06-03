"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface VerifyResetFormProps {
  token: string
}

export function VerifyResetForm({ token }: VerifyResetFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Update the verification code
    const newVerificationCode = [...verificationCode]
    newVerificationCode[index] = value
    setVerificationCode(newVerificationCode)

    // Move to the next input if the current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to the previous input on backspace if the current input is empty
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // If the pasted data is a 6-digit code, fill all inputs
    if (/^\d{6}$/.test(pastedData)) {
      const newVerificationCode = pastedData.split("")
      setVerificationCode(newVerificationCode)

      // Focus the last input
      inputRefs.current[5]?.focus()
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const code = verificationCode.join("")

    // Validate the code
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code.",
      })
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Code verified",
        description: "Your verification code has been accepted.",
      })

      router.push(`/auth/new-password/${token}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "The verification code is invalid or has expired.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Verification Code</label>
        <div className="flex justify-between gap-2">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="h-12 w-12 rounded-md border border-input bg-background px-3 py-2 text-center text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to your email</p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Code"
        )}
      </Button>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Didn&apos;t receive a code? </span>
        <button
          type="button"
          className="font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => {
            toast({
              title: "Code resent",
              description: "A new verification code has been sent to your email.",
            })
          }}
        >
          Resend
        </button>
      </div>
    </form>
  )
}
