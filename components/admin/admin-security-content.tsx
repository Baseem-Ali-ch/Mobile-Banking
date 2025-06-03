"use client"

import { useState } from "react"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AdminSecurityLogs } from "./admin-security-logs"
import { AdminSessionManagement } from "./admin-session-management"
import { AdminTwoFactorSettings } from "./admin-two-factor-settings"

export function AdminSecurityContent() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">Manage your account security and authentication settings.</p>
      </div>

      <Tabs defaultValue="password">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to maintain account security. We recommend using a strong, unique password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
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
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Password Requirements:</div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center text-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    At least 8 characters
                  </li>
                  <li className="flex items-center text-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center text-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    At least one number
                  </li>
                  <li className="flex items-center text-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    At least one special character
                  </li>
                </ul>
              </div>

              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Notifications</CardTitle>
              <CardDescription>Configure how you receive security alerts and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <div className="text-sm text-muted-foreground">Receive security alerts via email</div>
                </div>
                <Switch id="email-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-alerts">SMS Alerts</Label>
                  <div className="text-sm text-muted-foreground">Receive security alerts via SMS</div>
                </div>
                <Switch id="sms-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="login-alerts">Login Notifications</Label>
                  <div className="text-sm text-muted-foreground">Get notified of new login attempts</div>
                </div>
                <Switch id="login-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="unusual-activity">Unusual Activity</Label>
                  <div className="text-sm text-muted-foreground">Get notified of suspicious account activity</div>
                </div>
                <Switch id="unusual-activity" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2fa" className="space-y-4">
          <AdminTwoFactorSettings />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <AdminSessionManagement />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <AdminSecurityLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
