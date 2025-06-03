"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Smartphone, Mail, Key } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { verifyTwoFactor } from "@/store/slices/authSlice"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const twoFactorSchema = z.object({
  method: z.enum(["app", "sms", "email"]),
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 digits.",
    })
    .max(6),
})

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>

interface TwoFactorAuthProps {
  email: string
  onCancel: () => void
}

export function TwoFactorAuth({ email, onCancel }: TwoFactorAuthProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      method: "app",
      code: "",
    },
  })

  const selectedMethod = form.watch("method")

  const handleSendCode = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCodeSent(true)
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to your ${selectedMethod === "email" ? "email" : "phone"}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send code",
        description: "There was an error sending the verification code. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(data: TwoFactorFormValues) {
    setIsLoading(true)
    try {
      // Simulate API call to verify code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verify 2FA
      dispatch(verifyTwoFactor())

      toast({
        title: "Verification successful",
        description: "You have been successfully authenticated.",
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Please verify your identity to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Verification Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="app" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          <div className="flex items-center">
                            <Key className="mr-2 h-4 w-4" />
                            Authenticator App
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sms" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          <div className="flex items-center">
                            <Smartphone className="mr-2 h-4 w-4" />
                            SMS to ******1234
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="email" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            Email to {email.replace(/(.{2})(.*)(?=@)/, "$1***")}
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMethod !== "app" && !codeSent && (
              <Button type="button" variant="outline" className="w-full" onClick={handleSendCode} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            )}

            {(selectedMethod === "app" || codeSent) && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit code"
                        {...field}
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(selectedMethod === "app" || codeSent) && (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Back to Login
        </Button>
        <Button variant="link" size="sm" className="text-xs">
          Need help?
        </Button>
      </CardFooter>
    </Card>
  )
}
