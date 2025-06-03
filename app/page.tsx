import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")

  if (!token) {
    redirect("/auth/login")
  }

  return redirect("/dashboard")
}
