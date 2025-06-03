import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground">Enter your email to receive a password reset link</p>
        </div>
        <ResetPasswordForm />
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
