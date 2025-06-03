"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateSecuritySettings } from "@/store/slices/profileSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Loader2, LogOut, Smartphone } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function SecuritySettings() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isUpdating } = useAppSelector((state) => state.profile)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsLoading(true)
    try {
      await dispatch(
        updateSecuritySettings({
          type: "password",
          data: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        }),
      ).unwrap()

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorToggle = async (checked: boolean) => {
    setTwoFactorEnabled(checked)

    if (checked) {
      setShowQRCode(true)
      // Generate backup codes
      setBackupCodes([
        "ABCD-EFGH-IJKL",
        "MNOP-QRST-UVWX",
        "1234-5678-90AB",
        "CDEF-GHIJ-KLMN",
        "OPQR-STUV-WXYZ",
        "ABCD-1234-EFGH",
        "IJKL-5678-MNOP",
        "QRST-90AB-UVWX",
      ])

      try {
        await dispatch(
          updateSecuritySettings({
            type: "2fa",
            data: { enabled: true },
          }),
        ).unwrap()

        toast({
          title: "Two-factor authentication enabled",
          description: "Please save your backup codes in a secure location.",
        })
      } catch (error) {
        setTwoFactorEnabled(false)
        setShowQRCode(false)
        setBackupCodes([])

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to enable two-factor authentication. Please try again.",
        })
      }
    } else {
      setShowQRCode(false)
      setBackupCodes([])

      try {
        await dispatch(
          updateSecuritySettings({
            type: "2fa",
            data: { enabled: false },
          }),
        ).unwrap()

        toast({
          title: "Two-factor authentication disabled",
          description: "Two-factor authentication has been disabled for your account.",
        })
      } catch (error) {
        setTwoFactorEnabled(true)

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to disable two-factor authentication. Please try again.",
        })
      }
    }
  }

  const handleBiometricToggle = async (checked: boolean) => {
    setBiometricEnabled(checked)

    try {
      await dispatch(
        updateSecuritySettings({
          type: "biometric",
          data: { enabled: checked },
        }),
      ).unwrap()

      toast({
        title: checked ? "Biometric authentication enabled" : "Biometric authentication disabled",
        description: checked
          ? "You can now use biometric authentication to log in."
          : "Biometric authentication has been disabled for your account.",
      })
    } catch (error) {
      setBiometricEnabled(!checked)

      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${checked ? "enable" : "disable"} biometric authentication. Please try again.`,
      })
    }
  }

  const handleLogoutAllDevices = async () => {
    setIsLoading(true)
    try {
      await dispatch(
        updateSecuritySettings({
          type: "logoutAll",
          data: {},
        }),
      ).unwrap()

      toast({
        title: "Logged out from all devices",
        description: "You have been logged out from all other devices.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out from all devices. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mock login history data
  const loginHistory = [
    {
      id: "1",
      device: "iPhone 13",
      browser: "Safari",
      location: "New York, USA",
      ip: "192.168.1.1",
      date: "2023-05-15T10:30:00Z",
      current: true,
    },
    {
      id: "2",
      device: "MacBook Pro",
      browser: "Chrome",
      location: "New York, USA",
      ip: "192.168.1.2",
      date: "2023-05-14T18:45:00Z",
      current: false,
    },
    {
      id: "3",
      device: "Windows PC",
      browser: "Firefox",
      location: "Boston, USA",
      ip: "192.168.1.3",
      date: "2023-05-10T09:15:00Z",
      current: false,
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="two-factor">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        <PasswordStrengthIndicator password={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="two-factor" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Require a verification code when logging in.</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} disabled={isUpdating} />
              </div>

              {showQRCode && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="text-base font-medium">Setup Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app (like Google Authenticator or Authy).
                  </p>
                  <div className="flex justify-center py-4">
                    <div className="bg-white p-2 rounded">
                      <img
                        src="/qr-code-generic.png"
                        alt="Two-Factor Authentication QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Backup Codes</h4>
                    <p className="text-sm text-muted-foreground">
                      Save these backup codes in a secure place. You can use them to access your account if you lose
                      your authenticator device.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="bg-muted p-2 rounded text-center font-mono text-sm">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Biometric Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your device's biometric features (fingerprint, face) to log in.
                  </p>
                </div>
                <Switch checked={biometricEnabled} onCheckedChange={handleBiometricToggle} disabled={isUpdating} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>View your recent login activity and manage devices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {loginHistory.map((login) => (
                  <div
                    key={login.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <p className="font-medium">
                          {login.device} - {login.browser}
                          {login.current && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {login.location} • {login.ip}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(login.date)}</p>
                    </div>
                    {!login.current && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleLogoutAllDevices}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout from all devices
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
