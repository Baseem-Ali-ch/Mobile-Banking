import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/store/provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AlertProvider } from "@/components/ui/alert-component"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MoneyManager",
  description: "Banking transaction system",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <AlertProvider>{children}</AlertProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
