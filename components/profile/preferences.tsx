"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updatePreferences } from "@/store/slices/profileSlice"
import { setCurrency } from "@/store/slices/settingsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"

export function Preferences() {
  const dispatch = useAppDispatch()
  const { isUpdating } = useAppSelector((state) => state.profile)
  const { accounts } = useAppSelector((state) => state.accounts)
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const [preferences, setPreferences] = useState({
    notifications: {
      transactionAlerts: true,
      balanceUpdates: true,
      securityAlerts: true,
      marketingCommunications: false,
    },
    app: {
      language: "en",
      theme: theme || "light",
      currency: "USD",
      defaultAccountId: accounts.length > 0 ? accounts[0].id : "",
    },
  })

  const handleNotificationToggle = (key: keyof typeof preferences.notifications) => (checked: boolean) => {
    // Security alerts cannot be disabled
    if (key === "securityAlerts" && !checked) {
      toast({
        title: "Security alerts cannot be disabled",
        description: "Security alerts are required for your account safety.",
      })
      return
    }

    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: checked,
      },
    })
  }

  const handleAppPreferenceChange = (key: keyof typeof preferences.app) => (value: string) => {
    setPreferences({
      ...preferences,
      app: {
        ...preferences.app,
        [key]: value,
      },
    })

    // Update theme immediately
    if (key === "theme") {
      setTheme(value)
    }
  }

  async function handleSave() {
    setIsLoading(true)
    try {
      await dispatch(updatePreferences(preferences)).unwrap()

      // Update currency throughout the application
      dispatch(setCurrency(preferences.app.currency))

      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update preferences. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Available languages
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ar", label: "Arabic" },
    { value: "hi", label: "Hindi" },
  ]

  // Available currencies
  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
    { value: "INR", label: "Indian Rupee (₹)" },
    { value: "CNY", label: "Chinese Yuan (¥)" },
    { value: "SAR", label: "Saudi Riyal (﷼)" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how and when you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="transaction-alerts" className="flex flex-col space-y-1">
                <span>Transaction Alerts</span>
                <span className="text-xs text-muted-foreground">
                  Receive notifications for deposits, withdrawals, and transfers
                </span>
              </Label>
              <Switch
                id="transaction-alerts"
                checked={preferences.notifications.transactionAlerts}
                onCheckedChange={handleNotificationToggle("transactionAlerts")}
                disabled={isUpdating}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="balance-updates" className="flex flex-col space-y-1">
                <span>Balance Updates</span>
                <span className="text-xs text-muted-foreground">
                  Receive notifications when your account balance changes
                </span>
              </Label>
              <Switch
                id="balance-updates"
                checked={preferences.notifications.balanceUpdates}
                onCheckedChange={handleNotificationToggle("balanceUpdates")}
                disabled={isUpdating}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security-alerts" className="flex flex-col space-y-1">
                <span>Security Alerts</span>
                <span className="text-xs text-muted-foreground">
                  Receive notifications for login attempts and security changes (cannot be disabled)
                </span>
              </Label>
              <Switch
                id="security-alerts"
                checked={preferences.notifications.securityAlerts}
                onCheckedChange={handleNotificationToggle("securityAlerts")}
                disabled={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-communications" className="flex flex-col space-y-1">
                <span>Marketing Communications</span>
                <span className="text-xs text-muted-foreground">Receive promotional emails and special offers</span>
              </Label>
              <Switch
                id="marketing-communications"
                checked={preferences.notifications.marketingCommunications}
                onCheckedChange={handleNotificationToggle("marketingCommunications")}
                disabled={isUpdating}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Preferences</CardTitle>
          <CardDescription>Customize your app experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences.app.language}
                onValueChange={handleAppPreferenceChange("language")}
                disabled={isUpdating}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences.app.theme}
                onValueChange={handleAppPreferenceChange("theme")}
                disabled={isUpdating}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={preferences.app.currency}
                onValueChange={handleAppPreferenceChange("currency")}
                disabled={isUpdating}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-account">Default Account</Label>
              <Select
                value={preferences.app.defaultAccountId}
                onValueChange={handleAppPreferenceChange("defaultAccountId")}
                disabled={isUpdating || accounts.length === 0}
              >
                <SelectTrigger id="default-account">
                  <SelectValue placeholder="Select default account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountName} ({account.accountNumber})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No accounts available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
