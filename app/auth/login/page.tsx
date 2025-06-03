import { LoginForm } from "@/components/auth/login-form"
import { AlertProvider } from "@/components/ui/alert-component"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <AlertProvider>
          <LoginForm />
        </AlertProvider>        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link href="/auth/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
